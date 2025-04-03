import React, { createContext, useContext, useState } from "react";

/**
 * Props for the TabsContext provider
 * @property {string} activeTab - The ID of the active tab
 * @property {(id: string) => void} setActiveTab - Function to set the active tab by ID
 * @property {boolean} isDisabled - Whether all tabs are disabled
 */
type TabsContextProps = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isDisabled?: boolean;
};

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

/**
 * Props for the TabsContextProvider component
 * @property {React.ReactNode} children - Child components
 * @property {string} defaultTab - The default active tab ID
 * @property {boolean} isDisabled - Whether all tabs are disabled
 */
type TabsContextProviderProps = {
  children: React.ReactNode;
  defaultTab?: string;
  isDisabled?: boolean;
};

/**
 * Provider component for the Tabs context
 */
const TabsContextProvider = ({
  children,
  defaultTab = "",
  isDisabled = false,
}: TabsContextProviderProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isDisabled,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};

/**
 * Hook to access the Tabs context
 * @returns {TabsContextProps} The Tabs context values
 * @throws {Error} If used outside of a TabsContextProvider
 */
const useTabsContext = (): TabsContextProps => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsContextProvider");
  }
  return context;
};

export { TabsContextProvider, useTabsContext };
export type { TabsContextProps };
