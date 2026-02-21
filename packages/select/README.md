# 📋 Select

> Simplified dropdown select component built on Telegraph's Combobox with streamlined API for common selection patterns.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/select.svg)](https://www.npmjs.com/package/@telegraph/select)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/select)](https://bundlephobia.com/result?p=@telegraph/select)
[![license](https://img.shields.io/npm/l/@telegraph/select)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/select
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/select";
```

Via Javascript:

```tsx
import "@telegraph/select/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Select } from "@telegraph/select";

export const CountrySelector = () => {
  const [country, setCountry] = useState("us");

  return (
    <Select.Root value={country} onValueChange={setCountry}>
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="uk">United Kingdom</Select.Option>
      <Select.Option value="de">Germany</Select.Option>
    </Select.Root>
  );
};
```

## When to Use Select vs Combobox

**Use Select when:**

- Simple dropdown selection
- Predefined list of options
- No search/filtering needed
- Standard selection patterns

**Use Combobox when:**

- Need search functionality
- Large option lists
- Custom option rendering
- Advanced filtering
- Multi-select with complex UI

## API Reference

### `<Select.Root>`

The main select container component.

| Prop            | Type                                  | Default       | Description                             |
| --------------- | ------------------------------------- | ------------- | --------------------------------------- |
| `value`         | `string \| string[]`                  | `undefined`   | Selected value(s)                       |
| `onValueChange` | `(value: string \| string[]) => void` | `undefined`   | Called when selection changes           |
| `size`          | `"0" \| "1" \| "2" \| "3"`           | `"1"`         | Size of the trigger button              |
| `placeholder`   | `string`                              | `undefined`   | Placeholder text when no value selected |
| `disabled`      | `boolean`                             | `false`       | Whether the select is disabled          |
| `triggerProps`  | `ComboboxTriggerProps`                | `undefined`   | Props passed to the trigger button      |
| `contentProps`  | `ComboboxContentProps`                | `undefined`   | Props passed to the dropdown content    |
| `optionsProps`  | `ComboboxOptionsProps`                | `undefined`   | Props passed to the options container   |

### `<Select.Option>`

Individual option within the select dropdown.

| Prop       | Type        | Default | Description                         |
| ---------- | ----------- | ------- | ----------------------------------- |
| `value`    | `string`    | -       | Unique value for this option        |
| `disabled` | `boolean`   | `false` | Whether this option is disabled     |
| `children` | `ReactNode` | -       | Display text/content for the option |

## Usage Patterns

### Basic Selection

```tsx
import { Select } from "@telegraph/select";

export const LanguageSelector = () => {
  const [language, setLanguage] = useState("en");

  return (
    <Select.Root
      value={language}
      onValueChange={setLanguage}
      placeholder="Choose language"
    >
      <Select.Option value="en">English</Select.Option>
      <Select.Option value="es">Spanish</Select.Option>
      <Select.Option value="fr">French</Select.Option>
      <Select.Option value="de">German</Select.Option>
    </Select.Root>
  );
};
```

### Multiple Selection

```tsx
import { Select } from "@telegraph/select";

export const SkillSelector = () => {
  const [skills, setSkills] = useState([]);

  return (
    <Select.Root
      value={skills}
      onValueChange={setSkills}
      placeholder="Select skills"
    >
      <Select.Option value="javascript">JavaScript</Select.Option>
      <Select.Option value="typescript">TypeScript</Select.Option>
      <Select.Option value="react">React</Select.Option>
      <Select.Option value="vue">Vue</Select.Option>
      <Select.Option value="angular">Angular</Select.Option>
    </Select.Root>
  );
};
```

### Different Sizes

```tsx
import { Select } from "@telegraph/select";

export const SizedSelects = () => (
  <div>
    {/* Small */}
    <Select.Root size="0" value="" onValueChange={console.log}>
      <Select.Option value="small">Small Option</Select.Option>
    </Select.Root>

    {/* Medium (default) */}
    <Select.Root size="1" value="" onValueChange={console.log}>
      <Select.Option value="medium">Medium Option</Select.Option>
    </Select.Root>

    {/* Large */}
    <Select.Root size="3" value="" onValueChange={console.log}>
      <Select.Option value="large">Large Option</Select.Option>
    </Select.Root>
  </div>
);
```

### With Disabled Options

```tsx
<Select.Root value={selectedOption} onValueChange={setSelectedOption}>
  <Select.Option value="available">Available Option</Select.Option>
  <Select.Option value="disabled" disabled>
    Disabled Option
  </Select.Option>
  <Select.Option value="premium">Premium Feature</Select.Option>
</Select.Root>
```

### Empty State

```tsx
import { Select } from "@telegraph/select";

export const EmptySelect = () => {
  const [value, setValue] = useState("");
  const options = []; // Empty options array

  return (
    <Select.Root value={value} onValueChange={setValue}>
      {options.length === 0 ? (
        <Select.Option value="" disabled>
          No options available
        </Select.Option>
      ) : (
        options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))
      )}
    </Select.Root>
  );
};
```

## Advanced Usage

### Form Integration

```tsx
import { Select } from "@telegraph/select";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  priority: string;
  categories: string[];
};

