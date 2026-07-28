import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  RemappedOmit,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
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

// `StackProps<T>` rather than `TgphComponentProps<typeof Stack>`: extracting
// props from a generic component instantiates its parameter at the constraint,
// which erases the passthrough. Threading `T` keeps Stack's props intact.
export type RootProps<T extends TgphElement = "a"> = Omit<
  StackProps<T>,
  "as" | "tgphRef" | "color"
> &
  PolymorphicPropsWithTgphRef<T, HTMLAnchorElement> &
  RootBaseProps;

const LinkContext = React.createContext<InternalProps>({
  size: "2",
  color: "blue",
  weight: "regular",
});

const Root = <T extends TgphElement = "a">(rootProps: RootProps<T>) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so every prop would otherwise be an
  // unresolved indexed access intersected with its declared type.
  const {
    as,
    size = "2",
    color = "blue",
    weight = "regular",
    ...props
  } = rootProps as RootProps<"a">;

  const borderColor = getLinkBorderColor(color);

  return (
    <LinkContext.Provider value={{ size, color, weight }}>
      <Stack
        as={as || "a"}
        display="inline-flex"
        align="center"
        gap="1"
        // `getLinkBorderColor` builds its non-special values as a
        // `${color}-11` template, which widens to `string`. Narrow the type at
        // the boundary; the value is unchanged.
        borderColor={borderColor as StackProps["borderColor"]}
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

const Text = <T extends TgphElement = "span">(linkTextProps: TextProps<T>) => {
  const { as, size, color, weight, style, ...props } =
    linkTextProps as TextProps<"span">;
  const context = React.useContext(LinkContext);
  return (
    <TelegraphText
      as={as || "span"}
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

const Icon = <T extends TgphElement = "span">(linkIconProps: IconProps<T>) => {
  const { icon, size, color, ...props } = linkIconProps as IconProps<"span">;
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

// The nested `Link.Icon` / `Link.Text` props, at their own default element:
// `React.ComponentProps<typeof Icon>` on a generic component instantiates its
// parameter at the constraint, which erases the passthrough. `as` stays open
// (`Link.Text` renders whatever element it is handed, and that is covered by a
// test) — only the passthrough is pinned to the default element.
type DefaultIconProps = RemappedOmit<IconProps, "as"> & { as?: TgphElement };
type DefaultTextProps = RemappedOmit<TextProps, "as"> & { as?: TgphElement };
export type DefaultProps<T extends TgphElement = "a"> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root<T>> & {
    icon?: DefaultIconProps;
    textProps?: DefaultTextProps;
  };

const Default = <T extends TgphElement = "a">(linkProps: DefaultProps<T>) => {
  const { icon, textProps, children, ...props } =
    linkProps as DefaultProps<"a">;
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
