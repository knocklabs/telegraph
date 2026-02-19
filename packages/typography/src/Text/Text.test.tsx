import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, expectTypeOf, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import type { TextProps } from "./Text";

import { Text } from "./Text";

describe("Text", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(<Text as="p">Text</Text>);
    expectToHaveNoViolations(await axe(container));
  });
  it("size props applies correct className", () => {
    const { container } = render(
      <Text size="9" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--font-size": "var(--tgph-text-9)",
    });
  });
  it("color props applies correct className", () => {
    const { container } = render(
      <Text color="red" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--color": "var(--tgph-red-11)",
    });
  });
  it("align props applies correct className", () => {
    const { container } = render(
      <Text align="left" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--text-align": "left",
    });
  });
  it("weight props applies correct className", () => {
    const { container } = render(
      <Text weight="medium" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--weight": "var(--tgph-weight-medium)",
    });
  });
  it("default props applies correct className", () => {
    const { container } = render(<Text as="p">Text</Text>);
    expect(container.firstChild).toHaveStyle({
      "--font-size": "var(--tgph-text-2)",
      "--leading": "var(--tgph-leading-2)",
      "--tracking": "var(--tgph-tracking-2)",
      "--weight": "var(--tgph-weight-regular)",
    });
  });

  describe("type inheritance", () => {
    it("accepts valid polymorphic props", () => {
      expectTypeOf<TextProps<"a">["href"]>().toEqualTypeOf<
        string | undefined
      >();
      expectTypeOf<TextProps<"label">["htmlFor"]>().toEqualTypeOf<
        string | undefined
      >();
    });

    it("accepts valid typography and layout props", () => {
      const validProps: TextProps<"span"> = {
        as: "span",
        size: "2",
        weight: "bold",
        color: "gray",
        padding: "1",
      };
      void validProps;
    });

    it("rejects invalid prop values", () => {
      // @ts-expect-error invalid size token
      const invalidSize: TextProps<"span"> = { as: "span", size: "99" };
      void invalidSize;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on TextProps
      const invalidProp: TextProps<"span"> = {
        as: "span",
        invalidProp: "invalid",
      };
      void invalidProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Text JSX
      const invalid = <Text as="span" invalidProp="invalid" />;
      void invalid;
    });
  });
});
