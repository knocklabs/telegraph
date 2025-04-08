![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/kbd.svg)](https://www.npmjs.com/package/@telegraph/kbd)

# @telegraph/kbd

> A component for displaying keyboard shortcuts and input keys with consistent styling.

## Installation

```bash
npm install @telegraph/kbd
```

### Add stylesheet

```css
@import "@telegraph/kbd";
```

## Usage

### Basic Usage

```tsx
import { Kbd } from "@telegraph/kbd";

export const BasicKbd = () => {
  return (
    <Text>
      Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search
    </Text>
  );
};
```

### Keyboard Combinations

```tsx
import { Kbd } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";

export const KeyboardShortcuts = () => {
  return (
    <Stack gap="2">
      <Stack direction="row" gap="2" align="center">
        <Text>Save:</Text>
        <Kbd>⌘</Kbd> + <Kbd>S</Kbd>
      </Stack>

      <Stack direction="row" gap="2" align="center">
        <Text>Undo:</Text>
        <Kbd>⌘</Kbd> + <Kbd>Z</Kbd>
      </Stack>

      <Stack direction="row" gap="2" align="center">
        <Text>Redo:</Text>
        <Kbd>⌘</Kbd> + <Kbd>⇧</Kbd> + <Kbd>Z</Kbd>
      </Stack>
    </Stack>
  );
};
```

### Platform-Specific Keys

```tsx
import { Kbd } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const PlatformKeys = () => {
  const isMac = navigator.platform.toLowerCase().includes("mac");

  return (
    <Stack gap="3">
      <Stack direction="row" gap="2" align="center">
        <Text>Copy:</Text>
        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd> + <Kbd>C</Kbd>
      </Stack>

      <Stack direction="row" gap="2" align="center">
        <Text>Paste:</Text>
        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd> + <Kbd>V</Kbd>
      </Stack>
    </Stack>
  );
};
```

## API Reference

### Kbd

The keyboard input component.

#### Props

| Prop       | Type                    | Default     | Description              |
| ---------- | ----------------------- | ----------- | ------------------------ |
| `size`     | `"1" \| "2"`            | `"1"`       | Size of the key display  |
| `variant`  | `"default" \| "subtle"` | `"default"` | Visual style variant     |
| `children` | `React.ReactNode`       | -           | Key or symbol to display |

## Examples

### Hotkey Helper

```tsx
import { Kbd } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const HotkeyHelper = () => {
  return (
    <Stack gap="4">
      <Text weight="medium">Editor Shortcuts</Text>

      <Stack gap="2">
        <Stack direction="row" gap="2" align="center" justify="between">
          <Text>Bold</Text>
          <Stack direction="row" gap="2">
            <Kbd>⌘</Kbd> + <Kbd>B</Kbd>
          </Stack>
        </Stack>

        <Stack direction="row" gap="2" align="center" justify="between">
          <Text>Italic</Text>
          <Stack direction="row" gap="2">
            <Kbd>⌘</Kbd> + <Kbd>I</Kbd>
          </Stack>
        </Stack>

        <Stack direction="row" gap="2" align="center" justify="between">
          <Text>Underline</Text>
          <Stack direction="row" gap="2">
            <Kbd>⌘</Kbd> + <Kbd>U</Kbd>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
```

### Command Menu Trigger

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { Kbd } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const CommandMenuTrigger = () => {
  return (
    <Button variant="soft">
      <Stack direction="row" gap="2" align="center">
        <Icon icon={Lucide.Search} alt="Search" />
        <Text>Quick Actions</Text>
        <Stack direction="row" gap="1">
          <Kbd size="1">⌘</Kbd>
          <Kbd size="1">K</Kbd>
        </Stack>
      </Stack>
    </Button>
  );
};
```

### Interactive Tutorial

```tsx
import { Kbd } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useEffect, useState } from "react";

export const KeyboardTutorial = () => {
  const [currentKey, setCurrentKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCurrentKey(e.key.toUpperCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Stack gap="3" align="center">
      <Text>Press any key:</Text>
      {currentKey && <Kbd size="2">{currentKey}</Kbd>}
    </Stack>
  );
};
```

## Accessibility

The Kbd component follows accessibility best practices:

- Uses semantic `<kbd>` HTML element
- Maintains proper color contrast for readability
- Works with screen readers to announce key combinations
- Scales appropriately with system font size settings
