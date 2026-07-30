import { TabList } from ".";
import type { TabListProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("TabList types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TabListProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TabListProps["loop"]>().not.toBeAny();
    expectTypeOf<TabListProps["activateOnFocus"]>().not.toBeAny();
    expectTypeOf<TabListProps["gap"]>().not.toBeAny();
    expectTypeOf<TabListProps["justify"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <TabList
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <TabList
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <TabList
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <TabList
      // @ts-expect-error loop is a boolean
      loop="yes"
    />;
    <TabList
      // @ts-expect-error activateOnFocus is a boolean
      activateOnFocus="yes"
    />;
  });

  it("accepts valid props", () => {
    <TabList loop activateOnFocus gap="2" px="1" />;
    <TabList as="nav" className="c" style={{ gap: 4 }} aria-label="tabs" />;
    <TabList data-testid="list" justify="center" />;
  });
});
