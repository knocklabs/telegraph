![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/menu.svg)](https://www.npmjs.com/package/@telegraph/menu)

# @telegraph/menu

> A flexible menu component for building dropdowns, context menus, and other popup interfaces.

## Installation

```bash
npm install @telegraph/menu
```

### Add stylesheet

```css
@import "@telegraph/menu";
```

## Usage

### Basic Usage

```tsx
import { Button } from "@telegraph/button";
import { Menu } from "@telegraph/menu";

export const BasicMenu = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button>Options</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => console.log("New")}>New</Menu.Item>
        <Menu.Item onSelect={() => console.log("Open")}>Open</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => console.log("Save")}>Save</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
```

### With Icons and Shortcuts

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { Kbd } from "@telegraph/kbd";
import { Menu } from "@telegraph/menu";

export const MenuWithIcons = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button icon={{ icon: Lucide.Settings, alt: "Settings" }} />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item
          icon={{ icon: Lucide.Plus, alt: "New" }}
          shortcut={
            <>
              <Kbd>⌘</Kbd>
              <Kbd>N</Kbd>
            </>
          }
        >
          New File
        </Menu.Item>
        <Menu.Item
          icon={{ icon: Lucide.Copy, alt: "Copy" }}
          shortcut={
            <>
              <Kbd>⌘</Kbd>
              <Kbd>C</Kbd>
            </>
          }
        >
          Copy
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item
          icon={{ icon: Lucide.Trash, alt: "Delete" }}
          variant="danger"
        >
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
```

### Sub-Menus

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { Menu } from "@telegraph/menu";

export const SubMenuExample = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button>File</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item>New File</Menu.Item>
        <Menu.Sub>
          <Menu.SubTrigger icon={{ icon: Lucide.FolderOpen, alt: "Open" }}>
            Open Recent
          </Menu.SubTrigger>
          <Menu.SubContent>
            <Menu.Item>document.txt</Menu.Item>
            <Menu.Item>image.png</Menu.Item>
            <Menu.Item>project.js</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
        <Menu.Separator />
        <Menu.Item>Save</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
```

## API Reference

### Menu.Root

The container component that manages menu state.

#### Props

| Prop           | Type                      | Default | Description                              |
| -------------- | ------------------------- | ------- | ---------------------------------------- |
| `defaultOpen`  | `boolean`                 | `false` | Initial open state                       |
| `open`         | `boolean`                 | -       | Controlled open state                    |
| `onOpenChange` | `(open: boolean) => void` | -       | Open state change handler                |
| `modal`        | `boolean`                 | `true`  | Whether menu blocks interactions outside |

### Menu.Trigger

The button that toggles the menu.

#### Props

| Prop      | Type      | Default | Description                       |
| --------- | --------- | ------- | --------------------------------- |
| `asChild` | `boolean` | `false` | Whether to merge props onto child |

### Menu.Content

The popup menu container.

#### Props

| Prop         | Type                           | Default   | Description                   |
| ------------ | ------------------------------ | --------- | ----------------------------- |
| `align`      | `"start" \| "center" \| "end"` | `"start"` | Alignment relative to trigger |
| `sideOffset` | `number`                       | `4`       | Distance from trigger         |

### Menu.Item

Individual menu item.

#### Props

| Prop       | Type                          | Default     | Description               |
| ---------- | ----------------------------- | ----------- | ------------------------- |
| `onSelect` | `() => void`                  | -           | Selection handler         |
| `disabled` | `boolean`                     | `false`     | Whether item is disabled  |
| `icon`     | `{ icon: Icon; alt: string }` | -           | Leading icon              |
| `shortcut` | `React.ReactNode`             | -           | Keyboard shortcut display |
| `variant`  | `"default" \| "danger"`       | `"default"` | Visual style variant      |

### Menu.Separator

Visual separator between menu items.

### Menu.Sub

Container for sub-menu functionality.

### Menu.SubTrigger

Button that opens sub-menu.

#### Props

Same as Menu.Item

### Menu.SubContent

Container for sub-menu items.

#### Props

Same as Menu.Content

## Examples

### Context Menu

```tsx
import { Menu } from "@telegraph/menu";
import { useState } from "react";

export const ContextMenu = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <Box
      onContextMenu={(e) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
      }}
      h="64"
      background="surface-1"
      rounded="2"
    >
      <Menu.Root>
        <Menu.Content
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
          }}
        >
          <Menu.Item icon={{ icon: Lucide.Copy, alt: "Copy" }}>Copy</Menu.Item>
          <Menu.Item icon={{ icon: Lucide.Paste, alt: "Paste" }}>
            Paste
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item
            icon={{ icon: Lucide.Trash, alt: "Delete" }}
            variant="danger"
          >
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </Box>
  );
};
```

### Checkbox Menu

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { Menu } from "@telegraph/menu";
import { useState } from "react";

export const CheckboxMenu = () => {
  const [selections, setSelections] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button>Format</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item
          icon={{
            icon: selections.bold ? Lucide.Check : undefined,
            alt: "Toggle bold",
          }}
          onSelect={() =>
            setSelections((s) => ({
              ...s,
              bold: !s.bold,
            }))
          }
        >
          Bold
        </Menu.Item>
        <Menu.Item
          icon={{
            icon: selections.italic ? Lucide.Check : undefined,
            alt: "Toggle italic",
          }}
          onSelect={() =>
            setSelections((s) => ({
              ...s,
              italic: !s.italic,
            }))
          }
        >
          Italic
        </Menu.Item>
        <Menu.Item
          icon={{
            icon: selections.underline ? Lucide.Check : undefined,
            alt: "Toggle underline",
          }}
          onSelect={() =>
            setSelections((s) => ({
              ...s,
              underline: !s.underline,
            }))
          }
        >
          Underline
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
};
```

## Accessibility

The Menu component follows WAI-ARIA guidelines:

- Uses `role="menu"` and `role="menuitem"`
- Supports keyboard navigation:
  - `↓` / `↑`: Navigate items
  - `→`: Open sub-menu
  - `←`: Close sub-menu
  - `Enter` / `Space`: Select item
  - `Escape`: Close menu
- Manages focus appropriately
- Announces selection changes to screen readers
- Supports typeahead for quick navigation
