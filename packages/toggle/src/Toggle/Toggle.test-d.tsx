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
    expectTypeOf<ToggleProps["color"]>().not.toBeAny();
    expectTypeOf<ToggleProps["value"]>().not.toBeAny();
    expectTypeOf<ToggleProps["defaultValue"]>().not.toBeAny();
    expectTypeOf<ToggleProps["onValueChange"]>().not.toBeAny();
    expectTypeOf<ToggleProps["label"]>().not.toBeAny();
    expectTypeOf<ToggleProps["indicator"]>().not.toBeAny();
    expectTypeOf<ToggleProps["labelProps"]>().not.toBeAny();
    expectTypeOf<ToggleProps["indicatorProps"]>().not.toBeAny();
    expectTypeOf<ToggleRootProps["size"]>().not.toBeAny();
    expectTypeOf<ToggleRootProps["color"]>().not.toBeAny();
    expectTypeOf<ToggleRootBaseProps["color"]>().not.toBeAny();
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
    <Toggle.Default
      // @ts-expect-error not a button color
      color="notAColor"
    />;
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
    <Toggle.Default value={false} defaultValue={false} />;
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
    <Toggle.Default disabled required name="toggle" />;
    <Toggle.Switch className="c" style={{ opacity: 0.5 }} />;
  });
});
