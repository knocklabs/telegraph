import { TgphComponentProps } from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import React from "react";

export type ListProps = TgphComponentProps<typeof Stack>;

const List = ({ direction = "column", gap = "4", ...props }: ListProps) => {
  return <Stack direction={direction} gap={gap} {...props} />;
};

export type ListItemProps = TgphComponentProps<typeof Stack>;

const ListItem = ({
  direction = "row",
  gap = "1",
  align = "baseline",
  ...props
}: ListItemProps) => {
  return <Stack direction={direction} gap={gap} align={align} {...props} />;
};

export type LabelProps = {
  textProps?: TgphComponentProps<typeof Text>;
  icon?: TgphComponentProps<typeof Icon>;
  description?: React.ReactNode;
  tooltipProps?: Omit<
    Partial<TgphComponentProps<typeof Tooltip>>,
    "enabled" | "label"
  >;
} & TgphComponentProps<typeof Stack>;

const Label = ({
  maxW = "36",
  maxH = "6",
  w = "full",
  icon,
  children,
  textProps,
  description,
  tooltipProps,
  ...props
}: LabelProps) => {
  const {
    color = "gray",
    weight = "medium",
    size = "1",
    ...restTextProps
  } = textProps || {};

  return (
    <Stack
      direction="row"
      align="baseline"
      gap="2"
      maxW={maxW}
      w={w}
      maxH={maxH}
      {...props}
    >
      {icon && (
        <Stack alignSelf="center">
          <Icon size="1" color="gray" {...icon} />
        </Stack>
      )}
      <Tooltip label={description} enabled={!!description} {...tooltipProps}>
        <Text
          as="label"
          {...restTextProps}
          color={color}
          weight={weight}
          size={size}
          borderBottom={description ? "px" : undefined}
          borderStyle={description ? "dashed" : undefined}
        >
          {children}
        </Text>
      </Tooltip>
    </Stack>
  );
};

export type ValueProps = TgphComponentProps<typeof Stack>;

const Value = ({ ...props }: ValueProps) => {
  return <Stack {...props} />;
};

export type ItemProps = ListItemProps & {
  label: React.ReactNode | string;
  icon?: TgphComponentProps<typeof Icon>;
  description?: React.ReactNode;
  labelProps?: TgphComponentProps<typeof Label>;
  valueProps?: TgphComponentProps<typeof Value>;
};

const Item = ({
  label,
  direction,
  icon,
  children,
  description,
  labelProps,
  valueProps,
  ...props
}: ItemProps) => {
  return (
    <ListItem direction={direction} {...props}>
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
