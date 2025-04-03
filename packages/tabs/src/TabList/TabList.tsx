import * as RadixTabs from "@radix-ui/react-tabs";
import { Stack } from "@telegraph/layout";
import React from "react";

/**
 * Props for the TabList component
 * @property {React.ReactNode} children - Tab components to render
 * @property {string} className - Additional CSS class names
 * @property {boolean} loop - Whether keyboard navigation should loop from last tab to first
 * @property {boolean} hasBorder - Whether to show a bottom border
 */
export type TabListProps = {
  children: React.ReactNode;
  className?: string;
  loop?: boolean;
  hasBorder?: boolean;
};

/**
 * Container component for Tab components
 * Renders a Radix TabsList
 */
const TabList = ({ children, className = "", loop = true }: TabListProps) => {
  return (
    <RadixTabs.List asChild loop={loop}>
      <Stack
        flexDirection={"row"}
        spacing="2"
        gap="1"
        paddingBottom={"2"}
        paddingRight={"0"}
        marginBottom="4"
        className={className}
        position="relative"
        data-tgph-tab-list=""
      >
        {children}
      </Stack>
    </RadixTabs.List>
  );
};

export { TabList };
