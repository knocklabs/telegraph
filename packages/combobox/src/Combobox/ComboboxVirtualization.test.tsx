import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode, useState } from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { Combobox } from "./Combobox";
import type { ComboboxHighlightDetails, ComboboxOption } from "./index";

// The spec for external virtualization: the consumer owns the full collection
// and mounts only a window of it.

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // Base UI scrolls the highlighted row into view. jsdom has no implementation.
  Element.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
  // Other suites feature-detect `scrollIntoView` and branch on it.
  delete (Element.prototype as Partial<Element>).scrollIntoView;
});

const queryPortalElement = (selector: string) =>
  document.querySelector(selector);
const queryPortalElements = (selector: string) =>
  document.querySelectorAll(selector);

const CHANNELS = Array.from({ length: 200 }, (_, index) => ({
  value: `channel-${index}`,
  label: `Channel ${index}`,
}));

const WINDOW_SIZE = 8;

const indexOfValue = (value: string) => Number(value.replace("channel-", ""));

type HarnessProps = {
  options?: Array<ComboboxOption>;
  windowSize?: number;
  defaultValue?: string;
  // Off for the cases that must observe a row the window never mounts.
  followHighlight?: boolean;
  onItemHighlighted?: (
    value: string | undefined,
    details: ComboboxHighlightDetails,
  ) => void;
  children?: ReactNode;
};

// Stands in for TanStack Virtual. It slides a fixed-size window to follow the
// highlighted index, like `virtualizer.scrollToIndex(details.index)`. It never
// mounts the prefix from index 0. Pinning that prefix is the workaround this
// contract removes, so a test that relied on it would prove nothing.
const VirtualizedCombobox = ({
  options = CHANNELS,
  windowSize = WINDOW_SIZE,
  defaultValue,
  followHighlight = true,
  onItemHighlighted,
  children,
}: HarnessProps) => {
  const [start, setStart] = useState(0);
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const windowOptions = options.slice(start, start + windowSize);

  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      options={options}
      onItemHighlighted={(highlightedValue, details) => {
        onItemHighlighted?.(highlightedValue, details);
        if (!followHighlight) return;
        const index = details.index;
        if (index < 0) return;
        setStart((current) => {
          if (index < current) return index;
          if (index >= current + windowSize) return index - windowSize + 1;
          return current;
        });
      }}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {windowOptions.map((option) => (
            <Combobox.Option key={option.value} value={option.value}>
              {option.label}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        {children}
      </Combobox.Content>
    </Combobox.Root>
  );
};

const openPopup = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);
  await waitFor(() => {
    expect(
      queryPortalElements("[data-tgph-combobox-option]").length,
    ).toBeGreaterThan(0);
  });
};

// Chained, not mapped. Each press must land before the next one is sent.
const pressArrow = async (
  user: ReturnType<typeof userEvent.setup>,
  key: "ArrowDown" | "ArrowUp",
  times: number,
) => {
  await Array.from({ length: times }).reduce(
    (chain) => chain.then(() => user.keyboard(`{${key}}`)),
    Promise.resolve(),
  );
};

// A re-render can re-report the same row without the highlight having moved.
const collapseRepeats = (values: Array<string>) =>
  values.filter((value, index) => value !== values[index - 1]);

