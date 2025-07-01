import * as RadixMenu from "@radix-ui/react-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import React from "react";

import { MenuItem } from "../MenuItem";

type RootProps = React.ComponentProps<typeof RadixMenu.Root> & {
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

type ContentProps<T extends TgphElement> = React.ComponentProps<
  typeof RadixMenu.Content
> &
  Omit<TgphComponentProps<typeof Stack<T>>, "align"> & {
    contentStackRef?: React.RefObject<HTMLDivElement>;
  };

const Content = <T extends TgphElement>({
  direction = "column",
  gap = "1",
  rounded = "4",
  py = "1",
  border = "px",
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
        <Stack
          bg="surface-1"
          direction={direction}
          gap={gap}
          rounded={rounded}
          border={border}
          py={py}
          shadow={shadow}
          style={{
            overflowY: "auto",
          }}
          zIndex="popover"
        >
          {children}
        </Stack>
      </RefToTgphRef>
    </RadixMenu.Content>
  );
};

type ButtonProps<T extends TgphElement> = TgphComponentProps<
  typeof MenuItem<T>
> &
  React.ComponentProps<typeof RadixMenu.Item>;

const Button = <T extends TgphElement>({
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
          onClick={onClick}
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

type DividerProps = TgphComponentProps<typeof Box>;

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
  Divider: typeof Divider;
};

Object.assign(Menu, {
  Root,
  Trigger,
  Content,
  Button,
  Divider,
});

export { Menu };
