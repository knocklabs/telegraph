import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Combobox } from "./Combobox";
import { findStringNodes, getOptionAccessibleLabel } from "./Combobox.helpers";
import type {
  ComboboxContentProps,
  ComboboxOptionProps,
  ComboboxOptionsProps,
} from "./index";

type Option = { value: string; label?: string };

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const VALUES = ["email", "sms", "push", "inapp", "webhook"];
const LABELS = ["Email", "SMS", "Push", "In-App", "Webhook"];

// Utility to query elements rendered in a portal
const queryPortalElement = (selector: string) =>
  document.querySelector(selector);
const queryPortalElements = (selector: string) =>
  document.querySelectorAll(selector);

const ComboboxSingleSelect = ({ ...props }) => {
  const [value, setValue] = useState<string>(VALUES[0]!);
  return (
    <Combobox.Root value={value} onValueChange={setValue} {...props}>
      <Combobox.Trigger />
      <Combobox.Content>
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

const ComboboxMultiSelect = () => {
  const [value, setValue] = useState<Array<string>>([VALUES[0]!, VALUES[1]!]);
  return (
    <Combobox.Root value={value} onValueChange={setValue}>
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

const CustomTriggerCombobox = () => {
  const [value, setValue] = useState<Option>(valuesLegacy[0]!);
  return (
    <Combobox.Root value={value} onValueChange={setValue} legacyBehavior={true}>
      <Combobox.Trigger>
        {({ value }) => {
          const option = Array.isArray(value) ? value[0] : value;
          return <div>Trigger Value:{option?.label}</div>;
        }}
      </Combobox.Trigger>
      <Combobox.Content>
        <Combobox.Options>
          {valuesLegacy.map((option) => (
            <Combobox.Option key={option.value} {...option} />
          ))}
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

const ControlledOpenCombobox = ({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div>
      <button data-testid="open-combobox" onClick={() => setOpen(true)}>
        Open combobox
      </button>
      <Combobox.Root open={open} onOpenChange={handleOpenChange}>
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
    </div>
  );
};

// --- T5: input-as-trigger + free-text (none) arrangements ------------------

// The `@telegraph/input`-styled anchor replaces the button trigger. There is no
// `Combobox.Search`; the anchor input owns role="combobox" and virtual focus.
const ComboboxInputTrigger = ({ ...props }) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      placeholder="Search a channel"
      {...props}
    >
      <Combobox.Input />
      <Combobox.Content>
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

// Free text: value === label so a pressed suggestion fills readable text.
const FREE_TEXT_CHANNELS = ["Email", "SMS", "Push", "In-App", "Webhook"];
const FreeTextCombobox = ({
  onInputValueChange,
  ...props
}: {
  onInputValueChange?: (value: string) => void;
  [key: string]: unknown;
}) => {
  const [inputValue, setInputValue] = useState("");
  return (
    <Combobox.Root
      selectionMode="none"
      inputValue={inputValue}
      onInputValueChange={(next) => {
        setInputValue(next);
        onInputValueChange?.(next);
      }}
      placeholder="Type or pick a channel"
      {...props}
    >
      <Combobox.Input />
      <Combobox.Content>
        <Combobox.Options>
          {FREE_TEXT_CHANNELS.map((channel) => (
            <Combobox.Option key={channel} value={channel}>
              {channel}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

describe("Combobox", () => {
  it("keeps the animated trigger tag when a spread supplies `as`", () => {
    const smuggled = { as: "b" } as Record<string, unknown>;
    const { container } = render(
      <Combobox.Root>
        <Combobox.Primitives.TriggerTag.Root value="a" {...smuggled} />
      </Combobox.Root>,
    );

    expect(container.querySelector("b")).toBeNull();
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("keeps the animated trigger indicator when a spread supplies `as`", () => {
    // A spread is the only route left: `as` is gone from the props type.
    const smuggled = { as: "b" } as Record<string, unknown>;
    const { container } = render(
      <Combobox.Root>
        <Combobox.Primitives.TriggerIndicator {...smuggled} />
      </Combobox.Root>,
    );

    expect(container.querySelector("b")).toBeNull();
    expect(container.querySelector("span")).not.toBeNull();
  });

  describe("Single Select", () => {
    it("combobox is accessible", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      expectToHaveNoViolations(await axe(container));
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      expectToHaveNoViolations(await axe(container));
    });

    it("pressing the down arrow key should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      // Open combobox
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    // Virtual focus (Base UI): DOM focus stays on the in-popup input and the
    // active option is tracked via data-highlighted / aria-activedescendant.
    // Per ARIA the option matching the current value is highlighted on open, and
    // arrow keys move that highlight rather than moving DOM focus onto an option.
    it("after opening, the selected option is highlighted and arrow keys move the highlight", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Open
      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      const firstOption = queryPortalElement(
        '[data-tgph-combobox-option-value="email"]',
      );
      await waitFor(() =>
        expect(firstOption?.getAttribute("data-highlighted")).not.toBeNull(),
      );
      // DOM focus is on the input, not the option.
      expect(document.activeElement?.tagName).toBe("INPUT");
      expect(document.activeElement).not.toEqual(firstOption);

      // Arrow keys move the highlight to the next option.
      await user.keyboard("[ArrowDown]");
      const secondOption = queryPortalElement(
        '[data-tgph-combobox-option-value="sms"]',
      );
      await waitFor(() =>
        expect(secondOption?.getAttribute("data-highlighted")).not.toBeNull(),
      );
      expect(firstOption?.getAttribute("data-highlighted")).toBeNull();
    });

    it("pressing enter on an option should select it", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Open
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      // Select first option
      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");
    });

    // Typing now filters (via the in-popup input) and highlights the first
    // match. Virtual focus keeps DOM focus on the input, so the match is tracked
    // with data-highlighted rather than becoming document.activeElement.
    it("pressing the first letter of an option highlights the matching option", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      await user.keyboard("s");
      const smsOption = queryPortalElement(
        '[data-tgph-combobox-option-value="sms"]',
      );
      await waitFor(() =>
        expect(smsOption?.getAttribute("data-highlighted")).not.toBeNull(),
      );
      expect(document.activeElement?.tagName).toBe("INPUT");

      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("SMS");
    });

    it("clear button should clear the field", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect clearable />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");

      const clearButton = queryPortalElement("[data-tgph-combobox-clear]");
      await user.click(clearButton!);
      expect(trigger?.textContent).toBe("");
    });

    it("should not be able to open when disabled", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect disabled />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "false");

      expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    });

    it("pressing enter on the trigger should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      expect(document.activeElement).toBe(trigger);

      // Open combobox with enter
      await user.keyboard("[Enter]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("pressing space on the trigger should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      expect(document.activeElement).toBe(trigger);

      // Open combobox with space
      await user.keyboard(" ");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("pressing arrow down on the trigger should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      expect(document.activeElement).toBe(trigger);

      // Open combobox with space
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("pressing enter on the clear button should not open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect clearable />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Select an option first to show the clear button
      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );
      await user.keyboard("[ArrowDown]");
      await user.keyboard("[Enter]");
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
      );

      // On open the selected option (Email) is highlighted per ARIA, so ArrowDown
      // moves to the next option (SMS) before Enter selects it.
      await waitFor(() => expect(trigger?.textContent).toBe("SMS"));

      const clearButton = container.querySelector(
        "[data-tgph-combobox-clear]",
      ) as HTMLElement;
      clearButton?.focus();

      await waitFor(() => expect(clearButton).toHaveFocus());

      await user.keyboard("[Enter]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "false");
      await waitFor(() => expect(trigger?.textContent).toBe(""));
    });

    it("pressing space on the clear button should not open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect clearable />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Select an option first to show the clear button
      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );
      await user.keyboard("[ArrowDown]");
      await user.keyboard("[Enter]");
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
      );
      // On open the selected option (Email) is highlighted per ARIA, so ArrowDown
      // moves to the next option (SMS) before Enter selects it.
      await waitFor(() => expect(trigger?.textContent).toBe("SMS"));

      // Focus the clear button
      const clearButton = container.querySelector(
        "[data-tgph-combobox-clear]",
      ) as HTMLElement;
      clearButton?.focus();

      // Press space on the clear button - this should clear the value but NOT open the combobox
      await user.keyboard(" ");
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
      );
      await waitFor(() => expect(trigger?.textContent).toBe(""));
    });
  });

  describe("Multi Select", () => {
    it("combobox is accessible", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      expectToHaveNoViolations(await axe(container));
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      expectToHaveNoViolations(await axe(container));
    });

    it("search is automatically focused on open", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      const searchInput = queryPortalElement("[data-tgph-combobox-search]");
      expect(document.activeElement).toBe(searchInput);
    });

    it("searching for an option should filter the options", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("Email");
      const options = queryPortalElements("[data-tgph-combobox-option]");
      expect(options.length).toBe(1);
    });

    it("keeps focus on the selected option when closeOnSelect is false", async () => {
      const user = userEvent.setup();

      const StayOpenMultiSelect = () => {
        const [value, setValue] = useState<Array<string>>([VALUES[0]!]);

        return (
          <Combobox.Root
            closeOnSelect={false}
            value={value}
            onValueChange={setValue}
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
            </Combobox.Content>
          </Combobox.Root>
        );
      };

      const { container } = render(<StayOpenMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      const getSmsOption = () =>
        Array.from(queryPortalElements("[data-tgph-combobox-option]")).find(
          (option) => option.textContent === "SMS",
        ) as HTMLElement | undefined;

      await user.click(getSmsOption()!);

      await waitFor(() => expect(trigger?.textContent).toBe("EmailSMS"));
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      // Virtual focus: DOM focus stays on the search input and the just-selected
      // option is tracked with data-highlighted rather than receiving DOM focus.
      expect(queryPortalElement("[data-tgph-combobox-search]")).toHaveFocus();
      expect(getSmsOption()?.getAttribute("data-highlighted")).not.toBeNull();
    });

    it("empty state should show when there are no results", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("No results");
      const emptyState = queryPortalElement("[data-tgph-combobox-empty]");
      expect(emptyState).not.toBeNull();
    });

    it("deselecting an option should update the value", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await waitFor(() => expect(trigger?.textContent).toBe("EmailSMS"));

      // Open
      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      // Clicking an already-selected option toggles it off (deselects it).
      // (Under virtual focus, arrow keys navigate relative to the seeded
      // selection, so clicking is the deterministic way to target Email.)
      const emailOption = Array.from(
        queryPortalElements("[data-tgph-combobox-option]"),
      ).find(
        (option) =>
          option.getAttribute("data-tgph-combobox-option-value") === "email",
      ) as HTMLElement;
      await user.click(emailOption);

      await waitFor(() => expect(trigger?.textContent).toBe("SMS"));
    });

    it("pressing enter on the trigger should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      expect(document.activeElement).toBe(trigger);

      // Open combobox with enter
      await user.keyboard("[Enter]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("pressing space on the trigger should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      expect(document.activeElement).toBe(trigger);

      // Open combobox with space
      await user.keyboard(" ");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("pressing arrow down on the trigger should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      expect(document.activeElement).toBe(trigger);

      // Open combobox with space
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });
    it("tag close button removes tag without opening the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await waitFor(() => expect(trigger?.textContent).toBe("EmailSMS"));

      const wasOpen = trigger?.getAttribute("aria-expanded") === "true";

      // Find and click the first tag's close button
      const tagButtons = container.querySelectorAll(
        "[data-tgph-combobox-tag-button]",
      );

      const firstTagButton = tagButtons[0];

      // Click the tag button - should remove tag without toggling combobox state
      await user.click(firstTagButton!);

      // Verify the tag was removed
      await waitFor(() => expect(trigger?.textContent).toBe("SMS"));

      // Verify combobox state didn't toggle
      const isOpen = trigger?.getAttribute("aria-expanded") === "true";
      expect(isOpen).toBe(wasOpen);
    });
  });

  describe("open state", () => {
    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { container, getByTestId } = render(
        <ControlledOpenCombobox onOpenChange={onOpenChange} />,
      );
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      expect(trigger?.getAttribute("aria-expanded")).toBe("false");

      await user.click(getByTestId("open-combobox"));
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
      );
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
    });

    it("calls onOpenAutoFocus when the popup opens (bridged to Base UI initialFocus)", async () => {
      const user = userEvent.setup();
      const onOpenAutoFocus = vi.fn((event: Event) => event.preventDefault());

      const Harness = () => {
        const [value, setValue] = useState<string>(VALUES[0]!);
        return (
          <Combobox.Root value={value} onValueChange={setValue}>
            <Combobox.Trigger />
            <Combobox.Content onOpenAutoFocus={onOpenAutoFocus}>
              <Combobox.Search />
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

      const { container } = render(<Harness />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );
      await waitFor(() => expect(onOpenAutoFocus).toHaveBeenCalled());
    });

    it("keeps the combobox open when escape dismissal is prevented", async () => {
      const user = userEvent.setup();
      const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => {
        event.preventDefault();
      });
      const { container } = render(
        <Combobox.Root>
          <Combobox.Trigger />
          <Combobox.Content onEscapeKeyDown={onEscapeKeyDown}>
            <Combobox.Options>
              {VALUES.map((option, index) => (
                <Combobox.Option key={option} value={option}>
                  {LABELS[index]}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Content>
        </Combobox.Root>,
      );
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      await user.keyboard("[Escape]");

      expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("keeps the combobox open when search escape dismissal is prevented", async () => {
      const user = userEvent.setup();
      const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => {
        event.preventDefault();
      });
      const { container } = render(
        <Combobox.Root>
          <Combobox.Trigger />
          <Combobox.Content onEscapeKeyDown={onEscapeKeyDown}>
            <Combobox.Search />
            <Combobox.Options>
              {VALUES.map((option, index) => (
                <Combobox.Option key={option} value={option}>
                  {LABELS[index]}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox.Content>
        </Combobox.Root>,
      );
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      await user.keyboard("[Escape]");

      expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    it("closes the combobox when Escape is pressed from search input", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Combobox.Root>
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
          </Combobox.Content>
        </Combobox.Root>,
      );
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      expect(queryPortalElement("[data-tgph-combobox-search]")).toHaveFocus();

      await user.keyboard("[Escape]");

      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
      );
    });
  });
});

const valuesLegacy: Array<Option> = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "inapp", label: "In-App" },
  { value: "webhook", label: "Webhook" },
];

const ComboboxSingleSelectLegacy = ({ ...props }) => {
  const [value, setValue] = useState<Option>(valuesLegacy[0]!);
  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      {...props}
      legacyBehavior={true}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Options>
          {valuesLegacy.map((option) => (
            <Combobox.Option key={option.value} {...option} />
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};
const ComboboxMultiSelectLegacy = () => {
  const [value, setValue] = useState<Array<Option>>([
    valuesLegacy[0]!,
    valuesLegacy[1]!,
  ]);
  return (
    <Combobox.Root value={value} onValueChange={setValue} legacyBehavior={true}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {valuesLegacy.map((option) => (
            <Combobox.Option key={option.value} {...option} />
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

describe("Input as trigger", () => {
  it("renders the styled input as the combobox anchor with no button trigger", async () => {
    const { container } = render(<ComboboxInputTrigger />);

    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement | null;
    expect(input).toBeTruthy();
    expect(input?.tagName).toBe("INPUT");
    // Base UI makes the anchor input the combobox; Telegraph points aria-controls
    // at the listbox id (matching Trigger/Search).
    expect(input?.getAttribute("role")).toBe("combobox");
    expect(input?.getAttribute("aria-expanded")).toBe("false");
    expect(input?.getAttribute("aria-controls")).toBeTruthy();
    // The button trigger is not part of this arrangement.
    expect(container.querySelector("[data-tgph-combobox-trigger]")).toBeNull();
  });

  it("does not mount a hidden popup input; the anchor input owns virtual focus", async () => {
    render(<ComboboxInputTrigger defaultOpen />);

    await waitFor(() =>
      expect(
        queryPortalElements("[data-tgph-combobox-option]").length,
      ).toBeGreaterThan(0),
    );

    // A second in-popup input would fight the anchor for role="combobox" and,
    // being inside the popup, would flip Base UI's anchor onto a (nonexistent)
    // button trigger. So it must be absent.
    expect(queryPortalElement("[data-tgph-combobox-input-hidden]")).toBeNull();
    expect(document.querySelectorAll("[data-tgph-combobox-input]").length).toBe(
      1,
    );
  });

  it("filters the options as you type in the anchor input", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboboxInputTrigger />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    await user.click(input);
    await user.type(input, "sms");

    await waitFor(() => {
      const options = queryPortalElements("[data-tgph-combobox-option]");
      expect(options.length).toBe(1);
    });
    expect(
      queryPortalElement("[data-tgph-combobox-option]")?.getAttribute(
        "data-tgph-combobox-option-value",
      ),
    ).toBe("sms");
  });

  it("selecting an option commits its value and closes", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboboxInputTrigger />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    await user.click(input);
    await user.type(input, "push");
    let option: Element | undefined;
    await waitFor(() => {
      option = Array.from(
        queryPortalElements("[data-tgph-combobox-option]"),
      ).find(
        (el) => el.getAttribute("data-tgph-combobox-option-value") === "push",
      );
      expect(option).toBeTruthy();
    });

    await user.click(option!);

    await waitFor(() =>
      expect(input.getAttribute("aria-expanded")).toBe("false"),
    );
  });

  it("does not open when the anchor input is disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboboxInputTrigger disabled />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    // Disabled reaches both the DOM and Base UI's store (passed to BaseUI Input).
    expect(input.disabled).toBe(true);
    expect(input.getAttribute("aria-expanded")).toBe("false");

    // Actually try to open it: a disabled input can't be clicked open, and no
    // options mount.
    await user.click(input);
    expect(input.getAttribute("aria-expanded")).toBe("false");
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='push']"),
    ).toBeFalsy();
  });

  it("clearing the anchor input clears the selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const Harness = () => {
      const [value, setValue] = useState<string | undefined>(undefined);
      return (
        <Combobox.Root
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        >
          <Combobox.Input />
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
    const { container } = render(<Harness />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    // Select a value so the input holds committed text.
    await user.click(input);
    await user.type(input, "push");
    const push = queryPortalElement('[data-tgph-combobox-option-value="push"]');
    await user.click(push!);
    await waitFor(() => expect(input.value).toBe("push"));
    onValueChange.mockClear();

    // Emptying the input is a clear: Base UI commits null, which must reach the
    // consumer as a cleared value rather than being swallowed as a sentinel.
    await user.clear(input);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(undefined));
  });

  it("keeps the popup open when the anchor input is cleared to re-search", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [value, setValue] = useState<string | undefined>(undefined);
      return (
        <Combobox.Root value={value} onValueChange={(next) => setValue(next)}>
          <Combobox.Input />
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
    const { container } = render(<Harness />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    // Select a value, then reopen the popup to re-search.
    await user.click(input);
    await user.type(input, "push");
    await user.click(
      queryPortalElement('[data-tgph-combobox-option-value="push"]')!,
    );
    await waitFor(() => expect(input.value).toBe("push"));
    await user.click(input);
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "true"));

    // Clearing the input to re-search is not a selection, so it must not close
    // the popup out from under the user.
    await user.clear(input);
    await waitFor(() => expect(input.value).toBe(""));
    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("reopening after a selection shows the full option list", async () => {
    const user = userEvent.setup();
    const { container } = render(<ComboboxInputTrigger />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    await user.click(input);
    await user.type(input, "push");
    await waitFor(() =>
      expect(queryPortalElements("[data-tgph-combobox-option]").length).toBe(1),
    );
    const push = queryPortalElement('[data-tgph-combobox-option-value="push"]');
    await user.click(push!);
    await waitFor(() =>
      expect(input.getAttribute("aria-expanded")).toBe("false"),
    );

    // Reopen: a programmatic label resync must not leave the list pre-filtered
    // to the selected option.
    await user.click(input);
    await waitFor(() =>
      expect(input.getAttribute("aria-expanded")).toBe("true"),
    );
    await waitFor(() =>
      expect(queryPortalElements("[data-tgph-combobox-option]").length).toBe(
        VALUES.length,
      ),
    );
  });

  it("combobox is accessible", async () => {
    const { container } = render(<ComboboxInputTrigger defaultOpen />);
    const results = await axe(container);
    expectToHaveNoViolations(results);
  });
});

describe("Free-text autocomplete (selectionMode none)", () => {
  it("keeps arbitrary typed text and selects nothing", async () => {
    const user = userEvent.setup();
    const onInputValueChange = vi.fn();
    const { container } = render(
      <FreeTextCombobox onInputValueChange={onInputValueChange} />,
    );
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    await user.type(input, "custom value");

    await waitFor(() => expect(input.value).toBe("custom value"));
    expect(onInputValueChange).toHaveBeenLastCalledWith("custom value");
    // No selection exists in free-text mode.
    expect(
      queryPortalElements('[data-tgph-combobox-option][aria-selected="true"]')
        .length,
    ).toBe(0);
  });

  it("fills the input from a pressed suggestion and closes", async () => {
    const user = userEvent.setup();
    const { container } = render(<FreeTextCombobox />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    await user.type(input, "sm");
    let sms: Element | undefined;
    await waitFor(() => {
      sms = Array.from(queryPortalElements("[data-tgph-combobox-option]")).find(
        (el) => el.getAttribute("data-tgph-combobox-option-value") === "SMS",
      );
      expect(sms).toBeTruthy();
    });

    await user.click(sms!);

    // The suggestion fills the input, and — because free text has no value
    // bridge — the item-press close is honored here (regression guard).
    await waitFor(() => {
      expect(input.value).toBe("SMS");
      expect(input.getAttribute("aria-expanded")).toBe("false");
    });
  });

  it("pressing an action item runs its handler without overwriting the input", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const Harness = () => {
      const [inputValue, setInputValue] = useState("");
      return (
        <Combobox.Root
          selectionMode="none"
          inputValue={inputValue}
          onInputValueChange={(next) => setInputValue(next)}
        >
          <Combobox.Input />
          <Combobox.Content>
            <Combobox.Options>
              {FREE_TEXT_CHANNELS.map((channel) => (
                <Combobox.Option key={channel} value={channel}>
                  {channel}
                </Combobox.Option>
              ))}
              <Combobox.Create
                values={FREE_TEXT_CHANNELS}
                onCreate={onCreate}
              />
            </Combobox.Options>
          </Combobox.Content>
        </Combobox.Root>
      );
    };
    const { container } = render(<Harness />);
    const input = container.querySelector(
      "[data-tgph-combobox-input]",
    ) as HTMLInputElement;

    await user.type(input, "brandnew");

    let createRow: Element | undefined;
    await waitFor(() => {
      createRow = Array.from(
        queryPortalElements("[data-tgph-combobox-option]"),
      ).find((el) => el.textContent?.includes("Create"));
      expect(createRow).toBeTruthy();
    });

    await user.click(createRow!);

    // The action item commits nothing to the input: the sentinel fill is
    // cancelled, so the user's free text survives (guards the sentinel
    // serialization from colliding with a real value).
    expect(onCreate).toHaveBeenCalledWith("brandnew");
    expect(input.value).toBe("brandnew");
  });
});

describe("required (form integration)", () => {
  const RequiredForm = ({ value }: { value?: string }) => (
    <form data-testid="form">
      <Combobox.Root
        value={value}
        onValueChange={() => {}}
        required
        name="channel"
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
    </form>
  );

  it("blocks form submission until a value is selected", () => {
    const { getByTestId, rerender } = render(<RequiredForm />);
    const form = getByTestId("form") as HTMLFormElement;

    // No selection: Base UI's hidden required input is empty → form invalid.
    expect(form.checkValidity()).toBe(false);

    // A selection populates the hidden input → the form validates.
    rerender(<RequiredForm value="email" />);
    expect(form.checkValidity()).toBe(true);
  });

  it("submits the selected value under the given name", () => {
    const { getByTestId, rerender } = render(<RequiredForm value="email" />);
    const form = getByTestId("form") as HTMLFormElement;

    const hidden = form.querySelector(
      'input[name="channel"]',
    ) as HTMLInputElement | null;
    expect(hidden).not.toBeNull();
    expect(hidden?.value).toBe("email");

    rerender(<RequiredForm value="sms" />);
    expect(
      (form.querySelector('input[name="channel"]') as HTMLInputElement)?.value,
    ).toBe("sms");
  });

  const MultiRequiredForm = ({ value }: { value?: Array<string> }) => (
    <form data-testid="form">
      <Combobox.Root
        value={value ?? []}
        onValueChange={() => {}}
        required
        name="channels"
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
    </form>
  );

  it("enforces required on a multi-select until at least one value is chosen", () => {
    const { getByTestId, rerender } = render(<MultiRequiredForm />);
    const form = getByTestId("form") as HTMLFormElement;

    // Empty multi-select is required → invalid; Base UI drops `required` once a
    // value exists, so a non-empty selection validates ("at least one" semantics).
    expect(form.checkValidity()).toBe(false);

    rerender(<MultiRequiredForm value={["email"]} />);
    expect(form.checkValidity()).toBe(true);
  });
});

describe("legacyBehavior Combobox", () => {
  describe("Single Select", () => {
    it("combobox is accessible", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      expectToHaveNoViolations(await axe(container));
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      expectToHaveNoViolations(await axe(container));
    });

    it("pressing the down arrow key should open the combobox", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Tab to trigger
      await user.tab();
      // Open combobox
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    });

    // Virtual focus: see the non-legacy counterpart above.
    it("after opening, the selected option is highlighted and arrow keys move the highlight", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Open
      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      const firstOption = queryPortalElement(
        '[data-tgph-combobox-option-value="email"]',
      );
      await waitFor(() =>
        expect(firstOption?.getAttribute("data-highlighted")).not.toBeNull(),
      );
      expect(document.activeElement?.tagName).toBe("INPUT");
      expect(document.activeElement).not.toEqual(firstOption);

      await user.keyboard("[ArrowDown]");
      const secondOption = queryPortalElement(
        '[data-tgph-combobox-option-value="sms"]',
      );
      await waitFor(() =>
        expect(secondOption?.getAttribute("data-highlighted")).not.toBeNull(),
      );
      expect(firstOption?.getAttribute("data-highlighted")).toBeNull();
    });

    it("pressing enter on an option should select it", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Open
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      // Select first option
      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");
    });

    // Virtual focus: see the non-legacy counterpart above.
    it("pressing the first letter of an option highlights the matching option", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      await user.keyboard("s");
      const smsOption = queryPortalElement(
        '[data-tgph-combobox-option-value="sms"]',
      );
      await waitFor(() =>
        expect(smsOption?.getAttribute("data-highlighted")).not.toBeNull(),
      );
      expect(document.activeElement?.tagName).toBe("INPUT");

      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("SMS");
    });

    it("clear button should clear the field", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy clearable />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");

      const clearButton = queryPortalElement("[data-tgph-combobox-clear]");
      await user.click(clearButton!);
      expect(trigger?.textContent).toBe("");
    });

    it("should not be able to open when disabled", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy disabled />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "false");

      expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("Multi Select", () => {
    it("combobox is accessible", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      expectToHaveNoViolations(await axe(container));
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      expectToHaveNoViolations(await axe(container));
    });

    it("search is automatically focused on open", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      const searchInput = queryPortalElement("[data-tgph-combobox-search]");
      expect(document.activeElement).toBe(searchInput);
    });

    it("searching for an option should filter the options", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("Email");
      const options = queryPortalElements("[data-tgph-combobox-option]");
      expect(options.length).toBe(1);
    });

    it("empty state should show when there are no results", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("No results");
      const emptyState = queryPortalElement("[data-tgph-combobox-empty]");
      expect(emptyState).not.toBeNull();
    });

    it("deselecting an option should update the value", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await waitFor(() => expect(trigger?.textContent).toBe("EmailSMS"));

      // Open
      await user.click(trigger!);
      await waitFor(() =>
        expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
      );

      // Clicking an already-selected option toggles it off (deselects it).
      const emailOption = Array.from(
        queryPortalElements("[data-tgph-combobox-option]"),
      ).find(
        (option) =>
          option.getAttribute("data-tgph-combobox-option-value") === "email",
      ) as HTMLElement;
      await user.click(emailOption);

      await waitFor(() => expect(trigger?.textContent).toBe("SMS"));
    });
  });
});

