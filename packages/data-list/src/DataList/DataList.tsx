import { type RemappedOmit, TgphElement } from "@telegraph/helpers";
import { Icon, type IconProps } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { Tooltip, type TooltipProps } from "@telegraph/tooltip";
import { Text, type TextProps } from "@telegraph/typography";
import React from "react";

// `StackProps<T>` rather than `TgphComponentProps<typeof Stack>`: extracting
// props from a generic component instantiates its parameter at the constraint,
// which erases the passthrough. Threading `T` keeps Stack's props intact.
export type ListProps<T extends TgphElement = "div"> = StackProps<T>;

const List = <T extends TgphElement = "div">(listProps: ListProps<T>) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so every prop would otherwise be an
  // unresolved indexed access intersected with its declared type.
  const {
    direction = "column",
    gap = "4",
    ...props
  } = listProps as ListProps<"div">;
  return (
    <Stack
      direction={direction}
      gap={gap}
      {...(props as Omit<ListProps<"div">, "direction" | "gap">)}
    />
  );
};

export type ListItemProps<T extends TgphElement = "div"> = StackProps<T>;

const ListItem = <T extends TgphElement = "div">(
  listItemProps: ListItemProps<T>,
) => {
  // Read through the default element: see the note on `List`.
  const {
    direction = "row",
    gap = "1",
    align = "baseline",
    ...props
  } = listItemProps as ListItemProps<"div">;
  return (
    <Stack
      direction={direction}
      gap={gap}
      align={align}
      {...(props as Omit<ListItemProps<"div">, "direction" | "gap" | "align">)}
    />
  );
};

export type LabelProps<T extends TgphElement = "div"> = {
  // `TextProps` / `IconProps` / `TooltipProps` rather than
  // `TgphComponentProps<typeof X>`: the bare form instantiates each generic at
  // its constraint and erases the passthrough. These nested prop bags are
  // rendered with the component's default element, so the defaulted props type
  // is the accurate one.
  textProps?: TextProps;
  icon?: IconProps;
  description?: React.ReactNode;
  tooltipProps?: Omit<Partial<TooltipProps>, "enabled" | "label">;
} & StackProps<T>;

const Label = <T extends TgphElement = "div">(labelProps: LabelProps<T>) => {
  // Read through the default element: see the note on `List`.
  const {
    maxW = "36",
    w = "full",
    icon,
    children,
    textProps,
    description,
    tooltipProps,
    ...props
  } = labelProps as LabelProps<"div">;

  const {
    color = "gray",
    weight = "medium",
    size = "1",
    ...restTextProps
  } = textProps || ({} as TextProps);

  return (
    <Stack
      direction="row"
      align="baseline"
      gap="2"
      maxW={maxW}
      w={w}
      {...(props as Omit<
        LabelProps<"div">,
        | "maxW"
        | "w"
        | "icon"
        | "children"
        | "textProps"
        | "description"
        | "tooltipProps"
        | "direction"
        | "align"
        | "gap"
      >)}
    >
      {icon && (
        <Stack alignSelf="center">
          <Icon
            size="0"
            color="gray"
            // `RemappedOmit` rather than `Omit`: Icon's props are a union over
            // the `alt` / `aria-hidden` XOR, and `Omit` collapses that union
            // into one object where both sides look present.
            {...(icon as RemappedOmit<IconProps, "size" | "color">)}
          />
        </Stack>
      )}
      <Tooltip label={description} enabled={!!description} {...tooltipProps}>
        <Stack direction="row" align="center" minH="6">
          <Text
            as="label"
            // `as` stays in the spread so a caller-supplied `textProps.as` keeps
            // winning as it does today; it is only omitted from the cast type so
            // it is not reported as specified twice.
            {...(restTextProps as Omit<
              TextProps<"label">,
              "as" | "color" | "weight" | "size"
            >)}
            color={color}
            weight={weight}
            size={size}
            borderBottom={description ? "px" : undefined}
            borderStyle={description ? "dashed" : undefined}
          >
            {children}
          </Text>
        </Stack>
      </Tooltip>
    </Stack>
  );
};

export type ValueProps<T extends TgphElement = "div"> = StackProps<T>;

const Value = <T extends TgphElement = "div">(valueProps: ValueProps<T>) => {
  // Read through the default element: see the note on `List`.
  const { w = "full", minW = "0", ...props } = valueProps as ValueProps<"div">;
  return (
    <Stack
      w={w}
      minW={minW}
      {...(props as Omit<ValueProps<"div">, "w" | "minW">)}
    />
  );
};

export type ItemProps<T extends TgphElement = "div"> = ListItemProps<T> & {
  label: React.ReactNode | string;
  icon?: IconProps;
  description?: React.ReactNode;
  labelProps?: LabelProps;
  valueProps?: ValueProps;
};

const Item = <T extends TgphElement = "div">(itemProps: ItemProps<T>) => {
  // Read through the default element: see the note on `List`.
  const {
    label,
    direction,
    icon,
    children,
    description,
    labelProps,
    valueProps,
    ...props
  } = itemProps as ItemProps<"div">;
  return (
    <ListItem
      direction={direction}
      {...(props as Omit<
        ItemProps<"div">,
        | "label"
        | "direction"
        | "icon"
        | "children"
        | "description"
        | "labelProps"
        | "valueProps"
      >)}
    >
      <Label icon={icon} description={description} {...labelProps}>
        {label}
      </Label>
      <Value {...valueProps}>{children}</Value>
    </ListItem>
  );
};

const DataList = {
  List,
  ListItem,
  Label,
  Value,
  Item,
};

export { DataList };
