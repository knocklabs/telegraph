import { describe, expectTypeOf, it } from "vitest";

import { Popover } from ".";
import type {
  PopoverContentProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from ".";

describe("Popover types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<PopoverRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<PopoverTriggerProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<PopoverContentProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<PopoverRootProps["open"]>().not.toBeAny();
    expectTypeOf<PopoverRootProps["modal"]>().not.toBeAny();
    expectTypeOf<PopoverRootProps["onOpenChange"]>().not.toBeAny();
    expectTypeOf<PopoverTriggerProps["asChild"]>().not.toBeAny();
    expectTypeOf<PopoverTriggerProps["disabled"]>().not.toBeAny();
    expectTypeOf<PopoverTriggerProps["tgphRef"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["side"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["align"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["sideOffset"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["skipAnimation"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["forceMount"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["onEscapeKeyDown"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["p"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["gap"]>().not.toBeAny();
    expectTypeOf<PopoverContentProps["className"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Popover.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Popover.Trigger
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Popover.Content
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Popover.Content
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Popover.Root
      // @ts-expect-error open is a boolean
      open="yes"
    />;
    <Popover.Trigger
      // @ts-expect-error asChild is a boolean
      asChild="yes"
    />;
    <Popover.Content
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Popover.Content
      // @ts-expect-error not a valid side
      side="sideways"
    />;
    <Popover.Content
      // @ts-expect-error not a valid align
      align="middle"
    />;
    <Popover.Content
      // @ts-expect-error not a spacing token
      gap={999}
    />;
  });

  it("accepts valid props", () => {
    <Popover.Root defaultOpen modal onOpenChange={(open) => open}>
      <Popover.Trigger asChild>
        <button type="button">Open</button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        side="top"
        sideOffset={8}
        p="2"
        gap="1"
        bg="surface-1"
        rounded="4"
        className="c"
        style={{ opacity: 1 }}
        aria-label="details"
        data-testid="popover-content"
        onEscapeKeyDown={() => {}}
      >
        Content
      </Popover.Content>
    </Popover.Root>;
    <Popover.Content forceMount skipAnimation />;
    <Popover.Trigger disabled className="trigger" />;
  });

  it("rejects `as` on animated content", () => {
    // KNO-14501.
    <Popover.Content
      // @ts-expect-error as is not a Popover.Content prop
      as="section"
    />;
  });
});
