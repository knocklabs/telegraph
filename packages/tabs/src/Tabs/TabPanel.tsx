import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

export type TabPanelProps = TgphComponentProps<typeof Box> &
  React.ComponentProps<typeof RadixTabs.Content> & {
    renderInBackground?: boolean;
  };

/**
 * Content panel associated with a Tab
 * Only renders when its associated tab is active
 */
const TabPanel = ({ value, children, forceMount, renderInBackground, ...props }: TabPanelProps) => {
  return (
    <RadixTabs.Content 
      value={value} 
      forceMount={renderInBackground || forceMount}
      asChild
    >
      <RefToTgphRef>
        <Box 
          data-tgph-tab-panel="" 
          {...props}
          style={{
            ...(renderInBackground && {
              visibility: 'var(--radix-tabs-content-visibility, visible)',
              overflow: 'var(--radix-tabs-content-overflow, visible)', 
              height: 'var(--radix-tabs-content-height, auto)',
            }),
            ...props.style,
          }}
        >
          {children}
        </Box>
      </RefToTgphRef>
    </RadixTabs.Content>
  );
};

export { TabPanel };
