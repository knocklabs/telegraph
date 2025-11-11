import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Box } from "./Box";

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
});
