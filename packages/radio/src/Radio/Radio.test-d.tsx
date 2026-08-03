import { Radio } from ".";
import type {
  RadioColor,
  RadioControlProps,
  RadioLabelProps,
  RadioProps,
  RadioRootBaseProps,
  RadioRootProps,
  RadioSize,
} from ".";
import type { RadioGroupChangeEventDetails } from "@base-ui/react/radio-group";
import type { RefObject } from "react";
import { describe, expectTypeOf, it } from "vitest";

import { RadioGroup } from "../RadioGroup";
import type { RadioGroupBaseProps, RadioGroupProps } from "../RadioGroup";

describe("Radio types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<RadioProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioRootProps>().not.toHaveProperty("notARealProp");
    // Also closed when the element is pinned to something other than the default.
    expectTypeOf<RadioRootProps<"section">>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<RadioProps<"a">>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioRootBaseProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioControlProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioLabelProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<RadioSize>().not.toBeAny();
    expectTypeOf<RadioColor>().not.toBeAny();
    expectTypeOf<RadioProps["size"]>().not.toBeAny();
    expectTypeOf<RadioProps["color"]>().not.toBeAny();
    expectTypeOf<RadioProps["value"]>().not.toBeAny();
    expectTypeOf<RadioProps["disabled"]>().not.toBeAny();
    expectTypeOf<RadioProps["label"]>().not.toBeAny();
    expectTypeOf<RadioRootBaseProps["value"]>().not.toBeAny();
  });

  // A radio's `value` is the option's identity, not what the control holds.
  // It is required, unlike every other prop on the surface.
  it("types value as a required string", () => {
    expectTypeOf<RadioProps["value"]>().toEqualTypeOf<string>();
    // @ts-expect-error value is required
    <Radio.Root />;
    // @ts-expect-error value is required
    <Radio.Default label="Pro" />;
  });

  it("rejects unknown props", () => {
    <Radio.Default
      value="pro"
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Radio.Default
      value="pro"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Radio.Root
      value="pro"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Radio.Control
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Radio.Label
      as="label"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  // Nested prop bags get excess-property checking as fresh object literals,
  // unlike hyphenated JSX attributes.
  it("rejects unknown props inside nested prop bags", () => {
    <Radio.Default
      value="pro"
      label="Pro"
      // @ts-expect-error unknown prop in the label bag
      labelProps={{ notARealProp: "x" }}
    />;
    <Radio.Default
      value="pro"
      label="Pro"
      // @ts-expect-error unknown prop in the control bag
      controlProps={{ notARealProp: "x" }}
    />;
  });

  // `Radio.Control` points `aria-labelledby` at the id the root resolved, so a
  // caller-supplied label id would leave a dangling IDREF.
  it("rejects id on the label", () => {
    <Radio.Default
      value="pro"
      label="Pro"
      // @ts-expect-error id belongs to the root
      labelProps={{ id: "my-label" }}
    />;
    <Radio.Root value="pro">
      {/* @ts-expect-error id belongs to the root */}
      <Radio.Label id="my-label">Pro</Radio.Label>
    </Radio.Root>;
  });

  // `Radio.Root` owns these and forwards them. Through `controlProps` they
  // would spread over the resolved value.
  it("rejects root-owned state props on the control", () => {
    <Radio.Default
      value="pro"
      label="Pro"
      disabled
      // @ts-expect-error disabled belongs on the root
      controlProps={{ disabled: false }}
    />;
    <Radio.Default
      value="pro"
      label="Pro"
      // @ts-expect-error readOnly belongs on the root
      controlProps={{ readOnly: true }}
    />;
    // The root still takes them.
    <Radio.Default value="pro" label="Pro" disabled readOnly required />;
  });

  it("rejects invalid values for declared props", () => {
    <Radio.Default
      value="pro"
      // @ts-expect-error not a radio size
      size="3"
    />;
    <Radio.Default
      value="pro"
      // @ts-expect-error not a radio color
      color="notAColor"
    />;
    <Radio.Default
      // @ts-expect-error value must be a string
      value={1}
    />;
    <Radio.Default
      value="pro"
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Radio.Label
      as="label"
      // @ts-expect-error not a text size token
      size="99"
    />;
  });

  it("renders as another element and types tgphRef to match", () => {
    <Radio.Root as="span" value="pro" />;
    <Radio.Default as="section" value="pro" label="Pro" />;
    <Radio.Label as="span">Pro</Radio.Label>;

    <Radio.Root
      as="span"
      value="pro"
      tgphRef={(node) => {
        expectTypeOf(node).toEqualTypeOf<HTMLElement | null>();
      }}
    />;
  });

  it("rejects a tgphRef that does not match the element", () => {
    const svgRef = {} as RefObject<SVGSVGElement>;
    <Radio.Root
      value="pro"
      // @ts-expect-error the root renders an HTML element, not an SVG one
      tgphRef={svgRef}
    />;
  });

  // Every row of the README's Radio table, so a documented-but-nonexistent
  // prop is a compile error.
  it("accepts every prop the README documents", () => {
    <Radio.Default
      value="pro"
      label="Pro"
      size="2"
      color="blue"
      disabled={false}
      readOnly={false}
      required={false}
      labelProps={{ color: "gray" }}
      controlProps={{ inputRef: { current: null } }}
    />;
  });
});