describe("Combobox external virtualization", () => {
  it("mounts only the window while indexing against the whole collection", async () => {
    const user = userEvent.setup();
    render(<VirtualizedCombobox />);
    await openPopup(user);

    expect(queryPortalElements("[data-tgph-combobox-option]").length).toBe(
      WINDOW_SIZE,
    );

    // Announces "1 of 200", not "1 of 8".
    const first = queryPortalElement(
      "[data-tgph-combobox-option-value='channel-0']",
    );
    expect(first?.getAttribute("aria-setsize")).toBe(String(CHANNELS.length));
    expect(first?.getAttribute("aria-posinset")).toBe("1");
  });

  it("advances exactly one option per ArrowDown across window boundaries", async () => {
    const user = userEvent.setup();
    const highlighted: Array<string> = [];
    render(
      <VirtualizedCombobox
        onItemHighlighted={(value) => {
          if (value) highlighted.push(value);
        }}
      />,
    );
    await openPopup(user);

    await pressArrow(user, "ArrowDown", WINDOW_SIZE * 3);

    const path = collapseRepeats(highlighted).map(indexOfValue);
    // The walk has to cross several window boundaries to mean anything.
    expect(path.length).toBeGreaterThan(WINDOW_SIZE * 2);
    path.forEach((index, position) => {
      if (position === 0) return;
      expect(index).toBe(path[position - 1]! + 1);
    });

    // ...without mounting the whole prefix.
    expect(
      queryPortalElements("[data-tgph-combobox-option]").length,
    ).toBeLessThanOrEqual(WINDOW_SIZE);
  });

  it("retreats exactly one option per ArrowUp across window boundaries", async () => {
    const user = userEvent.setup();
    const highlighted: Array<string> = [];
    render(
      <VirtualizedCombobox
        onItemHighlighted={(value) => {
          if (value) highlighted.push(value);
        }}
      />,
    );
    await openPopup(user);

    // Walk deep enough to leave the first window, then walk back.
    await pressArrow(user, "ArrowDown", WINDOW_SIZE * 2);
    const deepest = collapseRepeats(highlighted).at(-1)!;
    highlighted.length = 0;

    await pressArrow(user, "ArrowUp", WINDOW_SIZE + 2);

    const path = collapseRepeats(highlighted).map(indexOfValue);
    expect(path.length).toBeGreaterThan(WINDOW_SIZE);
    expect(path[0]).toBe(indexOfValue(deepest) - 1);
    path.forEach((index, position) => {
      if (position === 0) return;
      expect(index).toBe(path[position - 1]! - 1);
    });
  });

  it("reports the string value of a highlighted row outside the first window", async () => {
    const user = userEvent.setup();
    const onItemHighlighted = vi.fn();
    render(<VirtualizedCombobox onItemHighlighted={onItemHighlighted} />);
    await openPopup(user);

    await pressArrow(user, "ArrowDown", WINDOW_SIZE * 2);

    const [value, details] = onItemHighlighted.mock.lastCall as [
      string,
      ComboboxHighlightDetails,
    ];
    expect(typeof value).toBe("string");
    expect(indexOfValue(value)).toBeGreaterThanOrEqual(WINDOW_SIZE);
    // The index the consumer feeds to its virtualizer must address the same row.
    expect(CHANNELS[details.index]?.value).toBe(value);
  });

  it("renders the selected label when the option is outside the mounted window", async () => {
    render(
      <VirtualizedCombobox
        defaultValue="channel-150"
        followHighlight={false}
      />,
    );

    const trigger = queryPortalElement("[data-tgph-combobox-trigger]");
    expect(trigger?.textContent).toContain("Channel 150");
    // The row itself was never mounted, so the label came from the collection.
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='channel-150']"),
    ).toBeFalsy();
  });

  it("re-seeds the highlight from the top when the collection changes", async () => {
    const user = userEvent.setup();
    const highlighted: Array<string> = [];

    const Searchable = () => {
      const [query, setQuery] = useState("");
      const matches = CHANNELS.filter((channel) =>
        channel.label.toLowerCase().includes(query.toLowerCase()),
      );
      const [start, setStart] = useState(0);
      return (
        <Combobox.Root
          options={matches}
          onItemHighlighted={(value, details) => {
            if (value) highlighted.push(value);
            const index = details.index;
            if (index < 0) return;
            setStart((current) => {
              if (index < current) return index;
              if (index >= current + WINDOW_SIZE)
                return index - WINDOW_SIZE + 1;
              return current;
            });
          }}
        >
          <Combobox.Trigger />
          <Combobox.Content>
            <Combobox.Search
              value={query}
              onValueChange={(next) => {
                setQuery(next);
                setStart(0);
              }}
            />
            <Combobox.Options>
              {matches.slice(start, start + WINDOW_SIZE).map((option) => (
                <Combobox.Option key={option.value} value={option.value}>
                  {option.label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
            <Combobox.Empty />
          </Combobox.Content>
        </Combobox.Root>
      );
    };

    render(<Searchable />);
    await openPopup(user);

    await pressArrow(user, "ArrowDown", WINDOW_SIZE * 2);
    const beforeSearch = collapseRepeats(highlighted).at(-1)!;
    expect(indexOfValue(beforeSearch)).toBeGreaterThan(WINDOW_SIZE);
    highlighted.length = 0;

    // Narrowing the collection must not leave the highlight parked at a stale
    // index deep in the previous list.
    await user.type(
      queryPortalElement("[data-tgph-combobox-search]")! as HTMLElement,
      "Channel 1",
    );

    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='channel-1']"),
      ).toBeTruthy();
    });
    await user.keyboard("{ArrowDown}");

    const after = collapseRepeats(highlighted).at(-1)!;
    expect(indexOfValue(after)).toBeLessThan(indexOfValue(beforeSearch));
  });

  it("shows Empty only when the collection itself is empty", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <VirtualizedCombobox options={CHANNELS}>
        <Combobox.Empty />
      </VirtualizedCombobox>,
    );
    await openPopup(user);
    expect(queryPortalElement("[data-tgph-combobox-empty]")).toBeFalsy();

    rerender(
      <VirtualizedCombobox options={[]}>
        <Combobox.Empty />
      </VirtualizedCombobox>,
    );
    await waitFor(() => {
      expect(queryPortalElement("[data-tgph-combobox-empty]")).toBeTruthy();
    });
  });

  it("leaves the mounted-children contract untouched without an options collection", async () => {
    const user = userEvent.setup();
    render(
      <Combobox.Root defaultValue="email">
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Options>
            <Combobox.Option value="email">Email</Combobox.Option>
            <Combobox.Option value="sms">SMS</Combobox.Option>
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>,
    );
    await openPopup(user);

    // No collection, so no set-size bookkeeping is added to the DOM.
    const first = queryPortalElement(
      "[data-tgph-combobox-option-value='email']",
    );
    expect(first?.getAttribute("aria-setsize")).toBeNull();
    expect(first?.getAttribute("aria-posinset")).toBeNull();
  });
});

