![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/tooltip)

# @telegraph/tooltip

> A flexible tooltip component that provides contextual information when hovering over elements.

## Installation

```bash
npm install @telegraph/tooltip
```

### Add stylesheet

```css
@import "@telegraph/tooltip";
```

## Usage

### Basic Usage

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const BasicTooltip = () => {
  return (
    <Tooltip label="This is a helpful tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  );
};
```

### With Different Positions

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Tooltip } from "@telegraph/tooltip";

export const TooltipPositions = () => {
  return (
    <Stack gap="4">
      <Tooltip label="Top tooltip" side="top">
        <Button>Hover me</Button>
      </Tooltip>
      <Tooltip label="Bottom tooltip" side="bottom">
        <Button>Hover me</Button>
      </Tooltip>
      <Tooltip label="Left tooltip" side="left">
        <Button>Hover me</Button>
      </Tooltip>
      <Tooltip label="Right tooltip" side="right">
        <Button>Hover me</Button>
      </Tooltip>
    </Stack>
  );
};
```

### With Different Appearances

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Tooltip } from "@telegraph/tooltip";

export const TooltipAppearances = () => {
  return (
    <Stack gap="4">
      <Tooltip label="Dark tooltip" appearance="dark">
        <Button>Hover me</Button>
      </Tooltip>
      <Tooltip label="Light tooltip" appearance="light">
        <Button>Hover me</Button>
      </Tooltip>
    </Stack>
  );
};
```

### With Custom Content

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";

export const CustomTooltip = () => {
  return (
    <Tooltip
      label={
        <Stack gap="1">
          <Text weight="medium">Custom Tooltip</Text>
          <Text size="1" color="gray-11">
            With multiple lines of text
          </Text>
        </Stack>
      }
    >
      <Button>Hover me</Button>
    </Tooltip>
  );
};
```

### With TooltipGroupProvider

Use TooltipGroupProvider when you have multiple tooltips that should share state, preventing flickering when moving between them.

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Tooltip, TooltipGroupProvider } from "@telegraph/tooltip";

export const TooltipGroup = () => {
  return (
    <TooltipGroupProvider>
      <Stack gap="2">
        <Tooltip label="First tooltip">
          <Button>First button</Button>
        </Tooltip>
        <Tooltip label="Second tooltip">
          <Button>Second button</Button>
        </Tooltip>
      </Stack>
    </TooltipGroupProvider>
  );
};
```

## API Reference

### Tooltip

The main tooltip component that wraps around the trigger element.

#### Props

| Prop            | Type                                     | Default    | Description                                      |
| --------------- | ---------------------------------------- | ---------- | ------------------------------------------------ |
| `label`         | `string \| React.ReactNode`              | -          | The content to display in the tooltip            |
| `side`          | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | The preferred side to place the tooltip          |
| `align`         | `"start" \| "center" \| "end"`           | `"center"` | The alignment along the side                     |
| `sideOffset`    | `number`                                 | `4`        | The distance between the tooltip and the trigger |
| `appearance`    | `"light" \| "dark"`                      | `"dark"`   | The visual theme of the tooltip                  |
| `enabled`       | `boolean`                                | `true`     | Whether the tooltip is enabled                   |
| `delayDuration` | `number`                                 | `400`      | Delay in ms before showing the tooltip           |
| `skipAnimation` | `boolean`                                | `false`    | Whether to skip the show/hide animation          |

Additionally, Tooltip accepts all props from Radix UI's Tooltip.Content component.

### TooltipGroupProvider

A provider component that manages shared state between multiple tooltips.

```tsx
type TooltipGroupProviderProps = {
  children: React.ReactNode;
};
```

## Accessibility

The Tooltip component follows WAI-ARIA guidelines for tooltips:

- Uses `role="tooltip"` for proper screen reader announcement
- Supports keyboard navigation
- Manages focus appropriately
- Provides ARIA labels and descriptions
- Handles hover and focus states correctly

## Examples

### Interactive Tooltip

```tsx
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";

export const InteractiveTooltip = () => {
  return (
    <Tooltip
      label={
        <Stack gap="2">
          <Text weight="medium">Delete account?</Text>
          <Text size="1">This action cannot be undone.</Text>
          <Button size="1" color="red">
            Confirm delete
          </Button>
        </Stack>
      }
      delayDuration={0}
    >
      <Button color="red">Delete Account</Button>
    </Tooltip>
  );
};
```

### Tooltip with Icon

```tsx
import { Button } from "@telegraph/button";
import { Icon, Lucide } from "@telegraph/icon";
import { Tooltip } from "@telegraph/tooltip";

export const IconTooltip = () => {
  return (
    <Tooltip label="More information">
      <Button variant="ghost" size="1">
        <Icon icon={Lucide.Info} />
      </Button>
    </Tooltip>
  );
};
```
