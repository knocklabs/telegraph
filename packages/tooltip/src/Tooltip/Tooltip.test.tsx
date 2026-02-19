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

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on TooltipProps
      const invalidProp: TooltipProps = { label: "test", invalidProp: "invalid", children: null };
      void invalidProp;
    });
  });
});