describe("findStringNodes", () => {
  it("returns empty array for null node", () => {
    expect(findStringNodes(null)).toStrictEqual([]);
  });

  it("returns empty array for undefined node", () => {
    expect(findStringNodes(undefined)).toStrictEqual([]);
  });

  it("handles array of strings", () => {
    expect(findStringNodes(["Lorem", "ipsum"])).toStrictEqual([
      "Lorem",
      "ipsum",
    ]);
  });

  it("handles array of elements", () => {
    const children = [<span>Hello</span>, <span>World</span>];
    expect(findStringNodes(children)).toStrictEqual(["Hello", "World"]);
  });

  it("handles element with text content", () => {
    const node = <div>Hello</div>;
    expect(findStringNodes(node)).toStrictEqual(["Hello"]);
  });

  it("handles element with child elements", () => {
    const node = (
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
        <span>
          <span>Dolor</span>
          <span>Sit</span>
        </span>
      </div>
    );
    expect(findStringNodes(node)).toStrictEqual([
      "Lorem",
      "Ipsum",
      "Dolor",
      "Sit",
    ]);
  });

  it("handles element with mixed children", () => {
    const node = (
      <p>
        Lorem
        <span>ipsum</span>
        dolor
      </p>
    );
    expect(findStringNodes(node)).toStrictEqual(["Lorem", "ipsum", "dolor"]);
  });
});

