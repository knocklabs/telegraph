import * as RadixTabs from "@radix-ui/react-tabs";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { MenuItem } from "@telegraph/menu";
import React from "react";

/**
 * Props for the Tab component
 * @property {string} value - Unique identifier for the tab
 * @property {React.ReactNode} children - Content to display in the tab
 * @property {boolean} disabled - Whether this tab is disabled
 * @property {() => void} onClick - Additional onClick handler
 * @property {TabIconProps} leadingIcon - Icon to display on the left side of the tab
 * @property {TabIconProps} trailingIcon - Icon to display on the right side of the tab
 */
export type TabProps<T extends TgphElement> = {
  value: string;
} & TgphComponentProps<typeof MenuItem<T>>;

/**
 * Tab component that uses RadixTabs.Trigger with MenuItem styling
 */
const Tab = <T extends TgphElement>({
  disabled = false,
  value,
  children,
  onClick,
  leadingIcon,
  trailingIcon,
  icon,
  ...props
}: TabProps<T>) => {
  const defaultIconProps: TgphComponentProps<
    typeof MenuItem<T>
  >["leadingIcon"] = {
    size: "6",
    color: "gray",
    variant: "secondary",
  };

  const combinedLeadingIcon = leadingIcon
    ? ({ ...defaultIconProps, ...leadingIcon } as const)
    : icon
      ? ({ ...defaultIconProps, ...icon } as const)
      : undefined;

  return (
    <RadixTabs.Trigger
      value={value}
      disabled={disabled}
      onClick={onClick}
      asChild
    >
      <RefToTgphRef>
        <MenuItem
          leadingIcon={combinedLeadingIcon}
          trailingIcon={
            trailingIcon && { ...defaultIconProps, ...trailingIcon }
          }
          disabled={disabled}
          py="4"
          px="2"
          position="relative"
          data-tgph-tab=""
          gap="2"
          color="gray"
          size="1"
          {...props}
        >
          {children}
        </MenuItem>
      </RefToTgphRef>
    </RadixTabs.Trigger>
  );
};

export { Tab };
