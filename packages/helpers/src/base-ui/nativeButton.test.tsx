import { describe, expect, it } from "vitest";

import { inferNativeButton, withNativeButtonResolver } from "./nativeButton";

describe("native button inference", () => {
  it("infers intrinsic element semantics", () => {
    expect(inferNativeButton(<button type="button" />)).toBe(true);
    expect(inferNativeButton(<div />)).toBe(false);
    expect(inferNativeButton(<a href="/docs" />)).toBe(false);
  });

  it("leaves unregistered custom components unknown", () => {
    const CustomTrigger = () => <div />;

    expect(inferNativeButton(<CustomTrigger />)).toBeUndefined();
  });

  it("uses resolver metadata without rendering the component", () => {
    const PolymorphicTrigger = (_props: { as?: "button" | "div" }) => null;
    const registered = withNativeButtonResolver(
      PolymorphicTrigger,
      ({ as }) => as === "button",
    );

    expect(registered).toBe(PolymorphicTrigger);
    expect(inferNativeButton(<PolymorphicTrigger as="button" />)).toBe(true);
    expect(inferNativeButton(<PolymorphicTrigger as="div" />)).toBe(false);
  });
});
