import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Icon as TelegraphIcon } from "@telegraph/icon";
import { Box } from "@telegraph/layout";
import { Text as TelegraphText } from "@telegraph/typography";
import clsx from "clsx";
import React from "react";

import {
  buttonColorMap,
  buttonSizeMap,
  iconColorMap,
  iconSizeMap,
  iconVariantMap,
  textColorMap,
  textSizeMap,
} from "./Button.constants";

type RootBaseProps = {
  variant?: "solid" | "soft" | "outline" | "ghost";
  size?: "1" | "2" | "3";
  color?: "accent" | "gray" | "red" | "green" | "blue" | "yellow" | "purple";
  state?: "default" | "loading" | "disabled" | "error" | "success" | "warning";
  active?: boolean;
};

type InternalProps = {
  layout: "default" | "icon-only";
  color: Required<RootBaseProps>["color"] | "disabled";
};

type RootProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLButtonElement
> &
  TgphComponentProps<typeof Box> &
  RootBaseProps;

const ButtonContext = React.createContext<
  Required<Omit<RootBaseProps, "color" | "as"> & InternalProps>
>({
  variant: "solid",
  size: "2",
  color: "gray",
  state: "default",
  layout: "default",
  active: false,
});

const Root = <T extends TgphElement>({
  as,
  variant = "solid",
  size = "2",
  color: initialColor = "gray",
  state: initialState = "default",
  active = false,
  disabled,
  className,
  ...props
}: RootProps<T>) => {
  const state = disabled ? "disabled" : initialState;
  const color = state === "disabled" ? "disabled" : initialColor;

  const layout = React.useMemo<InternalProps["layout"]>(() => {
    const children = React.Children.toArray(props?.children);
    if (children?.length === 1 && React.isValidElement(children[0])) {
      const child = children[0] as
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
  }, [props?.children]);

  return (
    <ButtonContext.Provider
      value={{ variant, size, color, state, layout, active }}
    >
      <Box
        as={as || "button"}
        className={clsx(
          "appearance-none border-0 cursor-pointer bg-none box-border [font-family:inherit]",
          "inline-flex items-center justify-center rounded-3 transition-colors no-underline",
          state === "disabled" && "cursor-not-allowed",
          buttonColorMap[variant][color],
          buttonSizeMap[layout][size],
          className,
        )}
        data-tgph-button
        data-tgph-button-layout={layout}
        data-tgph-button-active={active}
        disabled={disabled}
        {...props}
      />
    </ButtonContext.Provider>
  );
};

type IconProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphIcon<T>
>;

const Icon = <T extends TgphElement>({
  size,
  color,
  variant,
  icon,
  alt,
  "aria-hidden": ariaHidden,
  ...props
}: IconProps<T>) => {
  const context = React.useContext(ButtonContext);

  const iconProps = {
    size: size ?? iconSizeMap[context.size],
    color: color ?? iconColorMap[context.variant][context.color],
    variant: variant ?? iconVariantMap[context.layout],
  };

  const a11yProps = !alt ? { "aria-hidden": ariaHidden } : { alt };

  return (
    <TelegraphIcon
      icon={icon}
      data-button-icon
      {...a11yProps}
      {...iconProps}
      {...props}
    />
  );
};

type TextProps<T extends TgphElement> = Omit<
  TgphComponentProps<typeof TelegraphText<T>>,
  "as"
> & {
  as?: T;
};

const Text = <T extends TgphElement>({
  as,
  color,
  size,
  weight = "medium",
  className,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(ButtonContext);

  return (
    <TelegraphText
      as={(as || "span") as T}
      color={color ?? textColorMap[context.variant][context.color]}
      size={size ?? textSizeMap[context.size]}
      weight={weight}
      className={clsx("no-underline whitespace-nowrap", className)}
      internal_optionalAs={true}
      data-button-text
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
type DefaultProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root> &
  BaseDefaultProps;

const Default = <T extends TgphElement>({
  leadingIcon,
  trailingIcon,
  icon,
  children,
  ...props
}: DefaultProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  return (
    <Root {...props}>
      {combinedLeadingIcon && <Icon {...combinedLeadingIcon} />}
      {children && <Text>{children}</Text>}
      {trailingIcon && <Icon {...trailingIcon} />}
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
