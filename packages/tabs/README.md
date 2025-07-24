# 📑 Tabs

> Composable tabs component for content navigation with accessible keyboard support and Telegraph design system integration.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/tabs.svg)](https://www.npmjs.com/package/@telegraph/tabs)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/tabs)](https://bundlephobia.com/result?p=@telegraph/tabs)
[![license](https://img.shields.io/npm/l/@telegraph/tabs)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/tabs
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/tabs";
```

Via Javascript:

```tsx
import "@telegraph/tabs/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Box } from "@telegraph/layout";
import { Tabs } from "@telegraph/tabs";
import { Home, Settings, User } from "lucide-react";

export const BasicTabs = () => (
  <Tabs defaultValue="home">
    <Tabs.List>
      <Tabs.Tab value="home" leadingIcon={{ icon: Home, alt: "Home" }}>
        Home
      </Tabs.Tab>
      <Tabs.Tab
        value="settings"
        leadingIcon={{ icon: Settings, alt: "Settings" }}
      >
        Settings
      </Tabs.Tab>
      <Tabs.Tab value="profile" leadingIcon={{ icon: User, alt: "Profile" }}>
        Profile
      </Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="home">
      <Box p="4">Welcome to the home page!</Box>
    </Tabs.Panel>
    <Tabs.Panel value="settings">
      <Box p="4">Configure your settings here.</Box>
    </Tabs.Panel>
    <Tabs.Panel value="profile">
      <Box p="4">Manage your profile information.</Box>
    </Tabs.Panel>
  </Tabs>
);
```

## API Reference

### `<Tabs>`

The root container component that provides tab state management and context.

| Prop            | Type                         | Default        | Description                                   |
| --------------- | ---------------------------- | -------------- | --------------------------------------------- |
| `defaultValue`  | `string`                     | `undefined`    | ID of the initially active tab (uncontrolled) |
| `value`         | `string`                     | `undefined`    | Currently active tab ID (controlled)          |
| `onValueChange` | `(value: string) => void`    | `undefined`    | Called when the active tab changes            |
| `disabled`      | `boolean`                    | `false`        | Disables all tabs when true                   |
| `orientation`   | `"horizontal" \| "vertical"` | `"horizontal"` | Layout orientation                            |
| `dir`           | `"ltr" \| "rtl"`             | `"ltr"`        | Text direction                                |

### `<Tabs.List>`

Container for tab buttons that manages keyboard navigation.

| Prop   | Type      | Default | Description                                              |
| ------ | --------- | ------- | -------------------------------------------------------- |
| `loop` | `boolean` | `true`  | Whether keyboard navigation loops from last to first tab |

### `<Tabs.Tab>`

Individual tab button that triggers content panel display.

| Prop           | Type         | Default     | Description                                  |
| -------------- | ------------ | ----------- | -------------------------------------------- |
| `value`        | `string`     | -           | **Required.** Unique identifier for this tab |
| `disabled`     | `boolean`    | `false`     | Whether this specific tab is disabled        |
| `leadingIcon`  | `IconProps`  | `undefined` | Icon displayed at the start of the tab       |
| `trailingIcon` | `IconProps`  | `undefined` | Icon displayed at the end of the tab         |
| `icon`         | `IconProps`  | `undefined` | Alias for `leadingIcon`                      |
| `onClick`      | `() => void` | `undefined` | Additional callback when tab is clicked      |

#### IconProps Type

```tsx
type IconProps = {
  icon: LucideIcon;
  alt: string;
  size?: string;
  color?: string;
  variant?: string;
};
```

### `<Tabs.Panel>`

Content panel associated with a specific tab.

| Prop                   | Type               | Default  | Description                                       |
| ---------------------- | ------------------ | -------- | ------------------------------------------------- |
| `value`                | `string`           | -        | **Required.** ID of the tab this panel belongs to |
| `forceMount`           | `boolean`          | `false`  | Whether to force mounting when tab is inactive    |
| `forceBackgroundMount` | `"once" \| "none"` | `"none"` | Background mounting strategy for performance      |

## Usage Patterns

### Basic Tabs

```tsx
import { Tabs } from "@telegraph/tabs";

export const DocumentTabs = () => (
  <Tabs defaultValue="overview">
    <Tabs.List>
      <Tabs.Tab value="overview">Overview</Tabs.Tab>
      <Tabs.Tab value="details">Details</Tabs.Tab>
      <Tabs.Tab value="history">History</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="overview">
      <p>Document overview content...</p>
    </Tabs.Panel>
    <Tabs.Panel value="details">
      <p>Detailed information...</p>
    </Tabs.Panel>
    <Tabs.Panel value="history">
      <p>Change history...</p>
    </Tabs.Panel>
  </Tabs>
);
```

### With Icons

```tsx
import { Tabs } from "@telegraph/tabs";
import { AlertCircle, BarChart, Clock, FileText } from "lucide-react";

export const IconTabs = () => (
  <Tabs defaultValue="content">
    <Tabs.List>
      <Tabs.Tab
        value="content"
        leadingIcon={{ icon: FileText, alt: "Content" }}
      >
        Content
      </Tabs.Tab>
      <Tabs.Tab
        value="analytics"
        leadingIcon={{ icon: BarChart, alt: "Analytics" }}
      >
        Analytics
      </Tabs.Tab>
      <Tabs.Tab
        value="activity"
        leadingIcon={{ icon: Clock, alt: "Activity" }}
        trailingIcon={{ icon: AlertCircle, alt: "Has notifications" }}
      >
        Activity
      </Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="content">Content management</Tabs.Panel>
    <Tabs.Panel value="analytics">Analytics dashboard</Tabs.Panel>
    <Tabs.Panel value="activity">Recent activity feed</Tabs.Panel>
  </Tabs>
);
```

### Controlled Tabs

```tsx
import { Tabs } from "@telegraph/tabs";
import { useState } from "react";

export const ControlledTabs = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div>
      <p>Current tab: {activeTab}</p>
      <button onClick={() => setActiveTab("tab3")}>Jump to Tab 3</button>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
          <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
          <Tabs.Tab value="tab3">Tab 3</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">First tab content</Tabs.Panel>
        <Tabs.Panel value="tab2">Second tab content</Tabs.Panel>
        <Tabs.Panel value="tab3">Third tab content</Tabs.Panel>
      </Tabs>
    </div>
  );
};
```

### Disabled Tabs

```tsx
<Tabs defaultValue="available">
  <Tabs.List>
    <Tabs.Tab value="available">Available</Tabs.Tab>
    <Tabs.Tab value="disabled" disabled>
      Disabled Tab
    </Tabs.Tab>
    <Tabs.Tab value="premium">Premium</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="available">Content for available tab</Tabs.Panel>
  <Tabs.Panel value="premium">Premium content</Tabs.Panel>
</Tabs>
```

### Vertical Orientation

```tsx
<Tabs defaultValue="section1" orientation="vertical">
  <Tabs.List>
    <Tabs.Tab value="section1">Section 1</Tabs.Tab>
    <Tabs.Tab value="section2">Section 2</Tabs.Tab>
    <Tabs.Tab value="section3">Section 3</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="section1">Vertical tab content 1</Tabs.Panel>
  <Tabs.Panel value="section2">Vertical tab content 2</Tabs.Panel>
  <Tabs.Panel value="section3">Vertical tab content 3</Tabs.Panel>
</Tabs>
```

## Advanced Usage

### Navigation Tabs

Use tabs as navigation links with the polymorphic `as` prop:

```tsx
import { Tabs } from "@telegraph/tabs";
import { Link } from "next/link";

export const NavigationTabs = ({ currentPath }) => (
  <Tabs value={currentPath}>
    <Tabs.List>
      <Tabs.Tab as={Link} value="/" href="/">
        Home
      </Tabs.Tab>
      <Tabs.Tab as={Link} value="/about" href="/about">
        About
      </Tabs.Tab>
      <Tabs.Tab as={Link} value="/contact" href="/contact">
        Contact
      </Tabs.Tab>
    </Tabs.List>

    {/* No panels needed for navigation */}
  </Tabs>
);
```

### Performance Optimization

Control when tab content is rendered using `forceBackgroundMount`:

```tsx
import { Tabs } from "@telegraph/tabs";

export const OptimizedTabs = () => (
  <Tabs defaultValue="summary">
    <Tabs.List>
      <Tabs.Tab value="summary">Summary</Tabs.Tab>
      <Tabs.Tab value="data">Large Dataset</Tabs.Tab>
      <Tabs.Tab value="charts">Heavy Charts</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="summary">Always visible summary</Tabs.Panel>

    {/* Only render when first accessed */}
    <Tabs.Panel value="data" forceBackgroundMount="none">
      <LargeDataTable />
    </Tabs.Panel>

    {/* Render once on component mount */}
    <Tabs.Panel value="charts" forceBackgroundMount="once">
      <ExpensiveCharts />
    </Tabs.Panel>
  </Tabs>
);
```

### Dynamic Tabs

```tsx
import { Tabs } from "@telegraph/tabs";
import { useState } from "react";

export const DynamicTabs = () => {
  const [tabs, setTabs] = useState([
    { id: "tab1", title: "Tab 1", content: "Content 1" },
    { id: "tab2", title: "Tab 2", content: "Content 2" },
  ]);
  const [activeTab, setActiveTab] = useState("tab1");

  const addTab = () => {
    const newId = `tab${tabs.length + 1}`;
    setTabs([
      ...tabs,
      {
        id: newId,
        title: `Tab ${tabs.length + 1}`,
        content: `Content ${tabs.length + 1}`,
      },
    ]);
    setActiveTab(newId);
  };

  const removeTab = (tabId: string) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  return (
    <div>
      <button onClick={addTab}>Add Tab</button>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.id}
              value={tab.id}
              trailingIcon={{
                icon: X,
                alt: "Close tab",
                onClick: (e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                },
              }}
            >
              {tab.title}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {tabs.map((tab) => (
          <Tabs.Panel key={tab.id} value={tab.id}>
            {tab.content}
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
};
```

### Tabs with Form Integration

```tsx
import { Tabs } from "@telegraph/tabs";
import { useState } from "react";

export const FormTabs = () => {
  const [formData, setFormData] = useState({
    personal: { name: "", email: "" },
    preferences: { theme: "light", notifications: true },
    billing: { plan: "free", cardNumber: "" },
  });
  const [currentTab, setCurrentTab] = useState("personal");

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const isTabComplete = (tabId: string) => {
    switch (tabId) {
      case "personal":
        return formData.personal.name && formData.personal.email;
      case "preferences":
        return true; // Always complete
      case "billing":
        return (
          formData.billing.plan !== "premium" || formData.billing.cardNumber
        );
      default:
        return false;
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List>
        <Tabs.Tab
          value="personal"
          trailingIcon={
            isTabComplete("personal")
              ? { icon: CheckCircle, alt: "Complete" }
              : { icon: Circle, alt: "Incomplete" }
          }
        >
          Personal Info
        </Tabs.Tab>
        <Tabs.Tab
          value="preferences"
          trailingIcon={
            isTabComplete("preferences")
              ? { icon: CheckCircle, alt: "Complete" }
              : { icon: Circle, alt: "Incomplete" }
          }
        >
          Preferences
        </Tabs.Tab>
        <Tabs.Tab
          value="billing"
          trailingIcon={
            isTabComplete("billing")
              ? { icon: CheckCircle, alt: "Complete" }
              : { icon: Circle, alt: "Incomplete" }
          }
        >
          Billing
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="personal">
        <PersonalInfoForm
          data={formData.personal}
          onChange={(data) => updateFormData("personal", data)}
        />
      </Tabs.Panel>

      <Tabs.Panel value="preferences">
        <PreferencesForm
          data={formData.preferences}
          onChange={(data) => updateFormData("preferences", data)}
        />
      </Tabs.Panel>

      <Tabs.Panel value="billing">
        <BillingForm
          data={formData.billing}
          onChange={(data) => updateFormData("billing", data)}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
```

### Nested Tabs

```tsx
import { Tabs } from "@telegraph/tabs";

export const NestedTabs = () => (
  <Tabs defaultValue="main1">
    <Tabs.List>
      <Tabs.Tab value="main1">Main Section 1</Tabs.Tab>
      <Tabs.Tab value="main2">Main Section 2</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="main1">
      <h3>Main Section 1</h3>

      {/* Nested tabs */}
      <Tabs defaultValue="sub1a">
        <Tabs.List>
          <Tabs.Tab value="sub1a">Sub 1A</Tabs.Tab>
          <Tabs.Tab value="sub1b">Sub 1B</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sub1a">Sub content 1A</Tabs.Panel>
        <Tabs.Panel value="sub1b">Sub content 1B</Tabs.Panel>
      </Tabs>
    </Tabs.Panel>

    <Tabs.Panel value="main2">
      <h3>Main Section 2</h3>
      <p>Main content 2</p>
    </Tabs.Panel>
  </Tabs>
);
```

## Accessibility

- ✅ **Keyboard Navigation**: Arrow keys navigate between tabs, Enter/Space activates
- ✅ **Screen Reader Support**: Proper ARIA roles and attributes
- ✅ **Focus Management**: Clear focus indicators and logical tab order
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Touch Support**: Optimized for mobile and touch devices

### Keyboard Shortcuts

| Key                | Action                             |
| ------------------ | ---------------------------------- |
| `Tab`              | Move focus to/from the tab list    |
| `Arrow Left/Right` | Navigate between tabs (horizontal) |
| `Arrow Up/Down`    | Navigate between tabs (vertical)   |
| `Home`             | Move to first tab                  |
| `End`              | Move to last tab                   |
| `Enter` / `Space`  | Activate focused tab               |

### ARIA Attributes

- `role="tablist"` - Applied to the tab list container
- `role="tab"` - Applied to each tab button
- `role="tabpanel"` - Applied to each content panel
- `aria-selected` - Indicates the active tab
- `aria-controls` - Links tabs to their panels
- `aria-labelledby` - Links panels to their tabs
- `tabindex` - Manages focus within the tab list

### Best Practices

1. **Provide Clear Labels**: Use descriptive text for tab buttons
2. **Logical Order**: Arrange tabs in a meaningful sequence
3. **Icon Alt Text**: Always provide alt text for icons
4. **Avoid Too Many Tabs**: Keep the number of tabs manageable
5. **Content Relationships**: Ensure tab content is related to its label

## Examples

### Basic Example

```tsx
import { Tabs } from "@telegraph/tabs";

export const DocumentViewer = () => (
  <Tabs defaultValue="content">
    <Tabs.List>
      <Tabs.Tab value="content">Content</Tabs.Tab>
      <Tabs.Tab value="metadata">Metadata</Tabs.Tab>
      <Tabs.Tab value="versions">Versions</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="content">
      <article>
        <h1>Document Title</h1>
        <p>Document content goes here...</p>
      </article>
    </Tabs.Panel>

    <Tabs.Panel value="metadata">
      <dl>
        <dt>Created</dt>
        <dd>January 1, 2024</dd>
        <dt>Author</dt>
        <dd>John Doe</dd>
      </dl>
    </Tabs.Panel>

    <Tabs.Panel value="versions">
      <ul>
        <li>v1.2.0 - Latest</li>
        <li>v1.1.0 - Previous</li>
        <li>v1.0.0 - Initial</li>
      </ul>
    </Tabs.Panel>
  </Tabs>
);
```

### Advanced Example

```tsx
import { Tabs } from "@telegraph/tabs";
import { BarChart, Bell, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";

export const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);

  // Simulate notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => prev + Math.floor(Math.random() * 3));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab
            value="overview"
            leadingIcon={{ icon: BarChart, alt: "Analytics" }}
          >
            Overview
          </Tabs.Tab>

          <Tabs.Tab value="users" leadingIcon={{ icon: Users, alt: "Users" }}>
            Users
          </Tabs.Tab>

          <Tabs.Tab
            value="notifications"
            leadingIcon={{ icon: Bell, alt: "Notifications" }}
            trailingIcon={
              notifications > 0
                ? {
                    icon: () => (
                      <span className="notification-badge">
                        {notifications}
                      </span>
                    ),
                    alt: `${notifications} new notifications`,
                  }
                : undefined
            }
          >
            Notifications
          </Tabs.Tab>

          <Tabs.Tab
            value="settings"
            leadingIcon={{ icon: Settings, alt: "Settings" }}
          >
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <div className="metrics-grid">
            <MetricCard title="Total Users" value="1,234" />
            <MetricCard title="Revenue" value="$12,345" />
            <MetricCard title="Growth" value="+12%" />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="users">
          <UserManagementTable />
        </Tabs.Panel>

        <Tabs.Panel value="notifications" forceBackgroundMount="once">
          <NotificationCenter
            notifications={notifications}
            onClear={() => setNotifications(0)}
          />
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <SettingsForm />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
```

### Real-world Example

```tsx
import { Tabs } from "@telegraph/tabs";
import { FileText, Image, Music, Video } from "lucide-react";
import { useState } from "react";

export const MediaLibrary = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentTab, setCurrentTab] = useState("documents");

  const fileTypes = {
    documents: {
      icon: FileText,
      alt: "Documents",
      extensions: [".pdf", ".doc", ".txt"],
    },
    images: {
      icon: Image,
      alt: "Images",
      extensions: [".jpg", ".png", ".gif"],
    },
    videos: {
      icon: Video,
      alt: "Videos",
      extensions: [".mp4", ".avi", ".mov"],
    },
    audio: { icon: Music, alt: "Audio", extensions: [".mp3", ".wav", ".flac"] },
  };

  const getFileCount = (type: string) => {
    // Simulate file counting
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="media-library">
      <div className="library-header">
        <h2>Media Library</h2>
        {selectedFiles.length > 0 && (
          <p>{selectedFiles.length} files selected</p>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <Tabs.List>
          {Object.entries(fileTypes).map(([type, config]) => (
            <Tabs.Tab key={type} value={type} leadingIcon={config}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
              <span className="file-count">({getFileCount(type)})</span>
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {Object.keys(fileTypes).map((type) => (
          <Tabs.Panel key={type} value={type}>
            <FileGrid
              fileType={type}
              selectedFiles={selectedFiles}
              onSelectionChange={setSelectedFiles}
              extensions={fileTypes[type].extensions}
            />
          </Tabs.Panel>
        ))}
      </Tabs>

      {selectedFiles.length > 0 && (
        <div className="selected-actions">
          <button onClick={() => downloadFiles(selectedFiles)}>
            Download Selected
          </button>
          <button onClick={() => deleteFiles(selectedFiles)}>
            Delete Selected
          </button>
          <button onClick={() => setSelectedFiles([])}>Clear Selection</button>
        </div>
      )}
    </div>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/tabs)
- [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) - Base primitive

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
