import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

import { Combobox } from "./Combobox";

// Virtual focus and highlight seeding are async and display-driven: Base UI
// queues initial focus and the active-descendant highlight on animation frames,
// so they only reproduce in a real headed browser — jsdom fires them eagerly.
// See vitest.browser.config.mts.

const VALUES = ["email", "sms", "push", "inapp", "webhook"];
const LABELS = ["Email", "SMS", "Push", "In-App", "Webhook"];

const waitFrames = (count: number) =>
  new Promise<void>((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

const SearchableCombobox = ({
  initialValue,
  onValueChange,
}: {
  initialValue?: string;
  onValueChange?: (value: string | undefined) => void;
}) => {
  const [value, setValue] = useState<string | undefined>(initialValue);
  return (
    <Combobox.Root
      value={value}
      onValueChange={(next) => {
        setValue(next as string | undefined);
        onValueChange?.(next as string | undefined);
      }}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {VALUES.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {LABELS[index]}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

const ButtonOnlyCombobox = () => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Combobox.Root
      value={value}
      onValueChange={(next) => setValue(next as string | undefined)}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Options>
          {VALUES.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {LABELS[index]}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

const getTrigger = async () => {
  let trigger: HTMLElement | null = null;
  // Browser-mode render commits asynchronously, so wait for the trigger to mount
  // before interacting (mirrors the menu browser test awaiting its first element).
  await vi.waitFor(() => {
    trigger = document.querySelector("[data-tgph-combobox-trigger]");
    if (!trigger) throw new Error("combobox trigger not mounted yet");
  });
  return trigger as unknown as HTMLElement;
};

const openViaTriggerClick = async () => {
  const trigger = await getTrigger();
  await userEvent.click(trigger);
  await waitFrames(4);
  return trigger;
};

describe("Combobox virtual focus (real browser)", () => {
  it("keeps DOM focus on the popup input and tracks the highlight with aria-activedescendant", async () => {
    render(<SearchableCombobox initialValue="email" />);
    await openViaTriggerClick();

    // Virtual focus: DOM focus lives on an <input>, never on an option.
    expect(document.activeElement?.tagName).toBe("INPUT");

    // ArrowDown moves the highlight without moving DOM focus off the input.
    await userEvent.keyboard("[ArrowDown]");
    await waitFrames(2);

    const highlighted = document.querySelector(
      "[data-tgph-combobox-option][data-highlighted]",
    );
    expect(
      highlighted,
      "an option is highlighted after ArrowDown",
    ).toBeTruthy();
    expect(document.activeElement?.tagName, "focus stays on the input").toBe(
      "INPUT",
    );
    expect(
      document.activeElement?.getAttribute("aria-activedescendant"),
      "aria-activedescendant on the input points at the highlighted option",
    ).toBe(highlighted?.id);
  });

  it("anchors virtual focus on the hidden input when no Search is rendered", async () => {
    render(<ButtonOnlyCombobox />);
    const trigger = await openViaTriggerClick();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    // Focus lands on an input — the always-mounted hidden anchor — not an option.
    expect(document.activeElement?.tagName).toBe("INPUT");

    await userEvent.keyboard("[ArrowDown]");
    await waitFrames(2);
    expect(
      document.querySelector("[data-tgph-combobox-option][data-highlighted]"),
      "arrow navigation highlights an option via the hidden input",
    ).toBeTruthy();
  });
});

describe("Combobox type-to-filter highlight (real browser)", () => {
  // Diagnostic for the auto-highlight-on-type case flagged in the rewrite: with
  // a non-first existing selection, does typing to filter highlight the first
  // match so Enter (without an explicit ArrowDown) selects it?
  it("auto-highlights the typed match and selects it on Enter, even with a non-first existing selection", async () => {
    const onValueChange = vi.fn();
    // webhook is the LAST option: a non-first existing selection, which used to
    // block auto-highlight-on-type until Base UI was fed the filtered option set
    // via `filteredItems` (see Combobox.tsx).
    render(
      <SearchableCombobox
        initialValue="webhook"
        onValueChange={onValueChange}
      />,
    );
    await openViaTriggerClick();

    // Type to filter down to SMS (the 2nd option).
    await userEvent.keyboard("sms");

    // Poll for the auto-highlight to settle — Base UI re-seeds the highlight
    // onto the first match over a few frames after the query narrows.
    await vi.waitFor(() => {
      const option = document.querySelector(
        '[data-tgph-combobox-option-value="sms"]',
      );
      expect(
        option,
        "the sms option is still mounted after filtering",
      ).toBeTruthy();
      expect(
        option?.getAttribute("data-highlighted"),
        "the typed match is auto-highlighted with no ArrowDown",
      ).not.toBeNull();
    });

    // Enter with no explicit ArrowDown commits the highlighted match.
    await userEvent.keyboard("[Enter]");
    await waitFrames(2);
    expect(onValueChange).toHaveBeenLastCalledWith("sms");
  });
});

const CreatableCombobox = ({
  onValueChange,
  onCreate,
}: {
  onValueChange?: (value: string | undefined) => void;
  onCreate?: (value: string) => void;
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Combobox.Root
      value={value}
      onValueChange={(next) => {
        setValue(next as string | undefined);
        onValueChange?.(next as string | undefined);
      }}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {VALUES.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {LABELS[index]}
            </Combobox.Option>
          ))}
          <Combobox.Create values={VALUES} onCreate={onCreate ?? (() => {})} />
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

describe("Combobox Create row highlight (real browser)", () => {
  // Guards the action-item sentinel: with a Create row mounted and nothing
  // selected, the Create row must not masquerade as the selected item and steal
  // the highlight. Typing must highlight the real match, and Enter must select
  // it rather than create.
  it("highlights the matching option (not the Create row) and Enter selects rather than creates", async () => {
    const onValueChange = vi.fn();
    const onCreate = vi.fn();
    render(
      <CreatableCombobox onValueChange={onValueChange} onCreate={onCreate} />,
    );
    await openViaTriggerClick();

    // "sm" matches only the SMS option and also offers a "Create sm" row.
    await userEvent.keyboard("sm");
    await vi.waitFor(() => {
      const sms = document.querySelector(
        '[data-tgph-combobox-option-value="sms"]',
      );
      expect(
        sms?.getAttribute("data-highlighted"),
        "the matching option is highlighted, not the Create row",
      ).not.toBeNull();
    });

    await userEvent.keyboard("[Enter]");
    await waitFrames(2);
    expect(onValueChange).toHaveBeenLastCalledWith("sms");
    expect(onCreate, "Create is not triggered").not.toHaveBeenCalled();
  });
});
