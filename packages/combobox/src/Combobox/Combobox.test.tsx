import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Combobox } from "./Combobox";
import { findStringNodes } from "./Combobox.helpers";

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
