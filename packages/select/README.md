![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/select.svg)](https://www.npmjs.com/package/@telegraph/select)

# @telegraph/select

> A flexible select component for single and multiple selection with rich content support.

## Installation

```bash
npm install @telegraph/select
```

### Add stylesheet

```css
@import "@telegraph/select";
```

## Usage

### Basic Usage

```tsx
import { Select } from "@telegraph/select";

export const BasicSelect = () => {
  const [value, setValue] = useState("");

  return (
    <Select
      value={value}
      onValueChange={setValue}
      options={[
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Orange", value: "orange" },
      ]}
      placeholder="Select a fruit..."
    />
  );
};
```

### With Icons

```tsx
import { Lucide } from "@telegraph/icon";
import { Select } from "@telegraph/select";

export const IconSelect = () => {
  const [value, setValue] = useState("");

  return (
    <Select
      value={value}
      onValueChange={setValue}
      options={[
        {
          label: "Light",
          value: "light",
          icon: { icon: Lucide.Sun, alt: "Light theme" },
        },
        {
          label: "Dark",
          value: "dark",
          icon: { icon: Lucide.Moon, alt: "Dark theme" },
        },
        {
          label: "System",
          value: "system",
          icon: { icon: Lucide.Laptop, alt: "System theme" },
        },
      ]}
      placeholder="Select theme..."
    />
  );
};
```

## API Reference

### Select

The main component for simple usage.

#### Props

| Prop            | Type                      | Default | Description                   |
| --------------- | ------------------------- | ------- | ----------------------------- |
| `value`         | `string`                  | -       | The selected value            |
| `onValueChange` | `(value: string) => void` | -       | Called when selection changes |
| `options`       | `Array<SelectOption>`     | -       | Array of select options       |
| `placeholder`   | `string`                  | -       | Placeholder text              |
| `disabled`      | `boolean`                 | `false` | Whether select is disabled    |
| `error`         | `boolean`                 | `false` | Whether select has error      |
| `size`          | `"1" \| "2"`              | `"2"`   | Size of the select            |

Where `SelectOption` is:

```ts
type SelectOption = {
  label: string;
  value: string;
  icon?: { icon: Icon; alt: string };
  disabled?: boolean;
};
```

### Select.Root

The container component for custom select layouts.

#### Props

| Prop            | Type                      | Default | Description                   |
| --------------- | ------------------------- | ------- | ----------------------------- |
| `value`         | `string`                  | -       | The selected value            |
| `onValueChange` | `(value: string) => void` | -       | Called when selection changes |
| `disabled`      | `boolean`                 | `false` | Whether select is disabled    |
| `error`         | `boolean`                 | `false` | Whether select has error      |

### Select.Trigger

The button that opens the select dropdown.

#### Props

| Prop          | Type         | Default | Description         |
| ------------- | ------------ | ------- | ------------------- |
| `placeholder` | `string`     | -       | Placeholder text    |
| `size`        | `"1" \| "2"` | `"2"`   | Size of the trigger |

### Select.Content

The select dropdown container.

### Select.Item

Individual select item for custom layouts.

#### Props

| Prop       | Type      | Default | Description                     |
| ---------- | --------- | ------- | ------------------------------- |
| `value`    | `string`  | -       | The value of this option        |
| `disabled` | `boolean` | `false` | Whether this option is disabled |

## Examples

### With Groups

```tsx
import { Stack } from "@telegraph/layout";
import { Select } from "@telegraph/select";
import { Text } from "@telegraph/typography";

export const GroupedSelect = () => {
  const [value, setValue] = useState("");

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger placeholder="Select a pet..." />
      <Select.Content>
        <Stack gap="1">
          <Text size="1" weight="medium" p="2">
            Dogs
          </Text>
          <Select.Item value="labrador">Labrador</Select.Item>
          <Select.Item value="poodle">Poodle</Select.Item>
          <Select.Item value="husky">Husky</Select.Item>
        </Stack>

        <Stack gap="1" mt="2">
          <Text size="1" weight="medium" p="2">
            Cats
          </Text>
          <Select.Item value="persian">Persian</Select.Item>
          <Select.Item value="siamese">Siamese</Select.Item>
          <Select.Item value="maine-coon">Maine Coon</Select.Item>
        </Stack>
      </Select.Content>
    </Select.Root>
  );
};
```

### With Rich Content

```tsx
import { Stack } from "@telegraph/layout";
import { Box } from "@telegraph/layout";
import { Select } from "@telegraph/select";
import { Text } from "@telegraph/typography";

export const RichSelect = () => {
  const [plan, setPlan] = useState("");

  return (
    <Select.Root value={plan} onValueChange={setPlan}>
      <Select.Trigger placeholder="Select a plan..." />
      <Select.Content>
        <Select.Item value="basic">
          <Stack gap="1" py="1">
            <Stack direction="row" justify="between" align="center">
              <Text weight="medium">Basic Plan</Text>
              <Text>$10/mo</Text>
            </Stack>
            <Text size="1" color="gray-11">
              Perfect for personal projects
            </Text>
          </Stack>
        </Select.Item>

        <Select.Item value="pro">
          <Stack gap="1" py="1">
            <Stack direction="row" justify="between" align="center">
              <Text weight="medium">Pro Plan</Text>
              <Text>$29/mo</Text>
            </Stack>
            <Text size="1" color="gray-11">
              For growing teams
            </Text>
          </Stack>
        </Select.Item>

        <Select.Item value="enterprise">
          <Stack gap="1" py="1">
            <Stack direction="row" justify="between" align="center">
              <Text weight="medium">Enterprise Plan</Text>
              <Text>Custom</Text>
            </Stack>
            <Text size="1" color="gray-11">
              For large organizations
            </Text>
          </Stack>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
};
```

## Accessibility

The Select component follows WAI-ARIA guidelines:

- Uses `role="combobox"` and `role="listbox"`
- Supports keyboard navigation:
  - `↓` / `↑`: Navigate options
  - `Home` / `End`: First/last option
  - `Enter` / `Space`: Select option
  - `Escape`: Close dropdown
  - Type to search
- Manages focus appropriately
- Announces selection changes to screen readers
- Provides proper labeling through `aria-label` and `aria-labelledby`
