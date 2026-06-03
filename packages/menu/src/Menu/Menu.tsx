import * as RadixMenu from "@radix-ui/react-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { ChevronRight } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import React from "react";

import { MenuItem, type MenuItemProps } from "../MenuItem";

export type RootProps = React.ComponentProps<typeof RadixMenu.Root> & {
  defaultOpen?: boolean;
};

type MenuContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const MenuContext = React.createContext<MenuContextProps>({
  open: false,
  setOpen: () => {},
});

const Root = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  modal = true,
  children,
  ...props
}: RootProps) => {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp ?? false,
    onChange: onOpenChangeProp,
  });
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <RadixMenu.Root
        open={open}
        onOpenChange={setOpen}
        modal={modal}
        {...props}
      >
        {children}
      </RadixMenu.Root>
    </MenuContext.Provider>
  );
};

type Anchor = React.ComponentProps<typeof RadixMenu.Anchor> & {
  tgphRef?: React.RefObject<HTMLDivElement>;
};

const Trigger = ({ asChild = true, tgphRef, children, ...props }: Anchor) => {
  const context = React.useContext(MenuContext);
  return (
    <RadixMenu.Anchor
      onClick={() => {
        context.setOpen(!context.open);
      }}
      asChild={asChild}
      {...props}
      ref={tgphRef}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </RadixMenu.Anchor>
  );
};

export type ContentProps<T extends TgphElement = "div"> = React.ComponentProps<
  typeof RadixMenu.Content
> &
  Omit<TgphComponentProps<typeof Stack<T>>, "align"> & {
    contentStackRef?: React.RefObject<HTMLDivElement>;
  };

const Content = <T extends TgphElement = "div">({
  direction = "column",
  gap = "1",
  rounded = "4",
  py = "1",
  shadow = "2",
  sideOffset = 4,
  children,
  onInteractOutside,
  onKeyDown,
  onCloseAutoFocus,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  return (
    <RadixMenu.Portal>
      <RadixMenu.Content
        onInteractOutside={onInteractOutside}
        onKeyDown={onKeyDown}
        onCloseAutoFocus={onCloseAutoFocus}
        asChild
        sideOffset={sideOffset}
        {...props}
        // Need to cast this type since RadixMenu.Content doesn't accept tgphRef
        ref={tgphRef as React.LegacyRef<HTMLDivElement>}
      >
        <RefToTgphRef>
          {/* Keep this Stack surface in sync with `SubContent` below. */}
          <Stack
            bg="surface-1"
            // Add tgph class so that this always works in portals
            className="tgph"
            direction={direction}
            gap={gap}
            rounded={rounded}
            py={py}
            shadow={shadow}
            style={{
              overflowY: "auto",
            }}
            zIndex="popover"
          >
            <LazyMotion features={domAnimation}>{children}</LazyMotion>
          </Stack>
        </RefToTgphRef>
      </RadixMenu.Content>
    </RadixMenu.Portal>
  );
};

export type ButtonProps<T extends TgphElement = "button"> = TgphComponentProps<
  typeof MenuItem<T>
> &
  React.ComponentProps<typeof RadixMenu.Item>;

const Button = <T extends TgphElement = "button">({
  mx = "1",
  asChild = true,
  icon,
  leadingIcon,
  trailingIcon,
  leadingComponent,
  trailingComponent,
  selected,
  tgphRef,
  onClick,
  ...props
}: ButtonProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  return (
    <RadixMenu.Item
      {...props}
      asChild={asChild}
      ref={tgphRef as React.LegacyRef<HTMLDivElement>}
    >
      <RefToTgphRef>
        <MenuItem
          onClick={
            onClick as React.MouseEventHandler<HTMLButtonElement> | undefined
          }
          selected={selected}
          leadingIcon={combinedLeadingIcon}
          trailingIcon={trailingIcon}
          leadingComponent={leadingComponent}
          trailingComponent={trailingComponent}
          data-tgph-menu-button
          mx={mx}
          style={{
            flexShrink: 0,
          }}
          {...props}
        />
      </RefToTgphRef>
    </RadixMenu.Item>
  );
};

export type SubProps = React.ComponentProps<typeof RadixMenu.Sub> & {
  defaultOpen?: boolean;
};

/**
 * Groups a `SubTrigger` with its `SubContent` to form a nested submenu that
 * opens on hover/focus. Works uncontrolled by default; pass `open`/`onOpenChange`
 * to control it, or `defaultOpen` to set the initial state.
 *
 * Note: the underlying `RadixMenu.Sub` is controlled-only (it has no internal
 * uncontrolled state), so we manage open state here via `useControllableState`,
 * mirroring `Menu.Root`. Without this the submenu would never open on hover.
 */
const Sub = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  children,
  ...props
}: SubProps) => {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp ?? false,
    onChange: onOpenChangeProp,
  });
  return (
    <RadixMenu.Sub open={open} onOpenChange={setOpen} {...props}>
      {children}
    </RadixMenu.Sub>
  );
};

