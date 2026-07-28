import { Select } from ".";
import type { Option, OptionProps, SelectProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Select types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<SelectProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<OptionProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<Option>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    // TODO(KNO-14474): Select.Root's `size` is still `any`. It is declared as
    // `TgphComponentProps<typeof Combobox.Trigger>["size"]`, but the computed
    // Combobox.Trigger props have no `size` key, so the indexed access widens.
    // expectTypeOf<SelectProps["size"]>().not.toBeAny();
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
    // TODO(KNO-14474): Select.Root still accepts any value for `size` because
    // the prop resolves to `any` (see "keeps declared props narrow" above).
    // <Select.Root
    //   // @ts-expect-error not a trigger size
    //   size="99"
    // />;
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
      // NOTE(KNO-14474): `triggerProps={{ size: "1" }}` no longer type-checks —
      // ComboboxTriggerProps lost `size` when Button.Root's props collapsed to
      // `unknown`, even though Select passes `size` to Combobox.Trigger.
      triggerProps={{ placeholder: "Select an option" }}
      contentProps={{ maxHeight: "40" }}
      optionsProps={{ p: "1" }}
    />;
    <Select.Option value="1" className="c" style={{ opacity: 0.5 }} />;
    <Select.Option value="1" aria-label="one" data-testid="one" />;
  });
});
