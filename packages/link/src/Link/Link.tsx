import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  RemappedOmit,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text as TelegraphText } from "@telegraph/typography";
import type { TextProps as TypographyTextProps } from "@telegraph/typography";
import React from "react";

import {
  LINK_ICON_SIZE_MAP,
  LINK_SIZE_MAP,
  LINK_WEIGHT_MAP,
  getLinkBorderColor,
} from "./Link.constants";

type RootBaseProps = {
  size?: keyof typeof LINK_SIZE_MAP;
  color?: TypographyTextProps["color"];
  weight?: keyof typeof LINK_WEIGHT_MAP;
};

type InternalProps = {
  size: Required<RootBaseProps>["size"];
  color: Required<RootBaseProps>["color"];
  weight: Required<RootBaseProps>["weight"];
};

export type RootProps<T extends TgphElement = "a"> = Omit<
  TgphComponentProps<typeof Stack>,
  "as" | "tgphRef" | "color"
> &
  PolymorphicPropsWithTgphRef<T, HTMLAnchorElement> &
  RootBaseProps;

const LinkContext = React.createContext<InternalProps>({
  size: "2",
  color: "blue",
  weight: "regular",
});

const Root = <T extends TgphElement = "a">({
  as,
  size = "2",
  color = "blue",
  weight = "regular",
  ...props
}: RootProps<T>) => {
  const borderColor = getLinkBorderColor(color);

  return (
    <LinkContext.Provider value={{ size, color, weight }}>
      <Stack
        as={(as || "a") as T}
        display="inline-flex"
        align="center"
        gap="1"
        borderColor={borderColor}
        data-tgph-link
        data-tgph-link-size={size}
        data-tgph-link-color={color}
        data-tgph-link-weight={weight}
        {...props}
      />
    </LinkContext.Provider>
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
  size,
  color,
  weight,
  style,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(LinkContext);
  return (
    <TelegraphText
      as={(as || "span") as T}
      size={size ?? LINK_SIZE_MAP[context.size]}
      color={color ?? context.color}
      weight={weight ?? LINK_WEIGHT_MAP[context.weight]}
      internal_optionalAs={true}
      data-link-text
      style={{
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    />
  );
};

export type IconProps<T extends TgphElement = "span"> = TgphComponentProps<
  typeof TelegraphIcon<T>
>;

const Icon = <T extends TgphElement = "span">({
  icon,
  size,
  color,
  ...props
}: IconProps<T>) => {
  const context = React.useContext(LinkContext);
  return (
    <TelegraphIcon
      icon={icon}
      size={size ?? LINK_ICON_SIZE_MAP[context.size]}
      color={color ?? context.color}
      data-link-icon
      {...props}
    />
  );
};

type DefaultIconProps = React.ComponentProps<typeof Icon>;
type DefaultTextProps = React.ComponentProps<typeof Text>;
export type DefaultProps<T extends TgphElement = "a"> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root<T>> & {
    icon?: DefaultIconProps;
    textProps?: DefaultTextProps;
  };

const Default = <T extends TgphElement = "a">({
  icon,
  textProps,
  children,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root {...props}>
      {children && <Text {...textProps}>{children}</Text>}
      {icon && <Icon {...icon} />}
    </Root>
  );
};

Object.assign(Default, {
  Root,
  Text,
  Icon,
});

const Link = Default as typeof Default & {
  Root: typeof Root;
  Text: typeof Text;
  Icon: typeof Icon;
};

export { Link };
