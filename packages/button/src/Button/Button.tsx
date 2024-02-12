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
  color?: "accent" | "gray" | "red";
  state?: "default" | "loading" | "disabled" | "error" | "success" | "warning";
};

type InternalProps = {
  layout: "default" | "icon-only";
};

type RootProps = RootBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type RootRef = HTMLButtonElement;

// Might make sense to move this into a shared
// package to be used across all components if we
// start to see more of these kinds of types.
type Required<T> = {
  [P in keyof T]-?: T[P];
};

const ButtonContext = React.createContext<
  Required<RootBaseProps & InternalProps>
>({
  variant: "solid",
  size: "2",
  color: "gray",
  state: "default",
  layout: "default",
});

const Root = React.forwardRef<RootRef, RootProps>(
  (
    {
      variant = "solid",
      size = "2",
      color = "gray",
      state: initialState = "default",
      disabled,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const state = disabled ? "disabled" : initialState;
    const [layout, setLayout] =
      React.useState<InternalProps["layout"]>("default");

    // Check if "Icon" is the only child so we can set the kind of layout
    React.useEffect(() => {
      const children = React.Children.toArray(props.children);
      if (children?.length === 1 && React.isValidElement(children[0])) {
        const child = children[0] as React.ReactComponentElement<typeof Icon>;
        if (child?.type?.displayName === "Icon") {
          return setLayout("icon-only");
        }
        return setLayout("default");
      }
    }, [props.children]);

    return (
      <ButtonContext.Provider value={{ variant, size, color, state, layout }}>
        <button
          className={clsx(
            buttonColorMap[variant][color],
            buttonSizeMap[layout][size],
            "inline-flex items-center justify-center rounded-3 transition-colors",
            className,
          )}
          ref={forwardedRef}
          {...props}
        />
      </ButtonContext.Provider>
    );
  },
);

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
    return <TelegraphIcon ref={forwardedRef} {...props} {...iconProps} />;
  },
);

type TextProps = Omit<React.ComponentProps<typeof TypographyText>, "as"> & {
  as?: React.ComponentProps<typeof TypographyText>["as"];
};

type TextRef = React.ElementRef<typeof TypographyText>;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ as, color, size, ...props }, forwardedRef) => {
    Text.displayName = "Text";

    const context = React.useContext(ButtonContext);
    const textProps = {
      as: as ?? "span",
      color: color ?? textColorMap[context.variant][context.color],
      size: size ?? textSizeMap[context.size],
    };

    return <TypographyText ref={forwardedRef} {...props} {...textProps} />;
  },
);

type DefaultIconProps = React.ComponentProps<typeof Icon>;

type DefaultProps = React.ComponentProps<typeof Root> &
  (
    | {
        leadingIcon?: DefaultIconProps;
        trailingIcon?: DefaultIconProps;
        icon?: never;
      }
    | {
        icon?: DefaultIconProps;
        leadingIcon?: never;
        trailingIcon?: never;
      }
  );

const Default = ({
  leadingIcon,
  trailingIcon,
  icon,
  children,
  ...props
}: DefaultProps) => {
  const combinedLeadingIcon = leadingIcon || icon;
  return (
    <Root {...props}>
      {combinedLeadingIcon && <Icon {...combinedLeadingIcon} />}
      {children}
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
