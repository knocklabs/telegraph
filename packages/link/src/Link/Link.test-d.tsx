import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

import { Link } from ".";
import type { LinkIconProps, LinkProps, LinkRootProps, LinkTextProps } from ".";

describe("Link types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<LinkProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<LinkRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<LinkTextProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<LinkIconProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<LinkProps["size"]>().not.toBeAny();
    expectTypeOf<LinkProps["color"]>().not.toBeAny();
    expectTypeOf<LinkProps["weight"]>().not.toBeAny();
    expectTypeOf<LinkProps["icon"]>().not.toBeAny();
    expectTypeOf<LinkProps["textProps"]>().not.toBeAny();
    expectTypeOf<LinkRootProps["size"]>().not.toBeAny();
    expectTypeOf<LinkRootProps["color"]>().not.toBeAny();
    expectTypeOf<LinkRootProps["weight"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Link
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Link
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Link.Root
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Link.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Link.Text
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Link.Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Link
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Link
      // @ts-expect-error not a link size
      size="99"
    />;
    <Link
      // @ts-expect-error not a link weight
      weight="ultra"
    />;
    <Link
      // @ts-expect-error not a text color token
      color="notAColor"
    />;
    <Link.Root
      // @ts-expect-error not a link size
      size="99"
    />;
    <Link.Text
      // @ts-expect-error not a text size
      size="99"
    />;
    <Link.Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not an icon size
      size="99"
    />;
  });

  it("accepts valid props", () => {
    <Link href="/docs" size="2" color="blue" weight="medium" p="2" mt="4" />;
    <Link as="button" onClick={() => {}} />;
    <Link icon={{ icon: Bell, alt: "bell" }} textProps={{ maxW: "40" }} />;
    // `textProps.as` swaps the rendered text element (covered in Link.test.tsx).
    <Link textProps={{ as: "strong", maxW: "40" }} />;
    <Link aria-label="docs" data-testid="docs" className="c" />;
    <Link style={{ opacity: 0.5 }}>Docs</Link>;
    <Link.Root href="/docs" size="3" color="accent" weight="regular" gap="1">
      <Link.Text size="2" color="accent">
        Docs
      </Link.Text>
      <Link.Icon icon={Bell} alt="bell" size="2" />
    </Link.Root>;
    <Link.Root as="span" className="c" style={{ opacity: 0.5 }} />;
    <Link.Text as="p" data-testid="text" />;
    <Link.Icon icon={Bell} aria-hidden color="blue" mr="1" />;
  });
});
