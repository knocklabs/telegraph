import { Text as TypographyText } from "@telegraph/typography";
import clsx from "clsx";
import React from "react";

import { buttonColorMap, textColorMap, textSizeMap } from "./prop-mappings";

type RootBaseProps = {
  variant?: "solid" | "soft" | "outline" | "ghost";
  size?: "1" | "2" | "3";
  color?: "accent" | "gray" | "red";
  state?: "default" | "loading" | "disabled" | "error" | "success" | "warning";
};

type RootProps = RootBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type RootRef = HTMLButtonElement;

type Required<T> = {
  [P in keyof T]-?: T[P];
};

const ButtonContext = React.createContext<Required<RootBaseProps>>({
  variant: "solid",
  size: "2",
  color: "gray",
  state: "default",
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
    return (
      <ButtonContext.Provider value={{ variant, size, color, state }}>
        <button
          className={clsx(buttonColorMap[variant][color], className)}
          ref={forwardedRef}
          {...props}
        />
      </ButtonContext.Provider>
    );
  },
);

type IconProps = {
  size: "1" | "2" | "3";
};

type IconRef = HTMLSpanElement;

const Icon = React.forwardRef<IconRef, IconProps>(
  ({ ...props }, forwardedRef) => {
    return <span ref={forwardedRef} {...props} />;
  },
);

type TextProps = Omit<React.ComponentProps<typeof TypographyText>, "as"> & {
  as?: React.ComponentProps<typeof TypographyText>["as"];
};

type TextRef = React.ElementRef<typeof TypographyText>;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ ...props }, forwardedRef) => {
    const context = React.useContext(ButtonContext);
    const textProps = {
      as: props.as ?? "span",
      color: props.color ?? textColorMap[context.variant][context.color],
      size: props.size ?? textSizeMap[context.size],
    };

    return <TypographyText ref={forwardedRef} {...props} {...textProps} />;
  },
);

const Default = () => {};

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
