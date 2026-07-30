import { Spinner } from ".";
import type { SpinnerProps } from ".";
import { LoaderCircle } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

describe("Spinner types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<SpinnerProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<SpinnerProps<"div">>().not.toHaveProperty("notARealProp");
    expectTypeOf<SpinnerProps<"a">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<SpinnerProps["icon"]>().not.toBeAny();
    expectTypeOf<SpinnerProps["size"]>().not.toBeAny();
    expectTypeOf<SpinnerProps["variant"]>().not.toBeAny();
    expectTypeOf<SpinnerProps["color"]>().not.toBeAny();
    expectTypeOf<SpinnerProps["animation"]>().not.toBeAny();
    // Inherited from Box's style props
    expectTypeOf<SpinnerProps["p"]>().not.toBeAny();
    expectTypeOf<SpinnerProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Spinner
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Spinner
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Spinner
      size="3"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Spinner
      // @ts-expect-error not a lucide icon
      icon="LoaderCircle"
    />;
    <Spinner
      // @ts-expect-error not an icon size
      size="99"
    />;
    <Spinner
      // @ts-expect-error not an icon variant
      variant="tertiary"
    />;
    <Spinner
      // @ts-expect-error not an icon color
      color="notAColor"
    />;
    <Spinner
      // @ts-expect-error not a supported animation
      animation="bounce"
    />;
    <Spinner
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Spinner />;
    <Spinner size="4" variant="secondary" color="accent" animation="spin" />;
    <Spinner icon={LoaderCircle} alt="Loading..." p="2" mt="4" bg="gray-2" />;
    // `as` does not infer T (it sits behind `Partial<...>`), so it stays
    // pinned to the "span" default rather than widening like Icon's does.
    <Spinner rounded="2" w="4" as="span" />;
    <Spinner className="c" style={{ opacity: 0.5 }} aria-label="loading" />;
    <Spinner data-testid="spinner" onClick={() => {}} />;
  });
});
