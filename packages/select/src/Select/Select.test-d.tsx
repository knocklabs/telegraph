import { Select } from ".";
import type { Option, OptionProps, SelectProps } from ".";
import type { Dispatch, SetStateAction } from "react";
import { describe, expectTypeOf, it } from "vitest";

// Declared at module scope: an initialized `const` would be narrowed by
// control flow to the value it holds, which is not what a consumer's state
// variable looks like at the call site.
declare const single: string;
declare const multi: Array<string>;
declare const optional: string | undefined;
declare const setSingle: Dispatch<SetStateAction<string | undefined>>;
declare const setMulti: Dispatch<SetStateAction<Array<string>>>;

describe("Select types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<SelectProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<OptionProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<Option>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<SelectProps["size"]>().not.toBeAny();
    expectTypeOf<SelectProps["value"]>().not.toBeAny();
    expectTypeOf<SelectProps["placeholder"]>().not.toBeAny();
    expectTypeOf<SelectProps["disabled"]>().not.toBeAny();
    expectTypeOf<SelectProps["clearable"]>().not.toBeAny();
    expectTypeOf<SelectProps["errored"]>().not.toBeAny();
    expectTypeOf<SelectProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<SelectProps["triggerProps"]>().not.toBeAny();
    expectTypeOf<SelectProps["contentProps"]>().not.toBeAny();
    expectTypeOf<SelectProps["optionsProps"]>().not.toBeAny();
    expectTypeOf<OptionProps["value"]>().not.toBeAny();
    expectTypeOf<OptionProps["selected"]>().not.toBeAny();
    expectTypeOf<Option["value"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Select.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Select.Root
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Select.Option
      value="1"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Select.Root
      // @ts-expect-error not a trigger size
      size="99"
    />;
    <Select.Root
      // @ts-expect-error placeholder is a string
      placeholder={12}
    />;
    <Select.Root
      // @ts-expect-error disabled is a boolean
      disabled="yes"
    />;
    <Select.Option
      // @ts-expect-error option value is a string
      value={12}
    />;
    <Select.Option
      value="1"
      // @ts-expect-error label is omitted from Select.Option
      label="Option 1"
    />;
  });

  it("narrows the reported value to the value it was given", () => {
    expectTypeOf<SelectProps<string>["onValueChange"]>().toEqualTypeOf<
      ((value: string) => void) | undefined
    >();
    expectTypeOf<SelectProps<Array<string>>["onValueChange"]>().toEqualTypeOf<
      ((value: Array<string>) => void) | undefined
    >();

    <Select.Root
      value={single}
      onValueChange={(value) => expectTypeOf(value).toEqualTypeOf<string>()}
    />;
    <Select.Root
      value={multi}
      onValueChange={(value) =>
        expectTypeOf(value).toEqualTypeOf<Array<string>>()
      }
    />;

    // The value type is inferred from `defaultValue` too, so uncontrolled
    // selects report the same narrowed shape.
    <Select.Root
      defaultValue={multi}
      onValueChange={(value) =>
        expectTypeOf(value).toEqualTypeOf<Array<string>>()
      }
    />;

    // The `useState` setter consumers reach for first, both controlled and —
    // falling back to the `string` default — uncontrolled.
    <Select.Root value={optional} onValueChange={setSingle} />;
    <Select.Root value={multi} onValueChange={setMulti} />;
    <Select.Root onValueChange={setSingle} />;
  });

  it("rejects handlers and values that disagree with the value type", () => {
    <Select.Root
      value={single}
      // @ts-expect-error a single-value select does not report an array
      onValueChange={(_value: Array<string>) => {}}
    />;
    <Select.Root
      value={multi}
      // @ts-expect-error a multi-value select does not report a bare string
      onValueChange={(_value: string) => {}}
    />;
    <Select.Root
      // @ts-expect-error select values are strings, not option objects
      value={{ value: "1", label: "Option 1" }}
    />;
    <Select.Root
      // @ts-expect-error legacyBehavior emits option objects Select cannot produce
      legacyBehavior
    />;
  });

  it("accepts valid props", () => {
    <Select.Root
      size="2"
      placeholder="Select an option"
      value="1"
      onValueChange={() => {}}
      disabled={false}
      clearable
      errored={false}
    >
      <Select.Option value="1">Option 1</Select.Option>
      <Select.Option value="2" selected>
        Option 2
      </Select.Option>
    </Select.Root>;
    <Select.Root
      defaultValue={["1", "2"]}
      modal={false}
      closeOnSelect
      defaultOpen={false}
      onOpenChange={() => {}}
      triggerProps={{ size: "1", placeholder: "Select an option" }}
      contentProps={{ maxHeight: "40" }}
      optionsProps={{ p: "1" }}
    />;
    <Select.Option value="1" className="c" style={{ opacity: 0.5 }} />;
    <Select.Option value="1" aria-label="one" data-testid="one" />;
  });
});
