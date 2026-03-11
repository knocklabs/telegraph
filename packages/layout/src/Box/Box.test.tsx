import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, expectTypeOf, it } from "vitest";

import { Box } from "./Box";
import type { BoxProps } from "./Box";

describe("Box", () => {
  describe("borderColor", () => {
    it("applies borderColor correctly", () => {
      const { container } = render(<Box borderColor="red-11" />);
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-red-11)",
      });
    });

    it("applies borderTopColor correctly", () => {
      const { container } = render(<Box borderTopColor="red-11" />);
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-red-11) 0 0 0",
      });
    });

    it("applies borderBottomColor correctly", () => {
      const { container } = render(<Box borderBottomColor="blue-9" />);
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "0 0 var(--tgph-blue-9) 0",
      });
    });

    it("applies borderLeftColor correctly", () => {
      const { container } = render(<Box borderLeftColor="green-10" />);
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "0 0 0 var(--tgph-green-10)",
      });
    });

    it("applies borderRightColor correctly", () => {
      const { container } = render(<Box borderRightColor="yellow-11" />);
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "0 var(--tgph-yellow-11) 0 0",
      });
    });

    it("applies multiple directional borderColors correctly", () => {
      const { container } = render(
        <Box
          borderTopColor="red-11"
          borderBottomColor="blue-9"
          borderLeftColor="green-10"
          borderRightColor="yellow-11"
        />,
      );
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color":
          "var(--tgph-red-11) var(--tgph-yellow-11) var(--tgph-blue-9) var(--tgph-green-10)",
      });
    });

    it("borderColor is overridden by directional borderColors", () => {
      const { container } = render(
        <Box borderColor="gray-5" borderTopColor="red-11" />,
      );
      const box = container.querySelector(".tgph-box");

      // When both are set, the more specific directional value should win
      // This depends on the order of prop processing
      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-red-11) 0 0 0",
      });
    });

    it("maintains backward compatibility with existing borderColor", () => {
      const { container } = render(
        <Box
          borderColor="red-11"
          borderWidth="1"
          borderStyle="solid"
          padding="4"
        />,
      );
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-red-11)",
        "--border-width": "var(--tgph-spacing-1)",
        "--border-style": "var(--tgph-border-style-solid)",
        "--padding":
          "var(--tgph-spacing-4) var(--tgph-spacing-4) var(--tgph-spacing-4) var(--tgph-spacing-4)",
      });
    });

    it("borderTopColor written BEFORE borderColor - EDGE CASE: last wins", () => {
      // When borderTopColor comes before borderColor in JSX,
      // borderColor will overwrite the directional value
      const { container } = render(
        <Box borderTopColor="red-11" borderColor="gray-5" />,
      );
      const box = container.querySelector(".tgph-box");

      // This is a known limitation: borderColor (without direction) overwrites
      // the entire CSS variable, losing the directional value
      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-gray-5)",
      });
    });

    it("borderColor written BEFORE borderTopColor - directional overrides base", () => {
      // When borderColor comes before directional props,
      // the directional props properly override specific sides
      const { container } = render(
        <Box borderColor="gray-5" borderTopColor="red-11" />,
      );
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-red-11) 0 0 0",
      });
    });

    it("multiple directional props with base borderColor (proper order)", () => {
      const { container } = render(
        <Box
          borderColor="gray-5"
          borderTopColor="red-11"
          borderBottomColor="blue-9"
        />,
      );
      const box = container.querySelector(".tgph-box");

      expect(box).toHaveStyle({
        "--border-color": "var(--tgph-red-11) 0 var(--tgph-blue-9) 0",
      });
    });
  });

  describe("type inheritance", () => {
    it("accepts valid polymorphic props", () => {
      expectTypeOf<BoxProps<"a">["href"]>().toEqualTypeOf<string | undefined>();
      expectTypeOf<BoxProps<"button">["disabled"]>().toEqualTypeOf<
        boolean | undefined
      >();
    });

    it("accepts valid style props", () => {
      const validProps: BoxProps = {
        padding: "2",
        margin: "1",
        display: "flex",
      };
      void validProps;
    });

    it("accepts pseudo-class object props", () => {
      const validPseudo: BoxProps = {
        _hover: { backgroundColor: "gray-3" },
        _focus: { borderColor: "blue-5" },
      };
      void validPseudo;
    });

    it("accepts all pseudo states with various props", () => {
      const allStates: BoxProps = {
        _hover: { bg: "gray-3", shadow: "1" },
        _focus: { borderColor: "blue-5", p: "4" },
        _active: { bg: "red-3" },
        _focusWithin: { borderColor: "blue-8" },
        _disabled: { bg: "gray-2", rounded: "2" },
      };
      void allStates;
    });

    it("accepts shorthand props in pseudo objects", () => {
      const shorthands: BoxProps = {
        _hover: { p: "4", m: "2", rounded: "2", w: "10", h: "8" },
      };
      void shorthands;
    });

    it("rejects invalid color tokens in pseudo objects", () => {
      const invalid: BoxProps = {
        // @ts-expect-error invalid color token in hover
        _hover: { bg: "not-a-color" },
      };
      void invalid;
    });

    it("rejects unknown props in pseudo objects", () => {
      const invalid: BoxProps = {
        // @ts-expect-error unknown prop in hover
        _hover: { foo: "bar" },
      };
      void invalid;
    });

    it("rejects invalid spacing tokens in pseudo objects", () => {
      const invalid: BoxProps = {
        // @ts-expect-error invalid spacing token in hover
        _hover: { padding: "not-a-spacing-token" },
      };
      void invalid;
    });

    it("rejects invalid values in focus pseudo object", () => {
      const invalid: BoxProps = {
        // @ts-expect-error invalid color token in focus
        _focus: { borderColor: "fake-color" },
      };
      void invalid;
    });

    it("rejects invalid values in disabled pseudo object", () => {
      const invalid: BoxProps = {
        // @ts-expect-error invalid shadow token in disabled
        _disabled: { shadow: "not-a-shadow" },
      };
      void invalid;
    });
  });
});
