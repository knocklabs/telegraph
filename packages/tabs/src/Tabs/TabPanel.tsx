import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

export type TabPanelProps = TgphComponentProps<typeof Box> &
  React.ComponentProps<typeof RadixTabs.Content> & {
    forceBackgroundMount?: "once" | "none";
  };

/**
 * Content panel associated with a Tab
 * Only renders when its associated tab is active
 */
const TabPanel = ({
  value,
  children,
  forceMount,
  forceBackgroundMount = "none",
  ...props
}: TabPanelProps) => {
  const shouldForceMount = forceBackgroundMount === "once" || forceMount;

  return (
    <RadixTabs.Content value={value} forceMount={shouldForceMount} asChild>
      <RefToTgphRef>
        <Box
          data-tgph-tab-panel=""
          {...props}
          style={{
            ...(shouldForceMount && {
              visibility: "var(--radix-tabs-content-visibility, visible)",
              overflow: "var(--radix-tabs-content-overflow, visible)",
              height: "var(--radix-tabs-content-height, auto)",
            }),
            ...props.style,
          }}
          aria-hidden={
            shouldForceMount
              ? "var(--radix-tabs-content-aria-hidden, false)"
              : undefined
          }
        >
          {children}
        </Box>
      </RefToTgphRef>
    </RadixTabs.Content>
  );
};

export { TabPanel };
