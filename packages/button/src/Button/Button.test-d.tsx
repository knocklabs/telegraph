import type { IconProps as TelegraphIconProps } from "@telegraph/icon";
import type { TextProps as TypographyTextProps } from "@telegraph/typography";
import { Bell } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

import { Button } from ".";
import type {
  ButtonIconProps,
  ButtonProps,
  ButtonRootProps,
  ButtonTextProps,
} from ".";

describe("Button types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<ButtonProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ButtonRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ButtonTextProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ButtonIconProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<ButtonProps["variant"]>().not.toBeAny();
    expectTypeOf<ButtonProps["size"]>().not.toBeAny();
    expectTypeOf<ButtonProps["color"]>().not.toBeAny();
    expectTypeOf<ButtonProps["state"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Button
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Button
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Button.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Button.Text
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Button.Icon
      icon={Bell}
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Button
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Button
      // @ts-expect-error not a button variant
      variant="notAVariant"
    />;
    <Button
      // @ts-expect-error not a button size
      size="99"
    />;
  });

  it("accepts valid props", () => {
    <Button variant="soft" size="1" color="accent" p="2" mt="4" />;
    <Button as="a" href="/docs" target="_blank" />;
    <Button disabled type="submit" onClick={() => {}} />;
    <Button aria-label="save" data-testid="save" className="c" />;
    <Button style={{ opacity: 0.5 }} state="loading" active />;
  });

  // Pins the KNO-14778 swap. `Button.Icon` widens icon's props on purpose —
  // dropping `internal_iconType` to "simplify" it would break icon placement.
  it("derives its sub-component props from the upstream exported types", () => {
    expectTypeOf<ButtonIconProps<"span">>().toEqualTypeOf<
      TelegraphIconProps<"span"> & {
        internal_iconType?: "leading" | "trailing";
      }
    >();
    expectTypeOf<ButtonTextProps<"span">["size"]>().toEqualTypeOf<
      TypographyTextProps<"span">["size"]
    >();
    expectTypeOf<ButtonTextProps<"span">["color"]>().toEqualTypeOf<
      TypographyTextProps<"span">["color"]
    >();
    expectTypeOf<ButtonTextProps<"span">["weight"]>().toEqualTypeOf<
      TypographyTextProps<"span">["weight"]
    >();
    // Re-declared, so it stays `T` rather than typography's
    // `OptionalAsPropConfig` pair.
    expectTypeOf<ButtonTextProps<"p">["as"]>().toEqualTypeOf<"p" | undefined>();
  });
});
