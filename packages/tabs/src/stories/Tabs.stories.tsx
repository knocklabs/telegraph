import { Tab, TabList, TabPanel, Tabs } from "..";
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
    <TabList>
      <Tab value="tab1">First Tab</Tab>
      <Tab value="tab2">Second Tab</Tab>
      <Tab value="tab3">Third Tab</Tab>
    </TabList>

    <TabPanel value="tab1">
      <Box padding="4">Content for the first tab</Box>
    </TabPanel>
    <TabPanel value="tab2">
      <Box padding="4">Content for the second tab</Box>
    </TabPanel>
    <TabPanel value="tab3">
      <Box padding="4">Content for the third tab</Box>
    </TabPanel>
  </Tabs>
);

/**
 * Example with the new icon API
 */
export const WithIcons = () => (
  <Tabs defaultValue="home">
    <TabList>
      <Tab
        value="home"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Home",
        }}
      >
        Tab
      </Tab>
      <Tab
        value="settings"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Settings",
        }}
      >
        Tab
      </Tab>
      <Tab
        value="notifications"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Notifications",
        }}
      >
        Tab
      </Tab>
    </TabList>

    <TabPanel value="home">
      <Box padding="4">Home content</Box>
    </TabPanel>
    <TabPanel value="settings">
      <Box padding="4">Settings content</Box>
    </TabPanel>
    <TabPanel value="notifications">
      <Box padding="4">Notifications content</Box>
    </TabPanel>
  </Tabs>
);

/**
 * Example with disabled tabs
 */
export const Disabled = () => (
  <Tabs defaultValue="tab1">
    <TabList>
      <Tab value="tab1">Enabled Tab</Tab>
      <Tab value="tab2" disabled icon={{ icon: Lucide.Plus, alt: "Plus" }}>
        Disabled Tab
      </Tab>
      <Tab value="tab3">Enabled Tab</Tab>
    </TabList>

    <TabPanel value="tab1">
      <Box padding="4">Content for the first tab</Box>
    </TabPanel>
    <TabPanel value="tab2">
      <Box padding="4">Content for the second tab (disabled)</Box>
    </TabPanel>
    <TabPanel value="tab3">
      <Box padding="4">Content for the third tab</Box>
    </TabPanel>
  </Tabs>
);

/**
 * Example with composable pattern
 */
export const ComposablePattern = () => (
  <Tabs defaultValue="tab1">
    <Tabs.List>
      <Tabs.Tab value="tab1">First Tab</Tabs.Tab>
      <Tabs.Tab value="tab2">Second Tab</Tabs.Tab>
      <Tabs.Tab value="tab3">Third Tab</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="tab1">
      <Box padding="4">Content for the first tab</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab2">
      <Box padding="4">Content for the second tab</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab3">
      <Box padding="4">Content for the third tab</Box>
    </Tabs.Panel>
  </Tabs>
);
