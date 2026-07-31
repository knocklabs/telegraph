import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { Checkbox } from "./Checkbox";

// Base UI puts `role="checkbox"` and `aria-checked` on the element it renders
// (our styled Stack), and keeps the real `<input>` out of the a11y tree. So
// aria assertions go through `getControl`, and anything about the actual form
// control goes through `getHiddenInput`.
const getControl = () => screen.getByRole("checkbox");

const getHiddenInput = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;

/** The FormData captured by the first call to a submit spy. */
const getSubmitted = (onSubmit: { mock: { calls: unknown[][] } }) =>
  onSubmit.mock.calls[0]![0] as FormData;

describe("Checkbox", () => {
  it("is accessible", async () => {
    const { container } = render(<Checkbox.Default label="Select run" />);
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible when checked", async () => {
    const { container } = render(
      <Checkbox.Default label="Select run" defaultValue />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible when indeterminate", async () => {
    const { container } = render(
      <Checkbox.Default label="Select run" indeterminate />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible when disabled", async () => {
    const { container } = render(
      <Checkbox.Default label="Select run" disabled />,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("renders a real checkbox input", () => {
    const { container } = render(
      <Checkbox.Default label="Select run" name="run" />,
    );
    const input = getHiddenInput(container);
    expect(input).toBeInTheDocument();
    expect(input.type).toBe("checkbox");
    expect(input.name).toBe("run");
  });

  // `Checkbox.styles.css` hangs the focus ring off
  // `[data-tgph-checkbox-control]:focus-visible`, which is only correct because
  // Base UI makes the rendered element focusable and keeps the real input
  // hidden beside it. If Base UI ever moves focus onto the input, the ring
  // silently stops rendering — so pin the structure here.
  it("puts focus on the control, not the hidden input", () => {
    const { container } = render(<Checkbox.Default label="Select run" />);
    const control = getControl();
    const input = getHiddenInput(container);

    expect(control).toHaveAttribute("tabindex", "0");
    expect(input).toHaveAttribute("tabindex", "-1");
    expect(input).toHaveAttribute("aria-hidden", "true");
    // The input is a sibling of the control, never a descendant.
    expect(control.contains(input)).toBe(false);
  });

  it("associates the label with the input", async () => {
    const user = userEvent.setup();
    render(<Checkbox.Default label="Select run" />);

    // Clicking the label text toggles the checkbox, which only works if
    // htmlFor points at the input's id.
    await user.click(screen.getByText("Select run"));
    expect(getControl()).toBeChecked();
  });

  it("supports an uncontrolled default", async () => {
    const user = userEvent.setup();
    render(<Checkbox.Default label="Select run" defaultValue />);

    expect(getControl()).toBeChecked();
    await user.click(getControl());
    expect(getControl()).not.toBeChecked();
  });

  it("supports a controlled value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Checkbox.Default
        label="Select run"
        value={false}
        onValueChange={onValueChange}
      />,
    );

    await user.click(getControl());

    expect(onValueChange.mock.calls[0]![0]).toBe(true);
    // Controlled: stays false until the parent updates `value`.
    expect(getControl()).not.toBeChecked();
  });

  it("toggles with the space key", async () => {
    const user = userEvent.setup();
    render(<Checkbox.Default label="Select run" />);

    await user.tab();
    await user.keyboard(" ");

    expect(getControl()).toBeChecked();
  });

  it("exposes indeterminate to assistive tech and the DOM", () => {
    const { container } = render(
      <Checkbox.Default label="Select run" indeterminate />,
    );

    expect(getHiddenInput(container).indeterminate).toBe(true);
    expect(getControl()).toHaveAttribute("aria-checked", "mixed");
  });

  it("does not fire onValueChange when disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Checkbox.Default
        label="Select run"
        disabled
        onValueChange={onValueChange}
      />,
    );

    await user.click(getControl());
    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe("form submission", () => {
    const renderForm = (ui: React.ReactNode, onSubmit: (d: FormData) => void) =>
      render(
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSubmit(new FormData(event.currentTarget));
          }}
        >
          {ui}
          <button type="submit">Submit</button>
        </form>,
      );

    it('submits "on" by default when checked', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(
        <Checkbox.Default label="Select run" name="run" defaultValue />,
        onSubmit,
      );

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(getSubmitted(onSubmit).get("run")).toBe("on");
    });

    it("submits formValue when provided", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(
        <Checkbox.Default
          label="Select run"
          name="runs"
          formValue="run_1"
          defaultValue
        />,
        onSubmit,
      );

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(getSubmitted(onSubmit).get("runs")).toBe("run_1");
    });

    it("submits nothing when unchecked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(<Checkbox.Default label="Select run" name="run" />, onSubmit);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(getSubmitted(onSubmit).get("run")).toBeNull();
    });
  });

  describe("composition", () => {
    it("renders Root / Control / Label", async () => {
      const user = userEvent.setup();
      render(
        <Checkbox.Root name="run">
          <Checkbox.Control />
          <Checkbox.Label>Select run</Checkbox.Label>
        </Checkbox.Root>,
      );

      await user.click(screen.getByText("Select run"));
      expect(getControl()).toBeChecked();
    });

    it("supports aria-label without a visible label", () => {
      render(
        <Checkbox.Root aria-label="Select run">
          <Checkbox.Control />
        </Checkbox.Root>,
      );
      expect(getControl()).toHaveAccessibleName("Select run");
    });
  });

  // Pointing `aria-labelledby` at a label that never rendered dangles the
  // IDREF and, worse, stops Base UI falling back to a wrapping `<label>`. The
  // control then has no accessible name at all.
  describe("labelling without Checkbox.Label", () => {
    it("leaves aria-labelledby unset when no label rendered", () => {
      render(
        <Checkbox.Root>
          <Checkbox.Control />
        </Checkbox.Root>,
      );
      expect(getControl()).not.toHaveAttribute("aria-labelledby");
    });

    it("takes its name from a wrapping native label", async () => {
      const { container } = render(
        <label>
          Accept terms
          <Checkbox.Root>
            <Checkbox.Control />
          </Checkbox.Root>
        </label>,
      );

      expect(getControl()).toHaveAccessibleName("Accept terms");
      expectToHaveNoViolations(await axe(container));
    });

    it("still prefers an explicit Checkbox.Label", () => {
      render(
        <Checkbox.Root>
          <Checkbox.Control />
          <Checkbox.Label>Select run</Checkbox.Label>
        </Checkbox.Root>,
      );
      expect(getControl()).toHaveAccessibleName("Select run");
    });
  });

  describe("event details", () => {
    it("passes Base UI's event details to onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Checkbox.Default label="Select run" onValueChange={onValueChange} />,
      );

      await user.click(getControl());

      expect(onValueChange).toHaveBeenCalledTimes(1);
      const [value, eventDetails] = onValueChange.mock.calls[0]!;
      expect(value).toBe(true);
      // The reason this argument exists: the native event behind the change,
      // so consumers can read `shiftKey` for range selection.
      expect(eventDetails.event).toBeInstanceOf(Object);
      expect(typeof eventDetails.cancel).toBe("function");
    });
  });

  // Base UI recomputes the hidden input's id from `value ?? name`, so anything
  // that changes the key changes the id — on the same DOM node. `Checkbox.Label`
  // has to follow it or `htmlFor` silently points at nothing.
  describe("label association follows Base UI's input id", () => {
    // Outside a group Base UI takes the input id straight from `id`, so
    // changing `id` is what moves it. (Inside a select-all group it derives the
    // id from the group instead — covered in the CheckboxGroup tests.)
    it("updates htmlFor when the id changes", async () => {
      const user = userEvent.setup();
      const { container, rerender } = render(
        <Checkbox.Default label="Select run" id="first" />,
      );

      const labelFor = () =>
        container.querySelector("label")!.getAttribute("for");
      expect(labelFor()).toBe("first");

      rerender(<Checkbox.Default label="Select run" id="second" />);

      expect(getHiddenInput(container).id).toBe("second");
      expect(labelFor()).toBe("second");
      await user.click(screen.getByText("Select run"));
      expect(getControl()).toBeChecked();
    });
  });
});