export type SubTriggerProps<T extends TgphElement = "button"> =
  MenuItemProps<T> & React.ComponentProps<typeof RadixMenu.SubTrigger>;

const SubTrigger = <T extends TgphElement = "button">({
  mx = "1",
  asChild = true,
  icon,
  leadingIcon,
  trailingIcon,
  leadingComponent,
  trailingComponent,
  tgphRef,
  onClick,
  ...props
}: SubTriggerProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  // Default to a chevron so the item reads as "opens a submenu". Only apply it
  // when the caller supplies neither a trailing icon nor a trailing component —
  // `MenuItemTrailing` renders `trailingIcon` in preference to
  // `trailingComponent`, so an unconditional default would hide a caller's
  // `trailingComponent`. Annotating with `typeof trailingIcon` keeps
  // `aria-hidden` as the literal `true` the icon type requires instead of
  // widening it to `boolean`.
  const combinedTrailingIcon: typeof trailingIcon =
    trailingIcon === undefined && trailingComponent === undefined
      ? { icon: ChevronRight, "aria-hidden": true }
      : trailingIcon;
  return (
    <RadixMenu.SubTrigger
      {...props}
      asChild={asChild}
      ref={tgphRef as React.LegacyRef<HTMLDivElement>}
    >
      <RefToTgphRef>
        <MenuItem
          // Pass onClick only to MenuItem (not also via {...props} to
          // RadixMenu.SubTrigger) so RefToTgphRef doesn't compose a
          // caller-supplied handler twice. Mirrors Menu.Button.
          onClick={
            onClick as React.MouseEventHandler<HTMLButtonElement> | undefined
          }
          leadingIcon={combinedLeadingIcon}
          trailingIcon={combinedTrailingIcon}
          leadingComponent={leadingComponent}
          trailingComponent={trailingComponent}
          data-tgph-menu-button
          mx={mx}
          style={{
            flexShrink: 0,
          }}
          {...props}
        />
      </RefToTgphRef>
    </RadixMenu.SubTrigger>
  );
};

export type SubContentProps<T extends TgphElement = "div"> =
  React.ComponentProps<typeof RadixMenu.SubContent> &
    Omit<TgphComponentProps<typeof Stack<T>>, "align">;

const SubContent = <T extends TgphElement = "div">({
  direction = "column",
  gap = "1",
  rounded = "4",
  py = "1",
  shadow = "2",
  // Submenus open to the side with no gap by default; `side`/`align` are
  // managed by Radix and intentionally not accepted here.
  sideOffset = 0,
  children,
  onInteractOutside,
  onKeyDown,
  tgphRef,
  ...props
}: SubContentProps<T>) => {
  return (
    <RadixMenu.Portal>
      <RadixMenu.SubContent
        onInteractOutside={onInteractOutside}
        onKeyDown={onKeyDown}
        asChild
        sideOffset={sideOffset}
        {...props}
        // Need to cast this type since RadixMenu.SubContent doesn't accept tgphRef
        ref={tgphRef as React.LegacyRef<HTMLDivElement>}
      >
        <RefToTgphRef>
          {/* Keep this Stack surface in sync with `Content` above. */}
          <Stack
            bg="surface-1"
            // Add tgph class so that this always works in portals
            className="tgph"
            direction={direction}
            gap={gap}
            rounded={rounded}
            py={py}
            shadow={shadow}
            style={{
              overflowY: "auto",
            }}
            zIndex="popover"
          >
            <LazyMotion features={domAnimation}>{children}</LazyMotion>
          </Stack>
        </RefToTgphRef>
      </RadixMenu.SubContent>
    </RadixMenu.Portal>
  );
};

export type DividerProps = TgphComponentProps<typeof Box>;

const Divider = ({
  w = "full",
  borderBottom = "px",
  ...props
}: DividerProps) => {
  return <Box as="hr" w={w} borderBottom={borderBottom} {...props} />;
};

const Menu = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
  Button: typeof Button;
  Sub: typeof Sub;
  SubTrigger: typeof SubTrigger;
  SubContent: typeof SubContent;
  Divider: typeof Divider;
};

Object.assign(Menu, {
  Root,
  Trigger,
  Content,
  Button,
  Sub,
  SubTrigger,
  SubContent,
  Divider,
});

export { Menu };