export const TaskForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div>
        <label htmlFor="priority">Priority</label>
        <Controller
          name="priority"
          control={control}
          rules={{ required: "Priority is required" }}
          render={({ field }) => (
            <Select.Root
              value={field.value || ""}
              onValueChange={field.onChange}
              placeholder="Select priority"
            >
              <Select.Option value="low">Low Priority</Select.Option>
              <Select.Option value="medium">Medium Priority</Select.Option>
              <Select.Option value="high">High Priority</Select.Option>
              <Select.Option value="urgent">Urgent</Select.Option>
            </Select.Root>
          )}
        />
        {errors.priority && (
          <span className="error">{errors.priority.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="categories">Categories</label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value || []}
              onValueChange={field.onChange}
              placeholder="Select categories"
            >
              <Select.Option value="frontend">Frontend</Select.Option>
              <Select.Option value="backend">Backend</Select.Option>
              <Select.Option value="design">Design</Select.Option>
              <Select.Option value="testing">Testing</Select.Option>
            </Select.Root>
          )}
        />
      </div>
    </form>
  );
};
```

### Dynamic Options

```tsx
import { Select } from "@telegraph/select";

export const DynamicSelect = () => {
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setLoading(true);
      fetchOptionsForCategory(category)
        .then(setOptions)
        .finally(() => setLoading(false));
    }
  }, [category]);

  return (
    <div>
      <Select.Root value={category} onValueChange={setCategory}>
        <Select.Option value="electronics">Electronics</Select.Option>
        <Select.Option value="clothing">Clothing</Select.Option>
        <Select.Option value="books">Books</Select.Option>
      </Select.Root>

      {category && (
        <Select.Root
          disabled={loading}
          value=""
          onValueChange={console.log}
          placeholder={loading ? "Loading..." : "Select subcategory"}
        >
          {options.map((option) => (
            <Select.Option key={option.id} value={option.id}>
              {option.name}
            </Select.Option>
          ))}
        </Select.Root>
      )}
    </div>
  );
};
```

### Custom Trigger Styling

```tsx
import { Select } from "@telegraph/select";

export const CustomStyledSelect = () => {
  const [value, setValue] = useState("");

  return (
    <Select.Root
      value={value}
      onValueChange={setValue}
      triggerProps={{
        variant: "outline",
        color: "accent",
      }}
      contentProps={{
        align: "start",
        sideOffset: 4,
      }}
    >
      <Select.Option value="option1">Option 1</Select.Option>
      <Select.Option value="option2">Option 2</Select.Option>
      <Select.Option value="option3">Option 3</Select.Option>
    </Select.Root>
  );
};
```

### Conditional Rendering

```tsx
import { Select } from "@telegraph/select";

export const ConditionalSelect = ({ userRole, permissions }) => {
  const [access, setAccess] = useState("");

  const availableRoles = [
    { value: "read", label: "Read Only", permission: "read" },
    { value: "write", label: "Read & Write", permission: "write" },
    { value: "admin", label: "Administrator", permission: "admin" },
  ].filter((role) => permissions.includes(role.permission));

  return (
    <Select.Root value={access} onValueChange={setAccess}>
      {availableRoles.map((role) => (
        <Select.Option key={role.value} value={role.value}>
          {role.label}
        </Select.Option>
      ))}
    </Select.Root>
  );
};
```

### Loading State

```tsx
import { Select } from "@telegraph/select";
import { Box } from "@telegraph/layout";

export const SelectWithLoading = ({ loading, options, ...props }) => {
  if (loading) {
    return <Box w="80" h="8" bg="gray-3" rounded="2" />;
  }

  return (
    <Select.Root {...props}>
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select.Root>
  );
};
```

### Grouped Options

```tsx
import { Select } from "@telegraph/select";

