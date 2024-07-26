import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Button } from "@telegraph/button";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import React from "react";

const SegmentedControlContextState = React.createContext<{
  value?: React.ComponentProps<typeof ToggleGroup.Root>["value"];
}>({
  value: "",
});

type RootProps = Omit<React.ComponentProps<typeof ToggleGroup.Root>, "type"> &
  TgphComponentProps<typeof Stack> & {
    type?: React.ComponentProps<typeof ToggleGroup.Root>["type"];
  };

const Root = ({
  // ToggleGroup.Root Props
  type = "single",
  value,
  defaultValue,
  onValueChange,
  disabled,
  rovingFocus,
  orientation,
  dir,
  loop,
  children,
  ...props
}: RootProps) => {
  return (
    <SegmentedControlContextState.Provider value={{ value }}>
      {/* @ts-expect-error: radix's type props doesn't seem to be typed correctly, could be a bug? */}
      <ToggleGroup.Root
        asChild={true}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        rovingFocus={rovingFocus}
        orientation={orientation}
        dir={dir}
        loop={loop}
      >
        <RefToTgphRef>
          <Stack
            border="px"
            rounded="4"
            p="1"
            gap="1"
            align="center"
            justify="space-between"
            {...props}
          >
            {children}
          </Stack>
        </RefToTgphRef>
      </ToggleGroup.Root>
    </SegmentedControlContextState.Provider>
  );
};

const ButtonStyleProps: Record<
  string,
  TgphComponentProps<typeof Button.Root>
> = {
  active: {
    variant: "soft",
    color: "gray",
  },
  inactive: {
    variant: "ghost",
    color: "gray",
  },
};

type OptionProps = React.ComponentProps<typeof ToggleGroup.Item> &
  TgphComponentProps<typeof Button>;

const Option = ({
  // ToggleGroup.Item Props
  value,
  disabled,
  // Button Props
  size = "1",
  style,
  ...props
}: OptionProps) => {
  const context = React.useContext(SegmentedControlContextState);
  const status = context.value === value ? "active" : "inactive";

  return (
    <ToggleGroup.Item asChild={true} value={value} disabled={disabled}>
      <RefToTgphRef>
        <Button
          size={size}
          {...ButtonStyleProps[status]}
          style={{
            // Make the button take up all availabel space
            flexGrow: 1,
            ...style,
          }}
          {...props}
        />
      </RefToTgphRef>
    </ToggleGroup.Item>
  );
};

const Default = {};

Object.assign(Default, {
  Root,
  Option,
});
const SegmentedControl = Default as typeof Default & {
  Root: typeof Root;
  Option: typeof Option;
};

export { SegmentedControl };
