import { Input } from ".";
import type {
  InputBaseRootProps,
  InputProps,
  InputRootProps,
  InputSlotProps,
} from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Input types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<InputProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<InputRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<InputBaseRootProps>().not.toHaveProperty("notARealProp");
    // TODO(KNO-14474): Input.Slot still accepts unknown props. InputSlotProps
    // derives from TgphSlotProps, which intersects `Record<string, unknown>`,
    // so the index signature swallows every key.
    // expectTypeOf<InputSlotProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<InputProps["size"]>().not.toBeAny();
    expectTypeOf<InputProps["variant"]>().not.toBeAny();
    expectTypeOf<InputProps["errored"]>().not.toBeAny();
    expectTypeOf<InputProps["LeadingComponent"]>().not.toBeAny();
    expectTypeOf<InputProps["TrailingComponent"]>().not.toBeAny();
    expectTypeOf<InputBaseRootProps["size"]>().not.toBeAny();
    expectTypeOf<InputBaseRootProps["variant"]>().not.toBeAny();
    expectTypeOf<InputBaseRootProps["errored"]>().not.toBeAny();
    expectTypeOf<InputRootProps["size"]>().not.toBeAny();
    expectTypeOf<InputRootProps["variant"]>().not.toBeAny();
    expectTypeOf<InputRootProps["textProps"]>().not.toBeAny();
    expectTypeOf<InputRootProps["stackProps"]>().not.toBeAny();
    expectTypeOf<InputSlotProps["position"]>().not.toBeAny();
    expectTypeOf<InputSlotProps["size"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Input
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Input.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    // TODO(KNO-14474): Input.Slot still accepts unknown props — its
    // `Record<string, unknown>` index signature disables excess-property checks.
    // <Input.Slot
    //   // @ts-expect-error unknown prop
    //   notARealProp="x"
    // />;
  });

  it("rejects invalid values for declared props", () => {
    <Input
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Input
      // @ts-expect-error not an input size
      size="99"
    />;
    <Input
      // @ts-expect-error not an input variant
      variant="notAVariant"
    />;
    <Input
      // @ts-expect-error errored is a boolean
      errored="yes"
    />;
    <Input
      // @ts-expect-error not a font size token
      fontSize={16}
    />;
    <Input.Root
      // @ts-expect-error not an input size
      size="99"
    />;
    // TODO(KNO-14474): Input.Slot still accepts invalid values for declared
    // props — forwardRef's PropsWithoutRef collapses the intersection down to
    // the inherited index signature, erasing `position`'s union.
    // <Input.Slot
    //   // @ts-expect-error not a slot position
    //   position="middle"
    // />;
  });

  it("accepts valid props", () => {
    <Input size="2" variant="outline" errored p="2" mt="4" />;
    <Input placeholder="Email" value="" onChange={() => {}} disabled />;
    <Input aria-label="email" data-testid="email" className="c" />;
    <Input style={{ opacity: 0.5 }} type="email" name="email" />;
    <Input
      LeadingComponent={<span>@</span>}
      TrailingComponent={<span>.com</span>}
    />;
    <Input.Root size="3" variant="ghost" stackProps={{ gap: "1" }}>
      <Input.Slot position="trailing" size="3">
        <span>x</span>
      </Input.Slot>
    </Input.Root>;
    <Input.Slot position="leading">
      <span>x</span>
    </Input.Slot>;
  });
});
