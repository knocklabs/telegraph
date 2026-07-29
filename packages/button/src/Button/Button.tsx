import {
  type PolymorphicRootProps,
  RemappedOmit,
  type Required,
  type TgphComponentProps,
  type TgphElement,
  useDeterminateState,
} from "@telegraph/helpers";
import { Spinner, Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { useStyleEngine } from "@telegraph/style-engine";
import { Text as TelegraphText } from "@telegraph/typography";
import clsx from "clsx";
import React from "react";

import {
  BUTTON_COLOR_MAP,
  BUTTON_SIZE_MAP,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  ICON_COLOR_MAP,
  ICON_SIZE_MAP,
  ICON_VARIANT_MAP,
  TEXT_COLOR_MAP,
  TEXT_SIZE_MAP,
  cssVars,
} from "./Button.constants";

type RootBaseProps = {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  state?: "default" | "loading";
  active?: boolean;
  // Declared rather than inherited: Button reads it to derive its state and
  // forces the element back to `button`, so it survives any `as`.
  disabled?: boolean;
};

type InternalProps = {
  layout: "default" | "icon-only";
  color: Required<RootBaseProps>["color"];
  state: Required<RootBaseProps>["state"] | "disabled" | "active";
};

type ButtonClickHandler = {
  bivarianceHack(event: React.SyntheticEvent | Event): void;
}["bivarianceHack"];

type ButtonOnClick = ButtonClickHandler | boolean;

export type RootProps<T extends TgphElement = "button"> = Omit<
  StackProps<T>,
  "tgphRef" | "as" | "onClick"
> &
  PolymorphicRootProps<T, HTMLButtonElement> &
  RootBaseProps & {
    onClick?: ButtonClickHandler;
  };

const ButtonContext = React.createContext<
  Required<
    Omit<RootBaseProps, "color" | "as" | "state" | "disabled"> & InternalProps
  >
>({
  variant: "solid",
  size: "2",
  color: "default",
  state: "default",
  layout: "default",
  active: false,
});

type DeriveStateParams = {
  state: Required<RootBaseProps>["state"];
  disabled?: boolean;
  active?: boolean;
};

// Derive the state of the button based on the html button props in
const deriveState = (params: DeriveStateParams): InternalProps["state"] => {
  if (params.disabled) return "disabled";
  if (params.state === "loading") return "loading";
  if (params.active) return "active";
  return params.state;
};

const Root = <T extends TgphElement = "button">(rootProps: RootProps<T>) => {
  const {
    as,
    variant = "solid",
    size = "2",
    color = "default",
    state: stateProp = "default",
    active = false,
    type = "button",
    disabled,
    onClick,
    className,
    children,
    style,
    ...props
  } = rootProps as RootProps<"button">;

  const derivedState = deriveState({ state: stateProp, disabled, active });
  const state = useDeterminateState<InternalProps["state"]>({
    value: derivedState,
    determinateValue: "loading",
    minDurationMs: 1200,
  });

  const { styleProp, otherProps } = useStyleEngine({
    props: {
      ...BUTTON_COLOR_MAP[variant][color],
      style,
    },
    cssVars,
  });

  // If the button is in a disabled state, we don't want any clicks to fire.
  // To do this reliably, we convert the element back to a button if it is
  // disabled. We do this so we can use the native button element's disabled
  // state to prevent clicks.
  // We also want to trivially pass in "button" if no "as" prop is provided
  const derivedAs = disabled || !as ? "button" : as;

  const layout = React.useMemo<InternalProps["layout"]>(() => {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray?.length === 1 && React.isValidElement(childrenArray[0])) {
      const child = childrenArray[0] as
        | React.ReactComponentElement<typeof Icon>
        | {
            props: {
              icon: undefined;
            };
          };
      if (child?.props?.icon) {
        return "icon-only";
      }
    }
    return "default";
  }, [children]);

  return (
    <ButtonContext.Provider
      value={{ variant, size, color, state, layout, active }}
    >
      <Stack
        as={derivedAs}
        className={clsx("tgph-button", className)}
        display="inline-flex"
        align="center"
        justify="center"
        {...BUTTON_SIZE_MAP[layout][size]}
        style={styleProp}
        data-tgph-button
        data-tgph-button-layout={layout}
        data-tgph-button-state={state}
        data-tgph-button-variant={variant}
        data-tgph-button-color={color}
        disabled={state === "disabled" || state === "loading"}
        {...(derivedAs === "button" && { type })} // Only pass in type if we are a button
        {...otherProps}
        {...props}
        {...(typeof onClick === "function" && { onClick })}
      >
        {state === "loading" && (
          <Spinner
            size={ICON_SIZE_MAP[size]}
            color={ICON_COLOR_MAP[variant][color]}
            variant={ICON_VARIANT_MAP[layout]}
            data-tgph-button-loading-icon
          />
        )}
        {children}
      </Stack>
    </ButtonContext.Provider>
  );
};

