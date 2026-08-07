import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import type { TgphElement } from "../types/utility";

import {
  defineNativeButtonResolver,
  inferTriggerNativeButton,
  resolveNativeButton,
} from "./inferTriggerNativeButton";

type PolymorphicButtonProps = {
  as?: "button" | "div";
  disabled?: boolean;
};

const resolvePolymorphicButton = (
  props: unknown = {},
  nativeButton?: boolean,
) => {
  const { as, disabled } = props as PolymorphicButtonProps;
  return disabled
    ? true
    : (nativeButton ?? (as === undefined || as === "button"));
};

const PolymorphicButton = (_props: PolymorphicButtonProps) => null;

defineNativeButtonResolver({
  component: PolymorphicButton,
  resolver: resolvePolymorphicButton,
});

const infer = (
  children: ReactNode,
  options: { asChild?: boolean; nativeButton?: boolean } = {},
) =>
  inferTriggerNativeButton({
    asChild: options.asChild ?? true,
    children,
    nativeButton: options.nativeButton,
  });

describe("resolveNativeButton", () => {
  it("unwraps Motion components using their stable component symbol", () => {
    const MotionDiv = {
      [Symbol.for("motionComponentSymbol")]: "div",
    } as unknown as TgphElement;
    const MotionButton = {
      [Symbol.for("motionComponentSymbol")]: "button",
    } as unknown as TgphElement;

    expect(resolveNativeButton({ component: MotionDiv })).toBe(false);
    expect(resolveNativeButton({ component: MotionButton })).toBe(true);
  });
});

describe("inferTriggerNativeButton", () => {
  it("prefers an explicit nativeButton value", () => {
    expect(infer(<button />, { nativeButton: false })).toBe(false);
    expect(infer(<div />, { nativeButton: true })).toBe(true);
  });

  it("lets a registered component's render coercion override an explicit value", () => {
    expect(infer(<PolymorphicButton as="div" />, { nativeButton: true })).toBe(
      true,
    );
    expect(
      infer(<PolymorphicButton as="div" disabled />, {
        nativeButton: false,
      }),
    ).toBe(true);
  });

  it("uses the Base UI default when the trigger is not composed", () => {
    expect(infer(<div />, { asChild: false })).toBe(true);
    expect(infer("Trigger")).toBe(true);
  });

  it("infers intrinsic element semantics", () => {
    expect(infer(<button />)).toBe(true);
    expect(infer(<div />)).toBe(false);
  });

  it("uses a stable resolver registered by a polymorphic component", () => {
    expect(infer(<PolymorphicButton />)).toBe(true);
    expect(infer(<PolymorphicButton as="div" />)).toBe(false);
    expect(infer(<PolymorphicButton as="div" disabled />)).toBe(true);
  });

  it("recognizes a resolver registered by another package instance", () => {
    const ForeignButton = (_props: PolymorphicButtonProps) => null;

    Object.defineProperty(
      ForeignButton,
      Symbol.for("@telegraph/native-button-resolver"),
      { value: resolvePolymorphicButton },
    );

    expect(infer(<ForeignButton as="div" />)).toBe(false);
    expect(
      infer(<ForeignButton as="div" disabled />, { nativeButton: false }),
    ).toBe(true);
  });

  it("uses the Base UI default for unrecognized components", () => {
    const CustomComponent = () => <div />;

    expect(infer(<CustomComponent />)).toBe(true);
  });
});
