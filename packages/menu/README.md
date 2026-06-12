# 📋 Menu

> Accessible dropdown menu component built on Base UI with Telegraph design system styling.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/menu.svg)](https://www.npmjs.com/package/@telegraph/menu)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/menu)](https://bundlephobia.com/result?p=@telegraph/menu)
[![license](https://img.shields.io/npm/l/@telegraph/menu)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/menu
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/menu";
```

Via Javascript:

```tsx
import "@telegraph/menu/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";
import { Archive, Edit, MoreHorizontal, Trash } from "lucide-react";

export const ActionMenu = () => (
  <Menu.Root>
    <Menu.Trigger>
      <Button
        variant="ghost"
        icon={{ icon: MoreHorizontal, alt: "More actions" }}
      />
    </Menu.Trigger>

    <Menu.Content>
      <Menu.Button leadingIcon={{ icon: Edit, alt: "" }}>Edit</Menu.Button>
      <Menu.Button leadingIcon={{ icon: Archive, alt: "" }}>
        Archive
      </Menu.Button>
      <Menu.Divider />
      <Menu.Button leadingIcon={{ icon: Trash, alt: "" }} color="red">
        Delete
      </Menu.Button>
    </Menu.Content>
  </Menu.Root>
);
```

## API Reference

### `<Menu.Root>`

The root container that manages menu state and provides context.

| Prop           | Type                      | Default     | Description                      |
| -------------- | ------------------------- | ----------- | -------------------------------- |
| `open`         | `boolean`                 | `undefined` | Controlled open state            |
| `defaultOpen`  | `boolean`                 | `false`     | Default open state               |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |
| `modal`        | `boolean`                 | `true`      | Whether menu should be modal     |

### `<Menu.Trigger>`

The trigger element that opens/closes the menu. Must wrap a single focusable element.

| Prop       | Type              | Default  | Description                        |
| ---------- | ----------------- | -------- | ---------------------------------- |
| `asChild`  | `boolean`         | `true`   | Whether to render as child element |
| `children` | `React.ReactNode` | required | Trigger element (usually a Button) |

### `<Menu.Content>`

The dropdown content container that holds menu items.

| Prop          | Type                                     | Default    | Description                      |
| ------------- | ---------------------------------------- | ---------- | -------------------------------- |
| `side`        | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Side to display menu             |
| `align`       | `"start" \| "center" \| "end"`           | `"center"` | Alignment relative to trigger    |
| `sideOffset`  | `number`                                 | `4`        | Distance from trigger            |
| `gap`         | `SpacingToken`                           | `"1"`      | Gap between menu items           |
| `py`          | `SpacingToken`                           | `"1"`      | Vertical padding                 |
| `rounded`     | `RoundedToken`                           | `"4"`      | Border radius                    |
| `shadow`      | `ShadowToken`                            | `"2"`      | Drop shadow                      |
| `border`      | `SpacingToken`                           | `"px"`     | Border width                     |
| `borderColor` | `ColorToken`                             | `"gray-8"` | Border color                     |
| `forceMount`  | `boolean`                                | `false`    | Keep content mounted when closed |

All Stack props are also supported for additional styling.

`Menu.Content` renders in a portal with `className="tgph"` so Telegraph styles
and CSS variables remain available outside the local subtree. The package also
continues to expose Radix-compatible Popper CSS custom properties, such as
`--radix-popper-anchor-width` and `--radix-popper-available-height`, mapped to
Base UI's positioning variables for downstream style compatibility.

### `<Menu.Button>`

Individual menu item that can be clicked or selected.

| Prop                   | Type                          | Default     | Description                  |
| ---------------------- | ----------------------------- | ----------- | ---------------------------- |
| `children`             | `React.ReactNode`             | required    | Button label                 |
| `leadingIcon` / `icon` | `IconProps`                   | `undefined` | Icon before text             |
| `trailingIcon`         | `IconProps`                   | `undefined` | Icon after text              |
| `leadingComponent`     | `React.ReactNode`             | `undefined` | Custom component before text |
| `trailingComponent`    | `React.ReactNode`             | `undefined` | Custom component after text  |
| `selected`             | `boolean`                     | `false`     | Whether item is selected     |
| `disabled`             | `boolean`                     | `false`     | Whether item is disabled     |
| `color`                | `"gray" \| "accent" \| "red"` | `"gray"`    | Button color theme           |
| `onClick`              | `() => void`                  | `undefined` | Click handler                |

Inherits all Button props for additional styling.

### `<Menu.Sub>`

Groups a `Menu.SubTrigger` with its `Menu.SubContent` to create a nested submenu
that opens on hover/focus. Render it inside a `Menu.Content`.

| Prop           | Type                      | Default     | Description                       |
| -------------- | ------------------------- | ----------- | --------------------------------- |
| `open`         | `boolean`                 | `undefined` | Controlled open state             |
| `defaultOpen`  | `boolean`                 | `false`     | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes  |

### `<Menu.SubTrigger>`

The item inside a `Menu.Sub` that opens the submenu on hover (or `→` / `Enter`).
Accepts the same props as `Menu.Button` and defaults to a trailing chevron icon.

| Prop           | Type              | Default        | Description                              |
| -------------- | ----------------- | -------------- | ---------------------------------------- |
| `children`     | `React.ReactNode` | required       | Trigger label                            |
| `trailingIcon` | `IconProps`       | `ChevronRight` | Trailing icon; pass your own to override |
| `leadingIcon`  | `IconProps`       | `undefined`    | Icon before text                         |
| `disabled`     | `boolean`         | `false`        | Whether the submenu trigger is disabled  |

Inherits all `Menu.Button` props.

### `<Menu.SubContent>`

The container for a submenu's items. Always opens to the side of its trigger
(`right`, flipping to `left` on collision); `side` and `align` are managed
automatically and are not accepted.

| Prop          | Type           | Default | Description                     |
| ------------- | -------------- | ------- | ------------------------------- |
| `sideOffset`  | `number`       | `0`     | Distance from the trigger       |
| `alignOffset` | `number`       | `0`     | Offset along the trigger's edge |
| `gap`         | `SpacingToken` | `"1"`   | Gap between menu items          |
| `py`          | `SpacingToken` | `"1"`   | Vertical padding                |
| `rounded`     | `RoundedToken` | `"4"`   | Border radius                   |
| `shadow`      | `ShadowToken`  | `"2"`   | Drop shadow                     |

All Stack props are also supported for additional styling.

### `<Menu.Divider>`

Visual separator between menu sections.

### `<MenuItem>` (Standalone)

Standalone menu item component for use outside of Menu context.

| Prop                | Type              | Default     | Description                  |
| ------------------- | ----------------- | ----------- | ---------------------------- |
| `selected`          | `boolean`         | `false`     | Whether item is selected     |
| `leadingComponent`  | `React.ReactNode` | `undefined` | Custom component before text |
| `trailingComponent` | `React.ReactNode` | `undefined` | Custom component after text  |
| `textProps`         | `TextProps`       | `undefined` | Props for text element       |

Inherits all Button props.

## Usage Patterns

### Basic Action Menu

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";
import { Copy, Download, MoreVertical, Share } from "lucide-react";

<Menu.Root>
  <Menu.Trigger>
    <Button variant="ghost" icon={{ icon: MoreVertical, alt: "Actions" }} />
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Button leadingIcon={{ icon: Copy, alt: "" }}>Copy</Menu.Button>
    <Menu.Button leadingIcon={{ icon: Share, alt: "" }}>Share</Menu.Button>
    <Menu.Button leadingIcon={{ icon: Download, alt: "" }}>
      Download
    </Menu.Button>
  </Menu.Content>
</Menu.Root>;
```

### Menu with Sections

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";
import { Bell, CreditCard, LogOut, Settings, Shield, User } from "lucide-react";

<Menu.Root>
  <Menu.Trigger>
    <Button variant="outline">Account Menu</Button>
  </Menu.Trigger>

  <Menu.Content align="end">
    {/* Profile section */}
    <Menu.Button leadingIcon={{ icon: User, alt: "" }}>Profile</Menu.Button>
    <Menu.Button leadingIcon={{ icon: Settings, alt: "" }}>
      Settings
    </Menu.Button>

    <Menu.Divider />

    {/* Billing section */}
    <Menu.Button leadingIcon={{ icon: CreditCard, alt: "" }}>
      Billing
    </Menu.Button>
    <Menu.Button leadingIcon={{ icon: Bell, alt: "" }}>
      Notifications
    </Menu.Button>

    <Menu.Divider />

    {/* Account section */}
    <Menu.Button leadingIcon={{ icon: Shield, alt: "" }}>Privacy</Menu.Button>
    <Menu.Button leadingIcon={{ icon: LogOut, alt: "" }} color="red">
      Sign Out
    </Menu.Button>
  </Menu.Content>
</Menu.Root>;
```

### Selection Menu

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";
import { Check } from "lucide-react";
import { useState } from "react";

const ViewMenu = () => {
  const [selectedView, setSelectedView] = useState("grid");

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline">View: {selectedView}</Button>
      </Menu.Trigger>

      <Menu.Content>
        <Menu.Button
          selected={selectedView === "grid"}
          onClick={() => setSelectedView("grid")}
        >
          Grid View
        </Menu.Button>
        <Menu.Button
          selected={selectedView === "list"}
          onClick={() => setSelectedView("list")}
        >
          List View
        </Menu.Button>
        <Menu.Button
          selected={selectedView === "card"}
          onClick={() => setSelectedView("card")}
        >
          Card View
        </Menu.Button>
      </Menu.Content>
    </Menu.Root>
  );
};
```

### Menu Positioning

```tsx
import { Menu } from "@telegraph/menu";

// Bottom aligned (default)
<Menu.Content side="bottom" align="start">

// Top aligned
<Menu.Content side="top" align="end">

// Side menus
<Menu.Content side="right" align="start">
<Menu.Content side="left" align="center">

// Custom offset
<Menu.Content sideOffset={8} align="center">
```

## Advanced Usage

### Controlled Menu State

```tsx
import { Menu } from "@telegraph/menu";
import { useState } from "react";

const ControlledMenu = () => {
  const [open, setOpen] = useState(false);

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    setOpen(false); // Close menu after action
  };

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger>
        <Button>Controlled Menu</Button>
      </Menu.Trigger>

      <Menu.Content>
        <Menu.Button onClick={() => handleAction("save")}>Save</Menu.Button>
        <Menu.Button onClick={() => handleAction("export")}>Export</Menu.Button>
      </Menu.Content>
    </Menu.Root>
  );
};
```

### Menu with Custom Components

```tsx
import { Box } from "@telegraph/layout";
import { Menu } from "@telegraph/menu";
import { Tag } from "@telegraph/tag";

<Menu.Root>
  <Menu.Trigger>
    <Box as="img" src="/user.jpg" alt="User menu" w="8" h="8" rounded="full" />
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Button
      leadingComponent={
        <Box as="img" src="/user.jpg" alt="" w="5" h="5" rounded="full" />
      }
      trailingComponent={<Tag size="0">Pro</Tag>}
    >
      John Doe
    </Menu.Button>

    <Menu.Divider />

    <Menu.Button>Settings</Menu.Button>
    <Menu.Button>Help</Menu.Button>
  </Menu.Content>
</Menu.Root>;
```

### Nested Menus (Submenus)

Use `Menu.Sub`, `Menu.SubTrigger`, and `Menu.SubContent` to nest a menu that
opens on hover (and via `→` / `Enter` for keyboard users). The submenu opens to
the side of its trigger automatically and stays open while the pointer moves
toward it.

```tsx
import { Menu } from "@telegraph/menu";

<Menu.Root>
  <Menu.Trigger>
    <Button>File Menu</Button>
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Button>New File</Menu.Button>
    <Menu.Button>Open File</Menu.Button>

    {/* Submenu — opens on hover, no need for a nested Menu.Root */}
    <Menu.Sub>
      <Menu.SubTrigger>Recent Files</Menu.SubTrigger>
      <Menu.SubContent>
        <Menu.Button>Document1.pdf</Menu.Button>
        <Menu.Button>Spreadsheet.xlsx</Menu.Button>
        <Menu.Button>Presentation.pptx</Menu.Button>
      </Menu.SubContent>
    </Menu.Sub>

    <Menu.Divider />
    <Menu.Button color="red">Delete File</Menu.Button>
  </Menu.Content>
</Menu.Root>;
```

`Menu.SubTrigger` adds a trailing chevron by default; pass your own
`trailingIcon` or a `trailingComponent` to replace it. Submenus nest
arbitrarily — a `Menu.SubContent` can contain another `Menu.Sub`.

### Menu with Keyboard Shortcuts

```tsx
import { Kbd } from "@telegraph/kbd";
import { Menu } from "@telegraph/menu";
import { Copy, Cut, Paste, Redo, Undo } from "lucide-react";

<Menu.Root>
  <Menu.Trigger>
    <Button>Edit Menu</Button>
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Button
      leadingIcon={{ icon: Undo, alt: "" }}
      trailingComponent={
        <Stack direction="row" gap="1">
          <Kbd label="Meta" size="0" />
          <Kbd label="Z" size="0" />
        </Stack>
      }
    >
      Undo
    </Menu.Button>

    <Menu.Button
      leadingIcon={{ icon: Redo, alt: "" }}
      trailingComponent={
        <Stack direction="row" gap="1">
          <Kbd label="Meta" size="0" />
          <Kbd label="Shift" size="0" />
          <Kbd label="Z" size="0" />
        </Stack>
      }
    >
      Redo
    </Menu.Button>

    <Menu.Divider />

    <Menu.Button
      leadingIcon={{ icon: Cut, alt: "" }}
      trailingComponent={
        <Stack direction="row" gap="1">
          <Kbd label="Meta" size="0" />
          <Kbd label="X" size="0" />
        </Stack>
      }
    >
      Cut
    </Menu.Button>

    <Menu.Button
      leadingIcon={{ icon: Copy, alt: "" }}
      trailingComponent={
        <Stack direction="row" gap="1">
          <Kbd label="Meta" size="0" />
          <Kbd label="C" size="0" />
        </Stack>
      }
    >
      Copy
    </Menu.Button>

    <Menu.Button
      leadingIcon={{ icon: Paste, alt: "" }}
      trailingComponent={
        <Stack direction="row" gap="1">
          <Kbd label="Meta" size="0" />
          <Kbd label="V" size="0" />
        </Stack>
      }
    >
      Paste
    </Menu.Button>
  </Menu.Content>
</Menu.Root>;
```

### Menu with Loading States

```tsx
import { Spinner } from "@telegraph/icon";
import { Menu } from "@telegraph/menu";
import { useState } from "react";

const MenuWithLoading = () => {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Button>Actions</Button>
      </Menu.Trigger>

      <Menu.Content>
        <Menu.Button onClick={handleAsyncAction} disabled={loading}>
          {loading ? (
            <Stack direction="row" align="center" gap="2">
              <Spinner size="2" />
              Processing...
            </Stack>
          ) : (
            "Sync Data"
          )}
        </Menu.Button>

        <Menu.Button>Other Action</Menu.Button>
      </Menu.Content>
    </Menu.Root>
  );
};
```

## Design Tokens & Styling

The menu component uses Telegraph design tokens for consistent styling:

### Color Tokens

**Menu Content:**

- Background: `var(--tgph-surface-1)`
- Border: `var(--tgph-gray-8)`
- Shadow: `var(--tgph-shadow-2)`

**Menu Items:**

- Default: `var(--tgph-gray-12)` text
- Hover: `var(--tgph-gray-3)` background
- Selected: `var(--tgph-accent-3)` background with checkmark
- Disabled: `var(--tgph-gray-8)` text

### Spacing Tokens

- Menu padding: `var(--tgph-spacing-1)` vertical
- Item gap: `var(--tgph-spacing-1)`
- Item padding: `var(--tgph-spacing-2)` horizontal
- Side offset: `4px` from trigger

### Border Radius

- Menu content: `var(--tgph-rounded-4)`
- Menu items: `var(--tgph-rounded-1)`

## Accessibility

- ✅ **Keyboard Navigation**: Full arrow key navigation and Enter/Space activation
- ✅ **Focus Management**: Proper focus trapping and restoration
- ✅ **Screen Reader Support**: ARIA roles, states, and properties
- ✅ **Escape Key**: Closes menu and returns focus to trigger
- ✅ **Click Outside**: Closes menu when clicking outside
- ✅ **Disabled States**: Proper handling of disabled menu items

### Keyboard Shortcuts

| Key               | Action                                        |
| ----------------- | --------------------------------------------- |
| `Space` / `Enter` | Open/close menu or activate item              |
| `Escape`          | Close menu                                    |
| `Arrow Down`      | Navigate to next item                         |
| `Arrow Up`        | Navigate to previous item                     |
| `Arrow Right`     | Open submenu (when focused on a `SubTrigger`) |
| `Arrow Left`      | Close submenu and return to its trigger       |
| `Home`            | Navigate to first item                        |
| `End`             | Navigate to last item                         |
| `Tab`             | Close menu and move to next focusable element |

Typeahead is also supported: type the first characters of an item to focus it.

### ARIA Attributes

- `role="menu"` on menu (and submenu) content
- `role="menuitem"` on menu buttons and submenu triggers
- `aria-expanded` on the trigger and on each `Menu.SubTrigger`
- `aria-haspopup="menu"` on the trigger and on each `Menu.SubTrigger`
- `aria-controls` linking a `SubTrigger` to its `SubContent`
- `aria-disabled` on disabled items
- `aria-checked` on selectable items

### Accessibility Guidelines

1. **Proper Labeling**: Ensure trigger has clear accessible name
2. **Icon Alt Text**: Use empty alt text for decorative icons
3. **Keyboard Support**: All actions must be keyboard accessible
4. **Focus Indicators**: Ensure visible focus indicators
5. **Screen Reader Context**: Provide context for menu purpose

```tsx
// ✅ Good accessibility practices
<Menu.Root>
  <Menu.Trigger>
    <Button aria-label="User account menu">
      <Box as="img" src="/user.jpg" alt="" w="8" h="8" rounded="full" />
    </Button>
  </Menu.Trigger>

  <Menu.Content>
    <Menu.Button>Profile Settings</Menu.Button>
    <Menu.Button>Sign Out</Menu.Button>
  </Menu.Content>
</Menu.Root>

// ❌ Poor accessibility
<Menu.Root>
  <Menu.Trigger>
    <div> {/* Not focusable */}
      ⋯
    </div>
  </Menu.Trigger>

  <Menu.Content>
    <div>Settings</div> {/* No role or interaction */}
  </Menu.Content>
</Menu.Root>
```

### Best Practices

1. **Use Button as Trigger**: Always wrap trigger in a focusable element
2. **Provide Context**: Make menu purpose clear through labeling
3. **Group Related Items**: Use dividers to separate logical sections
4. **Clear Item Labels**: Use descriptive text for menu items
5. **Handle Disabled States**: Properly disable items when actions aren't available

## Examples

### User Profile Menu

```tsx
import { Box, Stack } from "@telegraph/layout";
import { Menu } from "@telegraph/menu";
import { Tag } from "@telegraph/tag";
import { CreditCard, LogOut, Settings, User } from "lucide-react";

export const UserProfileMenu = ({ user }) => (
  <Menu.Root>
    <Menu.Trigger>
      <Box
        as="img"
        src={user.avatar}
        alt={`${user.name} menu`}
        w="8"
        h="8"
        rounded="full"
      />
    </Menu.Trigger>

    <Menu.Content align="end">
      {/* User info */}
      <Menu.Button
        leadingComponent={
          <Box as="img" src={user.avatar} alt="" w="5" h="5" rounded="full" />
        }
        trailingComponent={
          user.isPro && (
            <Tag size="0" color="accent">
              Pro
            </Tag>
          )
        }
      >
        {user.name}
      </Menu.Button>

      <Menu.Divider />

      {/* Account actions */}
      <Menu.Button leadingIcon={{ icon: User, alt: "" }}>
        Profile Settings
      </Menu.Button>
      <Menu.Button leadingIcon={{ icon: Settings, alt: "" }}>
        Preferences
      </Menu.Button>
      <Menu.Button leadingIcon={{ icon: CreditCard, alt: "" }}>
        Billing
      </Menu.Button>

      <Menu.Divider />

      <Menu.Button leadingIcon={{ icon: LogOut, alt: "" }} color="red">
        Sign Out
      </Menu.Button>
    </Menu.Content>
  </Menu.Root>
);
```

### Table Row Actions

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";
import { Archive, Copy, Edit, Eye, MoreVertical, Trash } from "lucide-react";

export const TableRowMenu = ({ item, onAction }) => (
  <Menu.Root>
    <Menu.Trigger>
      <Button
        variant="ghost"
        size="1"
        icon={{ icon: MoreVertical, alt: "Row actions" }}
      />
    </Menu.Trigger>

    <Menu.Content align="end">
      <Menu.Button
        leadingIcon={{ icon: Eye, alt: "" }}
        onClick={() => onAction("view", item)}
      >
        View Details
      </Menu.Button>

      <Menu.Button
        leadingIcon={{ icon: Edit, alt: "" }}
        onClick={() => onAction("edit", item)}
      >
        Edit
      </Menu.Button>

      <Menu.Button
        leadingIcon={{ icon: Copy, alt: "" }}
        onClick={() => onAction("duplicate", item)}
      >
        Duplicate
      </Menu.Button>

      <Menu.Divider />

      <Menu.Button
        leadingIcon={{ icon: Archive, alt: "" }}
        onClick={() => onAction("archive", item)}
      >
        Archive
      </Menu.Button>

      <Menu.Button
        leadingIcon={{ icon: Trash, alt: "" }}
        color="red"
        onClick={() => onAction("delete", item)}
      >
        Delete
      </Menu.Button>
    </Menu.Content>
  </Menu.Root>
);
```

### Filter Menu

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";
import { Filter } from "lucide-react";
import { useState } from "react";

export const FilterMenu = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    assignee: "all",
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline" leadingIcon={{ icon: Filter, alt: "" }}>
          Filters
        </Button>
      </Menu.Trigger>

      <Menu.Content>
        {/* Status filter */}
        <Menu.Button
          selected={filters.status === "all"}
          onClick={() => handleFilterChange("status", "all")}
        >
          All Status
        </Menu.Button>
        <Menu.Button
          selected={filters.status === "active"}
          onClick={() => handleFilterChange("status", "active")}
        >
          Active Only
        </Menu.Button>
        <Menu.Button
          selected={filters.status === "completed"}
          onClick={() => handleFilterChange("status", "completed")}
        >
          Completed Only
        </Menu.Button>

        <Menu.Divider />

        {/* Priority filter */}
        <Menu.Button
          selected={filters.priority === "high"}
          onClick={() => handleFilterChange("priority", "high")}
        >
          High Priority
        </Menu.Button>
        <Menu.Button
          selected={filters.priority === "medium"}
          onClick={() => handleFilterChange("priority", "medium")}
        >
          Medium Priority
        </Menu.Button>
      </Menu.Content>
    </Menu.Root>
  );
};
```

## References

- [Base UI Menu](https://base-ui.com/react/components/menu)
- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/menu)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
