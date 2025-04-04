![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/combobox)

# @telegraph/combobox

> A styled menu, triggered by a Select, that combines an Input and Single- or Multi-select.

## Installation Instructions

```
npm install @telegraph/combobox
```

### Add stylesheet

```
@import "@telegraph/combobox"
```

### Basic Usage

A combobox component that combines input and select functionality with a searchable dropdown menu.

#### `<Combobox/>`

```tsx
import { Combobox } from "@telegraph/combobox";
import { useState } from "react";

// Single select example
const SingleSelectExample = () => {
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

// Multi select example
const MultiSelectExample = () => {
  const [values, setValues] = useState<string[]>([]);

  return (
    <Combobox.Root value={values} onValueChange={setValues}>
      <Combobox.Trigger placeholder="Select options..." />
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

### Type Examples

#### Single Select Types

```tsx
// String values (recommended)
const [value, setValue] = useState<string>("");
```

#### Multi Select Types

```tsx
// String array values (recommended)
const [values, setValues] = useState<string[]>([]);
```

### Accessibility

The combobox implements the [ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), providing:

- Proper ARIA roles and attributes
- Keyboard navigation:
  - `↓` / `↑`: Navigate options
  - `Enter` / `Space`: Select option
  - `Escape`: Close dropdown
  - `Tab`: Move focus
- Screen reader announcements for selection changes
- Focus management

### Common Patterns

#### Form Integration

```tsx
import { useForm } from "react-hook-form";

