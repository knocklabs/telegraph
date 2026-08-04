import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { inferTriggerNativeButton } from "./inferTriggerNativeButton";

type PolymorphicButtonProps = {
  as?: "button" | "div";
  disabled?: boolean;
};

const PolymorphicButtonRoot = (_props: PolymorphicButtonProps) => null;
const PolymorphicButton = Object.assign(
  (_props: PolymorphicButtonProps) => null,
  { Root: PolymorphicButtonRoot },
);

const infer = (
  children: ReactNode,
  options: { asChild?: boolean; nativeButton?: boolean } = {},
) =>
  inferTriggerNativeButton({
    asChild: options.asChild ?? true,
    buttonComponent: PolymorphicButton,
    children,
    nativeButton: options.nativeButton,
  });

describe("inferTriggerNativeButton", () => {
  it("prefers an explicit nativeButton value", () => {
    expect(infer(<button />, { nativeButton: false })).toBe(false);
    expect(infer(<div />, { nativeButton: true })).toBe(true);
  });

  it("uses the Base UI default when the trigger is not composed", () => {
    expect(infer(<div />, { asChild: false })).toBe(true);
    expect(infer("Trigger")).toBe(true);
  });

  it("infers intrinsic element semantics", () => {
    expect(infer(<button />)).toBe(true);
    expect(infer(<div />)).toBe(false);
  });

  it("infers recognized polymorphic button semantics", () => {
    expect(infer(<PolymorphicButton />)).toBe(true);
    expect(infer(<PolymorphicButton as="div" />)).toBe(false);
    expect(infer(<PolymorphicButton as="div" disabled />)).toBe(true);
    expect(infer(<PolymorphicButton.Root as="div" />)).toBe(false);
  });

  it("uses the Base UI default for unrecognized components", () => {
    const CustomComponent = () => <div />;

    expect(infer(<CustomComponent />)).toBe(true);
  });
});
