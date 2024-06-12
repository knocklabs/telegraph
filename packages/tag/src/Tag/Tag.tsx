import { Button as TelegraphButton } from "@telegraph/button";
import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Lucide, Icon as TelegraphIcon } from "@telegraph/icon";
import { Box } from "@telegraph/layout";
import { Text as TelegraphText } from "@telegraph/typography";
import { clsx } from "clsx";
import React from "react";

import { COLOR, SIZE } from "./Tag.constants";

type RootBaseProps = {
  size?: "1" | "2";
  color?: keyof (typeof COLOR.Root)["soft"];
  variant?: keyof typeof COLOR.Root;
};

type RootProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLSpanElement
> &
  TgphComponentProps<typeof Box> &
  RootBaseProps;

const TagContext = React.createContext<Required<RootBaseProps>>({
  size: "1",
  color: "default",
  variant: "soft",
});

const Root = <T extends TgphElement>({
  as = "span" as T,
  size = "1",
  color = "default",
  variant = "soft",
  className,
  ...props
}: RootProps<T>) => {
  return (
    <TagContext.Provider value={{ size, color, variant }}>
      <Box
        as={as}
        className={clsx(
          "inline-flex items-center rounded-3 pl-2",
          SIZE.Root[size],
          COLOR.Root[variant][color],
          className,
        )}
        {...props}
        data-tag
      />
    </TagContext.Provider>
  );
};

type TextProps<T extends TgphElement> = Omit<
  TgphComponentProps<typeof TelegraphText<T>>,
  "as"
> & {
  as?: T;
};

const Text = <T extends TgphElement>({
  as = "span" as T,
  className,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(TagContext);
  return (
    <TelegraphText
      as={as}
      size={context.size}
      color={COLOR.Text[context.variant][context.color]}
      className={clsx("rounded-tl-0 rounded-bl-0 mr-2", className)}
      {...props}
    />
  );
};
type ButtonProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphButton<T>
>;

const Button = <T extends TgphElement>({
  className,
  ...props
}: ButtonProps<T>) => {
  const context = React.useContext(TagContext);
  return (
    <TelegraphButton
      size={context.size}
      color={COLOR.Button[context.variant][context.color]}
      variant={context.variant}
      icon={{ icon: Lucide.X, alt: "close" }}
      className={clsx("rounded-tl-0 rounded-bl-0", className)}
      {...props}
    />
  );
};
type IconProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphIcon<T>
>;

const Icon = <T extends TgphElement>({
  icon,
  alt,
  "aria-hidden": ariaHidden,
  className,
  ...props
}: IconProps<T>) => {
  const context = React.useContext(TagContext);
  const a11yProps = !alt ? { "aria-hidden": ariaHidden } : { alt };
  return (
    <TelegraphIcon
      icon={icon}
      size={context.size}
      color={COLOR.Icon[context.variant][context.color]}
      className={clsx("rounded-tl-0 rounded-bl-0 mr-1", className)}
      {...a11yProps}
      {...props}
    />
  );
};

type DefaultProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root> & {
    icon?: React.ComponentProps<typeof TelegraphIcon>;
    onCopy?: () => void;
    onRemove?: () => void;
  };

const Default = <T extends TgphElement>({
  color = "default",
  size = "1",
  variant = "soft",
  icon,
  onRemove,
  onCopy,
  children,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root color={color} size={size} variant={variant} {...props}>
      {icon && <Icon {...icon} />}
      <Text as="span">{children}</Text>
      {onRemove && (
        <Button onClick={onRemove} icon={{ icon: Lucide.X, alt: "Remove" }} />
      )}
      {onCopy && (
        <Button
          onClick={onCopy}
          icon={{ icon: Lucide.Copy, alt: "Copy text" }}
        />
      )}
    </Root>
  );
};

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
