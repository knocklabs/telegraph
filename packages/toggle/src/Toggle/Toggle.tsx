import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@telegraph/button";
import type {
  PolymorphicPropsWithTgphRef,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";
import { CheckCircle2, Circle } from "lucide-react";
import React, { Fragment } from "react";

import {
  INDICATOR_SIZE_MAP,
  LABEL_SIZE_MAP,
  TOGGLE_SIZE_MAP,
  type ToggleSize,
} from "./Toggle.constants";
import "./Toggle.styles.css";

type InternalContextType = {
  size: ToggleSize;
  value: boolean;
  disabled: boolean;
  id: string;
  onValueChange: (value: boolean) => void;
  required?: boolean;
  name?: string;
  color: TgphComponentProps<typeof Button.Root>["color"];
};

const ToggleContext = React.createContext<InternalContextType>({
  size: "2",
  value: false,
  disabled: false,
  id: "",
  onValueChange: () => {},
  required: false,
  name: undefined,
  color: "blue",
});

type RootBaseProps = {
  size?: ToggleSize;
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  color?: TgphComponentProps<typeof Button.Root>["color"];
};

type RootProps<T extends TgphElement> = Omit<
  TgphComponentProps<typeof Stack<T>>,
  "tgphRef" | "as"
> &
  PolymorphicPropsWithTgphRef<T, HTMLInputElement> &
  RootBaseProps;

const Root = <T extends TgphElement>({
  size = "2",
  color = "blue",
  value: valueProp,
  defaultValue = false,
  onValueChange: onValueChangeProp,
  disabled = false,
  required = false,
  id: idProp,
  name,
  className,
  tgphRef,
  children,
  as,
  style,
  ...props
}: RootProps<T>) => {
  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp,
  });

  const generatedId = React.useId();
  const id = idProp || generatedId;

  return (
    <ToggleContext.Provider
      value={{
        size,
        color,
        value,
        disabled,
        id,
        onValueChange,
        required,
        name,
      }}
    >
      <Stack
        as="label"
        direction="row"
        align="center"
        gap="2"
        display="inline-flex"
        justify="space-between"
        className={className}
        data-tgph-toggle-root
        htmlFor={id}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...props}
      >
        {children}
      </Stack>
    </ToggleContext.Provider>
  );
};

type SwitchProps = TgphComponentProps<typeof Box>;

const Switch = ({ as, className, style, ...props }: SwitchProps) => {
  const context = React.useContext(ToggleContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const sizeConfig = TOGGLE_SIZE_MAP[context.size];

  return (
    <Box position="relative">
      {/* Hidden native checkbox for accessibility */}
      <VisuallyHidden.Root>
        <input
          type="checkbox"
          id={context.id}
          checked={context.value}
          onChange={(event) => context.onValueChange(event.target.checked)}
          disabled={context.disabled}
          required={context.required}
          name={context.name}
          value="on"
          ref={inputRef}
          data-tgph-toggle-input
        />
      </VisuallyHidden.Root>
      {/* Visual toggle */}
      <Button.Root
        as="label"
        className={className}
        htmlFor={context.id}
        color={context.value ? context.color : "gray"}
        rounded="full"
        align="center"
        justify="flex-start"
        disabled={context.disabled}
        data-tgph-toggle-switch
        data-tgph-toggle-size={context.size}
        data-tgph-toggle-checked={context.value}
        style={{
          cursor: context.disabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...sizeConfig}
        {...props}
      >
        <Icon
          icon={context.value ? CheckCircle2 : Circle}
          size={sizeConfig.iconSize}
          color={
            // If the toggle is disabled, we want to use the disabled color.
            context.disabled
              ? "disabled"
              : // If not, we can assign the color the same way we do for the button.
                context.value
                ? context.color
                : "gray"
          }
          bg="white"
          rounded="full"
          mx="0_5"
          data-tgph-toggle-icon
          aria-hidden
        />
      </Button.Root>
    </Box>
  );
};

type LabelProps<T extends TgphElement> = TgphComponentProps<typeof Text<T>> & {
  hidden?: boolean;
};

const Label = <T extends TgphElement>({
  hidden = false,
  as,
  style,
  ...props
}: LabelProps<T>) => {
  const context = React.useContext(ToggleContext);
  const Wrapper = hidden ? VisuallyHidden.Root : Fragment;

  return (
    <Wrapper asChild>
      <Text
        as={(as || "label") as T}
        htmlFor={context.id}
        size={LABEL_SIZE_MAP[context.size]}
        data-tgph-toggle-label
        data-tgph-toggle-disabled={context.disabled}
        style={{
          cursor: context.disabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...props}
      />
    </Wrapper>
  );
};

type IndicatorProps<T extends TgphElement> = TgphComponentProps<
  typeof Tag<T>
> & {
  enabledContent?: React.ReactNode;
  disabledContent?: React.ReactNode;
};

const Indicator = <T extends TgphElement>({
  as,
  enabledContent = "Enabled",
  disabledContent = "Disabled",
  style,
  children,
  ...props
}: IndicatorProps<T>) => {
  const context = React.useContext(ToggleContext);

  // Determine what content to show
  const content =
    children || (context.value ? enabledContent : disabledContent);
  const size = INDICATOR_SIZE_MAP[context.size];

  return (
    <Tag
      as={as || "label"}
      size={size}
      color={context.value ? "blue" : "gray"}
      data-tgph-toggle-indicator
      htmlFor={context.id}
      style={{
        cursor: context.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...props}
    >
      {content}
    </Tag>
  );
};

type DefaultProps<T extends TgphElement> = RootProps<T> & {
  label?: React.ReactNode;
  labelProps?: Omit<LabelProps<"label">, "as">;
  indicator?: boolean;
  indicatorProps?: Omit<IndicatorProps<"span">, "as">;
};

const Default = <T extends TgphElement>({
  label,
  labelProps,
  indicator,
  indicatorProps,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root {...props}>
      {label && (
        <Label as="label" {...labelProps}>
          {label}
        </Label>
      )}
      <Stack direction="row" gap="1" align="center">
        {indicator && <Indicator {...indicatorProps} />}
        <Switch />
      </Stack>
    </Root>
  );
};

const Toggle = {
  Default,
  Root,
  Switch,
  Label,
  Indicator,
};

export { Toggle };
