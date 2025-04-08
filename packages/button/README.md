![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/button)

# @telegraph/button

> A flexible button component with multiple variants, sizes, and composable parts for building interactive elements.

## Installation

```bash
npm install @telegraph/button
```

### Add stylesheet

```css
@import "@telegraph/button";
```

## Usage

### Basic Usage

```tsx
import { Button } from "@telegraph/button";

export const BasicButtons = () => {
  return (
    <Stack direction="row" gap="2">
      <Button>Default Button</Button>
      <Button variant="soft" color="accent">
        Soft Accent
      </Button>
      <Button variant="outline" color="red">
        Outline Red
      </Button>
    </Stack>
  );
};
```

### With Icons

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";

export const IconButtons = () => {
  return (
    <Stack direction="row" gap="2">
      <Button leadingIcon={{ icon: Lucide.Plus, alt: "Add" }}>Add Item</Button>
      <Button
        trailingIcon={{ icon: Lucide.ArrowRight, alt: "Next" }}
        variant="soft"
      >
        Continue
      </Button>
      <Button
        icon={{ icon: Lucide.Settings, alt: "Settings" }}
        variant="ghost"
      />
    </Stack>
  );
};
```

### Composable Parts

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";

export const ComposableButton = () => {
  return (
    <Button.Root color="accent" variant="soft">
      <Button.Icon icon={Lucide.Check} alt="Selected" />
      <Button.Text>Completed</Button.Text>
    </Button.Root>
  );
};
```

## API Reference

### Button

The main button component for simple usage.

#### Props

| Prop           | Type                                        | Default   | Description                    |
| -------------- | ------------------------------------------- | --------- | ------------------------------ |
| `variant`      | `"solid" \| "soft" \| "outline" \| "ghost"` | `"solid"` | Visual style variant           |
| `size`         | `"1" \| "2" \| "3"`                         | `"2"`     | Button size                    |
| `color`        | `"accent" \| "gray" \| "red"`               | `"gray"`  | Color theme                    |
| `leadingIcon`  | `{ icon: Icon; alt: string }`               | -         | Icon before text               |
| `trailingIcon` | `{ icon: Icon; alt: string }`               | -         | Icon after text                |
| `icon`         | `{ icon: Icon; alt: string }`               | -         | Icon-only button               |
| `disabled`     | `boolean`                                   | `false`   | Whether the button is disabled |

### Button.Root

The container component that handles layout and style coordination.

#### Props

| Prop      | Type                                        | Default   | Description          |
| --------- | ------------------------------------------- | --------- | -------------------- |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `"solid"` | Visual style variant |
| `size`    | `"1" \| "2" \| "3"`                         | `"2"`     | Button size          |
| `color`   | `"accent" \| "gray" \| "red"`               | `"gray"`  | Color theme          |

### Button.Text

Text component that inherits styles from Button.Root. Can be customized with all props from `@telegraph/typography`.

### Button.Icon

Icon component that maintains proper sizing and colors. Can be customized with all props from `@telegraph/icon`.

#### Props

| Prop    | Type                          | Default   | Description              |
| ------- | ----------------------------- | --------- | ------------------------ |
| `icon`  | `Icon`                        | -         | Icon component to render |
| `alt`   | `string`                      | -         | Accessible description   |
| `color` | `"accent" \| "gray" \| "red"` | Inherited | Icon color               |

## Examples

### Loading State

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { useState } from "react";

export const LoadingButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await someAsyncAction();
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      leadingIcon={
        isLoading
          ? {
              icon: Lucide.Loader,
              alt: "Loading",
            }
          : undefined
      }
    >
      {isLoading ? "Processing..." : "Submit"}
    </Button>
  );
};
```

### Custom Layout

```tsx
import { Button } from "@telegraph/button";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";

export const CustomButton = () => {
  return (
    <Button.Root variant="soft" size="3">
      <Stack direction="row" gap="3" align="center">
        <Button.Icon icon={Lucide.Bell} alt="Notifications" />
        <Stack gap="1">
          <Button.Text>Enable Notifications</Button.Text>
          <Button.Text size="1" color="gray">
            Get real-time updates
          </Button.Text>
        </Stack>
      </Stack>
    </Button.Root>
  );
};
```

## Accessibility

The Button component follows WAI-ARIA guidelines:

- Uses native `<button>` element for proper keyboard interaction
- Maintains focus styles for keyboard navigation
- Provides proper ARIA labels for icon-only buttons
- Communicates disabled state to assistive technologies
- Ensures proper color contrast in all variants