describe("RadioGroup types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<RadioGroupProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<RadioGroupBaseProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<RadioGroupProps["value"]>().not.toBeAny();
    expectTypeOf<RadioGroupProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<RadioGroupProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<RadioGroupProps["size"]>().not.toBeAny();
    expectTypeOf<RadioGroupProps["color"]>().not.toBeAny();
  });

  // A radio group holds one option, so `value` is a string rather than the
  // checkbox group's array.
  it("types the selection as a single string", () => {
    expectTypeOf<RadioGroupProps["value"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<
      Parameters<NonNullable<RadioGroupProps["onValueChange"]>>
    >().toEqualTypeOf<[string, RadioGroupChangeEventDetails]>();
  });

  // KNO-14309: wrapping a Base UI callback can collapse its params to `any` at
  // the JSX call site while the props type still looks right. Only an
  // assertion inside the JSX catches that.
  it("types onValueChange at the JSX call site, never any", () => {
    <RadioGroup
      name="plan"
      onValueChange={(value, eventDetails) => {
        expectTypeOf(value).toEqualTypeOf<string>();
        expectTypeOf(
          eventDetails,
        ).toEqualTypeOf<RadioGroupChangeEventDetails>();
        expectTypeOf(eventDetails.cancel).toBeFunction();
      }}
    />;
  });

  // The group renders its element inside Base UI's `render` callback, so it is
  // deliberately not polymorphic.
  it("rejects as", () => {
    // @ts-expect-error RadioGroup is not polymorphic
    <RadioGroup as="section" />;
    // @ts-expect-error not even the element it actually renders
    <RadioGroup as="div" />;
  });

  it("rejects unknown props and invalid values", () => {
    <RadioGroup
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <RadioGroup
      // @ts-expect-error a radio group holds one value, not a list
      value={["pro"]}
    />;
    <RadioGroup
      // @ts-expect-error not a radio size
      size="3"
    />;
    <RadioGroup
      // @ts-expect-error not a flex direction
      direction="sideways"
    />;
    <RadioGroup
      // @ts-expect-error onValueChange receives a string
      onValueChange={(value: number) => value}
    />;
  });

  // Every row of the README's RadioGroup table.
  it("accepts every prop the README documents", () => {
    <RadioGroup
      value="pro"
      onValueChange={() => {}}
      name="plan"
      size="2"
      color="blue"
      disabled={false}
      readOnly={false}
      required={false}
      direction="column"
      gap="2"
    >
      <Radio.Default value="pro" label="Pro" />
    </RadioGroup>;
    <RadioGroup defaultValue="free" direction="row" form="my-form" />;
  });
});
