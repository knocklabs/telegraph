![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/icon.svg)](https://www.npmjs.com/package/@telegraph/icon)

# @telegraph/icon

> A comprehensive icon system with Lucide icons and consistent styling options.

## Installation

```bash
npm install @telegraph/icon
```

### Add stylesheet

```css
@import "@telegraph/icon";
```

## Usage

### Basic Usage

```tsx
import { Icon, Lucide } from "@telegraph/icon";

export const BasicIcon = () => {
  return <Icon icon={Lucide.Bell} alt="Notifications" />;
};
```

### Icon Variants

```tsx
import { Icon, Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";

export const IconVariants = () => {
  return (
    <Stack direction="row" gap="3">
      <Icon icon={Lucide.Check} alt="Success" color="green" variant="primary" />
      <Icon
        icon={Lucide.AlertCircle}
        alt="Warning"
        color="yellow"
        variant="secondary"
      />
      <Icon icon={Lucide.X} alt="Error" color="red" size="3" />
    </Stack>
  );
};
```

### With Text

```tsx
import { Icon, Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const IconWithText = () => {
  return (
    <Stack direction="row" gap="2" align="center">
      <Icon icon={Lucide.Info} alt="Information" color="blue" />
      <Text>Important information</Text>
    </Stack>
  );
};
```

## API Reference

### Icon

The main icon component.

#### Props

| Prop      | Type                                                                                               | Default     | Description            |
| --------- | -------------------------------------------------------------------------------------------------- | ----------- | ---------------------- |
| `icon`    | `React.ComponentType`                                                                              | -           | Lucide icon component  |
| `alt`     | `string`                                                                                           | -           | Accessible description |
| `size`    | `"1" \| "2" \| "3" \| "4" \| "5" \| "6"`                                                           | `"2"`       | Icon size              |
| `color`   | `"default" \| "gray" \| "red" \| "blue" \| "green" \| "yellow" \| "purple" \| "accent" \| "white"` | `"default"` | Icon color             |
| `variant` | `"primary" \| "secondary"`                                                                         | `"primary"` | Visual variant         |

### Available Icons

All icons are imported from Lucide and available through the `Lucide` export:

```tsx
import { Lucide } from "@telegraph/icon";

// Available icons
Lucide.Bell; // Notification bell
Lucide.Check; // Checkmark
Lucide.X; // Close/remove
Lucide.AlertCircle; // Warning
Lucide.Info; // Information
// ... and many more
```

## Examples

### Interactive Icon

```tsx
import { Icon, Lucide } from "@telegraph/icon";
import { useState } from "react";

export const InteractiveIcon = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Box
      as="button"
      onClick={() => setIsActive(!isActive)}
      aria-pressed={isActive}
    >
      <Icon
        icon={isActive ? Lucide.Heart : Lucide.HeartOutline}
        alt={isActive ? "Unlike" : "Like"}
        color={isActive ? "red" : "gray"}
      />
    </Box>
  );
};
```

### Loading State

```tsx
import { keyframes } from "@telegraph/core";
import { Icon, Lucide } from "@telegraph/icon";

const spin = keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export const LoadingIcon = () => {
  return (
    <Icon
      icon={Lucide.Loader}
      alt="Loading"
      css={{ animation: `${spin} 1s linear infinite` }}
    />
  );
};
```

### Icon Button

```tsx
import { Button } from "@telegraph/button";
import { Icon, Lucide } from "@telegraph/icon";

export const IconButton = () => {
  return (
    <Button
      variant="ghost"
      size="2"
      icon={{ icon: Lucide.Settings, alt: "Settings" }}
    />
  );
};
```

## Accessibility

The Icon component follows accessibility best practices:

- Requires an `alt` prop for screen reader description
- Uses semantic HTML when wrapped in interactive elements
- Maintains proper color contrast ratios
- Scales appropriately with system font size settings
