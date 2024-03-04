import { Button as TelegraphButton } from "@telegraph/button";
import {
  Icon as TelegraphIcon,
  closeSharp,
  copyOutline,
} from "@telegraph/icon";
import { Text as TelegraphText } from "@telegraph/typography";
import { clsx } from "clsx";
import React from "react";

import { COLOR, SIZE } from "./Tag.constants";

type RootBaseProps = {
  size?: "1" | "2";
  color?: React.ComponentProps<typeof TelegraphButton>["color"] & "default";
  variant?: "soft" | "solid";
};

type RootProps = React.HTMLAttributes<RootRef> & RootBaseProps;

type RootRef = HTMLSpanElement;

const TagContext = React.createContext<RootBaseProps>({
  size: "1",
  color: "default",
  variant: "soft",
});

const Root = React.forwardRef<RootRef, RootProps>(
  (
    { size = "1", color = "default", variant = "soft", className, ...props },
    forwardedRef,
  ) => {
    return (
      <TagContext.Provider value={{ size, color, variant }}>
        <span
          className={clsx(
            "inline-flex items-center rounded-3 pl-2",
            SIZE.Root[size],
            COLOR.Root[variant][color],
            className,
          )}
          {...props}
          ref={forwardedRef}
          data-tag
        />
      </TagContext.Provider>
    );
  },
);

type TextProps = Omit<React.ComponentProps<typeof TelegraphText>, "as"> & {
  as: React.ComponentProps<typeof TelegraphText>["as"];
};

type TextRef = React.ElementRef<typeof TelegraphText>;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ as = "span", className, ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphText
        as={as}
        size={context.size}
        color={COLOR.Text[context.variant][context.color]}
        className={clsx("rounded-tl-0 rounded-bl-0 mr-2", className)}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

type ButtonProps = React.ComponentProps<typeof TelegraphButton.Root>;
type ButtonRef = React.ElementRef<typeof TelegraphButton.Root>;

const Button = React.forwardRef<ButtonRef, ButtonProps>(
  ({ className, ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphButton
        size={context.size}
        color={COLOR.Button[context.variant][context.color]}
        variant={context.variant}
        icon={{ icon: closeSharp, alt: "close" }}
        className={clsx("rounded-tl-0 rounded-bl-0", className)}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

type IconProps = React.ComponentProps<typeof TelegraphIcon>;
type IconRef = React.ElementRef<typeof TelegraphIcon>;

const Icon = React.forwardRef<IconRef, IconProps>(
  ({ className, ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphIcon
        size={context.size}
        color={COLOR.Icon[context.variant][context.color]}
        className={clsx("rounded-tl-0 rounded-bl-0 mr-1", className)}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

type DefaultProps = React.ComponentProps<typeof Root> & {
  text: string;
  icon?: React.ComponentProps<typeof TelegraphIcon>
  onCopy?: () => void;
  onRemove?: () => void;
};
type DefaultRef = React.ElementRef<typeof Root>;

const Default = React.forwardRef<DefaultRef, DefaultProps>(
  (
    {
      color = "default",
      size = "1",
      variant = "soft",
      icon,
      onRemove,
      onCopy,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Root color={color} size={size} variant={variant} {...props} ref={ref}>
        {icon && <Icon {...icon} />}
        <Text>{children}</Text>
        {onRemove && (
          <Button
            onClick={onRemove}
            icon={{ icon: closeSharp, alt: "Copy Text" }}
          />
        )}
        {onCopy && (
          <Button
            onClick={onCopy}
            icon={{ icon: copyOutline, alt: "Remove" }}
          />
        )}
      </Root>
    );
  },
);

Object.assign(Default, {
  Root,
  Button,
  Text,
  Icon,
});

const Tag = Default as typeof Default & {
  Root: typeof Root;
  Button: typeof Button;
  Text: typeof Text;
  Icon: typeof Icon;
};

export { Tag };
