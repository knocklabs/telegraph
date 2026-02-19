import { describe, expectTypeOf, it } from "vitest";

import { Stack } from "./Stack";
import type { StackProps } from "./Stack";

describe("Stack", () => {
  describe("type inheritance", () => {
    it("accepts valid polymorphic props", () => {
      expectTypeOf<StackProps<"a">["href"]>().toEqualTypeOf<
        string | undefined
      >();
    });

    it("accepts valid stack and box style props", () => {
      const validProps: StackProps = {
        direction: "row",
        gap: "2",
        padding: "2",
        display: "flex",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on StackProps
      const invalidProp: StackProps = { invalidProp: "invalid" };
      void invalidProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Stack JSX
      const invalid = <Stack invalidProp="invalid" />;
      void invalid;
    });
  });
});
