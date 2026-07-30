import { describe, expectTypeOf, it } from "vitest";

import { Box } from ".";
import type { BoxProps } from ".";

describe("Box types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<BoxProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<BoxProps<"section">>().not.toHaveProperty("notARealProp");
    expectTypeOf<BoxProps<"a">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<BoxProps["display"]>().not.toBeAny();
    expectTypeOf<BoxProps["p"]>().not.toBeAny();
    expectTypeOf<BoxProps["m"]>().not.toBeAny();
    expectTypeOf<BoxProps["bg"]>().not.toBeAny();
    expectTypeOf<BoxProps["rounded"]>().not.toBeAny();
    expectTypeOf<BoxProps["shadow"]>().not.toBeAny();
    expectTypeOf<BoxProps["position"]>().not.toBeAny();
    expectTypeOf<BoxProps["overflow"]>().not.toBeAny();
    expectTypeOf<BoxProps["w"]>().not.toBeAny();
    expectTypeOf<BoxProps["className"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Box
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Box
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Box
      as="section"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Box
      p="2"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Box
      _hover={{
        // @ts-expect-error unknown prop inside pseudo object
        notARealProp: "x",
      }}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Box
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Box
      // @ts-expect-error not a spacing token
      m="not-a-spacing-token"
    />;
    <Box
      // @ts-expect-error not a color token
      bg="notAColor"
    />;
    <Box
      // @ts-expect-error grid is not a supported display value
      display="grid"
    />;
    <Box
      // @ts-expect-error static is not a supported position value
      position="static"
    />;
    <Box
      // @ts-expect-error not a rounded token
      rounded="99"
    />;
    <Box
      _hover={{
        // @ts-expect-error not a color token
        bg: "notAColor",
      }}
    />;
  });

  it("accepts valid props", () => {
    <Box p="2" mt="4" bg="gray-2" rounded="2" shadow="1" w="full" />;
    <Box display="flex" position="relative" overflow="hidden" top="0" />;
    <Box m="-2" mx="-4" borderColor="gray-6" border="px" borderStyle="solid" />;
    <Box as="section" id="section-id" />;
    <Box as="a" href="/docs" target="_blank" />;
    <Box _hover={{ bg: "gray-3" }} _focus={{ shadow: "2" }} />;
    <Box className="c" style={{ opacity: 0.5 }} aria-label="box" />;
    <Box data-testid="box" onClick={() => {}}>
      children
    </Box>;
  });
});
