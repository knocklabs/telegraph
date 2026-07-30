import { Tabs } from ".";
import type { TabsProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Tabs types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TabsProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TabsProps["value"]>().not.toBeAny();
    expectTypeOf<TabsProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<TabsProps["orientation"]>().not.toBeAny();
    expectTypeOf<TabsProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<TabsProps["direction"]>().not.toBeAny();
    expectTypeOf<TabsProps["gap"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Tabs
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Tabs
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Tabs
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Tabs
      // @ts-expect-error not a tabs orientation
      orientation="diagonal"
    />;
    <Tabs
      // @ts-expect-error tab values are strings
      value={42}
    />;
    <Tabs
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
  });

  it("accepts valid props", () => {
    <Tabs defaultValue="one" orientation="vertical" p="2" gap="4" />;
    <Tabs value="one" onValueChange={(value) => value.toUpperCase()} />;
    <Tabs as="section" className="c" style={{ opacity: 0.5 }} />;
    <Tabs aria-label="tabs" data-testid="tabs" direction="row" />;
  });
});
