![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/input.svg)](https://www.npmjs.com/package/@telegraph/input)

# @telegraph/input

> A flexible input component with support for icons, buttons, and various states.

## Installation

```bash
npm install @telegraph/input
```

### Add stylesheet

```css
@import "@telegraph/input";
```

## Usage

### Basic Usage

```tsx
import { Input } from "@telegraph/input";

export const BasicInput = () => {
  const [value, setValue] = useState("");

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter text..."
    />
  );
};
```

### With Icons

```tsx
import { Lucide } from "@telegraph/icon";
import { Input } from "@telegraph/input";

export const IconInput = () => {
  return (
    <Stack gap="3">
      <Input
        leadingIcon={{ icon: Lucide.Search, alt: "Search" }}
        placeholder="Search..."
      />

      <Input
        trailingIcon={{ icon: Lucide.Calendar, alt: "Select date" }}
        type="date"
      />

      <Input
        leadingIcon={{ icon: Lucide.Mail, alt: "Email" }}
        trailingIcon={{ icon: Lucide.Check, alt: "Valid email" }}
        type="email"
      />
    </Stack>
  );
};
```

### With Buttons

```tsx
import { Lucide } from "@telegraph/icon";
import { Input } from "@telegraph/input";

export const ButtonInput = () => {
  return (
    <Input.Root>
      <Input.Field placeholder="Enter code..." />
      <Input.Button>Apply</Input.Button>
    </Input.Root>
  );
};
```

## API Reference

### Input

The main input component for simple usage.

#### Props

| Prop           | Type                                                           | Default     | Description                 |
| -------------- | -------------------------------------------------------------- | ----------- | --------------------------- |
| `value`        | `string`                                                       | -           | Input value                 |
| `onChange`     | `(e: ChangeEvent) => void`                                     | -           | Change handler              |
| `type`         | `"text" \| "email" \| "password" \| "number" \| "date" \| ...` | `"text"`    | Input type                  |
| `size`         | `"1" \| "2" \| "3"`                                            | `"2"`       | Input size                  |
| `variant`      | `"outline" \| "ghost"`                                         | `"outline"` | Visual variant              |
| `leadingIcon`  | `{ icon: Icon; alt: string }`                                  | -           | Icon before input           |
| `trailingIcon` | `{ icon: Icon; alt: string }`                                  | -           | Icon after input            |
| `disabled`     | `boolean`                                                      | `false`     | Whether input is disabled   |
| `errored`      | `boolean`                                                      | `false`     | Whether to show error state |
| `required`     | `boolean`                                                      | `false`     | Whether input is required   |

### Input.Root

Container component for custom input layouts.

#### Props

| Prop       | Type                   | Default     | Description                 |
| ---------- | ---------------------- | ----------- | --------------------------- |
| `size`     | `"1" \| "2" \| "3"`    | `"2"`       | Input size                  |
| `variant`  | `"outline" \| "ghost"` | `"outline"` | Visual variant              |
| `disabled` | `boolean`              | `false`     | Whether input is disabled   |
| `errored`  | `boolean`              | `false`     | Whether to show error state |

### Input.Field

The actual input field component.

Accepts all standard HTML input attributes.

### Input.Button

Button component specifically styled for inputs.

Accepts all props from `@telegraph/button`.

## Examples

### Search Input with Loading

```tsx
import { Lucide } from "@telegraph/icon";
import { Input } from "@telegraph/input";
import { useState } from "react";

export const SearchInput = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await searchAPI(query);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Input.Root>
      <Input.Field
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        leadingIcon={{
          icon: isLoading ? Lucide.Loader : Lucide.Search,
          alt: isLoading ? "Loading" : "Search",
        }}
      />
      <Input.Button onClick={handleSearch} disabled={isLoading || !query}>
        Search
      </Input.Button>
    </Input.Root>
  );
};
```

### Password Input with Toggle

```tsx
import { Lucide } from "@telegraph/icon";
import { Input } from "@telegraph/input";
import { useState } from "react";

export const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input.Root>
      <Input.Field
        type={showPassword ? "text" : "password"}
        placeholder="Enter password..."
        leadingIcon={{ icon: Lucide.Lock, alt: "Password" }}
      />
      <Input.Button
        variant="ghost"
        onClick={() => setShowPassword(!showPassword)}
        icon={{
          icon: showPassword ? Lucide.EyeOff : Lucide.Eye,
          alt: showPassword ? "Hide password" : "Show password",
        }}
      />
    </Input.Root>
  );
};
```

### Form Input with Error

```tsx
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useState } from "react";

export const FormInput = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) {
      setError("Email is required");
    } else if (!value.includes("@")) {
      setError("Invalid email address");
    } else {
      setError("");
    }
  };

  return (
    <Stack gap="1">
      <Input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        placeholder="Enter email..."
        errored={!!error}
        leadingIcon={{ icon: Lucide.Mail, alt: "Email" }}
      />
      {error && (
        <Text size="1" color="red">
          {error}
        </Text>
      )}
    </Stack>
  );
};
```

## Accessibility

The Input component follows WAI-ARIA guidelines:

- Uses semantic HTML input elements
- Supports keyboard navigation
- Provides proper labeling through aria-label or associated labels
- Communicates validation states to screen readers
- Maintains proper color contrast in all states
