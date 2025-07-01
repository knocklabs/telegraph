import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

import { BackgroundMount, TabsContext } from "./Tabs";

export type TabPanelProps = TgphComponentProps<typeof Box> &
  React.ComponentProps<typeof RadixTabs.Content> & {
    renderInBackground?: boolean;
    backgroundMount?: BackgroundMount;
  };

/**
 * Content panel associated with a Tab
 * Only renders when its associated tab is active
 */
const TabPanel = ({
  value,
  children,
  forceMount,
  renderInBackground,
  backgroundMount,
  ...props
}: TabPanelProps) => {
  const tabsContext = React.useContext(TabsContext);

  const shouldMountInBackground = React.useMemo(() => {
    if (renderInBackground !== undefined) return renderInBackground;
    
    if (backgroundMount && tabsContext) {
      return tabsContext.getTabMountState(value, backgroundMount);
    }
    
    return false;
  }, [renderInBackground, backgroundMount, value, tabsContext]);

  return (
    <RadixTabs.Content
      value={value}
      forceMount={shouldMountInBackground || forceMount}
      asChild
    >
      <RefToTgphRef>
        <Box
          data-tgph-tab-panel=""
          {...props}
          style={{
            ...(shouldMountInBackground && {
              visibility: "var(--radix-tabs-content-visibility, visible)",
              overflow: "var(--radix-tabs-content-overflow, visible)",
              height: "var(--radix-tabs-content-height, auto)",
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
