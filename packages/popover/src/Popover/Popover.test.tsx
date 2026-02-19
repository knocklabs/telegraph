import { describe, it } from "vitest";

import type { PopoverContentProps } from "./index";

describe("Popover", () => {
  describe("type inheritance", () => {
    it("accepts valid content-specific props", () => {
      const validProps: PopoverContentProps = {
        side: "bottom",
        sideOffset: 4,
        skipAnimation: true,
      };
      void validProps;
    });

    it("accepts inherited stack/layout props", () => {
      const validProps: PopoverContentProps = {
        gap: "2",
        padding: "4",
        rounded: "4",
        bg: "surface-1",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on PopoverContentProps
      const invalidProp: PopoverContentProps = { invalidProp: "invalid" };
      void invalidProp;
    });
  });
});
