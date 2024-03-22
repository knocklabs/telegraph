import type { Optional, PropsWithAs, Required } from "@telegraph/helpers";
import { Icon as TelegraphIcon } from "@telegraph/icon";
import { Text as TypographyText } from "@telegraph/typography";
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

type RootProps = RootBaseProps;

type RootRef = React.LegacyRef<HTMLButtonElement>;

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

const Root = React.forwardRef(
  (
    {
      as = "button",
      variant = "solid",
      size = "2",
      color: initialColor = "gray",
      state: initialState = "default",
      active = false,
      disabled,
      className,
      ...props
    }: PropsWithAs<"button", RootProps>,
    forwardedRef: RootRef,
  ) => {
    const state = disabled ? "disabled" : initialState;
    const color = state === "disabled" ? "disabled" : initialColor;

    const layout = React.useMemo<InternalProps["layout"]>(() => {
      const children = React.Children.toArray(props?.children);
      if (children?.length === 1 && React.isValidElement(children[0])) {
        const child = children[0] as React.ReactComponentElement<typeof Icon>;
        if (child?.props?.icon) {
          return "icon-only";
        }
      }
      return "default";
    }, [props?.children]);

    const ButtonComponent = as;
    return (
      <ButtonContext.Provider
        value={{ variant, size, color, state, layout, active }}
      >
        <ButtonComponent
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
          ref={forwardedRef}
          disabled={disabled}
          {...props}
        />
      </ButtonContext.Provider>
    );
  },
  // In order to use generics with forwardRef, you need to recast,
  // see source: https://fettblog.eu/typescript-react-generic-forward-refs/
) as <T extends React.ElementType>(
  props: PropsWithAs<T, RootProps> & { ref?: RootRef },
) => React.ReactElement;

type IconProps = React.ComponentProps<typeof TelegraphIcon>;

type IconRef = React.ElementRef<typeof TelegraphIcon>;

// Need to expilictly define the Icon type to avoid portable reference
// error when using the Icon component in the Button component. Should
// look for an alternative solution to avoid this error and remove the
// explicit type definition.
//
// See source: https://typescript.tv/errors/#ts2742
const Icon: typeof TelegraphIcon = React.forwardRef<IconRef, IconProps>(
  ({ size, color, variant, ...props }, forwardedRef) => {
    Icon.displayName = "Icon";

    const context = React.useContext(ButtonContext);
    const iconProps = {
      size: size ?? iconSizeMap[context.size],
      color: color ?? iconColorMap[context.variant][context.color],
      variant: variant ?? iconVariantMap[context.layout],
    };

    return (
      <TelegraphIcon
        ref={forwardedRef}
        data-button-icon
        {...props}
        {...iconProps}
      />
    );
  },
);

type TextProps = Optional<React.ComponentProps<typeof TypographyText>, "as">;

type TextRef = React.ElementRef<typeof TypographyText>;

const Text = React.forwardRef<TextRef, TextProps>(
  (
    { as, color, size, weight = "medium", className, ...props },
    forwardedRef,
  ) => {
    Text.displayName = "Text";

    const context = React.useContext(ButtonContext);
    const textProps = {
      as: as ?? "span",
      color: color ?? textColorMap[context.variant][context.color],
      size: size ?? textSizeMap[context.size],
      weight,
    };

    return (
      <TypographyText
        ref={forwardedRef}
        className={clsx("no-underline", className)}
        data-button-text
        {...props}
        {...textProps}
      />
    );
  },
);

type DefaultIconProps = React.ComponentProps<typeof Icon>;

type DefaultProps =
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

const Default = React.forwardRef(
  (
    {
      leadingIcon,
      trailingIcon,
      icon,
      children,
      ...props
    }: PropsWithAs<"button", DefaultProps & RootProps>,
    forwardedRef: RootRef,
  ) => {
    const combinedLeadingIcon = leadingIcon || icon;
    return (
      <Root {...props} ref={forwardedRef}>
        {combinedLeadingIcon && <Icon {...combinedLeadingIcon} />}
        {children && <Text>{children}</Text>}
        {trailingIcon && <Icon {...trailingIcon} />}
      </Root>
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, DefaultProps & RootProps> & { ref?: RootRef },
) => React.ReactElement;

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
