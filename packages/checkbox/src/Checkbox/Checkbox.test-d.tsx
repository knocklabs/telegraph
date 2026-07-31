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
import type { CheckboxRootChangeEventDetails } from "@base-ui/react/checkbox";
import type { CheckboxGroupChangeEventDetails } from "@base-ui/react/checkbox-group";
import type { RefObject } from "react";
import { describe, expectTypeOf, it } from "vitest";

import { CheckboxGroup } from "../CheckboxGroup";
import type {
  CheckboxGroupBaseProps,
  CheckboxGroupProps,
} from "../CheckboxGroup";

describe("Checkbox types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<CheckboxProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<CheckboxRootProps>().not.toHaveProperty("notARealProp");
    // Also closed when the element is pinned to something other than the default.
    expectTypeOf<CheckboxRootProps<"section">>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<CheckboxProps<"a">>().not.toHaveProperty("notARealProp");
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
    >().toEqualTypeOf<[boolean, CheckboxRootChangeEventDetails]>();
  });

  it("forwards Base UI's event details to onValueChange", () => {
    <Checkbox.Default
      label="Cancel this run"
      onValueChange={(value, eventDetails) => {
        expectTypeOf(value).toEqualTypeOf<boolean>();
        expectTypeOf(
          eventDetails,
        ).toEqualTypeOf<CheckboxRootChangeEventDetails>();
        // The escape hatch the second argument exists for: the native event
        // (for shift-click range selection) and cancellation.
        expectTypeOf(eventDetails.cancel).toBeFunction();
      }}
    />;
  });

  it("rejects unknown props", () => {
    <Checkbox.Default
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Checkbox.Default
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Checkbox.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Checkbox.Control
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Checkbox.Label
      as="label"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Checkbox.Root
      as="section"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  // Nested prop bags get excess-property checking as fresh object literals,
  // unlike hyphenated JSX attributes. See the `@telegraph/helpers` README.
  it("rejects unknown props inside nested prop bags", () => {
    <Checkbox.Default
      label="Cancel run"
      // @ts-expect-error unknown prop in the label bag
      labelProps={{ notARealProp: "x" }}
    />;
    <Checkbox.Default
      label="Cancel run"
      // @ts-expect-error unknown prop in the control bag
      controlProps={{ notARealProp: "x" }}
    />;
    <Checkbox.Default
      label="Cancel run"
      // @ts-expect-error a data-* key alone gets no attribute exemption here
      labelProps={{ "data-testid": "x" }}
    />;
  });

  // `Default` renders its own control and label, so children would be dropped.
  it("rejects children on Default but keeps them on Root", () => {
    // @ts-expect-error Default has no slot for children
    <Checkbox.Default label="Cancel run">extra</Checkbox.Default>;
    <Checkbox.Root>
      <Checkbox.Control />
    </Checkbox.Root>;
  });

  it("accepts className on every part", () => {
    <Checkbox.Default label="Cancel run" className="root" />;
    <Checkbox.Default
      label="Cancel run"
      controlProps={{ className: "control" }}
      labelProps={{ className: "label" }}
    />;
    <Checkbox.Root className="root">
      <Checkbox.Control className="control" />
      <Checkbox.Label className="label">Cancel run</Checkbox.Label>
    </Checkbox.Root>;
  });

  // Base UI moves the id onto the rendered element under `nativeButton`, which
  // leaves `Checkbox.Label`'s `htmlFor` pointing at a div.
  it("rejects nativeButton on the control", () => {
    <Checkbox.Default
      label="Cancel run"
      // @ts-expect-error nativeButton is not part of the public surface
      controlProps={{ nativeButton: true }}
    />;
    <Checkbox.Root>
      {/* @ts-expect-error nativeButton is not part of the public surface */}
      <Checkbox.Control nativeButton />
    </Checkbox.Root>;
  });

  it("rejects invalid values for declared props", () => {
    <Checkbox.Default
      // @ts-expect-error not a spacing token
      p={12345}
    />;
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
    <Checkbox.Default
      // @ts-expect-error indeterminate must be a boolean
      indeterminate="yes"
    />;
    <Checkbox.Default
      // @ts-expect-error parent must be a boolean
      parent="yes"
    />;
    <Checkbox.Default
      // @ts-expect-error name must be a string
      name={42}
    />;
    <Checkbox.Default
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <Checkbox.Default
      // @ts-expect-error not a spacing token
      gap={12345}
    />;
    <Checkbox.Label
      as="label"
      // @ts-expect-error not a text size token
      size="99"
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
    // The assertion that actually guards KNO-14309: the parameter must stay
    // `boolean` at the JSX call site, not just on the props type.
    <Checkbox.Default
      label="Cancel run"
      value={true}
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<boolean>();
      }}
    />;
    <Checkbox.Root aria-label="Select row">
      <Checkbox.Control />
      <Checkbox.Label>Select row</Checkbox.Label>
    </Checkbox.Root>;
  });

  it("renders as another element and types tgphRef to match", () => {
    <Checkbox.Root as="span" />;
    <Checkbox.Default as="section" label="Cancel run" />;
    <Checkbox.Label as="span">Cancel run</Checkbox.Label>;

    // `as` narrows the element, so element-specific props come with it.
    <Checkbox.Root as="fieldset" form="my-form" />;

    <Checkbox.Root
      as="span"
      tgphRef={(node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLElement | null>();
      }}
    />;
  });

  it("rejects props that don't belong to the element it renders as", () => {
    <Checkbox.Root
      as="span"
      // @ts-expect-error `form` is not a prop of span
      form="my-form"
    />;
  });

  // `tgphRef` is no longer `any`, so a ref for the wrong element is an error.
  it("rejects a tgphRef that does not match the element", () => {
    const svgRef = {} as RefObject<SVGSVGElement>;
    <Checkbox.Root
      // @ts-expect-error the root renders an HTML element, not an SVG one
      tgphRef={svgRef}
    />;
    <Checkbox.Control
      // @ts-expect-error the control renders an HTML element, not an SVG one
      tgphRef={svgRef}
    />;
  });

  // Now that props are closed, a prop documented in the README but never
  // implemented is a compile error rather than something the catch-all hides.
  // This block is every row of the README's Checkbox table.
  it("accepts every prop the README documents", () => {
    <Checkbox.Default
      label="Cancel this run"
      size="2"
      color="blue"
      value={false}
      onValueChange={() => {}}
      indeterminate={false}
      parent={false}
      disabled={false}
      readOnly={false}
      required={false}
      name="runs"
      formValue="run_1"
      labelProps={{ color: "gray" }}
      controlProps={{ inputRef: { current: null } }}
    />;
    <Checkbox.Default label="Cancel this run" defaultValue />;
  });
});