const MyForm = () => {
  const { register, setValue } = useForm();

  return (
    <form>
      <Combobox.Root onValueChange={(value) => setValue("field", value)}>
        {/* ... */}
      </Combobox.Root>
    </form>
  );
};
```

#### Custom Filtering

```tsx
const MyCombobox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const options = useMemo(
    () =>
      allOptions.filter((opt) =>
        opt.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  return (
    <Combobox.Root>
      <Combobox.Content>
        <Combobox.Search value={searchQuery} onValueChange={setSearchQuery} />
        <Combobox.Options>
          {options.map((opt) => (
            <Combobox.Option key={opt} value={opt}>
              {opt}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

#### Async Loading

```tsx
const AsyncCombobox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const loadOptions = async (query) => {
    setIsLoading(true);
    const results = await fetchOptions(query);
    setOptions(results);
    setIsLoading(false);
  };

  return (
    <Combobox.Root>
      <Combobox.Content>
        <Combobox.Search onValueChange={loadOptions} />
        <Combobox.Options>
          {isLoading ? (
            <Box p="4" textAlign="center">
              Loading...
            </Box>
          ) : (
            options.map((opt) => (
              <Combobox.Option key={opt} value={opt}>
                {opt}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox.Content>
    </Combobox.Root>
  );
};
```

#### Error States

```tsx
const ErrorCombobox = () => {
  const [error, setError] = useState("");

  return (
    <Stack gap="1">
      <Combobox.Root errored={!!error}>{/* ... */}</Combobox.Root>
      {error && (
        <Text color="red" size="1">
          {error}
        </Text>
      )}
    </Stack>
  );
};
```

### Component Parts

#### `<Combobox.Root/>`

The root component that manages the state and context for the combobox.

##### Props

| Name           | Type                                                      | Default    | Description                        |
| -------------- | --------------------------------------------------------- | ---------- | ---------------------------------- |
| value          | string \| string[] \| Option \| Option[]                  | undefined  | The selected value(s)              |
| onValueChange  | (value: string \| string[] \| Option \| Option[]) => void | undefined  | Callback when selection changes    |
| layout         | "truncate" \| "wrap"                                      | "truncate" | How to display multiple selections |
| open           | boolean                                                   | undefined  | Controlled open state              |
| defaultOpen    | boolean                                                   | false      | Initial open state                 |
| errored        | boolean                                                   | false      | Shows error styling                |
| placeholder    | string                                                    | undefined  | Placeholder text                   |
| onOpenChange   | (open: boolean) => void                                   | undefined  | Callback when open state changes   |
| modal          | boolean                                                   | true       | Whether to render in a modal       |
| closeOnSelect  | boolean                                                   | true       | Close menu after selection         |
| clearable      | boolean                                                   | false      | Show clear button                  |
| disabled       | boolean                                                   | false      | Disable the combobox               |
| legacyBehavior | boolean                                                   | false      | Use legacy object format           |

#### `<Combobox.Trigger/>`

The button that triggers the combobox dropdown.

For advanced customization of the trigger's internal components (indicator, clear button, text display, etc.), see the [Trigger Primitives](#trigger-primitives) section below.

##### Props

| Name        | Type              | Default   | Description            |
| ----------- | ----------------- | --------- | ---------------------- |
| size        | "1" \| "2" \| "3" | "2"       | Size of the trigger    |
| placeholder | string            | undefined | Placeholder text       |
| children    | ReactNode         | undefined | Custom trigger content |

#### `<Combobox.Content/>`

The dropdown menu content container.

##### Props

Accepts all props from `TelegraphMenu.Content`

#### `<Combobox.Options/>`

Container for the option items.

##### Props

Accepts all props from `Stack` component

#### `<Combobox.Option/>`

Individual selectable option item.

##### Props

| Name     | Type    | Default   | Description          |
| -------- | ------- | --------- | -------------------- |
| value    | string  | required  | Option value         |
| label    | string  | undefined | Display label        |
| selected | boolean | undefined | Force selected state |

#### `<Combobox.Search/>`

Search input field for filtering options.

##### Props

| Name        | Type   | Default  | Description         |
| ----------- | ------ | -------- | ------------------- |
| label       | string | "Search" | Accessibility label |
| placeholder | string | "Search" | Input placeholder   |

#### `<Combobox.Empty/>`

Empty state component shown when no options match search.

##### Props

| Name    | Type              | Default            | Description         |
| ------- | ----------------- | ------------------ | ------------------- |
| icon    | IconProps \| null | SearchIcon         | Empty state icon    |
| message | string \| null    | "No results found" | Empty state message |

#### `<Combobox.Create/>`

Option to create new values when none match search.

##### Props

| Name        | Type                              | Default   | Description              |
| ----------- | --------------------------------- | --------- | ------------------------ |
| leadingText | string                            | "Create"  | Text before search value |
| values      | string[] \| Option[]              | undefined | Existing values          |
| onCreate    | (value: string \| Option) => void | undefined | Creation callback        |

### Primitives

The combobox includes several primitive components for advanced customization. These primitives allow you to build custom trigger layouts and behaviors while maintaining the combobox's core functionality.

#### Trigger Primitives

##### `<Combobox.Primitives.TriggerIndicator/>`

The dropdown chevron icon that rotates based on the combobox's open state.

###### Props

| Name        | Type      | Default     | Description                         |
| ----------- | --------- | ----------- | ----------------------------------- |
| icon        | IconProps | ChevronDown | The icon to display                 |
| aria-hidden | boolean   | true        | Whether to hide from screen readers |

```tsx
<Combobox.Primitives.TriggerIndicator icon={CustomIcon} aria-hidden={false} />
```

##### `<Combobox.Primitives.TriggerClear/>`

A button to clear the current selection(s). Only shown when `clearable` is true and there are selections.

###### Props

| Name         | Type                               | Default   | Description           |
| ------------ | ---------------------------------- | --------- | --------------------- |
| tooltipProps | TgphComponentProps<typeof Tooltip> | undefined | Props for the tooltip |

Accepts all props from `Button`

```tsx
<Combobox.Primitives.TriggerClear tooltipProps={{ delay: 300 }} />
```

##### `<Combobox.Primitives.TriggerText/>`

Displays the selected value's text or label. Used in single-select mode.

###### Props

Accepts all props from `Button.Text`

```tsx
<Combobox.Primitives.TriggerText color="blue" weight="medium" />
```

##### `<Combobox.Primitives.TriggerPlaceholder/>`

Shows placeholder text when no value is selected.

###### Props

Accepts all props from `Button.Text`

```tsx
<Combobox.Primitives.TriggerPlaceholder color="gray-8" />
```

##### `<Combobox.Primitives.TriggerTagsContainer/>`

Container for selected value tags in multi-select mode. Handles tag layout and truncation.

###### Props

Accepts all props from `Stack`

```tsx
<Combobox.Primitives.TriggerTagsContainer gap="2" wrap="wrap" />
```

##### `<Combobox.Primitives.TriggerTag/>`

A collection of components for building custom tags in multi-select mode:

###### `<Combobox.Primitives.TriggerTag.Root/>`

The base container for a tag.

Props:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| value | string | required | The value this tag represents |

###### `<Combobox.Primitives.TriggerTag.Text/>`

The text content of a tag.

Props: Accepts all props from `Text`

###### `<Combobox.Primitives.TriggerTag.Button/>`

The remove button for a tag.

Props: Accepts all props from `Button`

###### `<Combobox.Primitives.TriggerTag.Default/>`

A pre-composed tag with text and remove button.

Props:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| value | string | required | The value this tag represents |

Example of a custom tag layout:

```tsx
<Combobox.Primitives.TriggerTag.Root value="example">
  <Icon icon={CustomIcon} />
  <Combobox.Primitives.TriggerTag.Text>
    Custom Tag
  </Combobox.Primitives.TriggerTag.Text>
  <Combobox.Primitives.TriggerTag.Button
    icon={{ icon: XIcon, alt: "Remove" }}
  />
</Combobox.Primitives.TriggerTag.Root>
```

Example of using the default tag:

```tsx
<Combobox.Primitives.TriggerTag.Default value="example" />
```

Complete example using primitives for a custom trigger layout:

```tsx
<Combobox.Root>
  <Combobox.Trigger>
    <Stack direction="row" justify="space-between" align="center" w="full">
      {/* Left side: Text or Tags */}
      <Box flex="1" overflow="hidden">
        <Combobox.Primitives.TriggerTagsContainer>
          <Combobox.Primitives.TriggerTag.Default value="tag1" />
          <Combobox.Primitives.TriggerTag.Default value="tag2" />
        </Combobox.Primitives.TriggerTagsContainer>
      </Box>

      {/* Right side: Clear and Indicator */}
      <Stack direction="row" gap="1" align="center">
        <Combobox.Primitives.TriggerClear />
        <Box borderLeft="1" h="4" />
        <Combobox.Primitives.TriggerIndicator />
      </Stack>
    </Stack>
  </Combobox.Trigger>
  <Combobox.Content>{/* ... */}</Combobox.Content>
</Combobox.Root>
```

### Legacy Behavior (⚠️ Deprecated)

> **Warning**: Legacy behavior is deprecated and will be removed in a future version. New implementations should use string values instead of objects.

The `legacyBehavior` prop changes how values are handled:

- When `false` (default, recommended): Values are simple strings
- When `true` (deprecated): Values are objects with `{ value: string; label?: string }`

#### Legacy Single Select Types

```tsx
// ⚠️ Deprecated - Don't use in new code
const [value, setValue] = useState<{ value: string; label?: string }>()

<Combobox.Root
  value={value}
  onValueChange={setValue}
  legacyBehavior={true}
>
```

#### Legacy Multi Select Types

```tsx
// ⚠️ Deprecated - Don't use in new code
const [values, setValues] = useState<Array<{ value: string; label?: string }>>([])

<Combobox.Root
  value={values}
  onValueChange={setValues}
  legacyBehavior={true}
>
```

This object-based value pattern is only maintained for backwards compatibility and should not be used in new code. It will be removed in a future major version.
