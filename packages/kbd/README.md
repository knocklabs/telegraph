# ⌨️ Kbd

> Interactive keyboard key component that responds to actual key presses with platform-aware styling.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/kbd.svg)](https://www.npmjs.com/package/@telegraph/kbd)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/kbd)](https://bundlephobia.com/result?p=@telegraph/kbd)
[![license](https://img.shields.io/npm/l/@telegraph/kbd)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/kbd
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/kbd";
```

Via Javascript:

```tsx
import "@telegraph/kbd/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";

export const KeyboardShortcut = () => (
  <KbdProvider>
    <p>
      Press <Kbd label="Meta" /> + <Kbd label="K" /> to search
    </p>
  </KbdProvider>
);
```

## API Reference

### `<Kbd>`

Displays a keyboard key with automatic icon/text resolution and press state.

| Prop       | Type                       | Default  | Description                                 |
| ---------- | -------------------------- | -------- | ------------------------------------------- |
| `label`    | `string`                   | required | Key label (e.g., "K", "Enter", "Meta")      |
| `size`     | `"0" \| "1" \| "2" \| "3"` | `"1"`    | Key size                                    |
| `contrast` | `boolean`                  | `false`  | Use contrast styling                        |
| `eventKey` | `KeyboardEvent["key"]`     | `label`  | Key event to listen for (defaults to label) |

### `<KbdProvider>`

Provides keyboard state context for managing multiple key presses.

| Prop       | Type              | Default  | Description      |
| ---------- | ----------------- | -------- | ---------------- |
| `children` | `React.ReactNode` | required | Child components |

## Key Recognition

The Kbd component automatically recognizes special keys and displays appropriate icons or text:

### Special Keys with Icons

- `Meta` → ⌘ (Mac) / Ctrl (PC)
- `Alt` → ⌥ (Mac) / Alt (PC)
- `Enter` → ↵ icon
- `Shift` → ⇧ icon
- `Backspace` → ⌫ icon
- `ArrowUp` → ↑ icon
- `ArrowDown` → ↓ icon
- `ArrowLeft` → ← icon
- `ArrowRight` → → icon

### Keys with Text

- `Control` → "Ctrl"
- `Escape` → "Esc"
- Single characters → Uppercase (e.g., "k" → "K")
- Other keys → As provided

## Usage Patterns

### Basic Keys

```tsx
import { Kbd } from "@telegraph/kbd";

// Letter keys
<Kbd label="K" />
<Kbd label="j" /> {/* Displays as "J" */}

// Number keys
<Kbd label="1" />
<Kbd label="0" />

// Special characters
<Kbd label="/" />
<Kbd label="?" />
```

### Modifier Keys

```tsx
import { Kbd } from "@telegraph/kbd";

// Platform-aware modifiers
<Kbd label="Meta" />     {/* ⌘ on Mac, Ctrl on PC */}
<Kbd label="Alt" />      {/* ⌥ on Mac, Alt on PC */}
<Kbd label="Control" />  {/* Always "Ctrl" */}
<Kbd label="Shift" />    {/* ⇧ icon */}
```

### Arrow Keys

```tsx
import { Kbd } from "@telegraph/kbd";

<Kbd label="ArrowUp" />
<Kbd label="ArrowDown" />
<Kbd label="ArrowLeft" />
<Kbd label="ArrowRight" />
```

### Sizes

```tsx
import { Kbd } from "@telegraph/kbd";

<Kbd label="K" size="0" /> {/* Extra small */}
<Kbd label="K" size="1" /> {/* Small (default) */}
<Kbd label="K" size="2" /> {/* Medium */}
<Kbd label="K" size="3" /> {/* Large */}
```

### Contrast Mode

```tsx
import { Kbd } from "@telegraph/kbd";

// Use on dark backgrounds
<div style={{ background: "var(--tgph-accent-9)", padding: "1rem" }}>
  <Kbd label="K" contrast />
</div>;
```

## Advanced Usage

### Keyboard Shortcuts Documentation

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const ShortcutHelp = () => (
  <KbdProvider>
    <Stack gap="3">
      <Stack direction="row" align="center" gap="2">
        <Stack direction="row" gap="1">
          <Kbd label="Meta" />
          <Text>+</Text>
          <Kbd label="K" />
        </Stack>
        <Text>Search</Text>
      </Stack>

      <Stack direction="row" align="center" gap="2">
        <Stack direction="row" gap="1">
          <Kbd label="Meta" />
          <Text>+</Text>
          <Kbd label="Shift" />
          <Text>+</Text>
          <Kbd label="P" />
        </Stack>
        <Text>Command Palette</Text>
      </Stack>

      <Stack direction="row" align="center" gap="2">
        <Kbd label="Escape" />
        <Text>Close Dialog</Text>
      </Stack>
    </Stack>
  </KbdProvider>
);
```

### Interactive Key Demonstration

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const InteractiveDemo = () => (
  <KbdProvider>
    <Stack gap="4">
      <Text>Try pressing these keys on your keyboard:</Text>
      <Stack direction="row" gap="2" wrap>
        <Kbd label="j" eventKey="j" />
        <Kbd label="k" eventKey="k" />
        <Kbd label="ArrowUp" />
        <Kbd label="ArrowDown" />
        <Kbd label="Enter" />
        <Kbd label="Escape" />
      </Stack>
      <Text size="1" color="gray">
        Keys will highlight when pressed!
      </Text>
    </Stack>
  </KbdProvider>
);
```

### Game Controls

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const GameControls = () => (
  <KbdProvider>
    <Stack gap="4">
      <Text as="h3">Game Controls</Text>

      <Stack gap="2">
        <Text weight="medium">Movement</Text>
        <Stack direction="row" gap="1">
          <Kbd label="W" />
          <Kbd label="A" />
          <Kbd label="S" />
          <Kbd label="D" />
        </Stack>
      </Stack>

      <Stack gap="2">
        <Text weight="medium">Actions</Text>
        <Stack direction="row" gap="2">
          <Stack direction="row" align="center" gap="1">
            <Kbd label=" " /> {/* Space */}
            <Text size="1">Jump</Text>
          </Stack>
          <Stack direction="row" align="center" gap="1">
            <Kbd label="E" />
            <Text size="1">Interact</Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  </KbdProvider>
);
```

### Code Editor Shortcuts

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

const shortcuts = [
  { keys: ["Meta", "S"], action: "Save file" },
  { keys: ["Meta", "Shift", "S"], action: "Save all files" },
  { keys: ["Meta", "/"], action: "Toggle comment" },
  { keys: ["Alt", "ArrowUp"], action: "Move line up" },
  { keys: ["Alt", "ArrowDown"], action: "Move line down" },
  { keys: ["Meta", "D"], action: "Duplicate line" },
];

export const EditorShortcuts = () => (
  <KbdProvider>
    <Stack gap="3">
      <Text as="h3">Editor Shortcuts</Text>
      {shortcuts.map(({ keys, action }, index) => (
        <Stack key={index} direction="row" align="center" gap="3">
          <Stack direction="row" gap="1" align="center">
            {keys.map((key, keyIndex) => (
              <Stack key={keyIndex} direction="row" align="center" gap="1">
                {keyIndex > 0 && <Text size="1">+</Text>}
                <Kbd label={key} size="0" />
              </Stack>
            ))}
          </Stack>
          <Text size="1">{action}</Text>
        </Stack>
      ))}
    </Stack>
  </KbdProvider>
);
```

### Custom Event Keys

```tsx
import { Kbd } from "@telegraph/kbd";

// Display one key but listen for a different one
<Kbd label="Space" eventKey=" " />
<Kbd label="Tab" eventKey="Tab" />
<Kbd label="Page Up" eventKey="PageUp" />
```

### Keyboard Navigation Guide

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const NavigationGuide = () => (
  <KbdProvider>
    <Stack gap="4">
      <Text as="h3">Keyboard Navigation</Text>

      <Stack gap="3">
        <Stack direction="row" align="center" gap="2">
          <Kbd label="Tab" />
          <Text>Next element</Text>
        </Stack>

        <Stack direction="row" align="center" gap="2">
          <Stack direction="row" gap="1">
            <Kbd label="Shift" />
            <Text>+</Text>
            <Kbd label="Tab" />
          </Stack>
          <Text>Previous element</Text>
        </Stack>

        <Stack direction="row" align="center" gap="2">
          <Kbd label="Enter" />
          <Text>Activate/Submit</Text>
        </Stack>

        <Stack direction="row" align="center" gap="2">
          <Kbd label="Escape" />
          <Text>Cancel/Close</Text>
        </Stack>

        <Stack direction="row" align="center" gap="2">
          <Stack direction="row" gap="1">
            <Kbd label="ArrowUp" />
            <Kbd label="ArrowDown" />
          </Stack>
          <Text>Navigate list items</Text>
        </Stack>
      </Stack>
    </Stack>
  </KbdProvider>
);
```

## Design Tokens & Styling

The Kbd component uses Telegraph design tokens for consistent styling:

### Size Tokens

**Size "0" (Extra Small):**

- Container: `min-width: var(--tgph-spacing-4)`, `height: var(--tgph-spacing-4)`
- Text: `size: 0`, `padding: var(--tgph-spacing-1)`
- Icon: `size: 0`

**Size "1" (Small - default):**

- Container: `min-width: var(--tgph-spacing-5)`, `height: var(--tgph-spacing-5)`
- Text: `size: 0`, `padding: var(--tgph-spacing-1)`
- Icon: `size: 0`

**Size "2" (Medium):**

- Container: `min-width: var(--tgph-spacing-6)`, `height: var(--tgph-spacing-6)`
- Text: `size: 1`, `padding: var(--tgph-spacing-1)`
- Icon: `size: 1`

**Size "3" (Large):**

- Container: `min-width: var(--tgph-spacing-8)`, `height: var(--tgph-spacing-8)`
- Text: `size: 2`, `padding: var(--tgph-spacing-2)`
- Icon: `size: 2`

### Color Tokens

**Default Styling:**

- Background: `var(--tgph-surface-1)`
- Border: `var(--tgph-gray-3)`
- Text: `var(--tgph-gray-12)`
- Pressed: `var(--tgph-gray-4)`

**Contrast Styling:**

- Background: `transparent`
- Border: `var(--tgph-gray-3)` (light) / `var(--tgph-black)` (dark)
- Text: `var(--tgph-white)` (light) / `var(--tgph-black)` (dark)
- Pressed: `var(--tgph-alpha-black-2)`

### Best Practices

1. **Wrap in KbdProvider**: Always use `KbdProvider` for proper keyboard state management
2. **Provide Context**: Explain what each shortcut does
3. **Group Related Keys**: Use visual hierarchy to group shortcuts
4. **Platform Consistency**: Let the component handle platform differences
5. **Test Interaction**: Verify that displayed keys actually trigger when pressed

## Examples

### Help Dialog with Shortcuts

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Modal } from "@telegraph/modal";
import { Text } from "@telegraph/typography";

export const HelpDialog = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <Modal.Content>
      <Modal.Header>
        <Text as="h2">Keyboard Shortcuts</Text>
      </Modal.Header>

      <Modal.Body>
        <KbdProvider>
          <Stack gap="4">
            <Stack gap="2">
              <Text weight="medium">Navigation</Text>
              <Stack gap="1">
                <ShortcutRow keys={["j"]} action="Next item" />
                <ShortcutRow keys={["k"]} action="Previous item" />
                <ShortcutRow keys={["Enter"]} action="Open item" />
              </Stack>
            </Stack>

            <Stack gap="2">
              <Text weight="medium">Actions</Text>
              <Stack gap="1">
                <ShortcutRow keys={["Meta", "K"]} action="Search" />
                <ShortcutRow keys={["?"]} action="Show help" />
                <ShortcutRow keys={["Escape"]} action="Close dialog" />
              </Stack>
            </Stack>
          </Stack>
        </KbdProvider>
      </Modal.Body>
    </Modal.Content>
  </Modal>
);

const ShortcutRow = ({ keys, action }) => (
  <Stack direction="row" align="center" justify="space-between">
    <Stack direction="row" gap="1" align="center">
      {keys.map((key, index) => (
        <Stack key={index} direction="row" align="center" gap="1">
          {index > 0 && <Text size="1">+</Text>}
          <Kbd label={key} size="0" />
        </Stack>
      ))}
    </Stack>
    <Text size="1" color="gray">
      {action}
    </Text>
  </Stack>
);
```

### Command Palette Trigger

```tsx
import { Button } from "@telegraph/button";
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Search } from "lucide-react";

