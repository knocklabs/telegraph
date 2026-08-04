import { describe, expect, it } from "vitest";

import { inferTriggerNativeButton } from "./inferTriggerNativeButton";

const PolymorphicButton = (_props: {
  as?: "button" | "div";
  disabled?: boolean;
}) => null;

const BUTTON_COMPONENTS = [PolymorphicButton];

describe("inferTriggerNativeButton", () => {
  it("infers intrinsic element semantics", () => {
    expect(inferTriggerNativeButton(<button />, BUTTON_COMPONENTS)).toBe(true);
    expect(inferTriggerNativeButton(<div />, BUTTON_COMPONENTS)).toBe(false);
  });

  it("infers recognized polymorphic button semantics", () => {
    expect(
      inferTriggerNativeButton(<PolymorphicButton />, BUTTON_COMPONENTS),
    ).toBe(true);
    expect(
      inferTriggerNativeButton(
        <PolymorphicButton as="div" />,
        BUTTON_COMPONENTS,
      ),
    ).toBe(false);
    expect(
      inferTriggerNativeButton(
        <PolymorphicButton as="div" disabled />,
        BUTTON_COMPONENTS,
      ),
    ).toBe(true);
  });

  it("leaves unrecognized components unknown", () => {
    const CustomComponent = () => <div />;

    expect(
      inferTriggerNativeButton(<CustomComponent />, BUTTON_COMPONENTS),
    ).toBeUndefined();
  });
});
