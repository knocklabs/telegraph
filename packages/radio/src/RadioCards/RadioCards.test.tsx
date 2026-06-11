// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { RadioCards } from "./RadioCards";

afterEach(() => {
  cleanup();
});

const radioOptions = [
  {
    title: "Option one",
    description: "The first option",
    value: "one",
  },
  {
    title: "Option two",
    description: "The second option",
    value: "two",
  },
];

describe("RadioCards", () => {
  it("is accessible", async () => {
    const { container } = render(
      <RadioCards
        aria-label="Delivery method"
        defaultValue="one"
        options={radioOptions}
      />,
    );

    expectToHaveNoViolations(await axe(container));
  });

  it("renders the default value with Telegraph and Radix-compatible state attributes", () => {
    render(
      <RadioCards
        aria-label="Delivery method"
        defaultValue="one"
        options={radioOptions}
      />,
    );

    const firstRadio = screen.getByRole("radio", { name: /Option one/ });
    const secondRadio = screen.getByRole("radio", { name: /Option two/ });

    expect(firstRadio).toHaveAttribute("data-tgph-radio-group-button");
    expect(firstRadio).toHaveAttribute("aria-checked", "true");
    expect(firstRadio).toHaveAttribute("data-checked", "");
    expect(firstRadio).toHaveAttribute("data-state", "checked");
    expect(secondRadio).toHaveAttribute("aria-checked", "false");
    expect(secondRadio).toHaveAttribute("data-unchecked", "");
    expect(secondRadio).toHaveAttribute("data-state", "unchecked");
  });

  it("supports controlled values and change callbacks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const ControlledRadioCards = () => {
      const [value, setValue] = useState("one");

      return (
        <RadioCards
          aria-label="Delivery method"
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
          options={radioOptions}
        />
      );
    };

    render(<ControlledRadioCards />);

    await user.click(screen.getByRole("radio", { name: /Option two/ }));

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("radio", { name: /Option two/ })).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("does not select disabled items", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioCards
        aria-label="Delivery method"
        defaultValue="one"
        onValueChange={onValueChange}
        options={[
          radioOptions[0],
          {
            ...radioOptions[1],
            disabled: true,
          },
        ]}
      />,
    );

    const disabledRadio = screen.getByRole("radio", { name: /Option two/ });

    expect(disabledRadio).toBeDisabled();
    expect(disabledRadio).toHaveAttribute("data-disabled", "");

    await user.click(disabledRadio);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: /Option one/ })).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("selects the next radio with arrow-key navigation", async () => {
    const user = userEvent.setup();

    render(
      <RadioCards
        aria-label="Delivery method"
        defaultValue="one"
        options={radioOptions}
      />,
    );

    screen.getByRole("radio", { name: /Option one/ }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("radio", { name: /Option one/ })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("radio", { name: /Option two/ })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.getByRole("radio", { name: /Option two/ })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("honors vertical orientation keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <RadioCards
        aria-label="Delivery method"
        defaultValue="one"
        orientation="vertical"
        options={radioOptions}
      />,
    );

    const firstRadio = screen.getByRole("radio", { name: /Option one/ });
    const secondRadio = screen.getByRole("radio", { name: /Option two/ });

    firstRadio.focus();
    await user.keyboard("{ArrowRight}");

    expect(firstRadio).toHaveAttribute("data-state", "checked");
    expect(firstRadio).toHaveAttribute("tabindex", "0");
    expect(secondRadio).toHaveAttribute("data-state", "unchecked");
    expect(secondRadio).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{ArrowDown}");

    expect(secondRadio).toHaveAttribute("data-state", "checked");
    expect(secondRadio).toHaveAttribute("tabindex", "0");
  });

  it("honors loop=false keyboard navigation", async () => {
    const user = userEvent.setup();

    render(
      <RadioCards
        aria-label="Delivery method"
        defaultValue="one"
        loop={false}
        options={radioOptions}
      />,
    );

    const firstRadio = screen.getByRole("radio", { name: /Option one/ });
    const secondRadio = screen.getByRole("radio", { name: /Option two/ });

    firstRadio.focus();
    await user.keyboard("{ArrowLeft}");

    expect(firstRadio).toHaveAttribute("data-state", "checked");
    expect(firstRadio).toHaveAttribute("tabindex", "0");
    expect(secondRadio).toHaveAttribute("data-state", "unchecked");
    expect(secondRadio).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{ArrowRight}");
    await user.keyboard("{ArrowRight}");

    expect(secondRadio).toHaveAttribute("data-state", "checked");
    expect(secondRadio).toHaveAttribute("tabindex", "0");
  });

  it("participates in forms with hidden radio inputs", () => {
    const { container } = render(
      <form data-testid="form">
        <RadioCards
          aria-label="Delivery method"
          defaultValue="two"
          name="delivery"
          options={radioOptions}
        />
      </form>,
    );

    const form = screen.getByTestId("form") as HTMLFormElement;
    const selectedInput = container.querySelector(
      'input[type="radio"][name="delivery"][value="two"]',
    );

    expect(selectedInput).toBeChecked();
    expect(new FormData(form).get("delivery")).toBe("two");
  });

  it("forwards ref and tgphRef to the rendered radio button", () => {
    const forwardedRef = createRef<HTMLButtonElement>();
    const tgphRef = createRef<HTMLButtonElement>();

    render(
      <RadioCards.Root aria-label="Delivery method" defaultValue="one">
        <RadioCards.Item value="one" ref={forwardedRef} tgphRef={tgphRef}>
          Option one
        </RadioCards.Item>
      </RadioCards.Root>,
    );

    const radio = screen.getByRole("radio", { name: "Option one" });

    expect(forwardedRef.current).toBe(radio);
    expect(tgphRef.current).toBe(radio);
  });
});
