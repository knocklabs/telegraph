import {
  Button,
  type ButtonIconProps,
  type ButtonTextProps,
} from "@telegraph/button";
import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Check } from "lucide-react";
import * as motion from "motion/react-m";
import type { ReactNode } from "react";

// `ButtonIconProps` rather than `TgphComponentProps<typeof Button.Icon>`:
// extracting props from a generic component instantiates its parameter at the
// constraint, so the bare form resolves to `{}` and every icon slot would
// accept nothing at all.
type MenuItemIconProps = {
  icon?: ButtonIconProps;
  leadingIcon?: ButtonIconProps;
  trailingIcon?: ButtonIconProps;
};

export type MenuItemProps<T extends TgphElement = "button"> =
  TgphComponentProps<typeof Button.Root<T>> &
    MenuItemIconProps & {
      selected?: boolean | null;
      leadingComponent?: ReactNode;
      trailingComponent?: ReactNode;
      textProps?: ButtonTextProps;
      // Declared here rather than inherited: neither Button.Root nor the
      // element passthrough has a `fontWeight` prop, so it only ever reached
      // this component through the old catch-all index signature. It is read
      // below to seed the label's weight and forwarded to Button.Root as
      // before.
      fontWeight?: ButtonTextProps["weight"];
    };

const MenuItem = <T extends TgphElement = "button">(
  menuItemProps: MenuItemProps<T>,
) => {
  // Read through the default element: while `T` is unresolved the element
  // passthrough is a deferred conditional, so Button.Root's inherited props are
  // not visible.
  const {
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
  } = menuItemProps as MenuItemProps<"button">;
  const rootProps = props;

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
  MenuItemProps,
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
  MenuItemProps,
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
