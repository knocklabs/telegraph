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

// The `as` prop is a generic prop that allows you to change the underlying
// element of a component. This is useful for creating a component that can
// be used as a button, link, or any other element.
type AsProp<C extends React.ElementType> = {
  as?: C;
};

// The `PropsWithAs` type is a utility type that allows you to create a
// component that can be used as a button, link, or any other element.
// It takes a generic type `C` that extends `React.ElementType` and a
// generic type `P` that extends `object`. It returns a type that includes
// the `as` prop and all the props of the underlying element type `C`.
// This allows you to create a component that can be used as a button, link,
// or any other element, and pass all the props of the underlying element type.
type PropsWithAs<C extends React.ElementType, P> = AsProp<C> &
  Omit<React.ComponentProps<C>, keyof AsProp<C>> &
  P;

type RootBaseProps = {
  variant?: "solid" | "soft" | "outline" | "ghost";
  size?: "1" | "2" | "3";
  color?: "accent" | "gray" | "red" | "green" | "blue" | "yellow";
  state?: "default" | "loading" | "disabled" | "error" | "success" | "warning";
};

type InternalProps = {
  layout: "default" | "icon-only";
  color: Required<RootBaseProps>["color"] | "disabled";
};

type RootProps = RootBaseProps;

type RootRef = React.LegacyRef<HTMLButtonElement>;

type Required<T> = {
  [P in keyof T]-?: T[P];
};

const ButtonContext = React.createContext<
  Required<Omit<RootBaseProps, "color" | "as"> & InternalProps>
>({
  variant: "solid",
  size: "2",
  color: "gray",
  state: "default",
  layout: "default",
});

const Root = React.forwardRef(
  (
    {
      as = "button",
      variant = "solid",
      size = "2",
      color: initialColor = "gray",
      state: initialState = "default",
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
      <ButtonContext.Provider value={{ variant, size, color, state, layout }}>
        <ButtonComponent
          className={clsx(
            "appearance-none border-0 cursor-pointer bg-none box-border [font-family:inherit]",
            "inline-flex items-center justify-center rounded-3 transition-colors no-underline",
            state === "disabled" && "cursor-not-allowed",
            buttonColorMap[variant][color],
            buttonSizeMap[layout][size],
            className,
          )}
          data-button-layout={layout}
          ref={forwardedRef}
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

type TextProps = Omit<React.ComponentProps<typeof TypographyText>, "as"> & {
  as?: React.ComponentProps<typeof TypographyText>["as"];
};

type TextRef = React.ElementRef<typeof TypographyText>;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ as, color, size, className, ...props }, forwardedRef) => {
    Text.displayName = "Text";

    const context = React.useContext(ButtonContext);
    const textProps = {
      as: as ?? "span",
      color: color ?? textColorMap[context.variant][context.color],
      size: size ?? textSizeMap[context.size],
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
