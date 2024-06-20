import * as RadixMenu from "@radix-ui/react-menu";
import { Button as TelegraphButton } from "@telegraph/button";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import React from "react";

type RootProps = React.ComponentProps<typeof RadixMenu.Root>;

const Root = ({
  open = true,
  onOpenChange = () => { },
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
  tgphRef?: React.LegacyRef<HTMLDivElement>;
};

const Anchor = ({ tgphRef, ...props }: Anchor) => {
  return <RadixMenu.Anchor {...props} ref={tgphRef} />;
};

type ContentProps = React.ComponentProps<typeof RadixMenu.Content> &
  TgphComponentProps<typeof Stack> & {
    tgphRef?: React.Ref<HTMLDivElement>;
  };

const Content = ({
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
}: ContentProps) => {
  return (
    <RadixMenu.Content
      onInteractOutside={onInteractOutside}
      onKeyDown={onKeyDown}
      onCloseAutoFocus={onCloseAutoFocus}
      asChild
      ref={tgphRef}
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
  typeof TelegraphButton<T>
> &
  React.ComponentProps<typeof RadixMenu.Item> & {
    selected?: boolean;
  };

const Button = <T extends TgphElement>({
  size = "2",
  variant = "ghost",
  mx = "1",
  children,
  icon,
  leadingIcon,
  trailingIcon,
  selected,
  "aria-activedescendant": ariaActivedescendant,
  ...props
}: ButtonProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;

  return (
    <RadixMenu.Item {...props} asChild>
      <RefToTgphRef>
        <TelegraphButton.Root
          variant={variant}
          size={size}
          mx={mx}
          data-focused={ariaActivedescendant === "true" ? "" : undefined}
          aria-activedescendant={ariaActivedescendant}
          data-tgph-menu-button
          style={{
            flexShrink: 0,
          }}
        >
          <Stack align="center" justify="space-between" gap="3" w="full">
            <Stack gap="3" align="center">
              {selected === true || selected === false ? (
                selected === true ? (
                  <TelegraphButton.Icon
                    variant="primary"
                    icon={Lucide.Check}
                    aria-hidden={true}
                  />
                ) : (
                  <TelegraphButton.Icon
                    variant="primary"
                    icon={Lucide.Check}
                    aria-hidden={true}
                    style={{ opacity: 0 }}
                  />
                )
              ) : null}
              {combinedLeadingIcon && (
                <TelegraphButton.Icon
                  variant="primary"
                  {...combinedLeadingIcon}
                />
              )}
              <TelegraphButton.Text>{children}</TelegraphButton.Text>
            </Stack>
            {trailingIcon && <TelegraphButton.Icon {...trailingIcon} />}
          </Stack>
        </TelegraphButton.Root>
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

Root.displayName = "Menu.Root";
Content.displayName = "Menu.Content";
Button.displayName = "Menu.Button";
Divider.displayName = "Menu.Divider";

Object.assign(Menu, {
  Root,
  Anchor,
  Content,
  Button,
  Divider,
});

export { Menu };
