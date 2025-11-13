import { TgphComponentProps } from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import React from "react";

type ListProps = TgphComponentProps<typeof Stack>;

const List = ({ direction = "column", gap = "4", ...props }: ListProps) => {
  return <Stack direction={direction} gap={gap} {...props} />;
};

type ListItemProps = TgphComponentProps<typeof Stack>;

const ListItem = ({
  direction = "row",
  gap = "1",
  align = "baseline",
  ...props
}: ListItemProps) => {
  return <Stack direction={direction} gap={gap} align={align} {...props} />;
};

type LabelProps = {
  textProps?: TgphComponentProps<typeof Text>;
  icon?: TgphComponentProps<typeof Icon>;
} & TgphComponentProps<typeof Stack>;

const Label = ({
  maxW = "36",
  maxH = "6",
  w = "full",
  icon,
  children,
  textProps,
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
      <Text
        as="label"
        {...restTextProps}
        color={color}
        weight={weight}
        size={size}
      >
        {children}
      </Text>
    </Stack>
  );
};

type ValueProps = TgphComponentProps<typeof Stack>;

const Value = ({ ...props }: ValueProps) => {
  return <Stack {...props} />;
};

type ItemProps = ListItemProps & {
  label: React.ReactNode | string;
  icon?: TgphComponentProps<typeof Icon>;
  labelProps?: TgphComponentProps<typeof Label>;
  valueProps?: TgphComponentProps<typeof Value>;
};

const Item = ({
  label,
  direction,
  icon,
  children,
  labelProps,
  valueProps,
  ...props
}: ItemProps) => {
  return (
    <ListItem direction={direction} {...props}>
      <Label icon={icon} {...labelProps}>
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
