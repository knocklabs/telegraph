import { Code } from ".";
import type { CodeProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Code types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<CodeProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<CodeProps<"pre">>().not.toHaveProperty("notARealProp");
    expectTypeOf<CodeProps<"span">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<CodeProps["variant"]>().not.toBeAny();
    expectTypeOf<CodeProps["size"]>().not.toBeAny();
    expectTypeOf<CodeProps["color"]>().not.toBeAny();
    expectTypeOf<CodeProps["weight"]>().not.toBeAny();
    expectTypeOf<CodeProps["align"]>().not.toBeAny();
    expectTypeOf<CodeProps["family"]>().not.toBeAny();
    expectTypeOf<CodeProps["textOverflow"]>().not.toBeAny();
    // Inherited from Box's style props
    expectTypeOf<CodeProps["p"]>().not.toBeAny();
    expectTypeOf<CodeProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Code
      as="code"
      // @ts-expect-error unknown prop
      fontSizes={16}
    />;
    <Code
      as="code"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Code
      as="pre"
      variant="ghost"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Code
      as="code"
      // @ts-expect-error not a code variant
      variant="notAVariant"
    />;
    <Code
      as="code"
      // @ts-expect-error not a code size
      size="99"
    />;
    <Code
      as="code"
      // @ts-expect-error not a code color
      color="notAColor"
    />;
    <Code
      as="code"
      // @ts-expect-error not a weight token
      weight="ultra-heavy"
    />;
    <Code
      as="code"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Code as="code" variant="soft" size="1" color="gray" weight="regular" />;
    <Code as="pre" variant="ghost" align="left" family="mono" />;
    <Code as="code" textOverflow="ellipsis" p="2" mt="4" bg="gray-2" />;
    <Code as="span" rounded="2" w="full" />;
    <Code as="a" href="/docs" target="_blank" />;
    <Code as="code" className="c" style={{ opacity: 0.5 }} aria-label="code" />;
    <Code as="code" data-testid="code" onClick={() => {}}>
      children
    </Code>;
  });
});
