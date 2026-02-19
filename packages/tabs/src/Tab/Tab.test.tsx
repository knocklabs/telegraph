import { describe, it } from "vitest";

import { Tab } from "./Tab";
import type { TabProps } from "./Tab";

describe("Tab", () => {
  describe("type inheritance", () => {
    it("accepts valid tab-specific props", () => {
      const validProps: TabProps = {
        value: "tab-1",
        children: "Tab 1",
      };
      void validProps;
    });

    it("accepts inherited button/menu props", () => {
      const validProps: TabProps = {
        value: "tab-1",
        variant: "ghost",
        size: "2",
        children: "Tab 1",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on TabProps
      const invalidProp: TabProps = {
        value: "tab-1",
        invalidProp: "invalid",
        children: "test",
      };
      void invalidProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Tab JSX
      const invalid = (
        <Tab value="tab-1" invalidProp="invalid">
          Test
        </Tab>
      );
      void invalid;
    });
  });
});
