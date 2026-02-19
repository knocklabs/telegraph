import { describe, it } from "vitest";

import { MenuItem } from "./MenuItem";
import type { MenuItemProps } from "./MenuItem";

describe("MenuItem", () => {
  describe("type inheritance", () => {
    it("accepts valid menu item props", () => {
      const validProps: MenuItemProps = {
        selected: true,
        leadingComponent: null,
        trailingComponent: null,
        children: "Menu item",
      };
      void validProps;
    });

    it("accepts inherited button/stack/layout props", () => {
      const validProps: MenuItemProps = {
        variant: "ghost",
        size: "2",
        gap: "1_5",
        padding: "2",
        children: "Menu item",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on MenuItemProps
      const invalidProp: MenuItemProps = { invalidProp: "invalid", children: "test" };
      void invalidProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on MenuItem JSX
      const invalid = <MenuItem invalidProp="invalid">Test</MenuItem>;
      void invalid;
    });
  });
});
