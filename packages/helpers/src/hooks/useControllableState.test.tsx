import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "./useControllableState";

const UncontrolledStateExample = ({
  onChange,
}: {
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useControllableState({
    defaultProp: "one",
    onChange,
  });

  return (
    <>
      <output>{value}</output>
      <button type="button" onClick={() => setValue("two")}>
        Set two
      </button>
    </>
  );
};

const DuplicateUpdateExample = ({
  onChange,
}: {
  onChange?: (value: boolean) => void;
}) => {
  const [, setValue] = useControllableState({
    defaultProp: true,
    onChange,
  });

  return (
    <button
      type="button"
      onClick={() => {
        setValue(false);
        setValue(false);
      }}
    >
      Close twice
    </button>
  );
};

const ControlledStateExample = ({
  onChange,
}: {
  onChange?: (value: string) => void;
}) => {
  const [value, setValue] = useControllableState({
    prop: "controlled",
    defaultProp: "uncontrolled",
    onChange,
  });

  return (
    <>
      <output>{value}</output>
      <button type="button" onClick={() => setValue("requested")}>
        Request update
      </button>
    </>
  );
};

const UpdaterExample = () => {
  const [value, setValue] = useControllableState({
    defaultProp: 1,
  });

  return (
    <>
      <output>{value}</output>
      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Increment
      </button>
    </>
  );
};

const ControlledRerenderExample = () => {
  const [controlledValue, setControlledValue] = useState("one");
  const [value, setValue] = useControllableState({
    prop: controlledValue,
    defaultProp: "fallback",
    onChange: setControlledValue,
  });

  return (
    <>
      <output>{value}</output>
      <button type="button" onClick={() => setValue("two")}>
        Set controlled value
      </button>
    </>
  );
};

describe("useControllableState", () => {
  it("updates uncontrolled state and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<UncontrolledStateExample onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Set two" }));

    expect(screen.getByText("two")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("dedupes same-value uncontrolled updates before rerender", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DuplicateUpdateExample onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Close twice" }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("requests controlled updates without changing the current value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ControlledStateExample onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Request update" }));

    expect(screen.getByText("controlled")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("requested");
  });

  it("supports updater functions", async () => {
    const user = userEvent.setup();

    render(<UpdaterExample />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("uses the next controlled prop after onChange updates it", async () => {
    const user = userEvent.setup();

    render(<ControlledRerenderExample />);

    await user.click(
      screen.getByRole("button", { name: "Set controlled value" }),
    );

    expect(screen.getByText("two")).toBeInTheDocument();
  });
});
