![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/segmented-control.svg)](https://www.npmjs.com/package/@telegraph/segmented-control)

# @telegraph/segmented-control

> A flexible segmented control component for switching between mutually exclusive options.

## Installation

```bash
npm install @telegraph/segmented-control
```

### Add stylesheet

```css
@import "@telegraph/segmented-control";
```

## Usage

### Basic Usage

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const BasicSegmentedControl = () => {
  const [value, setValue] = useState("daily");

  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      options={[
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Monthly", value: "monthly" },
      ]}
    />
  );
};
```

### With Icons

```tsx
import { Lucide } from "@telegraph/icon";
import { SegmentedControl } from "@telegraph/segmented-control";

export const IconSegmentedControl = () => {
  const [value, setValue] = useState("grid");

  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      options={[
        {
          label: "Grid",
          value: "grid",
          icon: { icon: Lucide.Grid, alt: "Grid view" },
        },
        {
          label: "List",
          value: "list",
          icon: { icon: Lucide.List, alt: "List view" },
        },
      ]}
    />
  );
};
```

## API Reference

### SegmentedControl

The main component for simple usage.

#### Props

| Prop            | Type                      | Default | Description                       |
| --------------- | ------------------------- | ------- | --------------------------------- |
| `value`         | `string`                  | -       | The selected value                |
| `onValueChange` | `(value: string) => void` | -       | Called when selection changes     |
| `options`       | `Array<SegmentOption>`    | -       | Array of segment options          |
| `size`          | `"1" \| "2"`              | `"2"`   | Size of the control               |
| `disabled`      | `boolean`                 | `false` | Whether all segments are disabled |

Where `SegmentOption` is:

```ts
type SegmentOption = {
  label: string;
  value: string;
  icon?: { icon: Icon; alt: string };
  disabled?: boolean;
};
```

### SegmentedControl.Root

The container component for custom segment layouts.

#### Props

| Prop            | Type                      | Default | Description                       |
| --------------- | ------------------------- | ------- | --------------------------------- |
| `value`         | `string`                  | -       | The selected value                |
| `onValueChange` | `(value: string) => void` | -       | Called when selection changes     |
| `size`          | `"1" \| "2"`              | `"2"`   | Size of the control               |
| `disabled`      | `boolean`                 | `false` | Whether all segments are disabled |

### SegmentedControl.Item

Individual segment item for custom layouts.

#### Props

| Prop       | Type      | Default | Description                     |
| ---------- | --------- | ------- | ------------------------------- |
| `value`    | `string`  | -       | The value of this option        |
| `disabled` | `boolean` | `false` | Whether this option is disabled |

## Examples

### Time Range Selector

```tsx
import { Stack } from "@telegraph/layout";
import { SegmentedControl } from "@telegraph/segmented-control";
import { Text } from "@telegraph/typography";

export const TimeRangeSelector = () => {
  const [range, setRange] = useState("7d");

  return (
    <Stack gap="2">
      <Text size="1" weight="medium">
        Time Range
      </Text>
      <SegmentedControl
        value={range}
        onValueChange={setRange}
        options={[
          { label: "24h", value: "24h" },
          { label: "7d", value: "7d" },
          { label: "30d", value: "30d" },
          { label: "90d", value: "90d" },
        ]}
        size="1"
      />
    </Stack>
  );
};
```

### Custom Layout

```tsx
import { Icon } from "@telegraph/icon";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { SegmentedControl } from "@telegraph/segmented-control";
import { Text } from "@telegraph/typography";

export const CustomSegmentedControl = () => {
  const [view, setView] = useState("card");

  return (
    <SegmentedControl.Root value={view} onValueChange={setView}>
      <SegmentedControl.Item value="card">
        <Stack direction="row" gap="2" align="center" p="2">
          <Icon icon={Lucide.CreditCard} alt="Card view" size="4" />
          <Stack gap="0">
            <Text size="2">Card</Text>
            <Text size="1" color="gray-11">
              Grid layout
            </Text>
          </Stack>
        </Stack>
      </SegmentedControl.Item>

      <SegmentedControl.Item value="table">
        <Stack direction="row" gap="2" align="center" p="2">
          <Icon icon={Lucide.Table} alt="Table view" size="4" />
          <Stack gap="0">
            <Text size="2">Table</Text>
            <Text size="1" color="gray-11">
              List layout
            </Text>
          </Stack>
        </Stack>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  );
};
```

## Accessibility

The SegmentedControl component follows WAI-ARIA guidelines:

- Uses `role="tablist"` for the container
- Uses `role="tab"` for individual segments
- Supports keyboard navigation:
  - `←` / `→`: Navigate segments
  - `Home`: First segment
  - `End`: Last segment
  - `Space` / `Enter`: Select segment
- Manages focus appropriately
- Announces selection changes to screen readers
