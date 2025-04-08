![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/popover.svg)](https://www.npmjs.com/package/@telegraph/popover)

# @telegraph/popover

> A flexible popover component for building tooltips, dropdowns, and contextual overlays.

## Installation

```bash
npm install @telegraph/popover
```

### Add stylesheet

```css
@import "@telegraph/popover";
```

## Usage

### Basic Usage

```tsx
import { Button } from "@telegraph/button";
import { Popover } from "@telegraph/popover";
import { Text } from "@telegraph/typography";

export const BasicPopover = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Text>This is a basic popover with some content.</Text>
      </Popover.Content>
    </Popover.Root>
  );
};
```

### With Arrow and Close Button

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Popover } from "@telegraph/popover";
import { Text } from "@telegraph/typography";

export const PopoverWithArrow = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Help</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Stack gap="3">
          <Stack direction="row" justify="between" align="center">
            <Text weight="semibold">Quick Tips</Text>
            <Popover.Close />
          </Stack>
          <Text>
            Here are some helpful tips for using this feature. Click anywhere
            outside to close this popover.
          </Text>
        </Stack>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
};
```

## API Reference

### Popover.Root

The container component that manages popover state.

#### Props

| Prop           | Type                      | Default | Description                                 |
| -------------- | ------------------------- | ------- | ------------------------------------------- |
| `open`         | `boolean`                 | -       | Controlled open state                       |
| `defaultOpen`  | `boolean`                 | `false` | Initial open state                          |
| `onOpenChange` | `(open: boolean) => void` | -       | Open state change handler                   |
| `modal`        | `boolean`                 | `false` | Whether popover blocks interactions outside |

### Popover.Trigger

The button that toggles the popover.

#### Props

| Prop      | Type      | Default | Description                       |
| --------- | --------- | ------- | --------------------------------- |
| `asChild` | `boolean` | `false` | Whether to merge props onto child |

### Popover.Content

The popover container.

#### Props

| Prop              | Type                                     | Default    | Description                              |
| ----------------- | ---------------------------------------- | ---------- | ---------------------------------------- |
| `align`           | `"start" \| "center" \| "end"`           | `"center"` | Horizontal alignment                     |
| `side`            | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side                           |
| `sideOffset`      | `number`                                 | `8`        | Distance from trigger                    |
| `alignOffset`     | `number`                                 | `0`        | Offset along alignment axis              |
| `avoidCollisions` | `boolean`                                | `true`     | Whether to flip when near viewport edges |

### Popover.Arrow

An optional arrow element that points to the trigger.

### Popover.Close

A button to close the popover.

#### Props

| Prop      | Type      | Default | Description                       |
| --------- | --------- | ------- | --------------------------------- |
| `asChild` | `boolean` | `false` | Whether to merge props onto child |

## Examples

### Feature Introduction

```tsx
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Popover } from "@telegraph/popover";
import { Text } from "@telegraph/typography";

export const FeatureIntro = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="soft" icon={{ icon: Lucide.Sparkles, alt: "New" }}>
          New Feature
        </Button>
      </Popover.Trigger>
      <Popover.Content side="right">
        <Stack gap="3">
          <Stack direction="row" gap="2" align="center">
            <Icon icon={Lucide.Sparkles} alt="New" color="blue" size="5" />
            <Text weight="semibold">Try Our New Feature!</Text>
          </Stack>
          <Text>
            We've just launched an exciting new feature. Click here to learn
            more about what you can do.
          </Text>
          <Button size="1">Learn More</Button>
        </Stack>
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  );
};
```

### Interactive Form

```tsx
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Popover } from "@telegraph/popover";
import { Text } from "@telegraph/typography";
import { useState } from "react";

export const FilterPopover = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="soft">Filter by Date</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Stack gap="3">
          <Text weight="semibold">Date Range</Text>
          <Stack gap="2">
            <Stack gap="1">
              <Text as="label" size="1">
                Start Date
              </Text>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((d) => ({
                    ...d,
                    start: e.target.value,
                  }))
                }
              />
            </Stack>
            <Stack gap="1">
              <Text as="label" size="1">
                End Date
              </Text>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((d) => ({
                    ...d,
                    end: e.target.value,
                  }))
                }
              />
            </Stack>
          </Stack>
          <Stack direction="row" gap="2" justify="end">
            <Popover.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Popover.Close>
            <Button>Apply Filter</Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};
```

## Accessibility

The Popover component follows WAI-ARIA guidelines:

- Uses `role="dialog"` for modal popovers
- Manages focus trap when modal
- Provides proper labeling through `aria-labelledby` and `aria-describedby`
- Supports keyboard navigation:
  - `Tab`: Navigate focusable elements
  - `Shift + Tab`: Navigate backwards
  - `Escape`: Close popover
- Returns focus to trigger element on close
- Announces popover state changes to screen readers
