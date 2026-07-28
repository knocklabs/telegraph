import { TooltipIfTruncated } from ".";
import type { TooltipIfTruncatedProps } from ".";
import { describe, expectTypeOf, it } from "vitest";

describe("TooltipIfTruncated types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<TooltipIfTruncatedProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<TooltipIfTruncatedProps["isTruncated"]>().not.toBeAny();
    expectTypeOf<TooltipIfTruncatedProps["label"]>().not.toBeAny();
    expectTypeOf<TooltipIfTruncatedProps["side"]>().not.toBeAny();
    expectTypeOf<TooltipIfTruncatedProps["align"]>().not.toBeAny();
    expectTypeOf<TooltipIfTruncatedProps["enabled"]>().not.toBeAny();
    expectTypeOf<TooltipIfTruncatedProps["delayDuration"]>().not.toBeAny();
    expectTypeOf<TooltipIfTruncatedProps["onOpenChange"]>().not.toBeAny();

    expectTypeOf<TooltipIfTruncatedProps["isTruncated"]>().toEqualTypeOf<
      ((trigger: HTMLElement) => boolean) | undefined
    >();
  });

  it("rejects unknown props", () => {
    <TooltipIfTruncated
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <TooltipIfTruncated
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <TooltipIfTruncated
      // @ts-expect-error isTruncated is a predicate, not a boolean
      isTruncated={true}
    />;
    <TooltipIfTruncated
      // @ts-expect-error not a tooltip side
      side="sideways"
    />;
    <TooltipIfTruncated
      // @ts-expect-error delayDuration is a number
      delayDuration="soon"
    />;
    <TooltipIfTruncated
      // @ts-expect-error enabled is a boolean
      enabled="yes"
    />;
  });

  it("accepts valid props", () => {
    <TooltipIfTruncated>
      <span>Some text</span>
    </TooltipIfTruncated>;
    <TooltipIfTruncated label="The full text" side="top" delayDuration={0}>
      <span>Some text</span>
    </TooltipIfTruncated>;
    <TooltipIfTruncated
      isTruncated={(trigger) => trigger.scrollWidth > trigger.clientWidth}
      enabled
      align="start"
      onOpenChange={(open) => open}
    >
      <span>Some text</span>
    </TooltipIfTruncated>;
  });
});
