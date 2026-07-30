import { TabPanel } from ".";
import type { TabPanelProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("TabPanel types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TabPanelProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TabPanelProps["value"]>().not.toBeAny();
    expectTypeOf<TabPanelProps["forceMount"]>().not.toBeAny();
    expectTypeOf<TabPanelProps["forceBackgroundMount"]>().not.toBeAny();
    expectTypeOf<TabPanelProps["p"]>().not.toBeAny();
    expectTypeOf<TabPanelProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <TabPanel
      value="a"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <TabPanel
      value="a"
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <TabPanel
      value="a"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <TabPanel
      // @ts-expect-error tab values are strings
      value={42}
    />;
    <TabPanel
      value="a"
      // @ts-expect-error not a forceBackgroundMount mode
      forceBackgroundMount="always"
    />;
    <TabPanel
      value="a"
      // @ts-expect-error forceMount is a boolean
      forceMount="yes"
    />;
  });

  it("accepts valid props", () => {
    <TabPanel value="a" forceMount forceBackgroundMount="once" p="2" />;
    <TabPanel value="a" as="section" className="c" style={{ opacity: 1 }} />;
    <TabPanel
      value="a"
      aria-label="panel"
      data-testid="panel"
      bg="surface-1"
    />;
  });
});