export const CommandPaletteTrigger = ({ onClick }) => (
  <KbdProvider>
    <Button
      variant="outline"
      onClick={onClick}
      style={{ width: "300px", justifyContent: "space-between" }}
    >
      <Stack direction="row" align="center" gap="2">
        <Search size={16} />
        <Text color="gray">Search...</Text>
      </Stack>

      <Stack direction="row" gap="1">
        <Kbd label="Meta" size="0" />
        <Kbd label="K" size="0" />
      </Stack>
    </Button>
  </KbdProvider>
);
```

### Gaming Key Display

```tsx
import { Kbd, KbdProvider } from "@telegraph/kbd";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const GameHUD = () => (
  <KbdProvider>
    <Stack
      position="fixed"
      bottom="4"
      right="4"
      bg="alpha-black-8"
      padding="3"
      rounded="2"
      gap="2"
    >
      <Text size="1" color="white" weight="medium">
        Controls
      </Text>

      <Stack gap="1">
        <Stack direction="row" gap="1" justify="center">
          <Kbd label="W" size="0" contrast />
        </Stack>
        <Stack direction="row" gap="1">
          <Kbd label="A" size="0" contrast />
          <Kbd label="S" size="0" contrast />
          <Kbd label="D" size="0" contrast />
        </Stack>
      </Stack>

      <Stack direction="row" justify="space-between" align="center">
        <Text size="0" color="white">
          Jump
        </Text>
        <Kbd label=" " size="0" contrast />
      </Stack>
    </Stack>
  </KbdProvider>
);
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/kbd)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