export const GroupedSelect = () => {
  const [value, setValue] = useState("");

  const optionGroups = [
    {
      label: "Fruits",
      options: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" },
      ],
    },
    {
      label: "Vegetables",
      options: [
        { value: "carrot", label: "Carrot" },
        { value: "lettuce", label: "Lettuce" },
        { value: "tomato", label: "Tomato" },
      ],
    },
  ];

  return (
    <Select.Root value={value} onValueChange={setValue}>
      {optionGroups.map((group) => (
        <React.Fragment key={group.label}>
          <Select.Option value="" disabled>
            {group.label}
          </Select.Option>
          {group.options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </React.Fragment>
      ))}
    </Select.Root>
  );
};
```

## Accessibility

Since Select is built on Combobox, it inherits all accessibility features:

- ✅ **Keyboard Navigation**: Arrow keys, Enter, Escape support
- ✅ **Screen Reader Support**: Proper ARIA attributes and announcements
- ✅ **Focus Management**: Logical focus order and indicators
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Touch Support**: Optimized for mobile and touch devices

### Keyboard Shortcuts

| Key               | Action                    |
| ----------------- | ------------------------- |
| `Space` / `Enter` | Open/close dropdown       |
| `Arrow Up/Down`   | Navigate options          |
| `Escape`          | Close dropdown            |
| `Home` / `End`    | Jump to first/last option |
| `Type to search`  | Quick option selection    |

### ARIA Attributes

- `role="combobox"` - Applied to the trigger
- `aria-expanded` - Indicates dropdown state
- `aria-haspopup="listbox"` - Describes dropdown content
- `role="listbox"` - Applied to options container
- `role="option"` - Applied to each option
- `aria-selected` - Indicates selected options

### Best Practices

1. **Provide Clear Labels**: Use descriptive labels for the select
2. **Meaningful Placeholders**: Write helpful placeholder text
3. **Logical Option Order**: Order options alphabetically or by relevance
4. **Handle Empty States**: Provide feedback when no options available
5. **Error Messaging**: Show clear validation errors

## Examples

### Basic Example

```tsx
import { Select } from "@telegraph/select";

export const StatusSelector = () => {
  const [status, setStatus] = useState("pending");

  return (
    <div>
      <label htmlFor="status">Status</label>
      <Select.Root value={status} onValueChange={setStatus}>
        <Select.Option value="pending">Pending</Select.Option>
        <Select.Option value="approved">Approved</Select.Option>
        <Select.Option value="rejected">Rejected</Select.Option>
        <Select.Option value="cancelled">Cancelled</Select.Option>
      </Select.Root>
    </div>
  );
};
```

### Advanced Example

```tsx
import { Select } from "@telegraph/select";
import { Controller, useForm } from "react-hook-form";

export const UserPreferencesForm = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      theme: "system",
      language: "en",
      notifications: [],
    },
  });

  const theme = watch("theme");

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div className="form-group">
        <label>Theme Preference</label>
        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value}
              onValueChange={field.onChange}
              size="2"
            >
              <Select.Option value="light">Light Mode</Select.Option>
              <Select.Option value="dark">Dark Mode</Select.Option>
              <Select.Option value="system">System Default</Select.Option>
            </Select.Root>
          )}
        />
      </div>

      <div className="form-group">
        <label>Language</label>
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value}
              onValueChange={field.onChange}
              triggerProps={{ variant: "outline" }}
            >
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="es">Español</Select.Option>
              <Select.Option value="fr">Français</Select.Option>
              <Select.Option value="de">Deutsch</Select.Option>
            </Select.Root>
          )}
        />
      </div>

      <div className="form-group">
        <label>Notification Types</label>
        <Controller
          name="notifications"
          control={control}
          render={({ field }) => (
            <Select.Root
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select notification types"
            >
              <Select.Option value="email">Email Updates</Select.Option>
              <Select.Option value="push">Push Notifications</Select.Option>
              <Select.Option value="sms">SMS Alerts</Select.Option>
              <Select.Option value="desktop">
                Desktop Notifications
              </Select.Option>
            </Select.Root>
          )}
        />
      </div>

      <button type="submit">Save Preferences</button>
    </form>
  );
};
```

### Real-world Example

```tsx
import { Select } from "@telegraph/select";
import { useEffect, useState } from "react";

export const CountryRegionSelector = () => {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (country) {
      setLoading(true);
      setRegion(""); // Reset region when country changes

      fetchRegionsForCountry(country)
        .then(setRegions)
        .finally(() => setLoading(false));
    }
  }, [country]);

  const countries = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "mx", label: "Mexico" },
    { value: "uk", label: "United Kingdom" },
  ];

  return (
    <div className="address-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <Select.Root
            value={country}
            onValueChange={setCountry}
            placeholder="Select country"
            size="2"
          >
            {countries.map((country) => (
              <Select.Option key={country.value} value={country.value}>
                {country.label}
              </Select.Option>
            ))}
          </Select.Root>
        </div>

        <div className="form-group">
          <label htmlFor="region">State/Province</label>
          <Select.Root
            value={region}
            onValueChange={setRegion}
            disabled={!country || loading}
            placeholder={
              !country
                ? "Select country first"
                : loading
                  ? "Loading..."
                  : "Select region"
            }
            size="2"
          >
            {regions.map((region) => (
              <Select.Option key={region.code} value={region.code}>
                {region.name}
              </Select.Option>
            ))}
          </Select.Root>
        </div>
      </div>
    </div>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/select)
- [Combobox Component](../combobox/README.md) - Full-featured dropdown with search

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
