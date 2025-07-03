import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

export type TabsProps = TgphComponentProps<typeof Box> &
  React.ComponentProps<typeof RadixTabs.Root>;

/**
 * Root component for Tabs
 * Provides context for tab state management and renders child components
 */
const Tabs = ({
  children,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabsProps) => {
  return (
    <RadixTabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      asChild
    >
      <RefToTgphRef>
        <Box data-tgph-tabs="" {...props}>
          {children}
        </Box>
      </RefToTgphRef>
    </RadixTabs.Root>
  );
};

export { Tabs };
