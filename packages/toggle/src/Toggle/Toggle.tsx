import { Button, type ButtonRootProps } from "@telegraph/button";
import {
  type PolymorphicPropsWithTgphRef,
  type TgphComponentProps,
  type TgphElement,
  VisuallyHidden,
  useControllableState,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";
import { CheckCircle2, Circle } from "lucide-react";
import {
  type ReactNode,
  createContext,
  useContext,
  useId,
  useRef,
} from "react";

import {
  INDICATOR_SIZE_MAP,
  LABEL_SIZE_MAP,
  TOGGLE_SIZE_MAP,
  type ToggleSize,
} from "./Toggle.constants";

type InternalContextType = {
  size: ToggleSize;
  value: boolean;
  disabled: boolean;
  id: string;
  labelId: string;
  onValueChange: (value: boolean) => void;
  required?: boolean;
  name?: string;
  color: ButtonRootProps["color"];
  "aria-label"?: string;
};

const ToggleContext = createContext<InternalContextType>({
  size: "2",
  value: false,
  disabled: false,
  id: "",
  labelId: "",
  onValueChange: () => {},
  required: false,
  name: undefined,
  color: "blue",
});

export type RootBaseProps = {
  size?: ToggleSize;
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  color?: ButtonRootProps["color"];
  // Declared rather than inherited: the root renders a `div`, and these are
  // forwarded to the hidden checkbox `Toggle.Switch` renders.
  disabled?: boolean;
  required?: boolean;
  name?: string;
};

// `value`/`defaultValue` are dropped from the passthrough: every element
// declares `defaultValue?: string | number | readonly string[]`, and
// intersecting that with the toggle's boolean state makes both unusable.
export type RootProps<T extends TgphElement = "div"> = Omit<
  StackProps<T>,
  "tgphRef" | "as" | "value" | "defaultValue"
> &
  Omit<
    PolymorphicPropsWithTgphRef<T, HTMLInputElement>,
    "as" | "value" | "defaultValue"
  > & { as?: T } & RootBaseProps;

const Root = <T extends TgphElement = "div">(rootProps: RootProps<T>) => {
  const {
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
    children,
    as,
    style,
    "aria-label": ariaLabel,
    ...props
  } = rootProps as RootProps<"div">;
  const [value, onValueChange] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChangeProp,
  });

  const generatedId = useId();
  const id = idProp || generatedId;
  const labelId = `${id}-label`;

  return (
    <ToggleContext.Provider
      value={{
        size,
        color,
        value,
        disabled,
        id,
        labelId,
        onValueChange,
        required,
        name,
        "aria-label": ariaLabel,
      }}
    >
      <Stack
        direction="row"
        align="center"
        gap="2"
        display="flex"
        justify="space-between"
        className={className}
        data-tgph-toggle-root
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

export type SwitchProps = ButtonRootProps<"label">;

const Switch = ({ as, className, style, ...props }: SwitchProps) => {
  const context = useContext(ToggleContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const { iconSize, ...sizeConfig } = TOGGLE_SIZE_MAP[context.size];
  // A `label` has no native `disabled`, so Button.Root's own `disabled` is
  // spread in at the same position, typed against the button element.
  const disabledProp: Pick<ButtonRootProps<"button">, "disabled"> = {
    disabled: context.disabled,
  };

  return (
    <Stack position="relative" align="center">
      <VisuallyHidden>
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
          aria-label={context["aria-label"]}
          data-tgph-toggle-input
        />
      </VisuallyHidden>
      <Button.Root
        as="label"
        className={className}
        htmlFor={context.id}
        aria-labelledby={context["aria-label"] ? undefined : context.labelId}
        color={context.value ? context.color : "gray"}
        rounded="full"
        align="center"
        justify="flex-start"
        {...disabledProp}
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
          size={iconSize}
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
          ml="px"
          data-tgph-toggle-icon
          aria-hidden
        />
      </Button.Root>
    </Stack>
  );
};

export type LabelProps<T extends TgphElement = "label"> = TgphComponentProps<
  typeof Text<T>
> & {
  hidden?: boolean;
};

const Label = <T extends TgphElement = "label">(labelProps: LabelProps<T>) => {
  const {
    hidden = false,
    as,
    style,
    ...props
  } = labelProps as LabelProps<"label">;
  const context = useContext(ToggleContext);
  const textProps = props as Omit<
    TgphComponentProps<typeof Text<"label">>,
    "as" | "htmlFor" | "id" | "size" | "style"
  >;

  if (hidden) {
    return (
      <VisuallyHidden asChild>
        <Text
          as={as || "label"}
          htmlFor={context.id}
          id={context.labelId}
          size={LABEL_SIZE_MAP[context.size]}
          data-tgph-toggle-label
          data-tgph-toggle-disabled={context.disabled}
          style={{
            cursor: context.disabled ? "not-allowed" : "pointer",
            ...style,
          }}
          {...textProps}
        />
      </VisuallyHidden>
    );
  }

  return (
    <Text
      as={as || "label"}
      htmlFor={context.id}
      id={context.labelId}
      size={LABEL_SIZE_MAP[context.size]}
      data-tgph-toggle-label
      data-tgph-toggle-disabled={context.disabled}
      style={{
        cursor: context.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...textProps}
    />
  );
};

export type IndicatorProps<T extends TgphElement = "span"> = TgphComponentProps<
  typeof Tag<T>
> & {
  enabledContent?: ReactNode;
  disabledContent?: ReactNode;
};

const Indicator = <T extends TgphElement = "span">(
  indicatorProps: IndicatorProps<T>,
) => {
  const {
    as,
    enabledContent = "Enabled",
    disabledContent = "Disabled",
    style,
    children,
    ...props
  } = indicatorProps as IndicatorProps<"label">;
  const context = useContext(ToggleContext);

  const content =
    children || (context.value ? enabledContent : disabledContent);
  const size = INDICATOR_SIZE_MAP[context.size];
  // No `Omit`: it would flatten Tag's discriminated `onRemove`/`onCopy` union
  // into a shape no branch accepts.
  const tagProps = props as TgphComponentProps<typeof Tag<"label">>;

  return (
    <Tag
      as={as || "label"}
      size={size}
      color={context.value ? context.color : "gray"}
      data-tgph-toggle-indicator
      htmlFor={context.id}
      style={{
        cursor: context.disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...tagProps}
    >
      {content}
    </Tag>
  );
};

export type DefaultProps<T extends TgphElement = "div"> = RootProps<T> & {
  label?: ReactNode;
  labelProps?: Omit<LabelProps<"label">, "as">;
  indicator?: boolean;
  indicatorProps?: Omit<IndicatorProps<"span">, "as">;
};

const Default = <T extends TgphElement = "div">({
  label,
  labelProps,
  indicator,
  indicatorProps,
  ...props
}: DefaultProps<T>) => {
  const rootProps = props as RootProps<T>;

  return (
    <Root<T> {...rootProps}>
      {label && (
        <Label as="label" {...labelProps}>
          {label}
        </Label>
      )}
      <Stack direction="row" gap="1" align="center">
        {indicator && (
          // `Omit` flattens Tag's discriminated `onRemove`/`onCopy` union, so
          // restore the original shape for the child.
          <Indicator {...(indicatorProps as IndicatorProps<"span">)} />
        )}
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
