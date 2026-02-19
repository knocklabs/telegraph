import { describe, expectTypeOf, it } from "vitest";

import { Input } from "./Input";
import type { InputProps, InputRootProps } from "./index";

describe("Input", () => {
  describe("type inheritance", () => {
    it("accepts valid input-specific props", () => {
      const validProps: InputRootProps = {
        size: "2",
        variant: "outline",
        errored: false,
      };
      void validProps;
    });

    it("accepts valid default props", () => {
      const validProps: InputProps = {
        size: "2",
        variant: "outline",
        LeadingComponent: null,
        TrailingComponent: null,
      };
      void validProps;
    });

    it("size prop accepts all valid tokens", () => {
      expectTypeOf<InputRootProps["size"]>().toEqualTypeOf<
        "1" | "2" | "3" | undefined
      >();
      const size1: InputRootProps = { size: "1" };
      const size2: InputRootProps = { size: "2" };
      const size3: InputRootProps = { size: "3" };
      void size1;
      void size2;
      void size3;
    });

    it("inherits HTML input attributes via Text", () => {
      const withPlaceholder: InputRootProps = { placeholder: "Enter text" };
      void withPlaceholder;

      const withType: InputRootProps = { type: "email" };
      void withType;
    });

    it("inherits layout style props from Text/Box", () => {
      const withLayout: InputRootProps = {
        w: "full",
        h: "full",
        bg: "transparent",
      };
      void withLayout;
    });

    it("rejects invalid prop values", () => {
      // @ts-expect-error invalid size token
      const invalidSize: InputRootProps = { size: "99" };
      void invalidSize;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on InputRootProps
      const invalidProp: InputRootProps = { invalidProp: "invalid" };
      void invalidProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Input JSX
      const invalid = <Input invalidProp="invalid" />;
      void invalid;

      // @ts-expect-error unknown prop rejected on Input.Root JSX
      const invalidRoot = <Input.Root invalidProp="invalid" />;
      void invalidRoot;
    });

    it("size prop works in JSX", () => {
      const small = <Input size="1" />;
      const medium = <Input size="2" />;
      const large = <Input size="3" />;
      void small;
      void medium;
      void large;
    });
  });
});
