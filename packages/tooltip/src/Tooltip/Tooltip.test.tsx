import { describe, it } from "vitest";

import type { TooltipProps } from "./Tooltip";

describe("Tooltip", () => {
  describe("type inheritance", () => {
    it("accepts valid tooltip-specific props", () => {
      const validProps: TooltipProps = {
        label: "Tooltip text",
        side: "top",
        enabled: true,
        appearance: "dark",
        children: null,
      };
      void validProps;
    });

    it("accepts disableFocusOpen prop", () => {
      const propsWithDisableFocusOpen: TooltipProps = {
        label: "Tooltip text",
        disableFocusOpen: true,
        children: null,
      };
      void propsWithDisableFocusOpen;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on TooltipProps
      const invalidProp: TooltipProps = {
        label: "test",
        invalidProp: "invalid",
        children: null,
      };
      void invalidProp;
    });
  });
});
