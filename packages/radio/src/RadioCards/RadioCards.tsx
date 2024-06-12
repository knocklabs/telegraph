import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "@telegraph/button";
import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import type { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import React from "react";

type RootProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Root>;
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
          <Stack gap="2">{children}</Stack>
        </RadioGroup.Root>
      </RadioButtonContext.Provider>
    );
  },
);

type ItemProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Item>;
type ItemRef = React.ElementRef<typeof RadioGroup.Item>;

const Item = React.forwardRef<ItemRef, ItemProps>(
  ({ children, ...props }, forwardedRef) => {
    const { value: contextValue } = React.useContext(RadioButtonContext);
    return (
      <>
        <RadioGroup.Item {...props} ref={forwardedRef} asChild>
          <Button.Root
            variant="outline"
            active={props.value === contextValue}
            className="data-[tgph-button-active=true]:!shadow-blue-8 data-[tgph-button-active=true]:!shadow-[inset_0_0_0_2px] !p-0 !h-full !w-full"
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
  return <Button.Text as={"span"} size={size} {...props} />;
};

type ItemIconProps<T extends TgphElement> = TgphComponentProps<
  typeof Button.Icon<T>
>;

const ItemIcon = <T extends TgphElement>(props: ItemIconProps<T>) => {
  return <Button.Icon {...props} />;
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

const Default = ({ options, ...props }: DefaultProps) => {
  return (
    <Root {...props}>
      {options.map((option) => (
        <Item value={option.value}>
          <Stack direction="column" align="flex-start" p="3" w="full">
            {option.icon && (
              <Box mb="2">
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
