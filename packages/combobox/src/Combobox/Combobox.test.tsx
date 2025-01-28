import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Combobox } from "./Combobox";

type Option = { value: string; label?: string };

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
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
const ComboboxMultiSelectControlledSearchLegacy = () => {
  const [value, setValue] = React.useState<Array<Option>>([
    valuesLegacy[0]!,
    valuesLegacy[1]!,
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <Combobox.Root value={value} onValueChange={setValue} legacyBehavior={true}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search vaue={searchQuery} onValueChange={setSearchQuery} />
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
      const firstOption = container.querySelector(
        "[data-tgph-combobox-option]",
      );
      expect(document.activeElement).toEqual(firstOption);
    });
    it("pressing enter on an option should select it", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");
    });
    it("pressing the first letter of a option should focus it", async () => {
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
      const clearButton = container.querySelector("[data-tgph-combobox-clear]");
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
      await waitFor(() =>
        expect(document.activeElement).toEqual(
          container.querySelector("[data-tgph-combobox-search]"),
        ),
      );
    });
    it("searching for an option should filter the options", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("Email");
      const options = container.querySelectorAll("[data-tgph-combobox-option]");
      expect(options.length).toBe(1);
    });
    it("searching for an option in a controlled search should filter the options", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <ComboboxMultiSelectControlledSearchLegacy />,
      );
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("Email");
      const options = container.querySelectorAll("[data-tgph-combobox-option]");
      expect(options.length).toBe(values.length);
    });
    it("empty state should show when there are no results", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectLegacy />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await waitFor(() =>
        expect(document.activeElement).toEqual(
          container.querySelector("[data-tgph-combobox-search]"),
        ),
      );
      await user.keyboard("No results");
      const empty = container.querySelector("[data-tgph-combobox-empty]");
      await waitFor(() => expect(empty).not.toBeNull());
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
    it("clear button should clear the field", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelectLegacy clearable />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");
      const clearButton = container.querySelector("[data-tgph-combobox-clear]");
      await user.click(clearButton!);
      expect(trigger?.textContent).toBe("");
    });
  });
});

const values = ["email", "sms", "push", "inapp", "webhook"];

const labels = ["Email", "SMS", "Push", "In-App", "Webhook"];

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
const ComboboxMultiSelectControlledSearch = () => {
  const [value, setValue] = React.useState<Array<string>>([
    values[0]!,
    values[1]!,
  ]);
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger />
      <Combobox.Content>
        <Combobox.Search vaue={searchQuery} onValueChange={setSearchQuery} />
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
      const firstOption = container.querySelector(
        "[data-tgph-combobox-option]",
      );
      expect(document.activeElement).toEqual(firstOption);
    });
    it("pressing enter on an option should select it", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.keyboard("[ArrowDown]");
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");
    });
    it("pressing the first letter of a option should focus it", async () => {
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
      const clearButton = container.querySelector("[data-tgph-combobox-clear]");
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
      await waitFor(() =>
        expect(document.activeElement).toEqual(
          container.querySelector("[data-tgph-combobox-search]"),
        ),
      );
    });
    it("searching for an option should filter the options", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("Email");
      const options = container.querySelectorAll("[data-tgph-combobox-option]");
      expect(options.length).toBe(1);
    });
    it("searching for an option in a controlled search should filter the options", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelectControlledSearch />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("Email");
      const options = container.querySelectorAll("[data-tgph-combobox-option]");
      expect(options.length).toBe(values.length);
    });
    it("empty state should show when there are no results", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxMultiSelect />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await waitFor(() =>
        expect(document.activeElement).toEqual(
          container.querySelector("[data-tgph-combobox-search]"),
        ),
      );
      await user.keyboard("No results");
      const empty = container.querySelector("[data-tgph-combobox-empty]");
      await waitFor(() => expect(empty).not.toBeNull());
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
    it("clear button should clear the field", async () => {
      const user = userEvent.setup();
      const { container } = render(<ComboboxSingleSelect clearable />);
      const trigger = container.querySelector("[data-tgph-combobox-trigger]");
      await user.click(trigger!);
      await waitFor(() => trigger?.getAttribute("aria-expanded") === "true");
      await user.keyboard("[Enter]");
      expect(trigger?.textContent).toBe("Email");
      const clearButton = container.querySelector("[data-tgph-combobox-clear]");
      await user.click(clearButton!);
      expect(trigger?.textContent).toBe("");
    });
  });
});
