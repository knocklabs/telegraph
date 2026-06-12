import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { SegmentedControl } from "./SegmentedControl";

class ResizeObserverMock implements ResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}

const SegmentedControlFixture = ({
  defaultValue = "left",
}: {
  defaultValue?: string;
}) => {
  return (
    <SegmentedControl.Root defaultValue={defaultValue}>
      <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
      <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
      <SegmentedControl.Option value="right" disabled>
        Right
      </SegmentedControl.Option>
    </SegmentedControl.Root>
  );
};

describe("SegmentedControl", () => {
  beforeAll(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("renders the default option with Telegraph state attributes", () => {
    render(<SegmentedControlFixture />);

    const activeOption = screen.getByRole("button", { name: "Left" });

    expect(activeOption).toHaveAttribute("data-tgph-segmented-control-option");
    expect(activeOption).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
    expect(activeOption).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled single values and legacy string callbacks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const ControlledSegmentedControl = () => {
      const [value, setValue] = useState("left");

      return (
        <SegmentedControl.Root
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue as string);
          }}
        >
          <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
          <SegmentedControl.Option value="center">
            Center
          </SegmentedControl.Option>
        </SegmentedControl.Root>
      );
    };

    render(<ControlledSegmentedControl />);

    await user.click(screen.getByRole("button", { name: "Center" }));

    expect(onValueChange).toHaveBeenCalledWith("center");
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "inactive",
    );
  });

  it("does not clear a controlled single value when the active option is clicked again", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl.Root value="left" onValueChange={onValueChange}>
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Left" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
  });

  it("does not clear an uncontrolled single value when the active option is clicked again", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl.Root defaultValue="left" onValueChange={onValueChange}>
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Left" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
  });

  it("supports an empty string as a controlled single value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const ControlledSegmentedControl = () => {
      const [value, setValue] = useState("left");

      return (
        <SegmentedControl.Root
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue as string);
          }}
        >
          <SegmentedControl.Option value="">None</SegmentedControl.Option>
          <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        </SegmentedControl.Root>
      );
    };

    render(<ControlledSegmentedControl />);

    await user.click(screen.getByRole("button", { name: "None" }));

    expect(onValueChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("button", { name: "None" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "inactive",
    );
  });

  it("does not collide with option values that match the empty-string sentinel", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const emptyStringSentinel = "__tgph_segmented_control_value__empty";

    const ControlledSegmentedControl = () => {
      const [value, setValue] = useState("");

      return (
        <SegmentedControl.Root
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue as string);
          }}
        >
          <SegmentedControl.Option value="">None</SegmentedControl.Option>
          <SegmentedControl.Option value={emptyStringSentinel}>
            Sentinel
          </SegmentedControl.Option>
        </SegmentedControl.Root>
      );
    };

    render(<ControlledSegmentedControl />);

    await user.click(screen.getByRole("button", { name: "Sentinel" }));

    expect(onValueChange).toHaveBeenCalledWith(emptyStringSentinel);
    expect(screen.getByRole("button", { name: "None" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "inactive",
    );
    expect(screen.getByRole("button", { name: "Sentinel" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
  });

  it("supports controlled multiple values and legacy array callbacks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const ControlledSegmentedControl = () => {
      const [value, setValue] = useState(["left"]);

      return (
        <SegmentedControl.Root
          type="multiple"
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue as string[]);
          }}
        >
          <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
          <SegmentedControl.Option value="center">
            Center
          </SegmentedControl.Option>
        </SegmentedControl.Root>
      );
    };

    render(<ControlledSegmentedControl />);

    await user.click(screen.getByRole("button", { name: "Center" }));

    expect(onValueChange).toHaveBeenCalledWith(["left", "center"]);
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
  });

  it("does not activate disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl.Root value="left" onValueChange={onValueChange}>
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="right" disabled>
          Right
        </SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Right" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute(
      "data-tgph-segmented-control-option-status",
      "active",
    );
  });

  it("visually and functionally disables every option when the root is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl.Root
        defaultValue="left"
        disabled
        onValueChange={onValueChange}
      >
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    const leftOption = screen.getByRole("button", { name: "Left" });
    const centerOption = screen.getByRole("button", { name: "Center" });

    expect(leftOption).toBeDisabled();
    expect(leftOption).toHaveAttribute("data-tgph-button-state", "disabled");
    expect(centerOption).toBeDisabled();
    expect(centerOption).toHaveAttribute("data-tgph-button-state", "disabled");

    await user.click(centerOption);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("moves focus with arrow keys by default", async () => {
    const user = userEvent.setup();

    render(<SegmentedControlFixture />);

    const leftOption = screen.getByRole("button", { name: "Left" });
    const centerOption = screen.getByRole("button", { name: "Center" });

    leftOption.focus();
    await user.keyboard("{ArrowRight}");

    expect(centerOption).toHaveFocus();
  });

  it("loops focus with arrow keys by default", async () => {
    const user = userEvent.setup();

    render(
      <SegmentedControl.Root defaultValue="left">
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
        <SegmentedControl.Option value="right">Right</SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    const leftOption = screen.getByRole("button", { name: "Left" });
    const rightOption = screen.getByRole("button", { name: "Right" });

    rightOption.focus();
    await user.keyboard("{ArrowRight}");

    expect(leftOption).toHaveFocus();
  });

  it("honors loop=false for arrow-key focus", async () => {
    const user = userEvent.setup();

    render(
      <SegmentedControl.Root defaultValue="left" loop={false}>
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    const leftOption = screen.getByRole("button", { name: "Left" });

    leftOption.focus();
    await user.keyboard("{ArrowLeft}");

    expect(leftOption).toHaveFocus();
  });

  it("preserves legacy opt-out support for roving focus", async () => {
    const user = userEvent.setup();

    render(
      <SegmentedControl.Root defaultValue="left" rovingFocus={false}>
        <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
        <SegmentedControl.Option value="center">Center</SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    const leftOption = screen.getByRole("button", { name: "Left" });

    leftOption.focus();
    await user.keyboard("{ArrowRight}");

    expect(leftOption).toHaveFocus();
  });

  it("forwards tgphRef through Base UI render props", () => {
    const rootRef = createRef<HTMLDivElement>();
    const optionRef = createRef<HTMLButtonElement>();

    render(
      <SegmentedControl.Root
        data-testid="segmented-control-root"
        defaultValue="left"
        tgphRef={rootRef}
      >
        <SegmentedControl.Option value="left" tgphRef={optionRef}>
          Left
        </SegmentedControl.Option>
      </SegmentedControl.Root>,
    );

    expect(rootRef.current).toBe(screen.getByTestId("segmented-control-root"));
    expect(optionRef.current).toBe(
      screen.getByRole("button", { name: "Left" }),
    );
  });
});
