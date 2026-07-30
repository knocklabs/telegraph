import { Tooltip, TooltipGroupProvider } from ".";
import type { TooltipBaseProps, TooltipProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("Tooltip types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TooltipProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<TooltipBaseProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TooltipProps["label"]>().not.toBeAny();
    expectTypeOf<TooltipProps["labelProps"]>().not.toBeAny();
    expectTypeOf<TooltipProps["enabled"]>().not.toBeAny();
    expectTypeOf<TooltipProps["disableFocusOpen"]>().not.toBeAny();
    expectTypeOf<TooltipProps["skipAnimation"]>().not.toBeAny();
    expectTypeOf<TooltipProps["triggerRef"]>().not.toBeAny();
    expectTypeOf<TooltipProps["side"]>().not.toBeAny();
    expectTypeOf<TooltipProps["align"]>().not.toBeAny();
    expectTypeOf<TooltipProps["delayDuration"]>().not.toBeAny();
    expectTypeOf<TooltipProps["skipDelayDuration"]>().not.toBeAny();
    expectTypeOf<TooltipProps["disableHoverableContent"]>().not.toBeAny();
    expectTypeOf<TooltipProps["avoidCollisions"]>().not.toBeAny();
    expectTypeOf<TooltipProps["hideWhenDetached"]>().not.toBeAny();
    expectTypeOf<TooltipProps["forceMount"]>().not.toBeAny();
    expectTypeOf<TooltipProps["onOpenChange"]>().not.toBeAny();
    expectTypeOf<TooltipProps["onEscapeKeyDown"]>().not.toBeAny();
    expectTypeOf<TooltipProps["onPointerDownOutside"]>().not.toBeAny();
    expectTypeOf<TooltipBaseProps["label"]>().not.toBeAny();
    expectTypeOf<TooltipBaseProps["labelProps"]>().not.toBeAny();
    expectTypeOf<TooltipBaseProps["enabled"]>().not.toBeAny();
    expectTypeOf<TooltipBaseProps["style"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Tooltip
      label="hi"
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      // @ts-expect-error unknown prop
      fontSize={16}
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      // Tooltip always merges onto its child, so `asChild` never did anything.
      // @ts-expect-error asChild is not a Tooltip prop
      asChild
    >
      <button>trigger</button>
    </Tooltip>;
    <TooltipGroupProvider
      // @ts-expect-error unknown prop
      notARealProp="x"
    >
      <span>child</span>
    </TooltipGroupProvider>;
  });

  it("rejects invalid values for declared props", () => {
    <Tooltip
      label="hi"
      // @ts-expect-error not a tooltip side
      side="sideways"
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      // @ts-expect-error not a tooltip alignment
      align="middle"
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      // @ts-expect-error delayDuration is a number
      delayDuration="fast"
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      // @ts-expect-error enabled is a boolean
      enabled="yes"
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      // @ts-expect-error labelProps are Stack props, 12345 is not a spacing token
      labelProps={{ p: 12345 }}
    >
      <button>trigger</button>
    </Tooltip>;
  });

  it("accepts valid props", () => {
    <Tooltip label="hi" side="top" align="start" delayDuration={100}>
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label={<span>hi</span>}
      enabled
      skipAnimation
      disableFocusOpen
      forceMount
      avoidCollisions={false}
      hideWhenDetached
      sideOffset={8}
      alignOffset={2}
    >
      <button>trigger</button>
    </Tooltip>;
    <Tooltip
      label="hi"
      open
      defaultOpen={false}
      onOpenChange={(open) => open}
      onEscapeKeyDown={() => {}}
      onPointerDownOutside={() => {}}
      style={{ opacity: 1 }}
      labelProps={{ p: "2", bg: "surface-1" }}
      aria-label="tooltip"
      id="tooltip"
    >
      <button>trigger</button>
    </Tooltip>;
    <TooltipGroupProvider>
      <span>child</span>
    </TooltipGroupProvider>;
  });
});
