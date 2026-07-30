import { LoaderCircle } from "lucide-react";
import { forwardRef } from "react";
import { describe, expectTypeOf, it } from "vitest";

import { Spinner } from ".";
import type { SpinnerProps } from ".";

// Stands in for `next/link`: takes `href` and renders an anchor.
const RouterLink = forwardRef<
  HTMLAnchorElement,
  { href: string; children?: React.ReactNode }
>(({ href, ...props }, ref) => <a href={href} ref={ref} {...props} />);
RouterLink.displayName = "RouterLink";

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
    <Spinner rounded="2" w="4" as="span" />;
    <Spinner className="c" style={{ opacity: 0.5 }} aria-label="loading" />;
    <Spinner data-testid="spinner" onClick={() => {}} />;
  });

  it("renders as another element", () => {
    // `as` used to sit behind `Partial<...>`, a mapped type, so it could never
    // infer `T` and stayed pinned to the "span" default.
    <Spinner as="div" />;
    <Spinner as={RouterLink} href="/loading" />;
    // @ts-expect-error RouterLink requires href
    <Spinner as={RouterLink} />;
  });
});
