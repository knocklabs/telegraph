![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/tabs)

# @telegraph/tabs
> Standardized tabs component for navigation

A composable tabs component based on [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) with Telegraph design system styling.

## Installation Instructions

```
npm install @telegraph/tabs
```

## Usage

```jsx
import { Tabs } from '@telegraph/tabs';
import { Box } from '@telegraph/layout';
import { Lucide } from '@telegraph/icon';

function MyTabs() {
  return (
    <Tabs defaultValue="tab1">
      {/* Composable pattern with nested components */}
      <Tabs.List>
        <Tabs.Tab 
          value="tab1"
          leadingIcon={{
            icon: Lucide.Home,
            alt: "Home icon"
          }}
        >
          First Tab
        </Tabs.Tab>
        <Tabs.Tab 
          value="tab2"
          leadingIcon={{
            icon: Lucide.Settings,
            alt: "Settings icon"
          }}
        >
          Second Tab
        </Tabs.Tab>
        <Tabs.Tab 
          value="tab3"
          leadingIcon={{
            icon: Lucide.Bell,
            alt: "Notifications icon"
          }}
        >
          Third Tab
        </Tabs.Tab>
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
}

```

## Controlled usage

The tabs component can be controlled when you need to manage the state yourself:

```jsx
import { Tabs, useTabsContext } from '@telegraph/tabs';
import { MenuItem } from '@telegraph/menu';
import { useState } from 'react';

function ControlledTabs() {
  const [value, setValue] = useState('tab1');
  
  return (
    <div>
      <p>Current active tab: {value}</p>
      <MenuItem 
        variant="outline" 
        size="2" 
        onClick={() => setValue('tab3')}
      >
        Switch to third tab programmatically
      </MenuItem>
      
      <Tabs value={value} onValueChange={setValue}>
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
    </div>
  );
}
```


## Using Tabs as Navigation Links

You can use tabs as navigation links by passing a Link component to the `as` prop. This is useful for creating tabbed navigation menus that update the URL:

```jsx
import { Tabs, useTabsContext } from '@telegraph/tabs';
import { Link } from '@telegraph/link';

function MyTabs() {
  return (
    <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab as={Link} value="tab1" href="/">Home</Tabs.Tab>
        <Tabs.Tab as={Link} value="tab2" href="/about">About</Tabs.Tab>
        <Tabs.Tab as={Link} value="tab3" href="/contact">Contact</Tabs.Tab>
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
}
```

## Components API

### Tabs (Root)
- `defaultValue`: String - ID of the initially active tab
- `value`: String - Controlled value for the active tab
- `onValueChange`: Function - Callback when the active tab changes
- `disabled`: Boolean - Disables all tabs when true

### Tab
- `value`: String (required) - Unique identifier for the tab
- `disabled`: Boolean - Disables this specific tab
- `onClick`: Function - Additional callback when tab is clicked
- `leadingIcon`: Object - Icon to display at the start of the tab
  - `icon`: ComponentType - The icon component to render
  - `alt`: String - Alternative text for the icon
- `trailingIcon`: Object - Icon to display at the end of the tab
  - `icon`: ComponentType - The icon component to render
  - `alt`: String - Alternative text for the icon
- `icon`: Object - Icon to display at the end of the tab
  - `icon`: ComponentType - The icon component to render
  - `alt`: String - Alternative text for the icon

### TabList
- `loop`: Boolean - Whether keyboard navigation loops from last to first tab

### TabPanel
- `value`: String (required) - ID of the tab this panel is associated with
- `forceMount`: Boolean - Whether to force mounting when tab is inactive
- `forceBackgroundMount`: "once" | "none" - Controls when content renders in background:
  - `once`: Force mount at render time, content always rendered (like forceMount=true)
  - `none` (default): Only render when tab is clicked/active
