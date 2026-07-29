import { Menu } from ".";
import type {
  MenuButtonProps,
  MenuContentProps,
  MenuDividerProps,
  MenuRootProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
} from ".";
import { forwardRef } from "react";
import { describe, expectTypeOf, it } from "vitest";

// Stands in for `next/link`: a component that takes `href` and renders an
// anchor, which is the shape callers reach for on a menu item that navigates.
const RouterLink = forwardRef<
  HTMLAnchorElement,
  { href: string; children?: React.ReactNode }
>(({ href, ...props }, ref) => <a href={href} ref={ref} {...props} />);
RouterLink.displayName = "RouterLink";

describe("Menu types", () => {
  it("has no catch-all index signature", () => {
    expectTypeOf<MenuRootProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<MenuContentProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<MenuButtonProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<MenuSubProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<MenuSubTriggerProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<MenuSubContentProps>().not.toHaveProperty("notARealProp");
    expectTypeOf<MenuDividerProps>().not.toHaveProperty("notARealProp");
  });

  it("keeps declared props narrow", () => {
    expectTypeOf<MenuRootProps["modal"]>().not.toBeAny();
    expectTypeOf<MenuRootProps["open"]>().not.toBeAny();
    expectTypeOf<MenuRootProps["onOpenChange"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["side"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["align"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["sideOffset"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["skipAnimation"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["forceMount"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["p"]>().not.toBeAny();
    expectTypeOf<MenuContentProps["className"]>().not.toBeAny();
    expectTypeOf<MenuButtonProps["selected"]>().not.toBeAny();
    expectTypeOf<MenuButtonProps["closeOnClick"]>().not.toBeAny();
    expectTypeOf<MenuButtonProps["onSelect"]>().not.toBeAny();
    expectTypeOf<MenuButtonProps["mx"]>().not.toBeAny();
    expectTypeOf<MenuSubProps["onOpenChange"]>().not.toBeAny();
    expectTypeOf<MenuSubTriggerProps["disabled"]>().not.toBeAny();
    expectTypeOf<MenuSubTriggerProps["selected"]>().not.toBeAny();
    expectTypeOf<MenuSubContentProps["sideOffset"]>().not.toBeAny();
    expectTypeOf<MenuSubContentProps["gap"]>().not.toBeAny();
    expectTypeOf<MenuDividerProps["borderBottom"]>().not.toBeAny();
    expectTypeOf<MenuDividerProps["w"]>().not.toBeAny();
  });

  it("rejects unknown props", () => {
    <Menu.Root
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.Trigger
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.Content
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.Content
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Menu.Button
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.Sub
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.SubTrigger
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.SubContent
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
    <Menu.SubContent
      // @ts-expect-error unknown prop
      fontSize={16}
    />;
    <Menu.Divider
      // @ts-expect-error unknown prop
      notARealProp="x"
    />;
  });

  it("rejects invalid values for declared props", () => {
    <Menu.Root
      // @ts-expect-error open is a boolean
      open="yes"
    />;
    <Menu.Content
      // @ts-expect-error not a spacing token
      p={12345}
    />;
    <Menu.Content
      // @ts-expect-error not a valid side
      side="sideways"
    />;
    <Menu.Content
      // @ts-expect-error not a valid align
      align="middle"
    />;
    <Menu.Button
      // @ts-expect-error not a button variant
      variant="notAVariant"
    />;
    <Menu.Button
      // @ts-expect-error not a button size
      size="99"
    />;
    <Menu.SubContent
      // @ts-expect-error not a spacing token
      gap={999}
    />;
    <Menu.Divider
      // @ts-expect-error not a spacing token
      borderBottom="notAToken"
    />;
  });

  it("accepts valid props", () => {
    <Menu.Root defaultOpen modal onOpenChange={(open) => open}>
      <Menu.Trigger asChild>
        <button type="button">Open</button>
      </Menu.Trigger>
      <Menu.Content
        align="start"
        side="top"
        sideOffset={8}
        p="2"
        gap="1"
        className="c"
        style={{ opacity: 1 }}
        aria-label="actions"
        data-testid="menu-content"
      >
        <Menu.Button label="Edit" onSelect={() => {}} />
        <Menu.Divider mt="2" w="full" borderBottom="px" />
        <Menu.Sub>
          <Menu.SubTrigger label="More" disabled={false} />
          <Menu.SubContent sideOffset={4} p="1" bg="surface-1">
            <Menu.Button label="Nested" selected />
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu.Root>;
    <Menu.Content as="section" forceMount skipAnimation />;
    <Menu.Divider as="div" my="2" data-testid="divider" />;
  });

  it("renders a menu item as a link", () => {
    // KNO-14480 Part 5. `MenuButtonItemProps` used bare `MenuItemProps`, whose
    // `as?: "button"` collapsed the element parameter to `"button"`.
    <Menu.Button as="a" href="/x" label="Docs" />;
    <Menu.Button as={RouterLink} href="/settings" label="Settings" />;
    <Menu.Button as="a" href="/x" target="_blank" rel="noreferrer" />;
  });

  it("enforces the element's own required props", () => {
    // @ts-expect-error RouterLink requires href
    <Menu.Button as={RouterLink} label="Missing href" />;
  });
});
