import { ChevronRight } from "lucide-react";
import { describe, it } from "vitest";

import type {
  MenuContentProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
} from "./index";

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

  describe("Sub type inheritance", () => {
    it("accepts controlled open props", () => {
      const validProps: MenuSubProps = {
        open: true,
        onOpenChange: () => {},
      };
      void validProps;
    });

    it("accepts defaultOpen for uncontrolled use", () => {
      const validProps: MenuSubProps = { defaultOpen: true };
      void validProps;
    });

    it("rejects mistyped known props", () => {
      // @ts-expect-error open must be a boolean, not a string
      const invalidProps: MenuSubProps = { open: "yes" };
      void invalidProps;
    });
  });

  describe("SubTrigger type inheritance", () => {
    it("accepts menu-item props (icon, disabled, children)", () => {
      const validProps: MenuSubTriggerProps = {
        leadingIcon: { icon: ChevronRight, "aria-hidden": true },
        trailingIcon: { icon: ChevronRight, "aria-hidden": true },
        disabled: true,
        children: "Recent files",
      };
      void validProps;
    });

    it("rejects mistyped known props", () => {
      // @ts-expect-error disabled must be a boolean, not a string
      const invalidProp: MenuSubTriggerProps = { disabled: "yes" };
      void invalidProp;
    });
  });

  describe("SubContent type inheritance", () => {
    it("accepts positioning and stack/layout props", () => {
      const validProps: MenuSubContentProps = {
        sideOffset: 0,
        alignOffset: -4,
        gap: "2",
        rounded: "4",
      };
      void validProps;
    });

    it("rejects mistyped known props", () => {
      // @ts-expect-error sideOffset must be a number, not a string
      const invalidProp: MenuSubContentProps = { sideOffset: "4" };
      void invalidProp;
    });
  });
});
