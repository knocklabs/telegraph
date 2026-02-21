import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Combobox } from "./Combobox";
import { findStringNodes } from "./Combobox.helpers";
import type { ComboboxContentProps, ComboboxOptionsProps } from "./index";

type Option = { value: string; label?: string };

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const values = ["email", "sms", "push", "inapp", "webhook"];
const labels = ["Email", "SMS", "Push", "In-App", "Webhook"];

// Utility to query elements rendered in a portal
const queryPortalElement = (selector: string) =>
  document.querySelector(selector);
const queryPortalElements = (selector: string) =>
  document.querySelectorAll(selector);
const queryPortalOptionByText = (text: string) => {
  return Array.from(queryPortalElements("[data-tgph-combobox-option]")).find(
    (option) => option.textContent === text,
  );
};

const ComboboxSingleSelect = ({ ...props }) => {
  const [value, setValue] = React.useState<string>(values[0]!);
  return (
    <Combobox.Root value={value} onValueChange={setValue} {...props}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Options>
          {values.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {labels[index]}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

const ComboboxMultiSelect = () => {
  const [value, setValue] = React.useState<Array<string>>([
    values[0]!,
    values[1]!,
  ]);
  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {values.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {labels[index]}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

const CustomTriggerCombobox = () => {
  const [value, setValue] = React.useState<Option>(valuesLegacy[0]!);
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
describe("Combobox", () => {
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

    it("after opening, pressing the down arrow key should focus the first option", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Open
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      // Focus first option
      await user.keyboard("[ArrowDown]");
      const firstOption = queryPortalElement("[data-tgph-combobox-option]");
      expect(document.activeElement).toEqual(firstOption);
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

    it("pressing the first letter of an option should focus it", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("s");
      const activeElementTextContent = document.activeElement?.textContent;
      expect(activeElementTextContent).toEqual("SMS");

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

      await waitFor(() => expect(trigger?.textContent).toBe("Email"));

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
      await waitFor(() => expect(trigger?.textContent).toBe("Email"));

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
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      // Focus first option
      await user.keyboard("[ArrowDown]");
      await user.keyboard("[Enter]");

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
});

const valuesLegacy: Array<Option> = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
  { value: "inapp", label: "In-App" },
  { value: "webhook", label: "Webhook" },
];

const ComboboxSingleSelectLegacy = ({ ...props }) => {
  const [value, setValue] = React.useState<Option>(valuesLegacy[0]!);
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
  const [value, setValue] = React.useState<Array<Option>>([
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

    it("after opening, pressing the down arrow key should focus the first option", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      // Open
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      // Focus first option
      await user.keyboard("[ArrowDown]");
      const firstOption = queryPortalElement("[data-tgph-combobox-option]");
      expect(document.activeElement).toEqual(firstOption);
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

    it("pressing the first letter of an option should focus it", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");

      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      await user.keyboard("s");
      const activeElementTextContent = document.activeElement?.textContent;
      expect(activeElementTextContent).toEqual("SMS");

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
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");

      // Focus first option
      await user.keyboard("[ArrowDown]");
      await user.keyboard("[Enter]");

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
          {values.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {labels[index]}
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
            {values.map((option, index) => (
              <Combobox.Option key={option} value={option}>
                {labels[index]}
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
            {values.map((option, index) => (
              <Combobox.Option key={option} value={option}>
                {labels[index]}
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
    const specialValues = [
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
            {specialValues.map((val) => (
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
  const [value, setValue] = React.useState<string | undefined>(undefined);

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
  const [value, setValue] = React.useState(initialValue);

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
            {values.map((option, index) => (
              <Combobox.Option key={option} value={option}>
                {labels[index]}
              </Combobox.Option>
            ))}
          </Combobox.Options>
          <Combobox.Empty />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  );
};

const ControlledOpenComboboxWrapper = ({
  onOpenChange,
}: {
  onOpenChange?: (open: boolean) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(values[0]!);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <div>
      <button data-testid="external-open-btn" onClick={() => setOpen(true)}>
        Open
      </button>
      <button data-testid="external-close-btn" onClick={() => setOpen(false)}>
        Close
      </button>
      <Combobox.Root
        open={open}
        onOpenChange={handleOpenChange}
        value={value}
        onValueChange={setValue}
      >
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Options>
            {values.map((option, index) => (
              <Combobox.Option key={option} value={option}>
                {labels[index]}
              </Combobox.Option>
            ))}
          </Combobox.Options>
          <Combobox.Empty />
        </Combobox.Content>
      </Combobox.Root>
    </div>
  );
};

const SingleSelectCloseOnSelectCombobox = ({
  closeOnSelect,
}: {
  closeOnSelect: boolean;
}) => {
  const [value, setValue] = React.useState<string>(values[0]!);

  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      closeOnSelect={closeOnSelect}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Options>
          {values.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {labels[index]}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

const SearchResetCombobox = () => {
  const [value, setValue] = React.useState<Array<string>>([]);

  return (
    <Combobox.Root value={value} onValueChange={setValue} closeOnSelect={false}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {values.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {labels[index]}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};

const CreatableCombobox = ({
  onCreate,
}: {
  onCreate?: (value: string) => void;
}) => {
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      placeholder="Select a channel"
      closeOnSelect={false}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {values.map((option, index) => (
            <Combobox.Option key={option} value={option}>
              {labels[index]}
            </Combobox.Option>
          ))}
          <Combobox.Create values={values} onCreate={onCreate} />
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};

const CreatableLegacyCombobox = ({
  onCreate,
}: {
  onCreate: (value: Option) => void;
}) => {
  const [value, setValue] = React.useState<Option | undefined>(undefined);

  return (
    <Combobox.Root
      value={value}
      onValueChange={setValue}
      placeholder="Select a channel"
      closeOnSelect={false}
      legacyBehavior={true}
    >
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {valuesLegacy.map((option) => (
            <Combobox.Option key={option.value} value={option.value}>
              {option.label}
            </Combobox.Option>
          ))}
          <Combobox.Create
            values={valuesLegacy}
            onCreate={onCreate}
            legacyBehavior={true}
          />
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
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

describe("behavior contracts", () => {
  it("supports defaultOpen", () => {
    const { container } = render(
      <Combobox.Root defaultOpen defaultValue="email">
        <Combobox.Trigger />
        <Combobox.Content>
          <Combobox.Options>
            {values.map((option, index) => (
              <Combobox.Option key={option} value={option}>
                {labels[index]}
              </Combobox.Option>
            ))}
          </Combobox.Options>
          <Combobox.Empty />
        </Combobox.Content>
      </Combobox.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");

    const content = queryPortalElement("[data-tgph-combobox-content]");
    expect(content?.getAttribute("data-tgph-combobox-content-open")).toBe(
      "true",
    );
  });

  it("supports controlled open state and emits onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { container, getByTestId } = render(
      <ControlledOpenComboboxWrapper onOpenChange={onOpenChange} />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    expect(trigger?.getAttribute("aria-expanded")).toBe("false");

    await user.click(trigger!);
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);

    await user.click(getByTestId("external-open-btn"));
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));

    await user.click(getByTestId("external-close-btn"));
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
    );
  });

  it("keeps the combobox open on selection when closeOnSelect is false", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SingleSelectCloseOnSelectCombobox closeOnSelect={false} />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));

    const smsOption = queryPortalElement(
      '[data-tgph-combobox-option-value="sms"]',
    );
    await user.click(smsOption!);

    await waitFor(() => expect(trigger?.textContent).toBe("SMS"));
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
  });

  it("resets the search query when the combobox closes", async () => {
    const user = userEvent.setup();
    const { container } = render(<SearchResetCombobox />);
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));

    const searchInput = queryPortalElement(
      "[data-tgph-combobox-search]",
    ) as HTMLInputElement;
    await user.type(searchInput, "web");

    await waitFor(() => {
      const options = queryPortalElements("[data-tgph-combobox-option]");
      expect(options.length).toBe(1);
    });

    await user.keyboard("[Escape]");
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("false"),
    );

    await user.click(trigger!);
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));

    const reopenedSearchInput = queryPortalElement(
      "[data-tgph-combobox-search]",
    ) as HTMLInputElement;
    expect(reopenedSearchInput.value).toBe("");

    await waitFor(() => {
      const options = queryPortalElements("[data-tgph-combobox-option]");
      expect(options.length).toBe(values.length);
    });
  });

  it("only renders create for missing values and emits string payload", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const { container } = render(<CreatableCombobox onCreate={onCreate} />);
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));

    const searchInput = queryPortalElement(
      "[data-tgph-combobox-search]",
    ) as HTMLInputElement;
    await user.type(searchInput, "email");

    expect(queryPortalOptionByText('Create "email"')).toBeUndefined();

    await user.clear(searchInput);
    await user.type(searchInput, "fax");

    const createOption = queryPortalOptionByText('Create "fax"');
    expect(createOption).toBeDefined();

    await user.click(createOption!);

    expect(onCreate).toHaveBeenCalledWith("fax");
    expect(searchInput.value).toBe("");
  });

  it("emits legacy object payload from create when legacyBehavior is true", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const { container } = render(
      <CreatableLegacyCombobox onCreate={onCreate} />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await waitFor(() => expect(trigger?.getAttribute("aria-expanded")).toBe("true"));

    const searchInput = queryPortalElement(
      "[data-tgph-combobox-search]",
    ) as HTMLInputElement;
    await user.type(searchInput, "pager");

    const createOption = queryPortalOptionByText('Create "pager"');
    expect(createOption).toBeDefined();

    await user.click(createOption!);

    expect(onCreate).toHaveBeenCalledWith({ value: "pager" });
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

  it("rejects unknown props on type level", () => {
    // @ts-expect-error unknown prop rejected on ComboboxContentProps
    const invalidProp: ComboboxContentProps = { invalidProp: "invalid" };
    void invalidProp;

    // @ts-expect-error unknown prop rejected on ComboboxOptionsProps
    const invalidOptionsProp: ComboboxOptionsProps = {
      invalidProp: "invalid",
    };
    void invalidOptionsProp;
  });
});
