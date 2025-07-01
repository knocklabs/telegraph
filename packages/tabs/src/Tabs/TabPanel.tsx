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

  let shouldMountInBackground = false;
  
  if (renderInBackground !== undefined) {
    shouldMountInBackground = renderInBackground;
  } else if (backgroundMount && tabsContext) {
    shouldMountInBackground = tabsContext.getTabMountState(value, backgroundMount);
  }

  const shouldForceMount = shouldMountInBackground || forceMount;
  const mountKey = backgroundMount === "hover" && tabsContext ? 
    `${value}-${tabsContext.hoveredTabs.has(value) ? 'mounted' : 'unmounted'}` : 
    undefined;

  return (
    <RadixTabs.Content
      value={value}
      forceMount={shouldForceMount}
      asChild
    >
      <RefToTgphRef>
        <Box
          key={mountKey}
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
