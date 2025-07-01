import * as RadixTabs from "@radix-ui/react-tabs";
import { RefToTgphRef, TgphComponentProps } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import React from "react";

export type BackgroundMount = "hover" | "once" | "hover-persist" | "none";

type TabsContextValue = {
  hoveredTabs: Set<string>;
  mountedTabs: Set<string>;
  activeTab: string | undefined;
  onTabHover: (tabValue: string) => void;
  onTabLeave: (tabValue: string) => void;
  getTabMountState: (
    tabValue: string,
    backgroundMount?: BackgroundMount,
  ) => boolean;
};

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a Tabs component");
  }
  return context;
};

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
  const [hoveredTabs, setHoveredTabs] = React.useState<Set<string>>(new Set());
  const [mountedTabs, setMountedTabs] = React.useState<Set<string>>(new Set());

  const activeTab = value || defaultValue;

  const onTabHover = React.useCallback((tabValue: string) => {
    setHoveredTabs((prev) => new Set(prev).add(tabValue));
  }, []);

  const onTabLeave = React.useCallback((tabValue: string) => {
    setHoveredTabs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tabValue);
      return newSet;
    });
  }, []);

  const getTabMountState = React.useCallback(
    (tabValue: string, backgroundMount?: BackgroundMount) => {
      if (tabValue === activeTab) return false;

      if (!backgroundMount || backgroundMount === "none") return false;
      if (backgroundMount === "once") return true;
      if (backgroundMount === "hover") {
        return hoveredTabs.has(tabValue);
      }
      if (backgroundMount === "hover-persist") {
        if (hoveredTabs.has(tabValue)) {
          setMountedTabs((prev) => new Set(prev).add(tabValue));
        }
        return mountedTabs.has(tabValue);
      }
      return false;
    },
    [hoveredTabs, mountedTabs, activeTab],
  );

  const contextValue: TabsContextValue = {
    hoveredTabs,
    mountedTabs,
    activeTab,
    onTabHover,
    onTabLeave,
    getTabMountState,
  };

  return (
    <TabsContext.Provider value={contextValue}>
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
    </TabsContext.Provider>
  );
};

export { Tabs };
