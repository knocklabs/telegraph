import { describe, expectTypeOf, it } from "vitest";

import { Stack } from ".";
import type { StackProps } from ".";

describe("Stack types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<StackProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<StackProps<"section">>().not.toHaveProperty("notARealProp");
    expectTypeOf<StackProps<"a">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<StackProps["direction"]>().not.toBeAny();
    expectTypeOf<StackProps["align"]>().not.toBeAny();
    expectTypeOf<StackProps["justify"]>().not.toBeAny();
    expectTypeOf<StackProps["wrap"]>().not.toBeAny();
    expectTypeOf<StackProps["gap"]>().not.toBeAny();
    expectTypeOf<StackProps["flexDirection"]>().not.toBeAny();
    expectTypeOf<StackProps["alignItems"]>().not.toBeAny();
    expectTypeOf<StackProps["justifyContent"]>().not.toBeAny();
    expectTypeOf<StackProps["flexWrap"]>().not.toBeAny();
    // Inherited from Box's style props
    expectTypeOf<StackProps["p"]>().not.toBeAny();
    expectTypeOf<StackProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Stack
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Stack
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Stack
      direction="column"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Stack
      as="section"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Stack
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <Stack
      // @ts-expect-error not an alignItems value
      align="middle"
    />;
    <Stack
      // @ts-expect-error not a justifyContent value
      justify="middle"
    />;
    <Stack
      // @ts-expect-error not a flexWrap value
      wrap="wrap-around"
    />;
    <Stack
      // @ts-expect-error not a spacing token
      gap={12345}
    />;
    <Stack
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Stack direction="column" align="center" justify="space-between" gap="2" />;
    <Stack wrap="wrap" flexDirection="row-reverse" alignItems="baseline" />;
    <Stack justifyContent="space-evenly" flexWrap="nowrap" gap="4" />;
    <Stack p="2" mt="4" bg="gray-2" rounded="2" w="full" />;
    <Stack as="section" id="section-id" />;
    <Stack as="a" href="/docs" target="_blank" />;
    <Stack className="c" style={{ opacity: 0.5 }} aria-label="stack" />;
    <Stack data-testid="stack" onClick={() => {}}>
      children
    </Stack>;
  });
});
