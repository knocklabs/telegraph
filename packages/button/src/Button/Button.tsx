import {
  type PolymorphicProps,
  type PolymorphicPropsWithTgphRef,
  type Required,
  type TgphComponentProps,
  type TgphElement,
  useDeterminateState,
} from "@telegraph/helpers";
import { Lucide, Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text as TelegraphText } from "@telegraph/typography";
import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

import {
  buttonSizeMap,
  iconColorMap,
  iconSizeMap,
  iconVariantMap,
  roundedMap,
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
  loadingIconStyles,
  outlineVariant,
  softVariant,
  solidVariant,
} from "./Button.css";

type RootBaseProps = {
  variant?: "solid" | "soft" | "outline" | "ghost";
  size?: "0" | "1" | "2" | "3";
  state?: "default" | "loading";
  active?: boolean;
} & SolidVariant &
  SoftVariant &
  OutlineVariant &
  GhostVariant;

type InternalProps = {
  layout: "default" | "icon-only";
  color: Required<RootBaseProps>["color"];
  state: Required<RootBaseProps>["state"] | "disabled" | "active";
};

type RootProps<T extends TgphElement> = Omit<
  TgphComponentProps<typeof Stack>,
  "tgphRef"
> &
  PolymorphicPropsWithTgphRef<T, HTMLButtonElement> &
  RootBaseProps;

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
  disabled,
  className,
  children,
  ...props
}: RootProps<T>) => {
  const derivedState = deriveState({ state: stateProp, disabled, active });
  const state = useDeterminateState<DefaultProps<T>["state"]>({
    value: derivedState,
    determinateValue: "loading",
    minDurationMs: 1200,
  });

  // If the button is in a disabled state, we don't want any clicks to fire.
  // To do this reliably, we convert the element back to a button if it is
  // disabled. We do this so we can use the native button element's disabled
  // state to prevent clicks.
  const derivedAs = disabled ? "button" : as;

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
        as={derivedAs || "button"}
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
        rounded={roundedMap[size]}
        data-tgph-button
        data-tgph-button-layout={layout}
        data-tgph-button-state={state}
        disabled={state === "disabled" || state === "loading"}
        {...props}
      >
        {state === "loading" && (
          <Icon
            as={motion.span}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            className={loadingIconStyles}
            icon={Lucide.LoaderCircle}
            aria-hidden={true}
          />
        )}
        {children}
      </Stack>
    </ButtonContext.Provider>
  );
};

type IconProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphIcon<T>
> & {
  internal_iconType?: "leading" | "trailing";
};

const Icon = <T extends TgphElement>({
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
    size: size ?? iconSizeMap[context.size],
    color:
      color ??
      iconColorMap[context.variant][
        context.state === "disabled" ? "disabled" : context.color
      ],
    variant: variant ?? iconVariantMap[context.layout],
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
  style,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(ButtonContext);
  const derivedColor =
    color ??
    textColorMap[context.variant][
      context.state === "disabled" ? "disabled" : context.color
    ];
  return (
    <TelegraphText
      as={(as || "span") as T}
      color={derivedColor}
      size={size ?? textSizeMap[context.size]}
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
