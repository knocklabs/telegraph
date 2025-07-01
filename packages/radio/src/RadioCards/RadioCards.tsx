import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "@telegraph/button";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import type { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import React from "react";

type RootProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Root> &
  TgphComponentProps<typeof Stack>;

type RadioButtonInternalContext = {
  value?: string;
};

const RadioButtonContext = React.createContext<RadioButtonInternalContext>({
  value: "",
});

const Root = ({ value, children, onValueChange, ...props }: RootProps) => {
  return (
    <RadioButtonContext.Provider value={{ value: value ?? "" }}>
      <RadioGroup.Root
        value={value}
        onValueChange={onValueChange}
        asChild
        {...props}
      >
        <RefToTgphRef>
          <Stack gap="1">{children}</Stack>
        </RefToTgphRef>
      </RadioGroup.Root>
    </RadioButtonContext.Provider>
  );
};

type ItemProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Item>;
type ItemRef = React.ElementRef<typeof RadioGroup.Item>;

const Item = React.forwardRef<ItemRef, ItemProps>(
  ({ children, style, ...props }, forwardedRef) => {
    const { value: contextValue } = React.useContext(RadioButtonContext);
    return (
      <>
        <RadioGroup.Item {...props} ref={forwardedRef} asChild>
          <RefToTgphRef>
            <Button.Root
              variant="outline"
              active={props.value === contextValue}
              h="full"
              w="full"
              px="0"
              py="0"
              data-tgph-radio-group-button
              style={{
                "--tgph-button-active-shadow":
                  "inset 0 0 0 1px var(--tgph-blue-8)",
                ...style,
              }}
            >
              {children}
            </Button.Root>
          </RefToTgphRef>
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
  const isGroupHorizontal = direction === "row" || direction === "row-reverse";
  return (
    <Root direction={direction} {...props}>
      {options.map((option) => (
        <Item key={option.value} value={option.value}>
          <Stack
            direction={isGroupHorizontal ? "column" : "row"}
            align={isGroupHorizontal ? "flex-start" : "center"}
            p="3"
            w="full"
          >
            {option.icon && (
              <Box
                mb={isGroupHorizontal ? "2" : "0"}
                mr={isGroupHorizontal ? "0" : "4"}
                ml={isGroupHorizontal ? "0" : "1"}
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
