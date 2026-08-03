import { Field } from "@base-ui/react/field";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FormEvent, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";
import { Checkbox } from "../Checkbox";

import { CheckboxGroup } from "./CheckboxGroup";

const RUNS = ["run-1", "run-2", "run-3"];

const getCheckbox = (name: string) => screen.getByRole("checkbox", { name });

/** The FormData captured by the first call to a submit spy. */
const getSubmitted = (onSubmit: { mock: { calls: unknown[][] } }) =>
  onSubmit.mock.calls[0]![0] as FormData;

/** Controlled group, so tests can assert on the value the group reports. */
const ControlledGroup = ({
  initialValue = [],
  onValueChange,
  disabledRuns = [],
  withParent = true,
}: {
  initialValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabledRuns?: string[];
  withParent?: boolean;
}) => {
  const [value, setValue] = useState<string[]>(initialValue);

  return (
    <CheckboxGroup
      value={value}
      allValues={RUNS}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    >
      {withParent && <Checkbox.Default parent label="Select all" />}
      {RUNS.map((run) => (
        <Checkbox.Default
          key={run}
          name={run}
          label={run}
          disabled={disabledRuns.includes(run)}
        />
      ))}
    </CheckboxGroup>
  );
};

describe("CheckboxGroup", () => {
  it("is accessible", async () => {
    const { container } = render(<ControlledGroup />);
    expectToHaveNoViolations(await axe(container));
  });

  it("supports an uncontrolled default value", async () => {
    const user = userEvent.setup();
    render(
      <CheckboxGroup defaultValue={["run-1"]}>
        {RUNS.map((run) => (
          <Checkbox.Default key={run} name={run} label={run} />
        ))}
      </CheckboxGroup>,
    );

    expect(getCheckbox("run-1")).toBeChecked();
    expect(getCheckbox("run-2")).not.toBeChecked();

    await user.click(getCheckbox("run-2"));
    expect(getCheckbox("run-2")).toBeChecked();
  });

  it("tracks children by name and reports the selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ControlledGroup withParent={false} onValueChange={onValueChange} />,
    );

    await user.click(getCheckbox("run-2"));

    expect(onValueChange).toHaveBeenCalledWith(["run-2"]);
    expect(onValueChange.mock.calls[0]).toHaveLength(1);
  });

  it("applies group size and color to every child", () => {
    render(
      <CheckboxGroup size="1" color="red">
        <Checkbox.Default name="run-1" label="run-1" />
        <Checkbox.Default name="run-2" label="run-2" size="2" />
      </CheckboxGroup>,
    );

    const first = getCheckbox("run-1");
    const second = getCheckbox("run-2");

    expect(first).toHaveAttribute("data-tgph-checkbox-size", "1");
    expect(first).toHaveAttribute("data-tgph-checkbox-color", "red");
    // A checkbox's own size prop beats the group default.
    expect(second).toHaveAttribute("data-tgph-checkbox-size", "2");
    expect(second).toHaveAttribute("data-tgph-checkbox-color", "red");
  });

  it("disables every child when the group is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup disabled onValueChange={onValueChange}>
        {RUNS.map((run) => (
          <Checkbox.Default key={run} name={run} label={run} />
        ))}
      </CheckboxGroup>,
    );

    await user.click(getCheckbox("run-1"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("submits the checked children in FormData", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget));
        }}
      >
        <CheckboxGroup defaultValue={["run-1", "run-3"]}>
          {RUNS.map((run) => (
            <Checkbox.Default key={run} name={run} label={run} />
          ))}
        </CheckboxGroup>
        <button type="submit">Submit</button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));

    const data = getSubmitted(onSubmit);
    expect(data.get("run-1")).toBe("on");
    expect(data.get("run-2")).toBeNull();
    expect(data.get("run-3")).toBe("on");
  });

  describe("parent select-all", () => {
    it("is unchecked, indeterminate, then checked as children toggle", async () => {
      const user = userEvent.setup();
      render(<ControlledGroup />);

      const parent = getCheckbox("Select all");
      expect(parent).toHaveAttribute("aria-checked", "false");

      await user.click(getCheckbox("run-1"));
      expect(parent).toHaveAttribute("aria-checked", "mixed");

      await user.click(getCheckbox("run-2"));
      await user.click(getCheckbox("run-3"));
      expect(parent).toHaveAttribute("aria-checked", "true");
    });

    it("selects and deselects everything", async () => {
      const user = userEvent.setup();
      render(<ControlledGroup />);

      await user.click(getCheckbox("Select all"));
      RUNS.forEach((run) => expect(getCheckbox(run)).toBeChecked());

      await user.click(getCheckbox("Select all"));
      RUNS.forEach((run) => expect(getCheckbox(run)).not.toBeChecked());
    });

    it("skips a disabled unchecked child when selecting all", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ControlledGroup
          disabledRuns={["run-3"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(getCheckbox("Select all"));

      expect(getCheckbox("run-1")).toBeChecked();
      expect(getCheckbox("run-2")).toBeChecked();
      expect(getCheckbox("run-3")).not.toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith(["run-1", "run-2"]);
    });

    it("keeps a disabled checked child when deselecting all", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ControlledGroup
          initialValue={RUNS}
          disabledRuns={["run-3"]}
          onValueChange={onValueChange}
        />,
      );

      await user.click(getCheckbox("Select all"));

      expect(getCheckbox("run-3")).toBeChecked();
      expect(onValueChange).toHaveBeenLastCalledWith(["run-3"]);
    });

    // Base UI derives the parent's checked state from
    // `value.length === allValues.length`, with no allowance for children that
    // can never be selected. So a permanently-disabled child pins the parent at
    // "mixed". Documented in the README; the fix is to leave such children out
    // of `allValues`.
    it("stays mixed when a disabled child is in allValues", async () => {
      const user = userEvent.setup();
      render(<ControlledGroup disabledRuns={["run-3"]} />);

      await user.click(getCheckbox("Select all"));

      expect(getCheckbox("run-1")).toBeChecked();
      expect(getCheckbox("run-2")).toBeChecked();
      expect(getCheckbox("Select all")).toHaveAttribute(
        "aria-checked",
        "mixed",
      );
    });

    it("reaches checked when the disabled child is left out of allValues", async () => {
      const user = userEvent.setup();
      const selectable = ["run-1", "run-2"];

      const Group = () => {
        const [value, setValue] = useState<string[]>([]);
        return (
          <CheckboxGroup
            value={value}
            onValueChange={setValue}
            allValues={selectable}
          >
            <Checkbox.Default parent label="Select all" />
            {selectable.map((run) => (
              <Checkbox.Default key={run} name={run} label={run} />
            ))}
            <Checkbox.Default name="run-3" label="run-3" disabled />
          </CheckboxGroup>
        );
      };

      render(<Group />);
      await user.click(getCheckbox("Select all"));

      expect(getCheckbox("Select all")).toHaveAttribute("aria-checked", "true");
      expect(getCheckbox("run-3")).not.toBeChecked();
    });

    // Base UI derives its own input id inside a select-all group and ignores
    // the one we pass, so `htmlFor` has to track the id it actually used or
    // clicking label text does nothing. Role-based queries hit the control
    // directly and would not catch this.
    it("toggles a child from a label click", async () => {
      const user = userEvent.setup();
      render(<ControlledGroup />);

      await user.click(screen.getByText("run-1"));
      expect(getCheckbox("run-1")).toBeChecked();
    });

    it("toggles the parent from a label click", async () => {
      const user = userEvent.setup();
      render(<ControlledGroup />);

      await user.click(screen.getByText("Select all"));
      RUNS.forEach((run) => expect(getCheckbox(run)).toBeChecked());
    });

    it("restores the hand-picked selection on the third click", async () => {
      const user = userEvent.setup();
      render(<ControlledGroup />);

      // Hand-pick a partial selection first.
      await user.click(getCheckbox("run-2"));
      expect(getCheckbox("run-2")).toBeChecked();

      const parent = getCheckbox("Select all");

      await user.click(parent); // -> all
      RUNS.forEach((run) => expect(getCheckbox(run)).toBeChecked());

      await user.click(parent); // -> none
      RUNS.forEach((run) => expect(getCheckbox(run)).not.toBeChecked());

      await user.click(parent); // -> back to the hand-picked selection
      expect(getCheckbox("run-1")).not.toBeChecked();
      expect(getCheckbox("run-2")).toBeChecked();
      expect(getCheckbox("run-3")).not.toBeChecked();
    });

    it("keeps the parent out of form submission", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSubmit(new FormData(event.currentTarget));
          }}
        >
          <CheckboxGroup defaultValue={[]} allValues={RUNS}>
            <Checkbox.Default parent label="Select all" name="select-all" />
            {RUNS.map((run) => (
              <Checkbox.Default key={run} name={run} label={run} />
            ))}
          </CheckboxGroup>
          <button type="submit">Submit</button>
        </form>,
      );

      await user.click(getCheckbox("Select all"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      const data = getSubmitted(onSubmit);
      expect(data.get("select-all")).toBeNull();
      expect(data.get("run-1")).toBe("on");
    });
  });

  describe("group id", () => {
    it("renders the id on the group element", () => {
      const { container } = render(
        <CheckboxGroup id="channels" aria-labelledby="channels-heading">
          <Checkbox.Default name="email" label="Email" />
        </CheckboxGroup>,
      );

      expect(container.querySelector("#channels")).toHaveAttribute(
        "data-tgph-checkbox-group",
      );
    });
  });

  // Base UI ORs the group's `disabled` over each checkbox's own, so a child
  // cannot opt out. If our own resolution disagreed, the label would style
  // itself enabled over a control Base UI had already disabled.
  describe("disabled precedence", () => {
    it("keeps a child disabled even when it passes disabled={false}", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container } = render(
        <CheckboxGroup disabled onValueChange={onValueChange}>
          <Checkbox.Default name="email" label="Email" disabled={false} />
        </CheckboxGroup>,
      );

      // The control is Base UI's rendered div, so `toBeDisabled` doesn't apply;
      // the real input is the aria-hidden sibling.
      const control = getCheckbox("Email");
      expect(control).toHaveAttribute("aria-disabled", "true");
      expect(control).toHaveAttribute("data-disabled");
      expect(
        container.querySelector<HTMLInputElement>('input[type="checkbox"]')!
          .disabled,
      ).toBe(true);

      // The label styling hangs off the control's `data-disabled` via `:has()`,
      // so this attribute is the whole contract. Nothing recomputes `disabled`
      // a second time, which is what used to drift.
      expect(
        container.querySelector(
          "[data-tgph-checkbox-root]:has([data-tgph-checkbox-control][data-disabled]) [data-tgph-checkbox-label]",
        ),
      ).not.toBeNull();

      await user.click(screen.getByText("Email"));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    // Base UI ORs in an enclosing `Field` too. That axis is invisible from this
    // package, which is exactly why the label styling reads Base UI's output
    // instead of recomputing it.
    it("styles the label disabled from a Field it cannot see", () => {
      const { container } = render(
        <Field.Root disabled>
          <Checkbox.Default name="email" label="Email" />
        </Field.Root>,
      );

      expect(getCheckbox("Email")).toHaveAttribute("data-disabled");
      expect(
        container.querySelector(
          "[data-tgph-checkbox-root]:has([data-tgph-checkbox-control][data-disabled]) [data-tgph-checkbox-label]",
        ),
      ).not.toBeNull();
    });

    // Standalone, not in a group: inside a group Base UI ORs the group value
    // back in and hides the bug. Here the root prop is the only source, so a
    // `controlProps.disabled` spreading over it really does re-enable it.
    it("blocks disabled from controlProps, which would spread over the root", () => {
      const { container } = render(
        <Checkbox.Default
          name="email"
          label="Email"
          disabled
          // The type rejects this; `Checkbox.test-d.tsx` asserts that. Here we
          // only care that it cannot win at runtime either.
          controlProps={{ disabled: false } as never}
        />,
      );

      expect(getCheckbox("Email")).toHaveAttribute("aria-disabled", "true");
      expect(
        container.querySelector<HTMLInputElement>('input[type="checkbox"]')!
          .disabled,
      ).toBe(true);
    });
  });

  describe("event details", () => {
    it("passes Base UI's event details to the group's onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <CheckboxGroup onValueChange={onValueChange}>
          <Checkbox.Default name="email" label="Email" />
        </CheckboxGroup>,
      );

      await user.click(getCheckbox("Email"));

      expect(onValueChange).toHaveBeenCalledTimes(1);
      const [value, eventDetails] = onValueChange.mock.calls[0]!;
      expect(value).toEqual(["email"]);
      expect(typeof eventDetails.cancel).toBe("function");
    });
  });

  // Inside a select-all group Base UI derives the input id from the group's own
  // id plus the checkbox's key, so `allValues` arriving after mount rewrites
  // every input id in place. `Checkbox.Label` has to follow.
  describe("label association when allValues arrives late", () => {
    const LateAllValues = () => {
      const [allValues, setAllValues] = useState<string[] | undefined>(
        undefined,
      );
      const [value, setValue] = useState<string[]>([]);
      return (
        <>
          <button type="button" onClick={() => setAllValues(RUNS)}>
            Load
          </button>
          <CheckboxGroup
            value={value}
            onValueChange={setValue}
            allValues={allValues}
          >
            <Checkbox.Default parent label="Select all" />
            {RUNS.map((run) => (
              <Checkbox.Default key={run} name={run} label={run} />
            ))}
          </CheckboxGroup>
        </>
      );
    };

    it("keeps label clicks working after the ids change", async () => {
      const user = userEvent.setup();
      const { container } = render(<LateAllValues />);

      await user.click(screen.getByRole("button", { name: "Load" }));

      const label = Array.from(container.querySelectorAll("label")).find(
        (node) => node.textContent === "run-1",
      )!;
      expect(document.getElementById(label.getAttribute("for")!)).toBeTruthy();

      await user.click(label);
      expect(getCheckbox("run-1")).toBeChecked();
    });
  });

  // `CheckboxRoot.js` guards the hidden input on `!groupContext`, so the prop
  // is inert here. The group owns the submitted set instead.
  describe("uncheckedValue inside a group", () => {
    it("submits nothing for an unchecked child", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSubmit(new FormData(event.currentTarget));
          }}
        >
          <CheckboxGroup defaultValue={[]}>
            <Checkbox.Default name="run-1" label="run-1" uncheckedValue="off" />
          </CheckboxGroup>
          <button type="submit">Submit</button>
        </form>,
      );

      await user.click(screen.getByRole("button", { name: "Submit" }));

      const submitted = onSubmit.mock.calls[0]![0] as FormData;
      expect(submitted.get("run-1")).toBeNull();
    });
  });
});
