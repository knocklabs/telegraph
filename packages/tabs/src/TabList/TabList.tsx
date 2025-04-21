import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, type TgphComponentProps } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import React from "react";

export type TabListProps = TgphComponentProps<typeof Stack> &
  React.ComponentProps<typeof RadixTabs.List>;

/**
 * Container component for Tab components
 * Renders a Radix TabsList
 */
const TabList = ({ children, loop = true, ...props }: TabListProps) => {
  return (
    <RadixTabs.List asChild loop={loop}>
      <RefToTgphRef>
        <Stack
          flexDirection={"row"}
          spacing="2"
          gap="1"
          paddingBottom={"1"}
          paddingRight={"0"}
          marginBottom="4"
          position="relative"
          data-tgph-tab-list=""
          {...props}
        >
          {children}
        </Stack>
      </RefToTgphRef>
    </RadixTabs.List>
  );
};

export { TabList };
