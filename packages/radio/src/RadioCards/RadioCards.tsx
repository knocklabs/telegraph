import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "@telegraph/button";
import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import type { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import clsx from "clsx";
import React from "react";

import { baseStyles } from "./RadioCards.css";

type RootProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Root> &
  Omit<TgphComponentProps<typeof Stack>, "tgphRef">;
type RootRef = React.ElementRef<typeof RadioGroup.Root>;

type RadioButtonInternalContext = {
  value?: string;
};

const RadioButtonContext = React.createContext<RadioButtonInternalContext>({
  value: "",
});

const Root = React.forwardRef<RootRef, RootProps>(
  ({ value, children, onValueChange, ...props }, forwardedRef) => {
    return (
      <RadioButtonContext.Provider value={{ value }}>
        <RadioGroup.Root
          value={value}
          onValueChange={onValueChange}
          asChild
          {...props}
          ref={forwardedRef}
        >
          <Stack gap="1">{children}</Stack>
        </RadioGroup.Root>
      </RadioButtonContext.Provider>
    );
  },
);

type ItemProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Item>;
type ItemRef = React.ElementRef<typeof RadioGroup.Item>;

const Item = React.forwardRef<ItemRef, ItemProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { value: contextValue } = React.useContext(RadioButtonContext);
    return (
      <>
        <RadioGroup.Item {...props} ref={forwardedRef} asChild>
          <Button.Root
            variant="outline"
            active={props.value === contextValue}
            className={clsx(className, baseStyles)}
            h="full"
            w="full"
            px="0"
            py="0"
          >
            {children}
          </Button.Root>
        </RadioGroup.Item>
      </>
    );
  },
);

type ItemTitleProps<T extends TgphElement> = TgphComponentProps<
  typeof Button.Text<T>
>;

const ItemTitle = <T extends TgphElement>({
  size = "2",
  ...props
}: ItemTitleProps<T>) => {
  return <Button.Text as={"span"} size={size} {...props} />;
};

type ItemDescriptionProps<T extends TgphElement> = TgphComponentProps<
  typeof Button.Text<T>
>;
const ItemDescription = <T extends TgphElement>({
  size = "0",
  ...props
}: ItemDescriptionProps<T>) => {
  return (
    <Button.Text
      as={"span"}
      size={size}
      color="gray"
      data-tgph-radio-card-description
      {...props}
    />
  );
};

type ItemIconProps<T extends TgphElement> = TgphComponentProps<
  typeof Button.Icon<T>
>;

const ItemIcon = <T extends TgphElement>(props: ItemIconProps<T>) => {
  return <Button.Icon color="gray" data-tgph-radio-card-icon {...props} />;
};

type DefaultIconProps = React.ComponentProps<typeof Icon>;

type DefaultProps = React.ComponentPropsWithoutRef<typeof Root> & {
  options: Array<
    {
      title?: string;
      description?: string;
      icon?: DefaultIconProps;
    } & React.ComponentPropsWithoutRef<typeof Item>
  >;
};

const Default = ({ options, direction = "row", ...props }: DefaultProps) => {
  const isHorizontal = direction === "row" || direction === "row-reverse";
  return (
    <Root direction={direction} {...props}>
      {options.map((option) => (
        <Item value={option.value}>
          <Stack
            direction={isHorizontal ? "column" : "row"}
            align={isHorizontal ? "flex-start" : "center"}
            p="3"
            w="full"
          >
            {option.icon && (
              <Box
                mb={isHorizontal ? "2" : "0"}
                mr={isHorizontal ? "0" : "4"}
                ml={isHorizontal ? "0" : "1"}
              >
                <ItemIcon {...option.icon} />
              </Box>
            )}
            <Stack direction="column" align="flex-start">
              {option.title && <ItemTitle>{option.title}</ItemTitle>}
              {option.description && (
                <ItemDescription>{option.description}</ItemDescription>
              )}
            </Stack>
          </Stack>
        </Item>
      ))}
    </Root>
  );
};

Object.assign(Default, {
  Root,
  Item,
  ItemTitle,
  ItemDescription,
  ItemIcon,
});

const RadioCards = Default as typeof Default & {
  Root: typeof Root;
  Item: typeof Item;
  ItemTitle: typeof ItemTitle;
  ItemDescription: typeof ItemDescription;
  ItemIcon: typeof ItemIcon;
};

export { RadioCards };