describe("Combobox external virtualization with action rows", () => {
  // An `onSelect` row commits nothing, so Base UI gives it a sentinel value it
  // cannot find in the collection. Telegraph has to supply the index instead.
  const ACTION_VALUE = "clear-all";
  const ACTION_COLLECTION = [
    { value: ACTION_VALUE, label: "Clear all" },
    ...CHANNELS.slice(0, 20),
  ];

  const WithActionRow = ({ onSelect }: { onSelect: () => void }) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Combobox.Root
        value={value}
        onValueChange={setValue}
        options={ACTION_COLLECTION}
        closeOnSelect={false}
      >
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Options>
            <Combobox.Option value={ACTION_VALUE} onSelect={onSelect}>
              Clear all
            </Combobox.Option>
            {CHANNELS.slice(0, 4).map((option) => (
              <Combobox.Option key={option.value} value={option.value}>
                {option.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>
    );
  };

  it("registers an action row so the keyboard can reach it", async () => {
    const user = userEvent.setup();
    render(<WithActionRow onSelect={vi.fn()} />);
    await openPopup(user);

    const actionRow = queryPortalElement(
      `[data-tgph-combobox-option-value='${ACTION_VALUE}']`,
    );
    // An unregistered row gets no id, so `aria-activedescendant` cannot
    // address it and arrow keys skip past.
    expect(actionRow?.getAttribute("id")).toBeTruthy();
  });

  it("commits an action row with Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<WithActionRow onSelect={onSelect} />);
    await openPopup(user);

    await pressArrow(user, "ArrowDown", 1);
    await user.keyboard("{Enter}");

    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1));
  });
});

describe("Combobox external virtualization with Create", () => {
  // The collection also sizes Base UI's navigation bounds, so a slot reserved
  // for a Create row that never renders leaves an index with no row behind it.
  const CREATE_COLLECTION = CHANNELS.slice(0, 2);
  const EXISTING = CREATE_COLLECTION[0]!.label;
  // Create renders as an option row labelled `Create "<query>"`.
  const CREATE_ROW = "[data-tgph-combobox-option-label^='Create \"']";

  const WithCreate = ({ onIndex }: { onIndex: (index: number) => void }) => {
    const [query, setQuery] = useState("");
    return (
      <Combobox.Root
        options={CREATE_COLLECTION}
        onItemHighlighted={(_value, details) => onIndex(details.index)}
      >
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Search value={query} onValueChange={setQuery} />
          <Combobox.Options>
            {CREATE_COLLECTION.map((option) => (
              <Combobox.Option key={option.value} value={option.value}>
                {option.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
          <Combobox.Create values={[EXISTING]} onCreate={() => {}} />
        </Combobox.Content>
      </Combobox.Root>
    );
  };

  it("reserves no navigable slot when Create suppresses itself", async () => {
    const user = userEvent.setup();
    const indexes: Array<number> = [];
    render(<WithCreate onIndex={(index) => indexes.push(index)} />);
    await openPopup(user);

    // The query is already one of Create's values, so Create renders nothing.
    await user.type(
      queryPortalElement("[data-tgph-combobox-search]")! as HTMLElement,
      EXISTING,
    );
    await waitFor(() => {
      expect(queryPortalElement(CREATE_ROW)).toBeFalsy();
    });

    indexes.length = 0;
    await pressArrow(user, "ArrowDown", CREATE_COLLECTION.length + 2);

    // Every highlight has to address a row that exists in the collection.
    expect(indexes.length).toBeGreaterThan(0);
    expect(Math.max(...indexes)).toBeLessThan(CREATE_COLLECTION.length);
  });

  it("still reserves a slot when Create does render", async () => {
    const user = userEvent.setup();
    const indexes: Array<number> = [];
    render(<WithCreate onIndex={(index) => indexes.push(index)} />);
    await openPopup(user);

    await user.type(
      queryPortalElement("[data-tgph-combobox-search]")! as HTMLElement,
      "a brand new value",
    );
    await waitFor(() => {
      expect(queryPortalElement(CREATE_ROW)).toBeTruthy();
    });

    indexes.length = 0;
    await pressArrow(user, "ArrowDown", CREATE_COLLECTION.length + 2);

    // Create sits one past the collection and must stay reachable.
    expect(Math.max(...indexes)).toBe(CREATE_COLLECTION.length);
  });
});
