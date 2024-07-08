import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text as TelegraphText } from "@telegraph/typography";
import clsx from "clsx";
import React from "react";

import {
  buttonSizeMap,
  iconColorMap,
  iconSizeMap,
  iconVariantMap,
  textColorMap,
  textSizeMap,
} from "./Button.constants";
import {
  type GhostVariant,
  type OutlineVariant,
  type SoftVariant,
  type SolidVariant,
  baseStyles,
  ghostVariant,
  outlineVariant,
  softVariant,
  solidVariant,
} from "./Button.css";

type RootBaseProps = {
  variant?: "solid" | "soft" | "outline" | "ghost";
  size?: "0" | "1" | "2" | "3";
  state?: "default" | "loading" | "disabled" | "error" | "success" | "warning";
  active?: boolean;
} & (
  | ({
      variant?: "solid";
    } & SolidVariant)
  | ({
      variant?: "soft";
    } & SoftVariant)
  | ({
      variant?: "outline";
    } & OutlineVariant)
  | ({
      variant?: "ghost";
    } & GhostVariant)
);

type InternalProps = {
  layout: "default" | "icon-only";
  color: Required<RootBaseProps>["color"];
};

type RootProps<T extends TgphElement> = Omit<
  TgphComponentProps<typeof Stack>,
  "tgphRef"
> &
  PolymorphicPropsWithTgphRef<T, HTMLButtonElement> &
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
  color = "gray",
  state: initialState = "default",
  active = false,
  disabled,
  className,
  ...props
}: RootProps<T>) => {
  const state = disabled ? "disabled" : initialState;

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
      <Stack
        as={as || "button"}
        className={clsx(
          baseStyles,
          variant === "solid" && solidVariant({ color }),
          variant === "soft" && softVariant({ color }),
          variant === "outline" && outlineVariant({ color }),
          variant === "ghost" && ghostVariant({ color }),
          className,
        )}
        {...buttonSizeMap[layout][size]}
        display="inline-flex"
        align="center"
        justify="center"
        rounded="3"
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
    color:
      color ??
      iconColorMap[context.variant][
        context.state === "disabled" ? "disabled" : context.color
      ],
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
      color={
        color ??
        textColorMap[context.variant][
          context.state === "disabled" ? "disabled" : context.color
        ]
      }
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
