import * as RadixTabs from "@radix-ui/react-tabs";
import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { MenuItem } from "@telegraph/menu";
import React from "react";

/**
 * Props for the Tab component
 * @property {string} value - Unique identifier for the tab
 * @property {React.ReactNode} children - Content to display in the tab
 * @property {boolean} disabled - Whether this tab is disabled
 * @property {() => void} onClick - Additional onClick handler
 * @property {string} className - Additional CSS class names
 * @property {TabIconProps} leadingIcon - Icon to display on the left side of the tab
 * @property {TabIconProps} trailingIcon - Icon to display on the right side of the tab
 * @property {string} variant - Visual style variant of the tab
 * @property {string} size - Size of the tab
 */
export type TabProps<T extends TgphElement> = {
  value: string;
} & TgphComponentProps<typeof MenuItem<T>>;

/**
 * Tab component that uses RadixTabs.Trigger with MenuItem styling
 */
const Tab = <T extends TgphElement>({
  value,
  children,
  disabled = false,
  onClick,
  className = "",
  variant = "ghost",
  size = "1",
  leadingIcon,
  trailingIcon,
  icon,
  ...props
}: TabProps<T>) => {
  const combinedLeadingIcon = (
    leadingIcon
      ? { size: "6", ...leadingIcon }
      : icon
        ? { size: "6", ...icon }
        : undefined
  ) as TgphComponentProps<typeof MenuItem<T>>["leadingIcon"] | undefined;

  return (
    <RadixTabs.Trigger
      value={value}
      disabled={disabled}
      onClick={onClick}
      className={className}
      asChild
    >
      <MenuItem
        variant={variant}
        size={size}
        leadingIcon={combinedLeadingIcon}
        trailingIcon={trailingIcon && { size: "6", ...trailingIcon }}
        disabled={disabled}
        style={{
          color: "var(--tgraph-gray-11)",
        }}
        py="4"
        px="2"
        position="relative"
        data-tgph-tab=""
        gap="2"
        color="gray"
        {...props}
      >
        {children}
      </MenuItem>
    </RadixTabs.Trigger>
  );
};

export { Tab };
