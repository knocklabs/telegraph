import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";
import { Radio } from "../Radio";

import { RadioGroup } from "./RadioGroup";

const PLANS = ["free", "pro", "enterprise"];

const getRadio = (name: string) => screen.getByRole("radio", { name });

const Options = () => (
  <>
    {PLANS.map((plan) => (
      <Radio.Default key={plan} value={plan} label={plan} />
    ))}
  </>
);

const Controlled = ({
  initialValue,
  onValueChange,
}: {
  initialValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = useState<string | undefined>(initialValue);
  return (
    <RadioGroup
      name="plan"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    >
      <Options />
    </RadioGroup>
  );
};

describe("RadioGroup", () => {
  it("is accessible", async () => {
    const { container } = render(
      <RadioGroup name="plan" defaultValue="free">
        <Options />
      </RadioGroup>,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("renders a radiogroup role", () => {
    render(
      <RadioGroup name="plan">
        <Options />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("supports an uncontrolled default value", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup name="plan" defaultValue="free">
        <Options />
      </RadioGroup>,
    );

    expect(getRadio("free")).toHaveAttribute("aria-checked", "true");

    await user.click(getRadio("pro"));
    expect(getRadio("pro")).toHaveAttribute("aria-checked", "true");
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Controlled initialValue="free" onValueChange={onValueChange} />);

    await user.click(getRadio("pro"));

    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(getRadio("pro")).toHaveAttribute("aria-checked", "true");
  });

  it("applies group size and color to every child", () => {
    render(
      <RadioGroup name="plan" size="1" color="green">
        <Radio.Default value="free" label="free" />
        <Radio.Default value="pro" label="pro" color="red" />
      </RadioGroup>,
    );

    expect(getRadio("free")).toHaveAttribute("data-tgph-radio-size", "1");
    expect(getRadio("free")).toHaveAttribute("data-tgph-radio-color", "green");
    // A radio's own color prop beats the group default.
    expect(getRadio("pro")).toHaveAttribute("data-tgph-radio-color", "red");
  });

  it("disables every child when the group is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" disabled onValueChange={onValueChange}>
        <Options />
      </RadioGroup>,
    );

    await user.click(getRadio("free"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // Base UI ORs the group's `disabled` over the radio's own, so a child cannot
  // opt out. This package matches that rather than letting the label style
  // itself enabled over a control Base UI has already disabled.
  it("does not let a child opt out of a disabled group", () => {
    render(
      <RadioGroup name="plan" disabled>
        <Radio.Default value="free" label="free" disabled={false} />
      </RadioGroup>,
    );
    expect(getRadio("free")).toHaveAttribute("data-disabled");
  });

  it("disables one option without affecting the others", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" onValueChange={onValueChange}>
        <Radio.Default value="free" label="free" disabled />
        <Radio.Default value="pro" label="pro" />
      </RadioGroup>,
    );

    await user.click(getRadio("free"));
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(getRadio("pro"));
    // First argument only: the second is Base UI's event detail.
    expect(onValueChange.mock.calls[0]![0]).toBe("pro");
  });

  // Base UI owns roving focus for a radio group. This package adds no shim, so
  // the test is here to catch a Base UI regression rather than our own.
  it("moves selection with the arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup name="plan" defaultValue="free">
        <Options />
      </RadioGroup>,
    );

    await user.tab();
    expect(getRadio("free")).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(getRadio("pro")).toHaveAttribute("aria-checked", "true");
    expect(getRadio("pro")).toHaveFocus();
  });

  it("puts one tab stop on the whole group", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup name="plan" defaultValue="pro">
        <Options />
      </RadioGroup>,
    );

    await user.tab();
    // Roving focus: the selected option is the tab stop, not the first one.
    expect(getRadio("pro")).toHaveFocus();
    expect(getRadio("free")).toHaveAttribute("tabindex", "-1");
  });

  // Matches `@telegraph/checkbox`: the second argument is Base UI's event
  // detail, which carries the native event and `cancel()`.
  describe("event details", () => {
    it("passes Base UI's event details as a second argument", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <RadioGroup name="plan" onValueChange={onValueChange}>
          <Options />
        </RadioGroup>,
      );

      await user.click(getRadio("pro"));

      expect(onValueChange.mock.calls[0]).toHaveLength(2);
      const eventDetails = onValueChange.mock.calls[0]![1];
      expect(eventDetails.event).toBeInstanceOf(Event);
      expect(typeof eventDetails.cancel).toBe("function");
    });
  });

  it("takes Stack layout props", () => {
    render(
      <RadioGroup name="plan" direction="row" gap="4" data-testid="group">
        <Options />
      </RadioGroup>,
    );
    expect(screen.getByTestId("group")).toBeInTheDocument();
  });
});