describe("CheckboxGroup types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<CheckboxGroupProps>().not.toHaveProperty("notARealProp");
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
    >().toEqualTypeOf<[string[], CheckboxGroupChangeEventDetails]>();
  });

  it("forwards Base UI's event details to the group's onValueChange", () => {
    <CheckboxGroup
      onValueChange={(value, eventDetails) => {
        expectTypeOf(value).toEqualTypeOf<string[]>();
        expectTypeOf(
          eventDetails,
        ).toEqualTypeOf<CheckboxGroupChangeEventDetails>();
      }}
    />;
  });

  // The group renders its element inside Base UI's `render` callback, so it is
  // deliberately not polymorphic — `as` should not be part of its surface.
  it("rejects as", () => {
    // @ts-expect-error CheckboxGroup is not polymorphic
    <CheckboxGroup as="section" />;
    // @ts-expect-error not even the element it actually renders
    <CheckboxGroup as="div" />;
  });

  it("rejects unknown props and invalid values", () => {
    <CheckboxGroup
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <CheckboxGroup
      // @ts-expect-error value is a list of keys, not a boolean
      value={true}
    />;
    <CheckboxGroup
      // @ts-expect-error not a checkbox size
      size="3"
    />;
    <CheckboxGroup
      // @ts-expect-error allValues is a list of keys
      allValues="run-1"
    />;
    <CheckboxGroup
      // @ts-expect-error the selection holds strings
      value={[1, 2]}
    />;
    <CheckboxGroup
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <CheckboxGroup
      // @ts-expect-error not a spacing token
      gap={12345}
    />;
    <CheckboxGroup
      // @ts-expect-error onValueChange receives a string array
      onValueChange={(value: string) => value}
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

  // Every row of the README's CheckboxGroup table.
  it("accepts every prop the README documents", () => {
    <CheckboxGroup
      value={["run-1"]}
      onValueChange={() => {}}
      allValues={["run-1"]}
      size="2"
      color="blue"
      disabled={false}
      direction="column"
      gap="2"
    />;
    <CheckboxGroup defaultValue={["run-1"]} direction="row" />;
  });
});
