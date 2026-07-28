import { Checkbox } from ".";
import type {
  CheckboxColor,
  CheckboxControlProps,
  CheckboxLabelProps,
  CheckboxProps,
  CheckboxRootBaseProps,
  CheckboxRootProps,
  CheckboxSize,
} from ".";
import { describe, expectTypeOf, it } from "vitest";

import { CheckboxGroup } from "../CheckboxGroup";
import type {
  CheckboxGroupBaseProps,
  CheckboxGroupProps,
} from "../CheckboxGroup";

describe("Checkbox types", () => {
  it("has no catch-all index signature", () => {
    // TODO(KNO-14474): CheckboxProps and CheckboxRootProps inherit Stack's
    // props, which today carry a `{ [x: string]: any }` index signature. Enable
    // once PR #922 lands the `PolymorphicProps` fix. The types below don't
    // inherit from Stack, so they're already closed.
    // expectTypeOf<CheckboxProps>().not.toHaveProperty("notARealProp");
    // expectTypeOf<CheckboxRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<CheckboxRootBaseProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<CheckboxControlProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<CheckboxLabelProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<CheckboxSize>().not.toBeAny();
    expectTypeOf<CheckboxColor>().not.toBeAny();
    expectTypeOf<CheckboxProps["size"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["color"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["value"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["indeterminate"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["parent"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["formValue"]>().not.toBeAny();
    expectTypeOf<CheckboxProps["label"]>().not.toBeAny();
    expectTypeOf<CheckboxRootProps["value"]>().not.toBeAny();
    expectTypeOf<CheckboxRootProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<CheckboxRootBaseProps["size"]>().not.toBeAny();
    expectTypeOf<CheckboxRootBaseProps["formValue"]>().not.toBeAny();
  });

  it("types value as a boolean and formValue as a string", () => {
    expectTypeOf<CheckboxProps["value"]>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<CheckboxProps["defaultValue"]>().toEqualTypeOf<
      boolean | undefined
    >();
    expectTypeOf<CheckboxProps["formValue"]>().toEqualTypeOf<
      string | undefined
    >();
  });

  // KNO-14309 / PR #895: Base UI's callbacks take a second `eventDetails`
  // argument, and wrapping them can collapse sibling callback params to `any`
  // at the JSX call site. An `any` param satisfies every ordinary assignment,
  // so only an explicit assertion catches it.
  it("takes a boolean in onValueChange, never any", () => {
    expectTypeOf<NonNullable<CheckboxProps["onValueChange"]>>()
      .parameter(0)
      .toEqualTypeOf<boolean>();
    expectTypeOf<
      Parameters<NonNullable<CheckboxProps["onValueChange"]>>
    >().toEqualTypeOf<[boolean]>();
  });

  it("rejects unknown props", () => {
    // TODO(KNO-14474): Checkbox.Default and Checkbox.Root accept anything while
    // Stack's catch-all index signature is in place. Enable with PR #922.
    // <Checkbox.Default
    //   // @ts-expect-error unknown prop
    //   fontSize={16}
    // />;
    // <Checkbox.Default
    //   // @ts-expect-error unknown prop
    //   notARealProp="x"
    // />;
    // <Checkbox.Root
    //   // @ts-expect-error unknown prop
    //   notARealProp="x"
    // />;
    <Checkbox.Control
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Checkbox.Label
      as="label"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    // TODO(KNO-14474): `p` is inherited from Stack, so it degrades to `any`
    // along with the rest of the catch-all. Enable with PR #922. The props
    // declared on Checkbox itself still narrow correctly, below.
    // <Checkbox.Default
    //   // @ts-expect-error not a spacing token
    //   p={12345}
    // />;
    <Checkbox.Default
      // @ts-expect-error not a checkbox size
      size="3"
    />;
    <Checkbox.Default
      // @ts-expect-error not a checkbox color
      color="notAColor"
    />;
    <Checkbox.Default
      // @ts-expect-error value must be a boolean
      value="yes"
    />;
    <Checkbox.Default
      // @ts-expect-error formValue must be a string
      formValue={1}
    />;
    <Checkbox.Default
      // @ts-expect-error onValueChange receives a boolean
      onValueChange={(value: string) => value}
    />;
  });

  it("still accepts valid usage", () => {
    <Checkbox.Default label="Cancel run" />;
    <Checkbox.Default
      label="Cancel run"
      size="1"
      color="red"
      defaultValue
      name="run"
      formValue="run_1"
      disabled
      p="2"
    />;
    // TODO(KNO-14474): the props type says `(value: boolean) => void` — asserted
    // above — but at the JSX call site the parameter still widens to `any`,
    // because the catch-all index signature wins during inference. This is the
    // KNO-14309 shape, and it is the assertion that actually guards it. Enable
    // with PR #922.
    // <Checkbox.Default
    //   label="Cancel run"
    //   value={true}
    //   onValueChange={(value) => {
    //     expectTypeOf(value).toEqualTypeOf<boolean>();
    //   }}
    // />;
    <Checkbox.Default label="Cancel run" value={true} />;
    <Checkbox.Root aria-label="Select row">
      <Checkbox.Control />
      <Checkbox.Label>Select row</Checkbox.Label>
    </Checkbox.Root>;
  });
});

describe("CheckboxGroup types", () => {
  it("has no catch-all index signature", () => {
    // TODO(KNO-14474): same Stack inheritance as CheckboxProps. Enable with #922.
    // expectTypeOf<CheckboxGroupProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<CheckboxGroupBaseProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<CheckboxGroupProps["value"]>().not.toBeAny();
    expectTypeOf<CheckboxGroupProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<CheckboxGroupProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<CheckboxGroupProps["allValues"]>().not.toBeAny();
    expectTypeOf<CheckboxGroupProps["size"]>().not.toBeAny();
    expectTypeOf<CheckboxGroupProps["color"]>().not.toBeAny();
  });

  it("types the selection as a string array", () => {
    expectTypeOf<CheckboxGroupProps["value"]>().toEqualTypeOf<
      string[] | undefined
    >();
    expectTypeOf<NonNullable<CheckboxGroupProps["onValueChange"]>>()
      .parameter(0)
      .toEqualTypeOf<string[]>();
    expectTypeOf<
      Parameters<NonNullable<CheckboxGroupProps["onValueChange"]>>
    >().toEqualTypeOf<[string[]]>();
  });

  it("rejects unknown props and invalid values", () => {
    // TODO(KNO-14474): accepts anything via Stack's catch-all. Enable with #922.
    // <CheckboxGroup
    //   // @ts-expect-error unknown prop
    //   notARealProp="x"
    // />;
    <CheckboxGroup
      // @ts-expect-error value is a list of keys, not a boolean
      value={true}
    />;
    <CheckboxGroup
      // @ts-expect-error not a checkbox size
      size="3"
    />;
  });

  it("still accepts valid usage", () => {
    <CheckboxGroup
      value={["run-1"]}
      allValues={["run-1", "run-2"]}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<string[]>();
      }}
      size="2"
      color="blue"
      direction="column"
      gap="2"
    >
      <Checkbox.Default parent label="Select all" />
      <Checkbox.Default name="run-1" label="run-1" />
    </CheckboxGroup>;
  });
});
