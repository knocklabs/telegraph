import { describe, expectTypeOf, it } from "vitest";

import { Tab } from ".";
import type { TabProps } from ".";

describe("Tab types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TabProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TabProps["value"]>().not.toBeAny();
    expectTypeOf<TabProps["size"]>().not.toBeAny();
    expectTypeOf<TabProps["selected"]>().not.toBeAny();
    expectTypeOf<TabProps["disabled"]>().not.toBeAny();
    expectTypeOf<TabProps["leadingIcon"]>().not.toBeAny();
    expectTypeOf<TabProps["trailingIcon"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Tab
      value="a"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tab
      value="a"
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Tab
      value="a"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Tab
      // @ts-expect-error tab values are strings
      value={42}
    />;
    <Tab
      value="a"
      // @ts-expect-error not a menu item size
      size="99"
    />;
    <Tab
      value="a"
      // @ts-expect-error selected is boolean | null
      selected="yes"
    />;
  });

  it("accepts valid props", () => {
    <Tab value="a" size="1" selected disabled p="2" />;
    <Tab value="a" as="a" className="c" style={{ opacity: 1 }} />;
    <Tab value="a" aria-label="tab" data-testid="tab" onClick={() => {}} />;
  });
});
