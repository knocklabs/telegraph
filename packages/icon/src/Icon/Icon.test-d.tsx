import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

import { Icon } from ".";
import type { IconProps, LucideIcon } from ".";

describe("Icon types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<IconProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<IconProps<"div">>().not.toHaveProperty("notARealProp");
    expectTypeOf<IconProps<"a">>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<IconProps["icon"]>().not.toBeAny();
    expectTypeOf<IconProps["icon"]>().toEqualTypeOf<LucideIcon>();
    expectTypeOf<IconProps["size"]>().not.toBeAny();
    expectTypeOf<IconProps["variant"]>().not.toBeAny();
    expectTypeOf<IconProps["color"]>().not.toBeAny();
    expectTypeOf<IconProps["animation"]>().not.toBeAny();
    // Inherited from Box's style props
    expectTypeOf<IconProps["p"]>().not.toBeAny();
    expectTypeOf<IconProps["bg"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Icon
      icon={Bell}
      aria-hidden
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Icon
      alt="bell"
      // @ts-expect-error not a lucide icon
      icon="Bell"
    />;
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not an icon size
      size="99"
    />;
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not an icon variant
      variant="tertiary"
    />;
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not an icon color
      color="notAColor"
    />;
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not a supported animation
      animation="bounce"
    />;
    <Icon
      icon={Bell}
      alt="bell"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Icon icon={Bell} alt="bell" size="3" variant="secondary" color="accent" />;
    <Icon icon={Bell} alt="bell" animation="spin" p="2" mt="4" bg="gray-2" />;
    <Icon icon={Bell} aria-hidden rounded="2" w="4" />;
    <Icon icon={Bell} alt="bell" as="div" />;
    <Icon icon={Bell} alt="bell" className="c" style={{ opacity: 0.5 }} />;
    <Icon icon={Bell} alt="bell" data-testid="icon" onClick={() => {}} />;
  });
});
