# 🔘 Toggle

> A boolean toggle component for enabling/disabling settings in the Telegraph design system.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/toggle.svg)](https://www.npmjs.com/package/@telegraph/toggle)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/toggle)](https://bundlephobia.com/result?p=@telegraph/toggle)
[![license](https://img.shields.io/npm/l/@telegraph/toggle)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/toggle
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/toggle";
```

Via Javascript:

```tsx
import "@telegraph/toggle/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Toggle } from "@telegraph/toggle";

export const Example = () => (
  <Toggle.Default label="Enable notifications" defaultValue={false} />
);
```

## API Reference

### `<Toggle.Default>` (Default Component)

The default Toggle component provides a simple API for common use cases.

| Prop             | Type                                                                                    | Default  | Description                               |
| ---------------- | --------------------------------------------------------------------------------------- | -------- | ----------------------------------------- |
| `size`           | `"1" \| "2"`                                                                            | `"2"`    | Toggle size                               |
| `color`          | `"default" \| "accent" \| "blue" \| "red" \| "green" \| "yellow" \| "purple" \| "gray"` | `"blue"` | Toggle color when enabled                 |
| `label`          | `React.ReactNode`                                                                       | -        | Label text or content                     |
| `indicator`      | `boolean`                                                                               | `false`  | Show dynamic indicator (Enabled/Disabled) |
| `value`          | `boolean`                                                                               | -        | Controlled value state                    |
| `defaultValue`   | `boolean`                                                                               | `false`  | Default value (uncontrolled)              |
| `onValueChange`  | `(value: boolean) => void`                                                              | -        | Callback when value changes               |
| `disabled`       | `boolean`                                                                               | `false`  | Whether the toggle is disabled            |
| `required`       | `boolean`                                                                               | `false`  | Whether the toggle is required            |
| `name`           | `string`                                                                                | -        | Name attribute for form submission        |
| `labelProps`     | `TgphComponentProps<typeof Text>`                                                       | -        | Props to pass to the label component      |
| `indicatorProps` | `TgphComponentProps<typeof Tag>`                                                        | -        | Props to pass to the indicator component  |

Additionally, all native HTML input attributes are supported (`aria-label`, `aria-describedby`, etc.)

### Composition API

For advanced use cases, use the composition API:

#### `<Toggle.Root>`

Container component that wraps all toggle parts and manages state.

| Prop            | Type                                                                                    | Default  | Description                    |
| --------------- | --------------------------------------------------------------------------------------- | -------- | ------------------------------ |
| `size`          | `"1" \| "2"`                                                                            | `"2"`    | Toggle size                    |
| `color`         | `"default" \| "accent" \| "blue" \| "red" \| "green" \| "yellow" \| "purple" \| "gray"` | `"blue"` | Toggle color when enabled      |
| `value`         | `boolean`                                                                               | -        | Controlled value state         |
| `defaultValue`  | `boolean`                                                                               | `false`  | Default value (uncontrolled)   |
| `onValueChange` | `(value: boolean) => void`                                                              | -        | Callback when value changes    |
| `disabled`      | `boolean`                                                                               | `false`  | Whether the toggle is disabled |
| `required`      | `boolean`                                                                               | `false`  | Whether the toggle is required |
| `name`          | `string`                                                                                | -        | Name attribute for form        |
| `id`            | `string`                                                                                | -        | ID for the input and label     |

#### `<Toggle.Switch>`

The visual toggle switch component.

Inherits all props from `Button.Root` component.

#### `<Toggle.Label>`

Label text for the toggle.

| Prop     | Type          | Default   | Description                            |
| -------- | ------------- | --------- | -------------------------------------- |
| `hidden` | `boolean`     | `false`   | Visually hide label (still accessible) |
| `as`     | `TgphElement` | `"label"` | HTML element or component to render    |

Inherits all props from `Text` component.

#### `<Toggle.Indicator>`

Dynamic indicator that shows different content based on toggle state.

| Prop              | Type              | Default      | Description                         |
| ----------------- | ----------------- | ------------ | ----------------------------------- |
| `enabledContent`  | `React.ReactNode` | `"Enabled"`  | Content to show when toggle is on   |
| `disabledContent` | `React.ReactNode` | `"Disabled"` | Content to show when toggle is off  |
| `as`              | `TgphElement`     | `"label"`    | HTML element or component to render |

Inherits all props from `Tag` component.

## Usage Patterns

### Basic Toggle

```tsx
import { Toggle } from "@telegraph/toggle";

// Toggle only
<Toggle.Default defaultValue={false} />

// Toggle with label
<Toggle.Default label="Enable notifications" defaultValue={false} />

// Pre-checked toggle
<Toggle.Default label="Subscribe to newsletter" defaultValue={true} />

// Disabled toggle
<Toggle.Default label="Premium feature" disabled defaultValue={false} />
```

### With Indicator

The indicator dynamically shows "Enabled" or "Disabled" based on toggle state:

```tsx
import { Toggle } from "@telegraph/toggle";

// Toggle with indicator (no label)
<Toggle.Default indicator={true} defaultValue={false} />

// Toggle with label and indicator
<Toggle.Default
  label="Email notifications"
  indicator={true}
  defaultValue={false}
/>

// Custom indicator text
<Toggle.Default
  indicator={true}
  indicatorProps={{
    enabledContent: "On",
    disabledContent: "Off",
  }}
  defaultValue={false}
/>

// Custom indicator colors
<Toggle.Default
  indicator={true}
  indicatorProps={{
    color: "green",
    enabledContent: "Active",
    disabledContent: "Inactive",
  }}
  defaultValue={false}
/>
```

### Sizes

```tsx
import { Toggle } from "@telegraph/toggle";

// Small toggle
<Toggle.Default label="Small setting" size="1" />

// Medium toggle (default)
<Toggle.Default label="Medium setting" size="2" />
```

### Colors

```tsx
import { Toggle } from "@telegraph/toggle";

// Blue (default)
<Toggle.Default label="Primary setting" color="blue" defaultValue={true} />

// Accent color
<Toggle.Default label="Accent setting" color="accent" defaultValue={true} />

// Green for success states
<Toggle.Default label="Success setting" color="green" defaultValue={true} />

// Red for critical settings
<Toggle.Default label="Critical setting" color="red" defaultValue={true} />
```

## Advanced Usage

### Controlled Mode

For full control over the toggle state:

```tsx
import { Toggle } from "@telegraph/toggle";
import { useState } from "react";

export const ControlledToggle = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <Toggle.Default
        label="Enable feature"
        value={enabled}
        onValueChange={setEnabled}
      />
      <p>Feature is {enabled ? "enabled" : "disabled"}</p>
    </div>
  );
};
```

### In Forms

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";

export const FormExample = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(Object.fromEntries(formData.entries()));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="3">
        <Toggle.Default
          label="I accept the terms and conditions"
          name="terms"
          required
        />
        <Toggle.Default
          label="Subscribe to newsletter"
          name="newsletter"
          defaultValue={true}
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  );
};
```

### Composition Pattern

For advanced customization, use the component parts:

```tsx
import { Toggle } from "@telegraph/toggle";

// Basic composition
export const CustomToggle = () => (
  <Toggle.Root defaultValue={false}>
    <Toggle.Label weight="bold" color="accent">
      Custom styled label
    </Toggle.Label>
    <Toggle.Switch />
  </Toggle.Root>
);

// With indicator
export const ToggleWithIndicator = () => (
  <Toggle.Root defaultValue={false}>
    <Toggle.Label>Enable notifications</Toggle.Label>
    <Toggle.Indicator enabledContent="On" disabledContent="Off" />
    <Toggle.Switch />
  </Toggle.Root>
);

// Hidden label (accessible)
export const HiddenLabelToggle = () => (
  <Toggle.Root defaultValue={false}>
    <Toggle.Label hidden>Enable dark mode</Toggle.Label>
    <Toggle.Switch />
  </Toggle.Root>
);
```

### Custom Layout

```tsx
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";

export const CustomLayout = () => (
  <Toggle.Root defaultValue={false}>
    <Stack direction="column" gap="2">
      <Toggle.Label weight="bold" size="3">
        Advanced Settings
      </Toggle.Label>
      <Stack direction="row" gap="2" align="center">
        <Toggle.Indicator />
        <Toggle.Switch />
      </Stack>
    </Stack>
  </Toggle.Root>
);
```

## Accessibility

- ✅ **Keyboard Navigation**: Focusable with Tab, toggled with Space
- ✅ **Screen Readers**: Proper checkbox semantics with labels
- ✅ **ARIA Support**: Full aria-label, aria-labelledby support
- ✅ **Focus Indicators**: Clear focus outline for keyboard users
- ✅ **Color Contrast**: All states meet WCAG AA standards
- ✅ **Disabled State**: Properly communicated to assistive tech

### ARIA Attributes

- `role="checkbox"` - Implicit via native checkbox
- `aria-checked` - Automatically managed
- `aria-disabled` - Set when disabled
- `aria-label` - For toggles without visible labels
- `aria-labelledby` - Reference to label element
- `aria-describedby` - Additional description

### Keyboard Shortcuts

| Key     | Action        |
| ------- | ------------- |
| `Tab`   | Focus toggle  |
| `Space` | Toggle on/off |
| `Enter` | Toggle on/off |

### Best Practices

1. **Always provide a label**: Either visible or via `aria-label` or `hidden` prop
2. **Use controlled mode for complex state**: When toggle state affects other UI
3. **Provide clear feedback**: Use labels that clearly indicate what will be enabled/disabled
4. **Keyboard accessible**: All toggles work with keyboard navigation

## Examples

### Settings Panel

```tsx
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";
import { Text } from "@telegraph/typography";

export const SettingsPanel = () => {
  return (
    <Stack direction="column" gap="4">
      <Stack direction="column" gap="2">
        <Text weight="bold" size="3">
          Notifications
        </Text>
        <Stack direction="column" gap="3">
          <Toggle.Default label="Email notifications" defaultValue={true} />
          <Toggle.Default label="Push notifications" defaultValue={true} />
          <Toggle.Default label="SMS notifications" defaultValue={false} />
        </Stack>
      </Stack>

      <Stack direction="column" gap="2">
        <Text weight="bold" size="3">
          Privacy
        </Text>
        <Stack direction="column" gap="3">
          <Toggle.Default label="Public profile" defaultValue={false} />
          <Toggle.Default label="Show online status" defaultValue={false} />
        </Stack>
      </Stack>
    </Stack>
  );
};
```

### Privacy Settings with Dependencies

```tsx
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";
import { Text } from "@telegraph/typography";
import { useState } from "react";

export const PrivacySettings = () => {
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <Stack direction="column" gap="4">
      <div>
        <Toggle.Default
          label="Public profile"
          value={publicProfile}
          onValueChange={setPublicProfile}
        />
        <Text size="1" color="gray" style={{ marginTop: "4px" }}>
          Allow others to see your profile information
        </Text>
      </div>

      <div>
        <Toggle.Default
          label="Show online status"
          disabled={!publicProfile}
          defaultValue={false}
        />
        <Text size="1" color="gray" style={{ marginTop: "4px" }}>
          {publicProfile
            ? "Display when you're online"
            : "Enable public profile first"}
        </Text>
      </div>
    </Stack>
  );
};
```

### Feature Flags with Indicators

```tsx
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";

export const FeatureFlags = () => {
  return (
    <Stack direction="row" gap="4">
      <Toggle.Default
        label="Beta Features"
        indicator={true}
        indicatorProps={{
          enabledContent: "Active",
          disabledContent: "Inactive",
          color: "blue",
        }}
        defaultValue={false}
      />

      <Toggle.Default
        label="Experimental UI"
        indicator={true}
        indicatorProps={{
          enabledContent: "Active",
          disabledContent: "Inactive",
          color: "purple",
        }}
        defaultValue={false}
      />

      <Toggle.Default
        label="Debug Mode"
        indicator={true}
        indicatorProps={{
          enabledContent: "Active",
          disabledContent: "Inactive",
          color: "red",
        }}
        defaultValue={false}
      />
    </Stack>
  );
};
```

### Multi-Option Toggle

```tsx
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";

export const MultiOptionToggle = () => {
  return (
    <Stack direction="row" gap="4" align="center">
      <Toggle.Default
        indicator={true}
        indicatorProps={{ children: "1" }}
        defaultValue={false}
        size="1"
      />
      <Toggle.Default
        indicator={true}
        indicatorProps={{ children: "2" }}
        defaultValue={false}
        size="1"
      />
      <Toggle.Default
        indicator={true}
        indicatorProps={{ children: "3" }}
        defaultValue={true}
        size="1"
      />
    </Stack>
  );
};
```

### Compact Settings List

```tsx
import { Stack } from "@telegraph/layout";
import { Toggle } from "@telegraph/toggle";

export const CompactSettings = () => {
  return (
    <Stack direction="column" gap="2">
      <Toggle.Default
        label="Dark mode"
        indicator={true}
        size="1"
        defaultValue={false}
      />
      <Toggle.Default
        label="Auto-save"
        indicator={true}
        size="1"
        defaultValue={true}
      />
      <Toggle.Default
        label="Show tips"
        indicator={true}
        size="1"
        defaultValue={true}
      />
    </Stack>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/toggle)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
