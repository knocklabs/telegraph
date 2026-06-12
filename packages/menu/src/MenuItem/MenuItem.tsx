import { Button } from "@telegraph/button";
import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Check } from "lucide-react";
import * as motion from "motion/react-m";
import type { ReactNode } from "react";

type MenuItemIconProps = {
  icon?: TgphComponentProps<typeof Button.Icon>;
  leadingIcon?: TgphComponentProps<typeof Button.Icon>;
  trailingIcon?: TgphComponentProps<typeof Button.Icon>;
};

export type MenuItemProps<T extends TgphElement = "button"> =
  TgphComponentProps<typeof Button.Root<T>> &
    MenuItemIconProps & {
      selected?: boolean | null;
      leadingComponent?: ReactNode;
      trailingComponent?: ReactNode;
      textProps?: TgphComponentProps<typeof Button.Text>;
    };

const MenuItem = <T extends TgphElement = "button">({
  variant = "ghost",
  size = "2",
  px = "2",
  gap = "1_5",
  justify = "space-between",
  w = "auto",
  selected,
  icon,
  leadingIcon,
  leadingComponent,
  trailingIcon,
  trailingComponent,
  textProps,
  ...props
}: MenuItemProps<T>) => {
  const rootProps = props as TgphComponentProps<typeof Button.Root>;

  return (
    <Button.Root
      size={size}
      variant={variant}
      gap={gap}
      px={px}
      justify={justify}
      w={w}
      {...rootProps}
    >
      <Stack gap={gap} align="center" w="full">
        <MenuItemLeading
          icon={icon}
          selected={selected}
          leadingIcon={leadingIcon}
          leadingComponent={leadingComponent}
        />
        <Button.Text
          weight={rootProps.fontWeight || "medium"}
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          {...textProps}
        >
          {rootProps.children}
        </Button.Text>
      </Stack>
      <MenuItemTrailing
        trailingIcon={trailingIcon}
        trailingComponent={trailingComponent}
      />
    </Button.Root>
  );
};

type MenuItemLeadingProps = Pick<
  TgphComponentProps<typeof MenuItem>,
  "leadingIcon" | "icon" | "selected" | "leadingComponent"
>;

const MenuItemLeading = ({
  icon,
  selected,
  leadingIcon,
  leadingComponent,
}: MenuItemLeadingProps) => {
  const isSelectableButton = selected === true || selected === false;

  if (isSelectableButton) {
    return (
      <Button.Icon
        as={motion.span}
        variant="primary"
        icon={Check}
        aria-hidden={true}
        // Mount at the animate target so unselected items don't flash checked
        // on open. Only blocks the mount animation; toggling still animates.
        initial={false}
        animate={
          selected
            ? {
                opacity: 1,
                rotate: 0,
                scale: 1,
              }
            : {
                opacity: 0,
                rotate: -45,
                scale: 0.3,
              }
        }
        transition={{ duration: 0.15, type: "spring", bounce: 0 }}
        style={{ transformOrigin: "center" }}
        display="block"
      />
    );
  }

  const combinedLeadingIcon = leadingIcon || icon;

  if (combinedLeadingIcon) {
    return <Button.Icon variant="primary" {...combinedLeadingIcon} />;
  }

  if (leadingComponent) {
    return leadingComponent;
  }
};

type MenuItemTrailingProps = Pick<
  TgphComponentProps<typeof MenuItem>,
  "trailingIcon" | "trailingComponent"
>;

const MenuItemTrailing = ({
  trailingIcon,
  trailingComponent,
}: MenuItemTrailingProps) => {
  if (trailingIcon) {
    return <Button.Icon variant="primary" {...trailingIcon} />;
  }

  if (trailingComponent) {
    return trailingComponent;
  }
};

export { MenuItem };