export type IconProps<T extends TgphElement = "span"> = TgphComponentProps<
  typeof TelegraphIcon<T>
> & {
  internal_iconType?: "leading" | "trailing";
};

const Icon = <T extends TgphElement = "span">(
  buttonIconProps: IconProps<T>,
) => {
  const {
    size,
    color,
    variant,
    icon,
    alt,
    "aria-hidden": ariaHidden,
    internal_iconType,
    ...props
  } = buttonIconProps as IconProps<"span">;
  const context = React.useContext(ButtonContext);

  const iconProps = {
    size: size ?? ICON_SIZE_MAP[context.size],
    color:
      color ??
      ICON_COLOR_MAP[context.variant][
        context.state === "disabled" ? "disabled" : context.color
      ],
    variant: variant ?? ICON_VARIANT_MAP[context.layout],
  };

  // `ariaHidden` is forwarded verbatim, including when undefined, so Icon still
  // logs its "alt prop is required" warning. Only the type is narrowed.
  const a11yProps = (alt ? { alt } : { "aria-hidden": ariaHidden }) as
    | { alt: string; "aria-hidden"?: never }
    | { alt?: never; "aria-hidden": true };

  // If the button is set to loading and this icon is identified as leading,
  // we don't want to render this icon and instead the loading icon which
  // is managed in the root component. We choose to render the loading icon
  // in the root component so that it displays when there is no icon already
  // inside of the button.
  if (context.state === "loading" && internal_iconType === "leading") {
    return null;
  }

  return (
    <TelegraphIcon
      icon={icon}
      data-button-icon
      data-button-icon-color={iconProps.color}
      {...a11yProps}
      {...iconProps}
      {...(props as Omit<
        TgphComponentProps<typeof TelegraphIcon<"span">>,
        "icon" | "size" | "color" | "variant" | "alt" | "aria-hidden"
      >)}
    />
  );
};

export type TextProps<T extends TgphElement = "span"> = RemappedOmit<
  TgphComponentProps<typeof TelegraphText<T>>,
  "as"
> & {
  as?: T;
};

const Text = <T extends TgphElement = "span">(
  buttonTextProps: TextProps<T>,
) => {
  const {
    as,
    color,
    size,
    weight = "medium",
    style,
    ...props
  } = buttonTextProps as TextProps<"span">;
  const context = React.useContext(ButtonContext);
  const derivedColor =
    color ??
    TEXT_COLOR_MAP[context.variant][
      context.state === "disabled" ? "disabled" : context.color
    ];
  return (
    <TelegraphText
      as={as || "span"}
      color={derivedColor}
      size={size ?? TEXT_SIZE_MAP[context.size]}
      weight={weight}
      internal_optionalAs={true}
      data-button-text
      data-button-text-color={derivedColor}
      style={{
        textDecoration: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...(props as Omit<
        TgphComponentProps<typeof TelegraphText<"span">>,
        "as" | "color" | "size" | "weight" | "style"
      >)}
    />
  );
};

type DefaultIconProps = IconProps;

type BaseDefaultProps =
  | {
      leadingIcon?: DefaultIconProps;
      trailingIcon?: DefaultIconProps;
      icon?: never;
    }
  | {
      icon?: DefaultIconProps;
      leadingIcon?: never;
      trailingIcon?: never;
    };
export type DefaultProps<T extends TgphElement = "button"> = Omit<
  RootProps<T>,
  "onClick"
> &
  BaseDefaultProps & {
    onClick?: ButtonOnClick;
  };

const Default = <T extends TgphElement = "button">({
  leadingIcon,
  trailingIcon,
  icon,
  onClick,
  children,
  ...props
}: DefaultProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  const rootProps = props as RootProps<T>;

  return (
    <Root<T> {...rootProps} {...(typeof onClick === "function" && { onClick })}>
      {combinedLeadingIcon && (
        <Icon {...combinedLeadingIcon} internal_iconType="leading" />
      )}
      {children && <Text>{children}</Text>}
      {trailingIcon && <Icon {...trailingIcon} internal_iconType="trailing" />}
    </Root>
  );
};

Object.assign(Default, {
  Root,
  Icon,
  Text,
});

const Button = Default as typeof Default & {
  Root: typeof Root;
  Icon: typeof Icon;
  Text: typeof Text;
};

export { Button };
