import * as RadixMenu from "@radix-ui/react-menu";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import React from "react";

import { MenuItem } from "../MenuItem";

type RootProps = React.ComponentProps<typeof RadixMenu.Root>;

const Root = ({
  open = true,
  onOpenChange = () => {},
  modal = true,
  children,
  ...props
}: RootProps) => {
  return (
    <RadixMenu.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      {...props}
    >
      {children}
    </RadixMenu.Root>
  );
};

type Anchor = React.ComponentProps<typeof RadixMenu.Anchor> & {
  tgphRef?: React.RefObject<HTMLDivElement>;
};

const Anchor = ({ tgphRef, ...props }: Anchor) => {
  return <RadixMenu.Anchor {...props} ref={tgphRef} />;
};

type ContentProps<T extends TgphElement> = React.ComponentProps<
  typeof RadixMenu.Content
> &
  TgphComponentProps<typeof Stack<T>> & {
    contentStackRef?: React.RefObject<HTMLDivElement>;
  };

const Content = <T extends TgphElement>({
  direction = "column",
  gap = "1",
  rounded = "4",
  py = "1",
  border = true,
  shadow = "2",
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
      // Need to cast this type since RadixMenu.Content doesn't accept tgphRef
      ref={tgphRef as React.LegacyRef<HTMLDivElement>}
    >
      <RefToTgphRef>
        <Stack
          direction={direction}
          gap={gap}
          rounded={rounded}
          border={border}
          py={py}
          shadow={shadow}
          style={{
            overflowY: "auto",
          }}
          {...props}
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
  React.ComponentProps<typeof RadixMenu.Item> & {
    selected?: boolean;
  };

const Button = <T extends TgphElement>({
  mx = "1",
  icon,
  leadingIcon,
  trailingIcon,
  leadingComponent,
  trailingComponent,
  selected,
  ...props
}: ButtonProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;

  return (
    <RadixMenu.Item {...props} asChild>
      <RefToTgphRef {...props}>
        <MenuItem
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
  Anchor: typeof Anchor;
  Content: typeof Content;
  Button: typeof Button;
  Divider: typeof Divider;
};

Object.assign(Menu, {
  Root,
  Anchor,
  Content,
  Button,
  Divider,
});

export { Menu };
