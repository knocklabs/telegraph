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
});
