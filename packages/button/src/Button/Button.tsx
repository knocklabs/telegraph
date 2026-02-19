import {
  type PolymorphicProps,
  type PolymorphicPropsWithTgphRef,
  RemappedOmit,
  type Required,
  type TgphComponentProps,
  type TgphElement,
  useDeterminateState,
} from "@telegraph/helpers";
import { Spinner, Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
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
};

type InternalProps = {
  layout: "default" | "icon-only";
  color: Required<RootBaseProps>["color"];
  state: Required<RootBaseProps>["state"] | "disabled" | "active";
};

export type RootProps<T extends TgphElement = "button"> = Omit<
  TgphComponentProps<typeof Stack>,
  "tgphRef" | "as" | "onClick"
> &
  Omit<PolymorphicPropsWithTgphRef<T, HTMLButtonElement>, "onClick"> &
  RootBaseProps & {
    onClick?(event?: React.SyntheticEvent | Event): void;
  };

const ButtonContext = React.createContext<
  Required<Omit<RootBaseProps, "color" | "as" | "state"> & InternalProps>
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

const Root = <T extends TgphElement>({
  as,
  variant = "solid",
  size = "2",
  color = "default",
  state: stateProp = "default",
  active = false,
  type = "button",
  disabled,
  className,
  children,
  style,
  ...props
}: RootProps<T>) => {
  const derivedState = deriveState({ state: stateProp, disabled, active });
  const state = useDeterminateState<DefaultProps<T>["state"]>({
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

const Icon = <T extends TgphElement = "span">({
  size,
  color,
  variant,
  icon,
  alt,
  "aria-hidden": ariaHidden,
  internal_iconType,
  ...props
}: IconProps<T>) => {
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

  const a11yProps = !alt ? { "aria-hidden": ariaHidden } : { alt };

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
      {...props}
    />
  );
};

export type TextProps<T extends TgphElement = "span"> = RemappedOmit<
  TgphComponentProps<typeof TelegraphText<T>>,
  "as"
> & {
  as?: T;
};

const Text = <T extends TgphElement = "span">({
  as,
  color,
  size,
  weight = "medium",
  style,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(ButtonContext);
  const derivedColor =
    color ??
    TEXT_COLOR_MAP[context.variant][
      context.state === "disabled" ? "disabled" : context.color
    ];
  return (
    <TelegraphText
      as={(as || "span") as T}
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
      {...props}
    />
  );
};

type DefaultIconProps = React.ComponentProps<typeof Icon>;

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
  PolymorphicProps<T>,
  "onClick"
> &
  TgphComponentProps<typeof Root> &
  BaseDefaultProps & {
    onClick?(event?: React.SyntheticEvent | Event): void;
  };

const Default = <T extends TgphElement = "button">({
  leadingIcon,
  trailingIcon,
  icon,
  children,
  ...props
}: DefaultProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  return (
    <Root {...props}>
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
