import { Tabs } from "..";
import { Lucide } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
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

export const WithAdditionalChildren = () => (
  <Tabs defaultValue="tab1">
    <Tabs.List>
      <Tabs.Tab
        value="tab1"
        size="1"
        leadingIcon={{
          icon: Lucide.Plus,
          alt: "Home",
        }}
        trailingComponent={
          <Box style={{ marginLeft: "-8px" }}>
            <Stack
              w="2"
              h="2"
              bg="red-4"
              p="2"
              borderRadius="full"
              align="center"
              justify="center"
            >
              <Text as="span" color="red" size="0">
                1
              </Text>
            </Stack>
          </Box>
        }
      >
        First Tab
      </Tabs.Tab>
      <Tabs.Tab
        value="tab2"
        size="1"
        leadingIcon={{
          icon: Lucide.Home,
          alt: "Home",
        }}
        trailingComponent={
          <Box style={{ marginLeft: "-8px" }}>
            <Stack
              w="2"
              h="2"
              bg="blue-4"
              p="2"
              borderRadius="full"
              align="center"
              justify="center"
            >
              <Text as="span" color="blue" size="0">
                2
              </Text>
            </Stack>
          </Box>
        }
      >
        Second Tab
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="tab1">
      <Box py="4">Content for the first tab</Box>
    </Tabs.Panel>
    <Tabs.Panel value="tab2">
      <Box py="4">Content for the second tab</Box>
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

/**
 * Example with background rendering - content renders even when tab is inactive
 */
export const BackgroundRendering = () => {
  const [currentTab, setCurrentTab] = React.useState("tab1");
  const [backgroundCounter, setBackgroundCounter] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundCounter(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List>
        <Tabs.Tab value="tab1">Background Proof</Tabs.Tab>
        <Tabs.Tab value="tab2">Height Test</Tabs.Tab>
        <Tabs.Tab value="tab3">Normal Behavior</Tabs.Tab>
      </Tabs.List>

      <Box py="4">
        <Text as="p">Current active tab: {currentTab}</Text>
      </Box>

      <Tabs.Panel value="tab1" renderInBackground>
        <Box py="4">
          <Text as="p" mb="3">
            <strong>Proof of background rendering:</strong> This counter updates even when this tab is inactive, 
            proving the component is mounted and running in the background.
          </Text>
          <Text as="p" style={{ fontSize: '24px', fontWeight: 'bold', color: '#007acc' }}>
            Counter: {backgroundCounter}
          </Text>
          <Text as="p" mt="3" style={{ fontSize: '14px', color: '#666' }}>
            Switch to another tab and come back - the counter will have continued incrementing!
          </Text>
        </Box>
      </Tabs.Panel>
      
      <Tabs.Panel value="tab2" renderInBackground>
        <Box py="4">
          <Text as="p" mb="3">
            <strong>Height behavior test:</strong> This tab contains a long list to test how background rendering 
            affects height calculations. The content should be hidden but maintain proper layout.
          </Text>
          <Box as="ul" style={{ listStyle: 'decimal', paddingLeft: '20px' }}>
            {Array.from({ length: 50 }, (_, i) => (
              <Box as="li" key={i} py="1">
                <Text as="span">List item #{i + 1} - This is a long item to test height behavior with background rendering enabled</Text>
              </Box>
            ))}
          </Box>
          <Text as="p" mt="4" style={{ fontSize: '14px', color: '#666' }}>
            This long list tests that inactive tabs with renderInBackground don't affect the visible layout height.
          </Text>
        </Box>
      </Tabs.Panel>
      
      <Tabs.Panel value="tab3">
        <Box py="4">
          <Text as="p">
            <strong>Normal behavior:</strong> This tab only renders when active (no renderInBackground prop).
            Content is unmounted when switching away and remounted when returning.
          </Text>
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
};
