import * as RadixTabs from "@radix-ui/react-tabs";
import React from "react";

/**
 * Props for the Tabs (Root) component
 * @property {React.ReactNode} children - Child components
 * @property {string} defaultValue - The ID of the default active tab
 * @property {string} value - The controlled value of the tab to activate
 * @property {(value: string) => void} onValueChange - Callback when the active tab changes
 * @property {string} className - Additional CSS class names
 */
export type TabsProps = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

/**
 * Root component for Tabs
 * Provides context for tab state management and renders child components
 */
const Tabs = ({ children, defaultValue, value, onValueChange }: TabsProps) => {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </RadixTabs.Root>
  );
};

export { Tabs };
