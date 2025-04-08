![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/combobox.svg)](https://www.npmjs.com/package/@telegraph/combobox)

# @telegraph/combobox

> A flexible combobox component that combines input and select functionality with a searchable dropdown menu.

## Installation

```bash
npm install @telegraph/combobox
```

### Add stylesheet

```css
@import "@telegraph/combobox";
```

## Usage

### Basic Usage

```tsx
import { Combobox } from "@telegraph/combobox";

export const SingleSelect = () => {
  const [value, setValue] = useState("");

  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger placeholder="Select an option..." />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          <Combobox.Option value="option1">Option 1</Combobox.Option>
          <Combobox.Option value="option2">Option 2</Combobox.Option>
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

### Multi-Select

```tsx
import { Combobox } from "@telegraph/combobox";
import { Stack } from "@telegraph/layout";

export const MultiSelect = () => {
  const [values, setValues] = useState<string[]>([]);

  return (
    <Combobox.Root value={values} onValueChange={setValues}>
      <Combobox.Trigger placeholder="Select options...">
        <Stack gap="1" wrap>
          {values.map((value) => (
            <Combobox.Tag key={value} value={value} />
          ))}
        </Stack>
      </Combobox.Trigger>
      <Combobox.Content>
        <Combobox.Search placeholder="Search options..." />
        <Combobox.Options>
          <Combobox.Option value="option1">Option 1</Combobox.Option>
          <Combobox.Option value="option2">Option 2</Combobox.Option>
          <Combobox.Option value="option3">Option 3</Combobox.Option>
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

### With Custom Rendering

```tsx
import { Combobox } from "@telegraph/combobox";
import { Icon, Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const CustomCombobox = () => {
  const [value, setValue] = useState("");

  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger>
        <Stack gap="2" align="center">
          <Icon icon={Lucide.User} />
          <Text>{value || "Select a user..."}</Text>
        </Stack>
      </Combobox.Trigger>
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          <Combobox.Option value="john">
            <Stack gap="2" align="center">
              <Icon icon={Lucide.User} />
              <Stack direction="column" gap="1">
                <Text weight="medium">John Doe</Text>
                <Text size="1" color="gray-11">
                  john@example.com
                </Text>
              </Stack>
            </Stack>
          </Combobox.Option>
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

## API Reference

### Combobox.Root

The main wrapper component that manages the combobox state.

#### Props

| Prop            | Type                                  | Default | Description                      |
| --------------- | ------------------------------------- | ------- | -------------------------------- |
| `value`         | `string \| string[]`                  | -       | The selected value(s)            |
| `onValueChange` | `(value: string \| string[]) => void` | -       | Called when selection changes    |
| `disabled`      | `boolean`                             | `false` | Whether the combobox is disabled |
| `errored`       | `boolean`                             | `false` | Whether to show error styling    |

### Combobox.Trigger

The button that toggles the combobox dropdown.

#### Props

| Prop          | Type              | Default | Description                            |
| ------------- | ----------------- | ------- | -------------------------------------- |
| `placeholder` | `string`          | -       | Text to show when no value is selected |
| `children`    | `React.ReactNode` | -       | Custom trigger content                 |

### Combobox.Content

The dropdown menu container.

#### Props

| Prop         | Type                           | Default   | Description               |
| ------------ | ------------------------------ | --------- | ------------------------- |
| `align`      | `"start" \| "center" \| "end"` | `"start"` | Alignment of the dropdown |
| `sideOffset` | `number`                       | `4`       | Distance from the trigger |

### Combobox.Search

The search input field.

#### Props

| Prop            | Type                      | Default       | Description                      |
| --------------- | ------------------------- | ------------- | -------------------------------- |
| `value`         | `string`                  | -             | Search input value               |
| `onValueChange` | `(value: string) => void` | -             | Called when search value changes |
| `placeholder`   | `string`                  | `"Search..."` | Input placeholder text           |

### Combobox.Options

Container for option items.

### Combobox.Option

Individual option item.

#### Props

| Prop       | Type              | Default | Description                    |
| ---------- | ----------------- | ------- | ------------------------------ |
| `value`    | `string`          | -       | Option value                   |
| `children` | `React.ReactNode` | -       | Option content                 |
| `disabled` | `boolean`         | `false` | Whether the option is disabled |

### Combobox.Primitives

Low-level primitive components for building custom trigger elements.

#### Combobox.Primitives.TriggerIndicator

The chevron indicator that shows dropdown state.

| Prop          | Type         | Default              | Description                         |
| ------------- | ------------ | -------------------- | ----------------------------------- |
| `icon`        | `LucideIcon` | `Lucide.ChevronDown` | Icon to use for the indicator       |
| `aria-hidden` | `boolean`    | `true`               | Whether to hide from screen readers |

#### Combobox.Primitives.TriggerClear

The clear button for resetting the combobox value.

| Prop           | Type           | Default | Description                  |
| -------------- | -------------- | ------- | ---------------------------- |
| `tooltipProps` | `TooltipProps` | -       | Props to pass to the tooltip |

#### Combobox.Primitives.TriggerText

The text content for single-select comboboxes.

#### Combobox.Primitives.TriggerPlaceholder

The placeholder text when no value is selected.

#### Combobox.Primitives.TriggerTagsContainer

Container for multi-select tags with optional truncation.

#### Combobox.Primitives.TriggerTagRoot

Root component for building custom multi-select tags.

| Prop    | Type     | Default | Description      |
| ------- | -------- | ------- | ---------------- |
| `value` | `string` | -       | Value of the tag |

#### Combobox.Primitives.TriggerTagText

Text content for custom multi-select tags.

#### Combobox.Primitives.TriggerTagButton

Button component for custom multi-select tags.

#### Combobox.Primitives.TriggerTagDefault

Default tag implementation combining Root, Text, and Button.

| Prop    | Type     | Default | Description      |
| ------- | -------- | ------- | ---------------- |
| `value` | `string` | -       | Value of the tag |

### Example: Custom Trigger Using Primitives

```tsx
import { Combobox } from "@telegraph/combobox";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

const CustomTrigger = () => {
  const [value, setValue] = useState("");

  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger>
        <Stack gap="2" align="center" justify="between" w="full">
          <Stack gap="2" align="center">
            <Combobox.Primitives.TriggerText />
            <Text color="gray">•</Text>
            <Text color="gray" size="1">
              Click to select
            </Text>
          </Stack>
          <Stack gap="2" align="center">
            <Combobox.Primitives.TriggerClear />
            <Combobox.Primitives.TriggerIndicator />
          </Stack>
        </Stack>
      </Combobox.Trigger>
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          <Combobox.Option value="option1">Option 1</Combobox.Option>
          <Combobox.Option value="option2">Option 2</Combobox.Option>
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

## Accessibility

The Combobox component follows WAI-ARIA guidelines:

- Uses `role="combobox"` for the input
- Uses `role="listbox"` for the options container
- Uses `role="option"` for individual options
- Supports keyboard navigation:
  - `↓` / `↑`: Navigate options
  - `Enter` / `Space`: Select option
  - `Escape`: Close dropdown
  - `Tab`: Move focus
- Announces selection changes to screen readers
- Manages focus appropriately

## Examples

### Async Loading

```tsx
import { Combobox } from "@telegraph/combobox";
import { Box } from "@telegraph/layout";
import { useEffect, useState } from "react";

export const AsyncCombobox = () => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      try {
        const results = await fetchOptions(search);
        setOptions(results);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, [search]);

  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger placeholder="Search users..." />
      <Combobox.Content>
        <Combobox.Search value={search} onValueChange={setSearch} />
        <Combobox.Options>
          {isLoading ? (
            <Box p="4" textAlign="center">
              Loading...
            </Box>
          ) : (
            options.map((option) => (
              <Combobox.Option key={option.value} value={option.value}>
                {option.label}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

### With Form Validation

```tsx
import { Combobox } from "@telegraph/combobox";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const FormCombobox = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setError(newValue ? "" : "Please select an option");
  };

  return (
    <Stack gap="2">
      <Combobox.Root
        value={value}
        onValueChange={handleChange}
        errored={!!error}
      >
        <Combobox.Trigger placeholder="Select required option..." />
        <Combobox.Content>
          <Combobox.Search />
          <Combobox.Options>
            <Combobox.Option value="option1">Option 1</Combobox.Option>
            <Combobox.Option value="option2">Option 2</Combobox.Option>
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>
      {error && (
        <Text color="red-11" size="1">
          {error}
        </Text>
      )}
    </Stack>
  );
};
```
