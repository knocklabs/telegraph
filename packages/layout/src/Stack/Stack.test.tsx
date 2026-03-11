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

  describe("pseudo-class types", () => {
    it("accepts Box style props in pseudo objects", () => {
      const valid: StackProps = {
        _hover: { backgroundColor: "gray-3", borderColor: "blue-5" },
        _focus: { bg: "blue-2", shadow: "1" },
        _active: { bg: "red-3" },
        _focusWithin: { borderColor: "blue-8" },
        _disabled: { bg: "gray-2" },
      };
      void valid;
    });

    it("accepts shorthand props in pseudo objects", () => {
      const valid: StackProps = {
        _hover: { p: "4", m: "2", rounded: "2", w: "10" },
      };
      void valid;
    });

    it("rejects invalid color tokens in pseudo objects", () => {
      const invalid: StackProps = {
        // @ts-expect-error invalid color token in hover
        _hover: { bg: "not-a-color" },
      };
      void invalid;
    });

    it("rejects unknown props in pseudo objects", () => {
      const invalid: StackProps = {
        // @ts-expect-error unknown prop in hover
        _hover: { foo: "bar" },
      };
      void invalid;
    });

    it("rejects invalid spacing tokens in pseudo objects", () => {
      const invalid: StackProps = {
        // @ts-expect-error invalid spacing token in focus
        _focus: { padding: "not-a-spacing-token" },
      };
      void invalid;
    });
  });
});
