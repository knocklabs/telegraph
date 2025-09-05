# 🔍 Combobox

> A searchable select component combining input and dropdown functionality with single and multi-select support.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/combobox.svg)](https://www.npmjs.com/package/@telegraph/combobox)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/combobox)](https://bundlephobia.com/result?p=@telegraph/combobox)
[![license](https://img.shields.io/npm/l/@telegraph/combobox)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/combobox
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/combobox";
```

Via Javascript:

```tsx
import "@telegraph/combobox/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Combobox } from "@telegraph/combobox";
import { useState } from "react";

// Single select example
export const SingleSelectExample = () => {
  const [value, setValue] = useState<string>("");

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

## API Reference

### `<Combobox.Root>`

The root component that manages the state and context for the combobox.

| Prop             | Type                                                        | Default      | Description                            |
| ---------------- | ----------------------------------------------------------- | ------------ | -------------------------------------- |
| `value`          | `string \| string[] \| Option \| Option[]`                  | `undefined`  | The selected value(s)                  |
| `onValueChange`  | `(value: string \| string[] \| Option \| Option[]) => void` | `undefined`  | Callback when selection changes        |
| `layout`         | `"truncate" \| "wrap"`                                      | `"truncate"` | How to display multiple selections     |
| `open`           | `boolean`                                                   | `undefined`  | Controlled open state                  |
| `defaultOpen`    | `boolean`                                                   | `false`      | Initial open state                     |
| `errored`        | `boolean`                                                   | `false`      | Shows error styling                    |
| `placeholder`    | `string`                                                    | `undefined`  | Placeholder text                       |
| `onOpenChange`   | `(open: boolean) => void`                                   | `undefined`  | Callback when open state changes       |
| `modal`          | `boolean`                                                   | `true`       | Whether to render in a modal           |
| `closeOnSelect`  | `boolean`                                                   | `true`       | Close menu after selection             |
| `clearable`      | `boolean`                                                   | `false`      | Show clear button                      |
| `disabled`       | `boolean`                                                   | `false`      | Disable the combobox                   |
| `legacyBehavior` | `boolean`                                                   | `false`      | Use legacy object format ⚠️ Deprecated |

### `<Combobox.Trigger>`

The button that triggers the combobox dropdown.

| Prop          | Type                | Default     | Description            |
| ------------- | ------------------- | ----------- | ---------------------- |
| `size`        | `"1" \| "2" \| "3"` | `"2"`       | Size of the trigger    |
| `placeholder` | `string`            | `undefined` | Placeholder text       |
| `children`    | `ReactNode`         | `undefined` | Custom trigger content |

### Other Components

- **`<Combobox.Content>`** - Dropdown menu content container
- **`<Combobox.Options>`** - Container for option items
- **`<Combobox.Option>`** - Individual selectable option
- **`<Combobox.Search>`** - Search input for filtering options
- **`<Combobox.Empty>`** - Empty state when no options match
- **`<Combobox.Create>`** - Option to create new values

For detailed props of each component, see the [Complete Component Reference](#complete-component-reference) section below.

## Advanced Usage

### Multi-Select with Tags

```tsx
import { Combobox } from "@telegraph/combobox";
import { useState } from "react";

export const MultiSelectExample = () => {
  const [values, setValues] = useState<string[]>([]);

  return (
    <Combobox.Root value={values} onValueChange={setValues} clearable>
      <Combobox.Trigger placeholder="Select multiple options..." />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          <Combobox.Option value="react">React</Combobox.Option>
          <Combobox.Option value="vue">Vue</Combobox.Option>
          <Combobox.Option value="svelte">Svelte</Combobox.Option>
          <Combobox.Option value="angular">Angular</Combobox.Option>
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

### Async Loading with Search

```tsx
import { Combobox } from "@telegraph/combobox";
import { Box } from "@telegraph/layout";
import { useMemo, useState } from "react";

export const AsyncCombobox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadOptions = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await fetchOptions(query);
      setOptions(results);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery]);

  return (
    <Combobox.Root>
      <Combobox.Trigger placeholder="Search for options..." />
      <Combobox.Content>
        <Combobox.Search
          value={searchQuery}
          onValueChange={(query) => {
            setSearchQuery(query);
            loadOptions(query);
          }}
        />
        <Combobox.Options>
          {isLoading ? (
            <Box padding="4" textAlign="center">
              Loading...
            </Box>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option key={option} value={option}>
                {option}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
        <Combobox.Empty />
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

### Create New Options

```tsx
import { Combobox } from "@telegraph/combobox";
import { useState } from "react";

export const CreatableCombobox = () => {
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [value, setValue] = useState("");

  const handleCreate = (newValue: string) => {
    setOptions((prev) => [...prev, newValue]);
    setValue(newValue);
  };

  return (
    <Combobox.Root value={value} onValueChange={setValue}>
      <Combobox.Trigger placeholder="Type to create..." />
      <Combobox.Content>
        <Combobox.Search />
        <Combobox.Options>
          {options.map((option) => (
            <Combobox.Option key={option} value={option}>
              {option}
            </Combobox.Option>
          ))}
        </Combobox.Options>
        <Combobox.Create
          values={options}
          onCreate={handleCreate}
          leadingText="Create"
        />
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

### Form Integration

```tsx
import { Combobox } from "@telegraph/combobox";
import { useForm } from "react-hook-form";

type FormData = {
  framework: string;
  languages: string[];
};

export const FormIntegration = () => {
  const { register, setValue, watch } = useForm<FormData>();

  return (
    <form>
      <Combobox.Root
        value={watch("framework")}
        onValueChange={(value) => setValue("framework", value)}
      >
        <Combobox.Trigger placeholder="Select framework..." />
        <Combobox.Content>
          <Combobox.Search />
          <Combobox.Options>
            <Combobox.Option value="react">React</Combobox.Option>
            <Combobox.Option value="vue">Vue</Combobox.Option>
          </Combobox.Options>
        </Combobox.Content>
      </Combobox.Root>
    </form>
  );
};
```

### Custom Trigger with Primitives

```tsx
import { Combobox } from "@telegraph/combobox";
import { Box, Stack } from "@telegraph/layout";

export const CustomTrigger = () => (
  <Combobox.Root clearable>
    <Combobox.Trigger>
      <Stack direction="row" justify="space-between" align="center" w="full">
        <Box flex="1" overflow="hidden">
          <Combobox.Primitives.TriggerTagsContainer>
            <Combobox.Primitives.TriggerTag.Default value="tag1" />
            <Combobox.Primitives.TriggerTag.Default value="tag2" />
          </Combobox.Primitives.TriggerTagsContainer>
        </Box>
        <Combobox.Primitives.TriggerActionContainer>
          <Combobox.Primitives.TriggerClear />
          <Box borderLeft="1" h="4" />
          <Combobox.Primitives.TriggerIndicator />
        </Combobox.Primitives.TriggerActionsContainer>
      </Stack>
    </Combobox.Trigger>
    <Combobox.Content>{/* Content */}</Combobox.Content>
  </Combobox.Root>
);
```

## Accessibility

- ✅ **ARIA Compliance**: Implements [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- ✅ **Keyboard Navigation**: Full keyboard support with arrow keys, Enter, Escape
- ✅ **Screen Readers**: Proper ARIA roles, labels, and state announcements
- ✅ **Focus Management**: Logical focus order and focus restoration

### Keyboard Shortcuts

| Key               | Action                         |
| ----------------- | ------------------------------ |
| `↓` / `↑`         | Navigate options               |
| `Enter` / `Space` | Select option                  |
| `Escape`          | Close dropdown                 |
| `Tab`             | Move focus                     |
| `Backspace`       | Remove last tag (multi-select) |

### ARIA Attributes

- `role="combobox"` - On trigger element
- `aria-expanded` - Indicates dropdown state
- `aria-controls` - Links trigger to dropdown
- `aria-selected` - Indicates selected options
- `role="listbox"` and `role="option"` - On dropdown and options

### Best Practices

1. **Provide labels**: Use clear, descriptive placeholders
2. **Handle loading states**: Show loading indicators during async operations
3. **Error feedback**: Use the `errored` prop and provide error messages
4. **Reasonable limits**: Consider pagination for large option lists

## Complete Component Reference

### `<Combobox.Option>`

Individual selectable option item.

| Prop       | Type      | Default     | Description          |
| ---------- | --------- | ----------- | -------------------- |
| `value`    | `string`  | required    | Option value         |
| `label`    | `string`  | `undefined` | Display label        |
| `selected` | `boolean` | `undefined` | Force selected state |

### `<Combobox.Search>`

Search input field for filtering options.

| Prop          | Type     | Default    | Description         |
| ------------- | -------- | ---------- | ------------------- |
| `label`       | `string` | `"Search"` | Accessibility label |
| `placeholder` | `string` | `"Search"` | Input placeholder   |

### `<Combobox.Empty>`

Empty state component shown when no options match search.

| Prop      | Type                | Default              | Description         |
| --------- | ------------------- | -------------------- | ------------------- |
| `icon`    | `IconProps \| null` | `SearchIcon`         | Empty state icon    |
| `message` | `string \| null`    | `"No results found"` | Empty state message |

### `<Combobox.Create>`

Option to create new values when none match search.

| Prop          | Type                                | Default     | Description              |
| ------------- | ----------------------------------- | ----------- | ------------------------ |
| `leadingText` | `string`                            | `"Create"`  | Text before search value |
| `values`      | `string[] \| Option[]`              | `undefined` | Existing values          |
| `onCreate`    | `(value: string \| Option) => void` | `undefined` | Creation callback        |

### Primitives

The combobox includes primitive components for advanced customization:

#### Trigger Primitives

- **`<Combobox.Primitives.TriggerIndicator>`** - Dropdown chevron icon
- **`<Combobox.Primitives.TriggerClear>`** - Clear button
- **`<Combobox.Primitives.TriggerText>`** - Selected value text
- **`<Combobox.Primitives.TriggerPlaceholder>`** - Placeholder text
- **`<Combobox.Primitives.TriggerTagsContainer>`** - Multi-select tags container
- **`<Combobox.Primitives.TriggerActionsContainer>`** - Container for actions section of trigger
- **`<Combobox.Primitives.TriggerTag.*>`** - Tag components for multi-select
- **`<Combobox.Primitives.TriggerValue>`** - Displays the value of the trigger for single and multi-select

For detailed primitive documentation, see the [Primitives](#primitives) section above.

## Type Examples

### Single Select Types

```tsx
// String values (recommended)
const [value, setValue] = useState<string>("");
```

### Multi Select Types

```tsx
// String array values (recommended)
const [values, setValues] = useState<string[]>([]);
```

### Legacy Behavior (⚠️ Deprecated)

> **Warning**: Legacy behavior is deprecated and will be removed in a future version.

```tsx
// ⚠️ Deprecated - Don't use in new code
const [value, setValue] = useState<{ value: string; label?: string }>();

<Combobox.Root
  value={value}
  onValueChange={setValue}
  legacyBehavior={true}
>
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/combobox)
- [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
