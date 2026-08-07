import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

import { MenuItem } from ".";
import type { MenuItemProps } from ".";

describe("MenuItem types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<MenuItemProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<MenuItemProps["selected"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["icon"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["leadingIcon"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["trailingIcon"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["leadingComponent"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["trailingComponent"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["textProps"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["variant"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["size"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["px"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["gap"]>().not.toBeAny();
    expectTypeOf<MenuItemProps["className"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <MenuItem
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <MenuItem
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <MenuItem
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <MenuItem
      // @ts-expect-error not a button variant
      variant="notAVariant"
    />;
    <MenuItem
      // @ts-expect-error not a button size
      size="99"
    />;
    <MenuItem
      // @ts-expect-error selected takes boolean | null
      selected="yes"
    />;
  });

  it("accepts valid props", () => {
    <MenuItem
      variant="ghost"
      size="2"
      px="2"
      gap="1_5"
      justify="space-between"
      selected
      leadingIcon={{ icon: Bell, alt: "bell" }}
    />;
    <MenuItem as="a" href="/docs" />;
    <MenuItem
      className="c"
      style={{ opacity: 1 }}
      aria-label="item"
      data-testid="item"
    />;
    <MenuItem
      textProps={{ weight: "medium" }}
      trailingComponent={<span />}
      leadingComponent={<span />}
      onClick={() => {}}
    />;
  });
});
