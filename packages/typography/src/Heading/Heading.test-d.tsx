import type { TgphComponentProps } from "@telegraph/helpers";
import type { BoxProps } from "@telegraph/layout";
import { describe, expectTypeOf, it } from "vitest";

import { Heading } from ".";
import type { HeadingProps } from ".";

describe("Heading types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<HeadingProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<HeadingProps<"h1">>().not.toHaveProperty("notARealProp");
    expectTypeOf<HeadingProps<"span">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<HeadingProps["size"]>().not.toBeAny();
    expectTypeOf<HeadingProps["color"]>().not.toBeAny();
    expectTypeOf<HeadingProps["weight"]>().not.toBeAny();
    expectTypeOf<HeadingProps["align"]>().not.toBeAny();
    expectTypeOf<HeadingProps["family"]>().not.toBeAny();
    expectTypeOf<HeadingProps["leading"]>().not.toBeAny();
    expectTypeOf<HeadingProps["tracking"]>().not.toBeAny();
    expectTypeOf<HeadingProps["textOverflow"]>().not.toBeAny();
    // Inherited from Box's style props
    expectTypeOf<HeadingProps["p"]>().not.toBeAny();
    expectTypeOf<HeadingProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Heading
      as="h2"
      // @ts-expect-error unknown prop
      fontSizes={16}
    />;
    <Heading
      as="h2"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Heading
      as="h1"
      size="6"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Heading
      as="h2"
      // @ts-expect-error not a heading size
      size="99"
    />;
    <Heading
      as="h2"
      // @ts-expect-error not a heading color
      color="notAColor"
    />;
    <Heading
      as="h2"
      // @ts-expect-error not a weight token
      weight="ultra-heavy"
    />;
    <Heading
      as="h2"
      // @ts-expect-error not a supported alignment
      align="justify"
    />;
    <Heading
      as="h2"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Heading as="h1" size="6" color="gray" weight="semi-bold" align="center" />;
    <Heading as="h2" family="sans" leading="2" tracking="2" />;
    <Heading as="h3" textOverflow="ellipsis" p="2" mt="4" bg="gray-2" />;
    <Heading as="span" rounded="2" w="full" />;
    <Heading as="a" href="/docs" target="_blank" />;
    <Heading as="h2" className="c" style={{ opacity: 0.5 }} aria-level={2} />;
    <Heading as="h2" data-testid="heading" onClick={() => {}}>
      children
    </Heading>;
  });

  // See the matching test in Text.test-d.tsx.
  it("inherits Box's props at Box's own types", () => {
    expectTypeOf<HeadingProps<"h3">["p"]>().toEqualTypeOf<
      BoxProps<"h3">["p"]
    >();
    expectTypeOf<HeadingProps<"h3">["bg"]>().toEqualTypeOf<
      BoxProps<"h3">["bg"]
    >();
    expectTypeOf<HeadingProps<"h3">["tgphRef"]>().toEqualTypeOf<
      BoxProps<"h3">["tgphRef"]
    >();
  });

  // Downstream packages reach these props through the exported alias, not
  // `TgphComponentProps<typeof Heading<T>>` (KNO-14778). They must not drift.
  it("is exactly the component's own props", () => {
    expectTypeOf<HeadingProps<"h2">>().toEqualTypeOf<
      TgphComponentProps<typeof Heading<"h2">>
    >();
    expectTypeOf<HeadingProps<"h3">>().toEqualTypeOf<
      TgphComponentProps<typeof Heading<"h3">>
    >();
  });
});
