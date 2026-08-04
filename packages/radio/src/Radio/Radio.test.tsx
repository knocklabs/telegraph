import { Field } from "@base-ui/react/field";
import { Stack } from "@telegraph/layout";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps, FormEvent, ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";
import { RadioGroup } from "../RadioGroup";

import { Radio } from "./Radio";

// Base UI puts `role="radio"` and `aria-checked` on the element it renders
// (our styled Stack), and keeps the real `<input>` out of the a11y tree. So
// aria assertions go through `getRadio`, and anything about the actual form
// control goes through the hidden input.
const getRadio = (name: string) => screen.getByRole("radio", { name });

const getInputs = (container: HTMLElement) =>
  Array.from(
    container.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
  );

const Group = ({ children, ...props }: ComponentProps<typeof RadioGroup>) => (
  <RadioGroup name="plan" {...props}>
    {children ?? (
      <>
        <Radio.Default value="free" label="Free" />
        <Radio.Default value="pro" label="Pro" />
        <Radio.Default value="enterprise" label="Enterprise" />
      </>
    )}
  </RadioGroup>
);

describe("Radio", () => {
  it("is accessible", async () => {
    const { container } = render(<Group defaultValue="free" />);
    expectToHaveNoViolations(await axe(container));
  });

  it("is accessible when disabled", async () => {
    const { container } = render(
      <RadioGroup name="plan">
        <Radio.Default value="free" label="Free" disabled />
      </RadioGroup>,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("renders a real radio input under the group name", () => {
    const { container } = render(<Group />);
    const inputs = getInputs(container);

    expect(inputs).toHaveLength(3);
    expect(inputs[0]!.type).toBe("radio");
    expect(inputs.every((input) => input.name === "plan")).toBe(true);
  });

  // `Radio.styles.css` hangs the focus ring off
  // `[data-tgph-radio-control]:focus-visible`, which is only correct because
  // Base UI makes the rendered element focusable and keeps the real input
  // hidden beside it. If Base UI ever moves focus onto the input, the ring
  // silently stops rendering — so pin the structure here.
  it("puts focus on the control, not the hidden input", () => {
    const { container } = render(<Group />);
    const control = getRadio("Free");
    const input = getInputs(container)[0]!;

    expect(control).toHaveAttribute("tabindex", "0");
    expect(input).toHaveAttribute("tabindex", "-1");
    expect(input).toHaveAttribute("aria-hidden", "true");
    // The input is a sibling of the control, never a descendant.
    expect(control.contains(input)).toBe(false);
  });

  it("associates the label with the input", async () => {
    const user = userEvent.setup();
    render(<Group />);

    // Clicking the label text selects, which only works if htmlFor points at
    // the input's id.
    await user.click(screen.getByText("Pro"));
    expect(getRadio("Pro")).toHaveAttribute("aria-checked", "true");
  });

  it("selects one option at a time", async () => {
    const user = userEvent.setup();
    render(<Group defaultValue="free" />);

    expect(getRadio("Free")).toHaveAttribute("aria-checked", "true");
    await user.click(getRadio("Pro"));

    expect(getRadio("Pro")).toHaveAttribute("aria-checked", "true");
    expect(getRadio("Free")).toHaveAttribute("aria-checked", "false");
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" onValueChange={onValueChange}>
        <Radio.Default value="free" label="Free" disabled />
      </RadioGroup>,
    );

    await user.click(getRadio("Free"));
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

    it("submits the selected value under the group name", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(<Group defaultValue="pro" />, onSubmit);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      const data = onSubmit.mock.calls[0]![0] as FormData;
      expect(data.get("plan")).toBe("pro");
      // One value, not one entry per radio.
      expect(data.getAll("plan")).toEqual(["pro"]);
    });

    it("submits nothing when no option is selected", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderForm(<Group />, onSubmit);

      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect((onSubmit.mock.calls[0]![0] as FormData).get("plan")).toBeNull();
    });
  });

  describe("composition", () => {
    it("renders Root / Control / Label", async () => {
      const { container } = render(
        <RadioGroup name="plan">
          <Radio.Root value="pro">
            <Radio.Control />
            <Radio.Label>Pro</Radio.Label>
          </Radio.Root>
        </RadioGroup>,
      );

      expect(getRadio("Pro")).toBeInTheDocument();
      expectToHaveNoViolations(await axe(container));
    });

    it("names the control from a label nested in a wrapper", () => {
      render(
        <RadioGroup name="plan">
          <Radio.Root value="pro">
            <Radio.Control />
            <Stack>
              <Radio.Label>Pro</Radio.Label>
            </Stack>
          </Radio.Root>
        </RadioGroup>,
      );
      expect(getRadio("Pro")).toBeInTheDocument();
    });
  });

  // Label presence is decided during render, not in an effect. An effect never
  // runs on the server, so server-rendered markup would ship an unnamed radio.
  it("names the control in server-rendered markup", () => {
    const html = renderToString(
      <RadioGroup name="plan">
        <Radio.Default value="pro" label="Pro" />
      </RadioGroup>,
    );
    const control = html.slice(html.indexOf('role="radio"'));

    expect(control).toContain("aria-labelledby=");
    const labelId = /aria-labelledby="([^"]+)"/.exec(control)![1]!;
    expect(html).toContain(`id="${labelId}"`);
  });

  describe("aria props on Root", () => {
    it("forwards aria-label to the control", () => {
      const { container } = render(
        <RadioGroup name="plan">
          <Radio.Default value="pro" aria-label="Pro plan" />
        </RadioGroup>,
      );

      expect(getRadio("Pro plan")).toBeInTheDocument();
      expect(
        container.querySelector("[data-tgph-radio-root]"),
      ).not.toHaveAttribute("aria-label");
    });

    // Base UI does not destructure `aria-describedby`, so it lands in
    // `elementProps` and merges after `getDescriptionProps` — and that merge
    // overwrites with `undefined`. Forwarding the prop unconditionally would
    // erase whatever a wrapping `Field` had computed.
    it("does not erase a Field description by forwarding undefined", () => {
      render(
        <Field.Root>
          <RadioGroup name="plan">
            <Radio.Default value="pro" label="Pro" />
          </RadioGroup>
          <Field.Description>Billed yearly</Field.Description>
        </Field.Root>,
      );

      expect(getRadio("Pro")).toHaveAccessibleDescription("Billed yearly");
    });

    // Base UI resolves the input id through `useLabelableId`, which returns
    // the enclosing labelable scope's control id ahead of the `id` we pass, so
    // the input does not always keep the id `Radio.Root` generated.
    // `Radio.Control` reports the real one back and `Radio.Label` points
    // `htmlFor` at that. With one radio the first id happens to line up
    // anyway, so this needs three to catch a regression.
    it("keeps label association working for every radio inside a Field", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container } = render(
        <Field.Root>
          <RadioGroup name="plan" onValueChange={onValueChange}>
            <Field.Item>
              <Radio.Default value="free" label="Free" />
            </Field.Item>
            <Field.Item>
              <Radio.Default value="pro" label="Pro" />
            </Field.Item>
            <Field.Item>
              <Radio.Default value="enterprise" label="Enterprise" />
            </Field.Item>
          </RadioGroup>
        </Field.Root>,
      );

      const ids = getInputs(container).map((input) => input.id);
      expect(new Set(ids).size).toBe(3);

      // Every label resolves to its own input, not just the first.
      const labels = Array.from(container.querySelectorAll("label"));
      expect(labels.map((label) => label.control)).not.toContain(null);

      // The last label is the one that breaks when the ids collide.
      await user.click(screen.getByText("Enterprise"));
      expect(onValueChange.mock.calls[0]![0]).toBe("enterprise");
    });

    // A bare `Field.Root` holds one control id and hands it to every radio
    // inside it, so the inputs collide and only the first label works. That is
    // Base UI's scoping, not something this package can undo: `Field.Item` is
    // the supported way to put more than one control in a field. Pinned so a
    // future Base UI release that fixes it shows up as a failure here.
    it("shares one input id across radios in a bare Field, so Field.Item is required", () => {
      const { container } = render(
        <Field.Root>
          <RadioGroup name="plan">
            <Radio.Default value="free" label="Free" />
            <Radio.Default value="pro" label="Pro" />
          </RadioGroup>
        </Field.Root>,
      );
      const ids = getInputs(container).map((input) => input.id);
      expect(new Set(ids).size).toBe(1);
    });

    // A visible label wins over `aria-label`: Base UI's fallback re-derives
    // `aria-labelledby` from the associated `<label>`, and that outranks
    // `aria-label`. `aria-labelledby` is the escape hatch.
    it("lets aria-labelledby override a visible label", () => {
      render(
        <>
          <span id="row">Pro plan, billed yearly</span>
          <RadioGroup name="plan">
            <Radio.Default value="pro" aria-labelledby="row" label="Pro" />
          </RadioGroup>
        </>,
      );
      expect(getRadio("Pro plan, billed yearly")).toBeInTheDocument();
    });
  });

  describe("label rendering", () => {
    // `{label && …}` renders a bare `0` instead of a label.
    it("renders a zero label inside a real label element", () => {
      const { container } = render(
        <RadioGroup name="plan">
          <Radio.Default value="zero" label={0} />
        </RadioGroup>,
      );
      expect(container.querySelector("label")).toHaveTextContent("0");
    });

    it("renders no label for false", () => {
      const { container } = render(
        <RadioGroup name="plan">
          <Radio.Default value="pro" aria-label="Pro" label={false} />
        </RadioGroup>,
      );
      expect(container.querySelector("label")).toBeNull();
    });

    // `Radio.Control` points `aria-labelledby` at `context.labelId` during
    // render, so a caller-supplied id would leave a dangling IDREF.
    it("keeps its own id even when a caller passes one", () => {
      const { container } = render(
        <RadioGroup name="plan">
          <Radio.Default
            value="pro"
            label="Pro"
            // @ts-expect-error id is not part of the label surface
            labelProps={{ id: "my-label" }}
          />
        </RadioGroup>,
      );

      const label = container.querySelector("label")!;
      expect(label.id).not.toBe("my-label");
      expect(getRadio("Pro")).toHaveAttribute("aria-labelledby", label.id);
    });
  });

  describe("styling hooks", () => {
    it("exposes size and color as data attributes", () => {
      render(
        <RadioGroup name="plan" size="1" color="red">
          <Radio.Default value="free" label="Free" />
          <Radio.Default value="pro" label="Pro" size="2" />
        </RadioGroup>,
      );

      const control = (name: string) =>
        getRadio(name).closest("[data-tgph-radio-control]") ?? getRadio(name);

      expect(control("Free")).toHaveAttribute("data-tgph-radio-size", "1");
      expect(control("Free")).toHaveAttribute("data-tgph-radio-color", "red");
      // A radio's own size prop beats the group default.
      expect(control("Pro")).toHaveAttribute("data-tgph-radio-size", "2");
      expect(control("Pro")).toHaveAttribute("data-tgph-radio-color", "red");
    });

    it("puts className on each part", () => {
      const { container } = render(
        <RadioGroup name="plan">
          <Radio.Default
            value="pro"
            label="Pro"
            className="my-root"
            controlProps={{ className: "my-control" }}
            labelProps={{ className: "my-label" }}
          />
        </RadioGroup>,
      );

      expect(container.querySelector(".my-root")).toBeInTheDocument();
      expect(container.querySelector(".my-control")).toBeInTheDocument();
      expect(container.querySelector(".my-label")).toBeInTheDocument();
    });
  });
});
