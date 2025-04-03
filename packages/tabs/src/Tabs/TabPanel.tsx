import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

export type TabPanelProps = TgphComponentProps<typeof Box> &
  React.ComponentProps<typeof RadixTabs.Content>;

/**
 * Content panel associated with a Tab
 * Only renders when its associated tab is active
 */
const TabPanel = ({ value, children, forceMount, ...props }: TabPanelProps) => {
  return (
    <RadixTabs.Content value={value} forceMount={forceMount} asChild>
      <RefToTgphRef>
        <Box data-tgph-tab-panel="" {...props}>
          {children}
        </Box>
      </RefToTgphRef>
    </RadixTabs.Content>
  );
};

export { TabPanel };