describe("getOptionAccessibleLabel", () => {
  it("returns undefined when no option is provided", () => {
    expect(getOptionAccessibleLabel()).toBeUndefined();
  });

  it("uses text-like LABELS as the accessible label", () => {
    expect(getOptionAccessibleLabel({ value: "email", label: "Email" })).toBe(
      "Email",
    );
    expect(getOptionAccessibleLabel({ value: "sms", label: 123 })).toBe("123");
  });

  it("falls back to the option value for non-text LABELS", () => {
    expect(
      getOptionAccessibleLabel({
        value: "push",
        label: <span>Push</span>,
      }),
    ).toBe("push");
  });

  it("falls back to the option value when the label is an empty string", () => {
    expect(getOptionAccessibleLabel({ value: "email", label: "" })).toBe(
      "email",
    );
  });
});

describe("Custom Trigger", () => {
  it("renders the custom trigger with the initial value", async () => {
    const { container } = render(<CustomTriggerCombobox />);
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    expect(trigger?.textContent).toBe("Trigger Value:Email");
  });

  it("updates the trigger when a new value is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<CustomTriggerCombobox />);
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Select SMS option
    await user.keyboard("s");
    await user.keyboard("[Enter]");

    // Verify trigger updated
    await waitFor(() => expect(trigger?.textContent).toBe("Trigger Value:SMS"));
  });

  it("maintains proper accessibility attributes", async () => {
    const user = userEvent.setup();
    const { container } = render(<CustomTriggerCombobox />);
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Verify initial accessibility attributes
    expect(trigger).toHaveAttribute("role", "combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

    // Open combobox and verify attributes update
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
  });

  it("handles keyboard navigation correctly", async () => {
    const user = userEvent.setup();
    const { container } = render(<CustomTriggerCombobox />);
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Open
    await user.keyboard("[ArrowDown]");
    await user.keyboard("[ArrowDown]");
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Select first option
    await user.keyboard("[Enter]");
    expect(trigger?.textContent).toBe("Trigger Value:Email");
  });

  it("is accessible", async () => {
    const user = userEvent.setup();
    const { container } = render(<CustomTriggerCombobox />);
    expectToHaveNoViolations(await axe(container));

    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
    expectToHaveNoViolations(await axe(container));
  });
});

