import * as RadixTabs from "@radix-ui/react-tabs";
import { type TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

/**
 * Props for the TabPanel component
 * @property {string} value - ID of the related tab
 * @property {React.ReactNode} children - Content to display when tab is active
 * @property {string} className - Additional CSS class names
 * @property {boolean} forceMount - Whether to force mounting when not active
 */
export type TabPanelProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
  forceMount?: true;
  containerProps?: TgphComponentProps<typeof Box>;
};

/**
 * Content panel associated with a Tab
 * Only renders when its associated tab is active
 */
const TabPanel = ({
  value,
  children,
  forceMount,
  containerProps,
}: TabPanelProps) => {
  return (
    <RadixTabs.Content value={value} forceMount={forceMount} asChild>
      <Box data-tgph-tab-panel="" {...containerProps}>
        {children}
      </Box>
    </RadixTabs.Content>
  );
};

export { TabPanel };
