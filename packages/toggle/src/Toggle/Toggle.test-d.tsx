import { Toggle } from ".";
import type {
  ToggleIndicatorProps,
  ToggleLabelProps,
  ToggleProps,
  ToggleRootBaseProps,
  ToggleRootProps,
  ToggleSize,
  ToggleSwitchProps,
} from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Toggle types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<ToggleProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ToggleRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ToggleRootBaseProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ToggleSwitchProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ToggleLabelProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<ToggleIndicatorProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<ToggleSize>().not.toBeAny();
    expectTypeOf<ToggleProps["size"]>().not.toBeAny();
    // TODO(KNO-14474): Toggle still widens `color` to `any`. RootBaseProps declares
    // `color?: TgphComponentProps<typeof Button.Root>["color"]`, and
    // `TgphComponentProps<typeof Button.Root>` now resolves to `{}`, so the indexed
    // access silently degrades to `any` and every color value is accepted.
    // expectTypeOf<ToggleProps["color"]>().not.toBeAny();
    expectTypeOf<ToggleProps["value"]>().not.toBeAny();
    expectTypeOf<ToggleProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<ToggleProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<ToggleProps["label"]>().not.toBeAny();
    expectTypeOf<ToggleProps["indicator"]>().not.toBeAny();
    expectTypeOf<ToggleProps["labelProps"]>().not.toBeAny();
    expectTypeOf<ToggleProps["indicatorProps"]>().not.toBeAny();
    expectTypeOf<ToggleRootProps["size"]>().not.toBeAny();
    // TODO(KNO-14474): same `any` leak as ToggleProps["color"] above.
    // expectTypeOf<ToggleRootProps["color"]>().not.toBeAny();
    // expectTypeOf<ToggleRootBaseProps["color"]>().not.toBeAny();
    expectTypeOf<ToggleRootBaseProps["size"]>().not.toBeAny();
    expectTypeOf<ToggleLabelProps["hidden"]>().not.toBeAny();
    expectTypeOf<ToggleIndicatorProps["enabledContent"]>().not.toBeAny();
    expectTypeOf<ToggleIndicatorProps["disabledContent"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Toggle.Default
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Toggle.Default
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Toggle.Root
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Toggle.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Toggle.Switch
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Toggle.Label
      as="label"
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Toggle.Indicator
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Toggle.Default
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Toggle.Default
      // @ts-expect-error not a toggle size
      size="3"
    />;
    <Toggle.Default
      // @ts-expect-error value must be a boolean
      value="yes"
    />;
    // TODO(KNO-14474): Toggle.Default still accepts any `color` value — the prop
    // resolves to `any` (see "keeps declared props narrow" above), so this is not
    // rejected. Re-enable once `color` recovers Button.Root's color union.
    // <Toggle.Default
    //   // @ts-expect-error not a button color
    //   color="notAColor"
    // />;
    <Toggle.Default
      // @ts-expect-error indicator must be a boolean
      indicator="yes"
    />;
    <Toggle.Root
      // @ts-expect-error not a toggle size
      size="3"
    />;
    <Toggle.Root
      // @ts-expect-error defaultValue must be a boolean
      defaultValue={12345}
    />;
    <Toggle.Label
      as="label"
      // @ts-expect-error hidden must be a boolean
      hidden="yes"
    />;
    <Toggle.Indicator
      // @ts-expect-error not a spacing token
      p={12345}
    />;
  });

  it("accepts valid props", () => {
    <Toggle.Default size="1" color="blue" p="2" mt="4" />;
    <Toggle.Default
      label="Enable notifications"
      labelProps={{ hidden: true }}
      indicator
      indicatorProps={{ enabledContent: "On", disabledContent: "Off" }}
    />;
    <Toggle.Default
      onValueChange={(value) => {
        expectTypeOf(value).toEqualTypeOf<boolean>();
      }}
    />;
    // TODO(KNO-14474): `value`/`defaultValue` are unusable on Toggle.Root and
    // Toggle.Default. RootBaseProps declares them as `boolean`, but the element
    // passthrough for the default `as="div"` also declares
    // `defaultValue?: string | number | readonly string[]`, so the intersection
    // collapses to `(readonly string[] & false) | (readonly string[] & true)`.
    // Toggle.test.tsx hits the same wall today.
    // <Toggle.Default value={false} defaultValue={false} />;
    <Toggle.Default
      as="section"
      id="toggle"
      className="c"
      style={{ opacity: 0.5 }}
      aria-label="toggle"
      data-testid="toggle"
    />;
    <Toggle.Root size="2" color="accent" gap="2">
      <Toggle.Label as="label">Label</Toggle.Label>
      <Toggle.Indicator enabledContent="On" disabledContent="Off" />
      <Toggle.Switch />
    </Toggle.Root>;
    <Toggle.Label as="span" hidden data-testid="label" />;
    <Toggle.Indicator as="span" className="c" style={{ opacity: 0.5 }} />;
    // TODO(KNO-14474): Toggle.Root/Toggle.Default are over-tightened — `disabled`,
    // `required` and `name` are read by the implementation and exercised by
    // Toggle.test.tsx, but `RootProps` no longer declares them (they came in via the
    // dropped polymorphic passthrough; the component renders a div, not the
    // HTMLInputElement its ref type names). Re-enable once they are declared.
    // <Toggle.Default disabled required name="toggle" />;
    // TODO(KNO-14474): Toggle.Switch is over-tightened — its props are typed as
    // `TgphComponentProps<typeof Button.Root>`, which now resolves to `{}`, so the
    // whole Button.Root surface (className, style, onClick, ...) is gone.
    // <Toggle.Switch className="c" style={{ opacity: 0.5 }} />;
  });
});