const ComboboxWithDefaultValue = ({
  defaultValue,
}: {
  defaultValue: string;
}) => {
  return (
    <Combobox.Root defaultValue={defaultValue} placeholder="Select a channel">
      <Combobox.Trigger />
      <Combobox.Content>
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

const ComboboxWithManyOptions = ({
  defaultValue,
}: {
  defaultValue: string;
}) => {
  const years = Array.from({ length: 101 }, (_, i) => String(1960 + i));

  return (
    <Combobox.Root defaultValue={defaultValue} placeholder="Select a year">
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Options>
          {years.map((year) => (
            <Combobox.Option key={year} value={year}>
              {year}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

describe("defaultValue", () => {
  it("renders with defaultValue", async () => {
    const { container } = render(
      <ComboboxWithDefaultValue defaultValue="sms" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    expect(trigger?.textContent).toBe("SMS");
  });

  it("allows selecting a different value when defaultValue is provided", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComboboxWithDefaultValue defaultValue="email" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Initial value should be Email
    expect(trigger?.textContent).toBe("Email");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Select SMS option
    await user.keyboard("s");
    await user.keyboard("[Enter]");

    // Value should now be SMS
    await waitFor(() => expect(trigger?.textContent).toBe("SMS"));
  });

  it("shows placeholder when defaultValue is not provided", async () => {
    const { container } = render(
      <Combobox.Root placeholder="Select a channel">
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
      </Combobox.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    // When no value is provided, the placeholder is shown
    expect(trigger?.textContent).toBe("Select a channel");
  });

  it("controlled value takes precedence over defaultValue", async () => {
    const { container } = render(
      <Combobox.Root
        value="push"
        defaultValue="sms"
        placeholder="Select a channel"
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
      </Combobox.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    // Controlled value (push) should take precedence
    expect(trigger?.textContent).toBe("Push");
  });

  it("is accessible with defaultValue", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComboboxWithDefaultValue defaultValue="email" />,
    );
    expectToHaveNoViolations(await axe(container));
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
    expectToHaveNoViolations(await axe(container));
  });
});

describe("scroll to selected", () => {
  it("scrolls to selected option when opening with many options", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComboboxWithManyOptions defaultValue="2025" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Value should be 2025
    expect(trigger?.textContent).toBe("2025");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The selected option should exist and be marked as selected
    const selectedOption = queryPortalElement(
      '[data-tgph-combobox-option-value="2025"]',
    );
    expect(selectedOption).not.toBeNull();
    expect(selectedOption?.getAttribute("aria-selected")).toBe("true");
  });

  it("handles values with special characters that would break CSS selectors", async () => {
    // Values that would break querySelector if used with string interpolation:
    // - Double quotes: Option "A"
    // - Brackets: Option [B]
    // - Backslashes: Option \C
    const SPECIAL_VALUES = [
      'Option "A"',
      "Option [B]",
      "Option \\C",
      "Option 'D'",
    ];

    const user = userEvent.setup();
    const { container } = render(
      <Combobox.Root defaultValue='Option "A"' placeholder="Select an option">
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Options>
            {SPECIAL_VALUES.map((val) => (
              <Combobox.Option key={val} value={val}>
                {val}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Value should be displayed (with quotes in the value)
    expect(trigger?.textContent).toBe('Option "A"');

    // Open combobox - this triggers the scroll-to-selected logic
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The selected option should exist and be marked as selected
    // We use getAttribute instead of querySelector to avoid the same issue
    const allOptions = document.querySelectorAll("[data-tgph-combobox-option]");
    const selectedOption = Array.from(allOptions).find(
      (el) =>
        el.getAttribute("data-tgph-combobox-option-value") === 'Option "A"',
    );
    expect(selectedOption).not.toBeNull();
    expect(selectedOption?.getAttribute("aria-selected")).toBe("true");
  });
});

const ComboboxWithDefaultScrollToValue = ({
  defaultScrollToValue,
}: {
  defaultScrollToValue: string;
}) => {
  const years = Array.from({ length: 101 }, (_, i) => String(1960 + i));
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      defaultScrollToValue={defaultScrollToValue}
      placeholder="Select a year"
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Options>
          {years.map((year) => (
            <Combobox.Option key={year} value={year}>
              {year}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

describe("defaultScrollToValue", () => {
  it("scrolls to defaultScrollToValue when no value is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ComboboxWithDefaultScrollToValue defaultScrollToValue="2025" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // No value should be selected initially
    expect(trigger?.textContent).toBe("Select a year");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The defaultScrollToValue option should exist (but not be selected)
    const targetOption = queryPortalElement(
      '[data-tgph-combobox-option-value="2025"]',
    );
    expect(targetOption).not.toBeNull();
    expect(targetOption?.getAttribute("aria-selected")).toBe("false");
  });

  it("selected value takes precedence over defaultScrollToValue", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Combobox.Root
        defaultValue="1990"
        defaultScrollToValue="2025"
        placeholder="Select a year"
      >
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Options>
            {Array.from({ length: 101 }, (_, i) => String(1960 + i)).map(
              (year) => (
                <Combobox.Option key={year} value={year}>
                  {year}
                </Combobox.Option>
              ),
            )}
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Value should be 1990 (defaultValue)
    expect(trigger?.textContent).toBe("1990");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Wait for scroll animation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The selected option (1990) should be marked as selected
    const selectedOption = queryPortalElement(
      '[data-tgph-combobox-option-value="1990"]',
    );
    expect(selectedOption).not.toBeNull();
    expect(selectedOption?.getAttribute("aria-selected")).toBe("true");

    // defaultScrollToValue option should not be selected
    const scrollToOption = queryPortalElement(
      '[data-tgph-combobox-option-value="2025"]',
    );
    expect(scrollToOption?.getAttribute("aria-selected")).toBe("false");
  });
});

// Wrapper component to test controlled value changes from outside
const ControlledComboboxWrapper = ({
  initialValue,
  onValueChange,
}: {
  initialValue: string;
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div>
      <button
        data-testid="external-change-btn"
        onClick={() => setValue("push")}
      >
        Change to Push
      </button>
      <button
        data-testid="external-change-sms-btn"
        onClick={() => setValue("sms")}
      >
        Change to SMS
      </button>
      <Combobox.Root
        value={value}
        onValueChange={handleValueChange}
        placeholder="Select a channel"
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
          <Combobox.Empty />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  );
};

describe("controlled value changes", () => {
  it("updates trigger when value prop changes externally", async () => {
    const user = userEvent.setup();
    const { container, getByTestId } = render(
      <ControlledComboboxWrapper initialValue="email" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Initial value should be Email
    expect(trigger?.textContent).toBe("Email");

    // Click the external button to change value to Push
    await user.click(getByTestId("external-change-btn"));

    // Trigger should now show Push
    await waitFor(() => expect(trigger?.textContent).toBe("Push"));
  });

  it("updates selected option in dropdown when value changes externally", async () => {
    const user = userEvent.setup();
    const { container, getByTestId } = render(
      <ControlledComboboxWrapper initialValue="email" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Email should be selected
    const emailOption = queryPortalElement(
      '[data-tgph-combobox-option-value="email"]',
    );
    expect(emailOption?.getAttribute("aria-selected")).toBe("true");

    // Close the combobox
    await user.keyboard("[Escape]");
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "false");

    // Change value externally to SMS
    await user.click(getByTestId("external-change-sms-btn"));
    await waitFor(() => expect(trigger?.textContent).toBe("SMS"));

    // Open combobox again
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // SMS should now be selected
    const smsOption = queryPortalElement(
      '[data-tgph-combobox-option-value="sms"]',
    );
    expect(smsOption?.getAttribute("aria-selected")).toBe("true");

    // Email should no longer be selected
    const emailOptionAfter = queryPortalElement(
      '[data-tgph-combobox-option-value="email"]',
    );
    expect(emailOptionAfter?.getAttribute("aria-selected")).toBe("false");
  });

  it("calls onValueChange when selecting from dropdown in controlled mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <ControlledComboboxWrapper
        initialValue="email"
        onValueChange={onValueChange}
      />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Open combobox
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

    // Select SMS
    await user.keyboard("s");
    await user.keyboard("[Enter]");

    // onValueChange should have been called with "sms"
    expect(onValueChange).toHaveBeenCalledWith("sms");
  });

  it("maintains controlled behavior - internal selection updates controlled value", async () => {
    const user = userEvent.setup();
    const { container, getByTestId } = render(
      <ControlledComboboxWrapper initialValue="email" />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    // Initial value
    expect(trigger?.textContent).toBe("Email");

    // Select a new value from dropdown
    await user.click(trigger!);
    await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
    await user.keyboard("p"); // Focus Push
    await user.keyboard("[Enter]");

    // Value should be Push
    await waitFor(() => expect(trigger?.textContent).toBe("Push"));

    // Now change externally to SMS
    await user.click(getByTestId("external-change-sms-btn"));
    await waitFor(() => expect(trigger?.textContent).toBe("SMS"));

    // Then change externally to Push again
    await user.click(getByTestId("external-change-btn"));
    await waitFor(() => expect(trigger?.textContent).toBe("Push"));
  });
});

describe("manualFiltering", () => {
  const renderWithSearch = (props?: { manualFiltering?: boolean }) =>
    render(
      <Combobox.Root defaultValue="email" {...props}>
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
      </Combobox.Root>,
    );

  const openAndType = async (
    user: ReturnType<typeof userEvent.setup>,
    container: HTMLElement,
    text: string,
  ) => {
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
    );
    const search = queryPortalElement(
      "[data-tgph-combobox-search]",
    ) as HTMLInputElement;
    await user.type(search, text);
  };

  it("keeps every rendered option visible for a non-matching query", async () => {
    const user = userEvent.setup();
    const { container } = renderWithSearch({ manualFiltering: true });

    await openAndType(user, container, "zzz");

    // The consumer owns filtering, so the internal filter never hides a row.
    await waitFor(() =>
      expect(queryPortalElements("[data-tgph-combobox-option]").length).toBe(
        VALUES.length,
      ),
    );
  });

  it("filters internally when the flag is absent (control)", async () => {
    const user = userEvent.setup();
    const { container } = renderWithSearch();

    await openAndType(user, container, "zzz");

    await waitFor(() =>
      expect(queryPortalElements("[data-tgph-combobox-option]").length).toBe(0),
    );
  });
});

describe("Trigger ref", () => {
  it("composes a consumer tgphRef with the internal trigger ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    const { container } = render(
      <Combobox.Root defaultValue="email">
        <Combobox.Trigger tgphRef={ref} />
        <Combobox.Content>
          <Combobox.Options>
            {VALUES.map((option, index) => (
              <Combobox.Option key={option} value={option}>
                {LABELS[index]}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>,
    );

    // The consumer ref resolves to the trigger element; the internal ref (which
    // drives keyboard-close refocus) is composed in rather than clobbered.
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    expect(ref.current).toBe(trigger);
  });
});

describe("Combobox type inheritance", () => {
  it("accepts valid content props", () => {
    const validProps: ComboboxContentProps = {};
    void validProps;
  });

  it("accepts inherited stack/layout props on Options", () => {
    const validProps: ComboboxOptionsProps = {
      gap: "2",
      padding: "1",
    };
    void validProps;
  });

  it("accepts React node labels on Option", () => {
    const validProps: ComboboxOptionProps = {
      value: "email",
      label: <span>Email</span>,
    };
    void validProps;
  });

  it("rejects unknown props on type level", () => {
    // @ts-expect-error unknown prop rejected on ComboboxContentProps
    const invalidProp: ComboboxContentProps = { invalidProp: "invalid" };
    void invalidProp;

    const invalidOptionsProp: ComboboxOptionsProps = {
      // @ts-expect-error unknown prop rejected on ComboboxOptionsProps
      invalidProp: "invalid",
    };
    void invalidOptionsProp;
  });
});

const PAGE_CHANNELS = [
  { value: "general", label: "general" },
  { value: "random", label: "random" },
];
const PAGE_PEOPLE = [
  { value: "ada", label: "Ada" },
  { value: "grace", label: "Grace" },
];

const ComboboxWithPages = ({
  withSearch = true,
  page,
  onPageChange,
  loopPages,
}: {
  withSearch?: boolean;
  page?: string;
  onPageChange?: (page: string) => void;
  loopPages?: boolean;
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Combobox.Root
      value={value}
      onValueChange={(next) => setValue(next as string | undefined)}
      defaultPage="channels"
      page={page}
      onPageChange={onPageChange}
      loopPages={loopPages}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        {withSearch ? <Combobox.Search /> : null}
        <Combobox.PageSelector aria-label="Destination type">
          <Combobox.PageButton value="channels">Channels</Combobox.PageButton>
          <Combobox.PageButton value="people">People</Combobox.PageButton>
        </Combobox.PageSelector>
        <Combobox.Options>
          <Combobox.Page value="channels">
            {PAGE_CHANNELS.map((o) => (
              <Combobox.Option key={o.value} value={o.value}>
                {o.label}
              </Combobox.Option>
            ))}
          </Combobox.Page>
          <Combobox.Page value="people">
            {PAGE_PEOPLE.map((o) => (
              <Combobox.Option key={o.value} value={o.value}>
                {o.label}
              </Combobox.Option>
            ))}
          </Combobox.Page>
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

const clickPageButton = async (
  user: ReturnType<typeof userEvent.setup>,
  label: string,
) => {
  const button = Array.from(document.querySelectorAll("button")).find(
    (el) => el.textContent?.trim() === label,
  );
  if (!button) throw new Error(`page button "${label}" not found`);
  await user.click(button);
};

describe("Segmented pages", () => {
  it("renders only the active page's options and swaps them on a page button click", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    // defaultPage="channels" is active.
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='general']"),
      ).toBeTruthy();
    });
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='ada']"),
    ).toBeFalsy();

    await clickPageButton(user, "People");

    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='ada']"),
      ).toBeTruthy();
    });
    // The previous page's options unmount, so the mounted set matches the page.
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='general']"),
    ).toBeFalsy();
  });

  it("marks the active page panel with the slide direction", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    // Forward: People comes after the default Channels page.
    await clickPageButton(user, "People");
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-page-panel]")?.getAttribute(
          "data-tgph-combobox-page-direction",
        ),
      ).toBe("forward");
    });

    // Back: Channels comes before People.
    await clickPageButton(user, "Channels");
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-page-panel]")?.getAttribute(
          "data-tgph-combobox-page-direction",
        ),
      ).toBe("back");
    });
  });

  it("switches pages with Left/Right while the search is empty", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    const search = (await waitFor(() => {
      const el = queryPortalElement("[data-tgph-combobox-search]");
      if (!el) throw new Error("search not mounted");
      return el;
    })) as HTMLInputElement;
    search.focus();

    await user.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='ada']"),
      ).toBeTruthy();
    });

    await user.keyboard("{ArrowLeft}");
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='general']"),
      ).toBeTruthy();
    });
  });

  it("clamps at the first/last page when loopPages is false", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages loopPages={false} />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    const search = (await waitFor(() => {
      const el = queryPortalElement("[data-tgph-combobox-search]");
      if (!el) throw new Error("search not mounted");
      return el;
    })) as HTMLInputElement;
    search.focus();

    // Left from the first page (channels) stays put — no wrap to the last.
    await user.keyboard("{ArrowLeft}");
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='general']"),
    ).toBeTruthy();
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='ada']"),
    ).toBeFalsy();

    // Right advances to the last page (people)...
    await user.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='ada']"),
      ).toBeTruthy();
    });

    // ...and Right again stays there instead of wrapping to the first.
    await user.keyboard("{ArrowRight}");
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='ada']"),
    ).toBeTruthy();
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='general']"),
    ).toBeFalsy();
  });

  it("does not switch pages when the search has text (arrows move the caret)", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    const search = (await waitFor(() => {
      const el = queryPortalElement("[data-tgph-combobox-search]");
      if (!el) throw new Error("search not mounted");
      return el;
    })) as HTMLInputElement;
    search.focus();
    await user.keyboard("gen");

    await user.keyboard("{ArrowRight}");
    // Still on the channels page. The People page never mounts.
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='ada']"),
    ).toBeFalsy();
  });

  it("switches pages with Left/Right when there is no search input", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages withSearch={false} />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    const hidden = (await waitFor(() => {
      const el = queryPortalElement("[data-tgph-combobox-input-hidden]");
      if (!el) throw new Error("hidden input not mounted");
      return el;
    })) as HTMLInputElement;
    hidden.focus();

    await user.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='ada']"),
      ).toBeTruthy();
    });
  });

  it("honors a controlled page prop", async () => {
    const user = userEvent.setup();
    render(<ComboboxWithPages page="people" onPageChange={() => {}} />);
    await user.click(queryPortalElement("[data-tgph-combobox-trigger]")!);

    await waitFor(() => {
      expect(
        queryPortalElement("[data-tgph-combobox-option-value='ada']"),
      ).toBeTruthy();
    });
    expect(
      queryPortalElement("[data-tgph-combobox-option-value='general']"),
    ).toBeFalsy();
  });
});
