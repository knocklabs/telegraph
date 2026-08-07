import type { ComponentProps } from "react";
import { describe, expectTypeOf, it } from "vitest";

import { Appearance, InvertedAppearance, OverrideAppearance } from ".";

// The shared props type is not on the package surface, so it is pinned off the
// components themselves.
type AppearanceProps = ComponentProps<typeof Appearance>;
type InvertedAppearanceProps = ComponentProps<typeof InvertedAppearance>;
type OverrideAppearanceProps = ComponentProps<typeof OverrideAppearance>;

describe("Appearance types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<AppearanceProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<InvertedAppearanceProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<OverrideAppearanceProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<AppearanceProps["appearance"]>().not.toBeAny();
    expectTypeOf<AppearanceProps["inverted"]>().not.toBeAny();
    expectTypeOf<AppearanceProps["asChild"]>().not.toBeAny();
    expectTypeOf<AppearanceProps["children"]>().not.toBeAny();
    expectTypeOf<InvertedAppearanceProps["appearance"]>().not.toBeAny();
    expectTypeOf<OverrideAppearanceProps["appearance"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Appearance
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Appearance
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <InvertedAppearance
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <OverrideAppearance
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Appearance
      // @ts-expect-error not an appearance
      appearance="blue"
    />;
    <Appearance
      // @ts-expect-error inverted must be a boolean
      inverted="yes"
    />;
    <Appearance
      // @ts-expect-error asChild must be a boolean
      asChild="yes"
    />;
    <InvertedAppearance
      // @ts-expect-error not an appearance
      appearance="blue"
    />;
    <OverrideAppearance
      // @ts-expect-error not an appearance
      appearance="blue"
    />;
  });

  it("accepts valid props", () => {
    <Appearance appearance="dark" inverted asChild={false} />;
    <Appearance
      appearance="light"
      id="root"
      className="c"
      style={{ opacity: 0.5 }}
      aria-label="appearance"
      data-testid="appearance"
      onClick={() => {}}
    >
      <span>content</span>
    </Appearance>;
    <InvertedAppearance appearance="dark" className="c">
      <span>content</span>
    </InvertedAppearance>;
    <OverrideAppearance appearance="light" asChild>
      <span>content</span>
    </OverrideAppearance>;
  });
});
