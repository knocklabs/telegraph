import { describe, it } from "vitest";

import type { MenuContentProps } from "./index";

describe("Menu", () => {
  describe("type inheritance", () => {
    it("accepts valid content-specific props", () => {
      const validProps: MenuContentProps = {
        sideOffset: 4,
      };
      void validProps;
    });

    it("accepts inherited stack/layout props", () => {
      const validProps: MenuContentProps = {
        gap: "2",
        padding: "4",
        rounded: "4",
        bg: "surface-1",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on MenuContentProps
      const invalidProp: MenuContentProps = { invalidProp: "invalid" };
      void invalidProp;
    });
  });
});
