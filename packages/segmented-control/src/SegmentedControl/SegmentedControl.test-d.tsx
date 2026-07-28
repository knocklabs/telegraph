import { SegmentedControl } from ".";
import type { SegmentedControlOptionProps, SegmentedControlRootProps } from ".";
import { AlignLeft } from "lucide-react";
import { describe, expectTypeOf, it } from "vitest";

describe("SegmentedControl types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<SegmentedControlRootProps>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<SegmentedControlRootProps<"multiple">>().not.toHaveProperty(
      "notARealProp",
    );
    expectTypeOf<SegmentedControlOptionProps>().not.toHaveProperty(
      "notARealProp",
    );
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<SegmentedControlRootProps["type"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["value"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["onValueChange"]>().not.toBeAny();
    // TODO(KNO-14474): SegmentedControl.Root's `size` is still `any`. It is
    // declared as `ComponentPropsWithoutRef<typeof Button.Root>["size"]`, and
    // `ComponentProps<typeof Button.Root>` collapses to `{}` (Button.Root's
    // props are built from a *bare* generic `TgphComponentProps<typeof Stack>`,
    // unlike Button.Text/Button.Icon which instantiate theirs), so the lookup
    // is an error type that degrades to `any`.
    // expectTypeOf<SegmentedControlRootProps["size"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["scrollControls"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["orientation"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["rovingFocus"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["loop"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["dir"]>().not.toBeAny();
    expectTypeOf<SegmentedControlRootProps["disabled"]>().not.toBeAny();
    expectTypeOf<SegmentedControlOptionProps["value"]>().not.toBeAny();
    expectTypeOf<SegmentedControlOptionProps["icon"]>().not.toBeAny();
    expectTypeOf<SegmentedControlOptionProps["variant"]>().not.toBeAny();

    // The `type` discriminant drives the public value shape.
    expectTypeOf<SegmentedControlRootProps["value"]>().toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf<
      SegmentedControlRootProps<"multiple">["value"]
    >().toEqualTypeOf<string[] | undefined>();
  });

  it("rejects unknown props", () => {
    <SegmentedControl.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <SegmentedControl.Root
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <SegmentedControl.Option
      value="left"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <SegmentedControl.Root
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <SegmentedControl.Root
      // @ts-expect-error not a segmented control type
      type="triple"
    />;
    // TODO(KNO-14474): SegmentedControl.Root still accepts any `size` value —
    // the prop resolves to `any` (see the note in "keeps declared props
    // narrow"), so no invalid size is rejected.
    // <SegmentedControl.Root
    //   // @ts-expect-error not a button size
    //   size="99"
    // />;
    <SegmentedControl.Root
      // @ts-expect-error not a scroll control mode
      scrollControls="scrollbar"
    />;
    <SegmentedControl.Root
      // @ts-expect-error segmented control values are strings or string arrays
      value={42}
    />;
    <SegmentedControl.Option
      // @ts-expect-error option values are strings
      value={42}
    />;
    <SegmentedControl.Option
      value="left"
      // @ts-expect-error not a button variant
      variant="notAVariant"
    />;
  });

  it("accepts valid props", () => {
    <SegmentedControl.Root
      value="left"
      onValueChange={(nextValue) => nextValue.toUpperCase()}
      size="1"
      scrollControls="none"
      orientation="horizontal"
      dir="ltr"
      loop
      rovingFocus={false}
      p="2"
      mt="4"
      className="c"
      style={{ opacity: 0.5 }}
      aria-label="alignment"
      data-testid="segmented-control"
    >
      <SegmentedControl.Option
        value="left"
        icon={{ icon: AlignLeft, "aria-hidden": true }}
      >
        Left
      </SegmentedControl.Option>
      <SegmentedControl.Option value="center" color="gray" size="1">
        Center
      </SegmentedControl.Option>
    </SegmentedControl.Root>;

    <SegmentedControl.Root
      type="multiple"
      defaultValue={["left", "center"]}
      onValueChange={(nextValue) => nextValue.length}
      disabled
    >
      <SegmentedControl.Option value="left">Left</SegmentedControl.Option>
    </SegmentedControl.Root>;
  });
});
