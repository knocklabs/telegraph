import { Field } from "@base-ui/react/field";
import { Stack } from "@telegraph/layout";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { X } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { renderToString } from "react-dom/server";
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

// The FormData captured by the first call to a submit spy.
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
    const renderForm = (ui: ReactNode, onSubmit: (d: FormData) => void) =>
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

    it("submits uncheckedValue when unchecked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(
        <Checkbox.Default label="Select run" name="run" uncheckedValue="off" />,
        onSubmit,
      );

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(getSubmitted(onSubmit).get("run")).toBe("off");
    });

    it("submits the checked value even when uncheckedValue is set", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(
        <Checkbox.Default
          label="Select run"
          name="run"
          formValue="run_1"
          uncheckedValue="off"
          defaultValue
        />,
        onSubmit,
      );

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(getSubmitted(onSubmit).getAll("run")).toEqual(["run_1"]);
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

  // Label presence is decided during render, not in an effect. An effect never
  // runs on the server, so server-rendered markup would ship an unnamed
  // checkbox and stay that way until hydration.
  describe("server rendering", () => {
    it("names the control in the server-rendered markup", () => {
      const html = renderToString(<Checkbox.Default label="Select run" />);
      const control = html.slice(html.indexOf('role="checkbox"'));

      expect(control).toContain("aria-labelledby=");
      const labelId = /aria-labelledby="([^"]+)"/.exec(control)![1]!;
      expect(html).toContain(`id="${labelId}"`);
    });

    it("finds a label nested inside a wrapper", () => {
      const html = renderToString(
        <Checkbox.Root>
          <Checkbox.Control />
          <Stack>
            <Checkbox.Label>Select run</Checkbox.Label>
          </Stack>
        </Checkbox.Root>,
      );
      expect(html.slice(html.indexOf('role="checkbox"'))).toContain(
        "aria-labelledby=",
      );
    });

    it("emits no aria-labelledby when there is no label to point at", () => {
      const html = renderToString(
        <Checkbox.Root>
          <Checkbox.Control />
        </Checkbox.Root>,
      );
      expect(html.slice(html.indexOf('role="checkbox"'))).not.toContain(
        "aria-labelledby=",
      );
    });
  });

  // These describe the checkbox, so they belong on the element that carries
  // `role="checkbox"` — not on the layout wrapper, where nothing reads them.
  describe("aria props on Root", () => {
    it("forwards aria-labelledby to the control", async () => {
      const { container } = render(
        <>
          <span id="heading">Cancel this run</span>
          <Checkbox.Default aria-labelledby="heading" />
        </>,
      );

      expect(getControl()).toHaveAttribute("aria-labelledby", "heading");
      expect(
        container.querySelector("[data-tgph-checkbox-root]"),
      ).not.toHaveAttribute("aria-labelledby");
      expect(getControl()).toHaveAccessibleName("Cancel this run");
      expectToHaveNoViolations(await axe(container));
    });

    it("forwards aria-describedby to the control", () => {
      const { container } = render(
        <>
          <span id="hint">Stops the run immediately</span>
          <Checkbox.Default label="Cancel this run" aria-describedby="hint" />
        </>,
      );

      expect(getControl()).toHaveAttribute("aria-describedby", "hint");
      expect(
        container.querySelector("[data-tgph-checkbox-root]"),
      ).not.toHaveAttribute("aria-describedby");
    });

    // Base UI does not destructure `aria-describedby`, so it lands in
    // `elementProps` and merges after `getDescriptionProps` — and that merge
    // overwrites with `undefined`. Forwarding the prop unconditionally erased
    // whatever a wrapping `Field` had computed.
    it("does not erase a Field description by forwarding undefined", async () => {
      const { container } = render(
        <Field.Root>
          <Checkbox.Default label="Cancel run" name="run" />
          <Field.Description>Stops the run immediately</Field.Description>
        </Field.Root>,
      );

      expect(getControl()).toHaveAccessibleDescription(
        "Stops the run immediately",
      );
      expectToHaveNoViolations(await axe(container));
    });

    // A visible label wins over `aria-label`: Base UI's fallback re-derives
    // `aria-labelledby` from the associated `<label>`, and that outranks
    // `aria-label`. Naming it during render keeps the result stable from the
    // first paint instead of flipping at hydration.
    it("names a labelled checkbox from the label, at render time", () => {
      const html = renderToString(
        <Checkbox.Default aria-label="Select run 1" label="1" />,
      );
      expect(html.slice(html.indexOf('role="checkbox"'))).toContain(
        "aria-labelledby=",
      );

      render(<Checkbox.Default aria-label="Select run 1" label="1" />);
      expect(getControl()).toHaveAccessibleName("1");
    });

    // The escape hatch for a longer accessible name than the visible text.
    it("lets aria-labelledby override a visible label", () => {
      render(
        <>
          <span id="row">Select run 1</span>
          <Checkbox.Default aria-labelledby="row" label="1" />
        </>,
      );
      expect(getControl()).toHaveAccessibleName("Select run 1");
    });
  });

  describe("label rendering", () => {
    // `{label && …}` renders a bare `0` instead of a label.
    it("renders a zero label inside a real label element", () => {
      const { container } = render(<Checkbox.Default label={0} />);
      const label = container.querySelector("label");
      expect(label).toHaveTextContent("0");
      expect(getControl()).toHaveAccessibleName("0");
    });

    // `label={cond && "text"}` yields `false` when the condition fails.
    it("renders no label for false", () => {
      const { container } = render(
        <Checkbox.Default aria-label="Select run" label={false} />,
      );
      expect(container.querySelector("label")).toBeNull();
    });

    // `Checkbox.Control` points `aria-labelledby` at `context.labelId` during
    // render, so a caller-supplied id would leave a dangling IDREF and the
    // control would have no accessible name at all.
    it("keeps its own id even when a caller passes one", async () => {
      const { container } = render(
        <Checkbox.Default
          label="Cancel run"
          // @ts-expect-error id is not part of the label surface
          labelProps={{ id: "my-label" }}
        />,
      );

      const label = container.querySelector("label")!;
      expect(label.id).not.toBe("my-label");
      expect(getControl()).toHaveAttribute("aria-labelledby", label.id);
      expect(getControl()).toHaveAccessibleName("Cancel run");
      expectToHaveNoViolations(await axe(container));
    });
  });

  describe("styling hooks", () => {
    it("puts className on each part", () => {
      const { container } = render(
        <Checkbox.Default
          label="Select run"
          className="my-root"
          controlProps={{ className: "my-control" }}
          labelProps={{ className: "my-label" }}
        />,
      );

      expect(container.querySelector("[data-tgph-checkbox-root]")).toHaveClass(
        "my-root",
      );
      expect(
        container.querySelector("[data-tgph-checkbox-control]"),
      ).toHaveClass("my-control");
      expect(container.querySelector("[data-tgph-checkbox-label]")).toHaveClass(
        "my-label",
      );
    });

    it("lets controlProps size and recolor the box", () => {
      const { container } = render(
        <Checkbox.Default
          label="Select run"
          controlProps={{ w: "10", h: "10", bg: "red-3" }}
        />,
      );

      const style = container
        .querySelector<HTMLElement>("[data-tgph-checkbox-control]")!
        .getAttribute("style")!;
      expect(style).toContain("--width: var(--tgph-spacing-10)");
      expect(style).toContain("--height: var(--tgph-spacing-10)");
      expect(style).toContain("--background-color: var(--tgph-red-3)");
    });

    it("swaps the indicator glyph through iconProps", () => {
      const { container } = render(
        <Checkbox.Default
          label="Select run"
          defaultValue
          controlProps={{ iconProps: { icon: X } }}
        />,
      );

      const icon = container.querySelector(
        "[data-tgph-checkbox-indicator] svg",
      );
      expect(icon).toHaveClass("lucide-x");
      // Decorative whatever is passed: the control carries the name.
      expect(
        container.querySelector("[data-tgph-checkbox-indicator] [aria-hidden]"),
      ).not.toBeNull();
    });

    // Cursor belongs to the stylesheet. Inline styles beat it, and the root's
    // covers the inert gap between the box and the label. jsdom applies no
    // stylesheet, so this checks the half that is observable here: that nothing
    // inline outranks the rules. Whether the rules themselves match is pinned
    // by the DOM-shape assertions in CheckboxGroup.test.tsx.
    it("sets no inline cursor on the root or the label", () => {
      const { container } = render(<Checkbox.Default label="Select run" />);

      expect(
        container.querySelector<HTMLElement>("[data-tgph-checkbox-root]")!.style
          .cursor,
      ).toBe("");
      expect(
        container.querySelector<HTMLElement>("[data-tgph-checkbox-label]")!
          .style.cursor,
      ).toBe("");
    });
  });

  // Native `readonly` does nothing on a checkbox, so Base UI implements it.
  // The point of the prop is that it is NOT disabled: the value still submits
  // and the control stays reachable. Pin that difference, because collapsing
  // the two would silently drop the value from the form.
  describe("readOnly", () => {
    const submitOnce = async (ui: ReactNode) => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const { unmount } = render(
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
      await user.click(screen.getByRole("button", { name: "Submit" }));
      const submitted = getSubmitted(onSubmit).get("ch");
      unmount();
      return submitted;
    };

    it("still submits its value, unlike disabled", async () => {
      await expect(
        submitOnce(
          <Checkbox.Default
            name="ch"
            label="Read only"
            defaultValue
            readOnly
          />,
        ),
      ).resolves.toBe("on");

      await expect(
        submitOnce(
          <Checkbox.Default name="ch" label="Disabled" defaultValue disabled />,
        ),
      ).resolves.toBeNull();
    });

    it("stays in the tab order, unlike disabled", () => {
      const { rerender } = render(
        <Checkbox.Default label="Read only" readOnly />,
      );
      expect(getControl()).toHaveAttribute("tabindex", "0");
      expect(getControl()).toHaveAttribute("aria-readonly", "true");
      expect(getControl()).not.toHaveAttribute("aria-disabled");

      rerender(<Checkbox.Default label="Read only" disabled />);
      expect(getControl()).toHaveAttribute("tabindex", "-1");
    });

    it("refuses changes from the control and the label", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Checkbox.Default
          label="Read only"
          readOnly
          onValueChange={onValueChange}
        />,
      );

      await user.click(getControl());
      await user.click(screen.getByText("Read only"));
      await user.keyboard(" ");

      expect(onValueChange).not.toHaveBeenCalled();
      expect(getControl()).not.toBeChecked();
    });

    // The cursor rules hang off these attributes. Without them a read-only
    // checkbox keeps `cursor: pointer` and looks live.
    it("exposes the hooks the read-only cursor rules need", () => {
      const { container } = render(
        <Checkbox.Default label="Read only" readOnly />,
      );

      expect(getControl()).toHaveAttribute("data-readonly");
      expect(
        container.querySelector(
          "[data-tgph-checkbox-root]:has([data-tgph-checkbox-control][data-readonly]) [data-tgph-checkbox-label]",
        ),
      ).not.toBeNull();
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
      // The reason this argument exists: the real native event behind the
      // change, so consumers can read `shiftKey` for range selection. A click
      // arrives as a PointerEvent, which is where `shiftKey` lives.
      expect(eventDetails.event).toBeInstanceOf(MouseEvent);
      expect(eventDetails.event).toHaveProperty("shiftKey", false);
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
