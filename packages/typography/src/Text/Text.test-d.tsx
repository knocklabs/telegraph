import type { CSSProperties } from "react";
import { describe, expectTypeOf, it } from "vitest";

import { Text } from ".";
import type { TextProps } from ".";

describe("Text types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TextProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TextProps<"p">>().not.toHaveProperty("notARealProp");
    expectTypeOf<TextProps<"a">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TextProps["size"]>().not.toBeAny();
    expectTypeOf<TextProps["color"]>().not.toBeAny();
    expectTypeOf<TextProps["weight"]>().not.toBeAny();
    expectTypeOf<TextProps["align"]>().not.toBeAny();
    expectTypeOf<TextProps["family"]>().not.toBeAny();
    expectTypeOf<TextProps["leading"]>().not.toBeAny();
    expectTypeOf<TextProps["tracking"]>().not.toBeAny();
    expectTypeOf<TextProps["textOverflow"]>().not.toBeAny();
    // Inherited from Box's style props
    expectTypeOf<TextProps["p"]>().not.toBeAny();
    expectTypeOf<TextProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Text
      as="span"
      // @ts-expect-error unknown prop
      fontSizes={16}
    />;
    <Text
      as="span"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Text
      as="p"
      size="3"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Text
      as="span"
      // @ts-expect-error not a text size
      size="99"
    />;
    <Text
      as="span"
      // @ts-expect-error not a text color
      color="notAColor"
    />;
    <Text
      as="span"
      // @ts-expect-error not a weight token
      weight="ultra-heavy"
    />;
    <Text
      as="span"
      // @ts-expect-error not a supported alignment
      align="justify"
    />;
    <Text
      as="span"
      // @ts-expect-error not a family token
      family="comic"
    />;
    <Text
      as="span"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Text as="span" size="3" color="gray" weight="medium" align="center" />;
    <Text as="p" family="mono" leading="2" tracking="2" textOverflow="clip" />;
    <Text as="p" p="2" mt="4" bg="gray-2" rounded="2" w="full" />;
    <Text as="a" href="/docs" target="_blank" />;
    <Text as="label" htmlFor="input-id" />;
    <Text as="span" className="c" style={{ opacity: 0.5 }} aria-label="text" />;
    <Text as="span" data-testid="text" onClick={() => {}}>
      children
    </Text>;
  });

  it("accepts style from a CSSProperties value, not only a literal", () => {
    const declared: CSSProperties = { color: "red" };
    const Wrapper = ({ style }: { style?: CSSProperties }) => (
      <Text as="p" style={style} />
    );

    <Text as="p" style={declared} />;
    <Wrapper />;
    // The custom-property half still has to work.
    <Text as="p" style={{ "--tgph-x": "1px" }} />;
    <Text
      as="p"
      // @ts-expect-error not a CSS property
      style={{ colr: "red" }}
    />;
  });
});
