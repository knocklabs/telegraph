import { TextArea } from ".";
import type { TextAreaProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("TextArea types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TextAreaProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TextAreaProps["size"]>().not.toBeAny();
    expectTypeOf<TextAreaProps["variant"]>().not.toBeAny();
    expectTypeOf<TextAreaProps["errored"]>().not.toBeAny();
    expectTypeOf<TextAreaProps["disabled"]>().not.toBeAny();
    expectTypeOf<TextAreaProps["resize"]>().not.toBeAny();
    expectTypeOf<TextAreaProps["textProps"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <TextArea
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <TextArea
      // @ts-expect-error unknown prop
      variantt="outline"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <TextArea
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <TextArea
      // @ts-expect-error not a textarea size
      size="99"
    />;
    <TextArea
      // @ts-expect-error not a textarea variant
      variant="notAVariant"
    />;
    <TextArea
      // @ts-expect-error not a resize value
      resize="diagonal"
    />;
    <TextArea
      // @ts-expect-error errored is a boolean
      errored="yes"
    />;
    <TextArea
      // @ts-expect-error TextArea only renders as a textarea
      as="div"
    />;
    <TextArea
      // @ts-expect-error not a font size token
      fontSize={16}
    />;
  });

  it("accepts valid props", () => {
    <TextArea size="2" variant="outline" resize="vertical" p="2" mt="4" />;
    <TextArea as="textarea" rows={4} placeholder="Notes" />;
    <TextArea disabled errored value="" onChange={() => {}} />;
    <TextArea aria-label="notes" data-testid="notes" className="c" />;
    <TextArea style={{ opacity: 0.5 }} textProps={{ placeholder: "hi" }} />;
  });
});
