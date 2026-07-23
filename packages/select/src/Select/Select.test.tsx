import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { Select } from "./Select";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const queryPortalElement = (selector: string) =>
  document.querySelector(selector);
const queryPortalElements = (selector: string) =>
  document.querySelectorAll(selector);

const getOptionByText = (text: string) => {
  return Array.from(queryPortalElements("[data-tgph-combobox-option]")).find(
    (option) => option.textContent === text,
  ) as HTMLElement | undefined;
};

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
];

const renderSelectOptions = () => {
  return options.map((option) => (
    <Select.Option key={option.value} value={option.value}>
      {option.label}
    </Select.Option>
  ));
};

const ControlledSingleSelect = ({
  onValueChange,
}: {
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState("email");

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <Select.Root value={value} onValueChange={handleValueChange}>
      {renderSelectOptions()}
    </Select.Root>
  );
};

const ControlledMultiSelect = ({
  onValueChange,
}: {
  onValueChange?: (value: Array<string>) => void;
}) => {
  const [value, setValue] = useState<Array<string>>(["email"]);

  const handleValueChange = (nextValue: Array<string>) => {
    setValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <Select.Root value={value} onValueChange={handleValueChange}>
      {renderSelectOptions()}
    </Select.Root>
  );
};

describe("Select", () => {
  it("is accessible", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Select.Root defaultValue="email">{renderSelectOptions()}</Select.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    expectToHaveNoViolations(await axe(container));

    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
    );

    expectToHaveNoViolations(
      await axe(document.body, {
        rules: {
          region: { enabled: false },
        },
      }),
    );
  });

  it("supports keyboard selection, Escape dismissal, and focus return", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Select.Root onValueChange={onValueChange}>
        {renderSelectOptions()}
      </Select.Root>,
    );
    const trigger = container.querySelector(
      "[data-tgph-combobox-trigger]",
    ) as HTMLElement;

    // Base UI uses virtual focus: DOM focus stays on the in-popup input while
    // the active option is tracked with data-highlighted. Arrow-down from the
    // trigger opens the popup; a second arrow-down highlights the first option.
    trigger.focus();
    await user.keyboard("[ArrowDown]");
    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("true"),
    );
    await user.keyboard("[ArrowDown]");

    const emailOption = queryPortalElement(
      '[data-tgph-combobox-option-value="email"]',
    );
    await waitFor(() =>
      expect(emailOption?.getAttribute("data-highlighted")).not.toBeNull(),
    );
    expect(document.activeElement?.tagName).toBe("INPUT");

    await user.keyboard("[Enter]");

    await waitFor(() => expect(trigger).toHaveTextContent("Email"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("email");

    // Reopen: now that Email is selected, it is highlighted on open per ARIA.
    trigger.focus();
    await user.keyboard("[ArrowDown]");
    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("true"),
    );

    const reopenedEmailOption = queryPortalElement(
      '[data-tgph-combobox-option-value="email"]',
    );
    await waitFor(() =>
      expect(
        reopenedEmailOption?.getAttribute("data-highlighted"),
      ).not.toBeNull(),
    );

    await user.keyboard("[Escape]");

    await waitFor(() =>
      expect(trigger.getAttribute("aria-expanded")).toBe("false"),
    );
    // Base UI returns focus to the trigger (finalFocus) asynchronously on close.
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("selects a controlled single value and closes after selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <ControlledSingleSelect onValueChange={onValueChange} />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    expect(trigger).toHaveTextContent("Email");

    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
    );

    await user.click(getOptionByText("SMS")!);

    await waitFor(() => expect(trigger).toHaveTextContent("SMS"));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onValueChange).toHaveBeenLastCalledWith("sms");
  });

  it("keeps controlled multi-select open after selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <ControlledMultiSelect onValueChange={onValueChange} />,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    expect(trigger).toHaveTextContent("Email");

    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
    );

    await user.click(getOptionByText("SMS")!);

    await waitFor(() => expect(trigger).toHaveTextContent("EmailSMS"));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"]);
  });

  it("derives multi-select behavior from an uncontrolled array defaultValue", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Select.Root defaultValue={["email"]} onValueChange={onValueChange}>
        {renderSelectOptions()}
      </Select.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
    );

    await user.click(getOptionByText("Push")!);

    await waitFor(() => expect(trigger).toHaveTextContent("EmailPush"));
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "push"]);
  });

  it("passes trigger, content, and options props through to Combobox", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Select.Root
        defaultValue="email"
        triggerProps={{ "data-select-trigger": true }}
        contentProps={{ "data-select-content": true }}
        optionsProps={{ "data-select-options": true, maxHeight: "64" }}
      >
        {renderSelectOptions()}
      </Select.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    expect(trigger).toHaveAttribute("data-select-trigger", "true");

    await user.click(trigger!);
    await waitFor(() =>
      expect(trigger?.getAttribute("aria-expanded")).toBe("true"),
    );

    const content = queryPortalElement("[data-tgph-combobox-content]");
    const optionList = queryPortalElement('[role="listbox"]');

    expect(content).toHaveAttribute("data-select-content", "true");
    expect(optionList).toHaveAttribute("data-select-options", "true");
    expect(optionList).toHaveStyle({
      "--max-height": "var(--tgph-spacing-64)",
    });
  });

  it("uses option children as the Combobox option label", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Select.Root defaultValue="email" onValueChange={onValueChange}>
        <Select.Option value="email">Email</Select.Option>
        <Select.Option value="sms">SMS label from children</Select.Option>
      </Select.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await user.click(getOptionByText("SMS label from children")!);

    await waitFor(() =>
      expect(trigger).toHaveTextContent("SMS label from children"),
    );
    expect(onValueChange).toHaveBeenLastCalledWith("sms");
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <Select.Root value="email" onValueChange={onValueChange}>
        <Select.Option value="email">Email</Select.Option>
        <Select.Option value="sms" disabled>
          SMS
        </Select.Option>
      </Select.Root>,
    );
    const trigger = container.querySelector("[data-tgph-combobox-trigger]");

    await user.click(trigger!);
    await user.click(getOptionByText("SMS")!);

    expect(trigger).toHaveTextContent("Email");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
