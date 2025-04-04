import { Tabs } from "..";
import { Lucide } from "@telegraph/icon";
import { Box } from "@telegraph/layout";
import React from "react";

/**
 * Example stories for the Tabs component
 */
export default {
  tags: ["autodocs"],
  title: "Components/Tabs",
  component: Tabs,
};

/**
 * Basic usage example
 */
export const Basic = () => (
  <Tabs defaultValue="tab1">
    <Tabs.List>
      <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
      <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
      <Tabs.Tab value="tab3">Third Tab</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="tab1">
      <Box py="4">Content for the first tab</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab2">
      <Box py="4">Content for the second tab</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab3">
      <Box py="4">Content for the third tab</Box>
    </Tabs.Panel>
  </Tabs>
);

/**
 * Example with the new icon API
 */
export const WithIcons = () => (
  <Tabs defaultValue="home">
    <Tabs.List>
      <Tabs.Tab
        value="home"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Home",
        }}
      >
        Tab
      </Tabs.Tab>
      <Tabs.Tab
        value="settings"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Settings",
        }}
      >
        Tab
      </Tabs.Tab>
      <Tabs.Tab
        value="notifications"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Notifications",
        }}
      >
        Tab
      </Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="home">
      <Box py="4">Home content</Box>
    </Tabs.Panel>
    <Tabs.Panel value="settings">
      <Box py="4">Settings content</Box>
    </Tabs.Panel>
    <Tabs.Panel value="notifications">
      <Box py="4">Notifications content</Box>
    </Tabs.Panel>
  </Tabs>
);

/**
 * Example with disabled tabs
 */
export const Disabled = () => (
  <Tabs defaultValue="tab1">
    <Tabs.List>
      <Tabs.Tab value="tab1">Enabled Tab</Tabs.Tab>
      <Tabs.Tab value="tab2" disabled icon={{ icon: Lucide.Plus, alt: "Plus" }}>
        Disabled Tab
      </Tabs.Tab>
      <Tabs.Tab value="tab3">Enabled Tab</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="tab1">
      <Box py="4">Content for the first tab</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab2">
      <Box py="4">Content for the second tab (disabled)</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab3">
      <Box py="4">Content for the third tab</Box>
    </Tabs.Panel>
  </Tabs>
);

/**
 * Example of controlled tabs with state management
 */
export const Controlled = () => {
  const [activeTab, setActiveTab] = React.useState("tab1");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
        <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
        <Tabs.Tab value="tab3">Third Tab</Tabs.Tab>
      </Tabs.List>

      <Box display="flex" gap="2" py="4">
        <Box>Current active tab: {activeTab}</Box>
        <button onClick={() => setActiveTab("tab1")}>Activate Tab 1</button>
        <button onClick={() => setActiveTab("tab2")}>Activate Tab 2</button>
        <button onClick={() => setActiveTab("tab3")}>Activate Tab 3</button>
      </Box>

      <Tabs.Panel value="tab1">
        <Box py="4">Content for the first tab</Box>
      </Tabs.Panel>
      <Tabs.Panel value="tab2">
        <Box py="4">Content for the second tab</Box>
      </Tabs.Panel>
      <Tabs.Panel value="tab3">
        <Box py="4">Content for the third tab</Box>
      </Tabs.Panel>
    </Tabs>
  );
};
