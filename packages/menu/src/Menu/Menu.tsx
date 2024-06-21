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
      <RadixMenu.Anchor style={{ display: "none" }} />
      {children}
    </RadixMenu.Root>
  );
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
  ...props
}: ContentProps) => {
  return (
    <RadixMenu.Content {...props} asChild>
      <RefToTgphRef>
        <Stack
          direction={direction}
          gap={gap}
          rounded={rounded}
          border={border}
          py={py}
          shadow={shadow}
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
  ...props
}: ButtonProps<T>) => {
  const combinedLeadingIcon = selected
    ? ({ icon: Lucide.Check, "aria-hidden": true } as TgphComponentProps<
        typeof TelegraphButton.Icon
      >)
    : leadingIcon || icon;

  return (
    <RadixMenu.Item {...props} asChild>
      <RefToTgphRef>
        <TelegraphButton.Root
          variant={variant}
          size={size}
          mx={mx}
          {...props}
          data-tgph-menu-button
        >
          <Stack align="center" justify="space-between" gap="3" w="full">
            <Stack gap="3" align="center">
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
  Content,
  Button,
  Divider,
});

export { Menu };
