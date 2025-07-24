# 📝 Input

> Flexible input component with slots for icons, buttons, and custom elements.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/input.svg)](https://www.npmjs.com/package/@telegraph/input)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/input)](https://bundlephobia.com/result?p=@telegraph/input)
[![license](https://img.shields.io/npm/l/@telegraph/input)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/input
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/input";
```

Via Javascript:
```tsx
import "@telegraph/input/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Input } from "@telegraph/input";
import { Icon } from "@telegraph/icon";
import { Search } from "lucide-react";

export const SearchInput = () => (
  <Input
    placeholder="Search..."
    LeadingComponent={<Icon icon={Search} alt="Search" />}
  />
);
```

## API Reference

### `<Input>` (Default Component)

The default Input component provides a simple API for common use cases.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"1" \| "2" \| "3"` | `"2"` | Input size |
| `variant` | `"outline" \| "ghost"` | `"outline"` | Visual style variant |
| `errored` | `boolean` | `false` | Shows error state styling |
| `disabled` | `boolean` | `false` | Disables the input |
| `LeadingComponent` | `React.ReactNode` | `undefined` | Component to display before the input text |
| `TrailingComponent` | `React.ReactNode` | `undefined` | Component to display after the input text |
| `as` | `TgphElement` | `"input"` | HTML element or component to render |

### Composition API

For advanced use cases, use the composition API:

#### `<Input.Root>`

Container component that wraps the input and slots.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"1" \| "2" \| "3"` | `"2"` | Input size |
| `variant` | `"outline" \| "ghost"` | `"outline"` | Visual style variant |
| `errored` | `boolean` | `false` | Shows error state styling |
| `disabled` | `boolean` | `false` | Disables the input |
| `as` | `TgphElement` | `"input"` | HTML element or component to render |

#### `<Input.Slot>`

Wrapper for leading and trailing components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `"leading" \| "trailing"` | `"leading"` | Position of the slot |

## Usage Patterns

### Basic Input

```tsx
import { Input } from "@telegraph/input";

// Simple text input
<Input placeholder="Enter your name" />

// Email input
<Input type="email" placeholder="Enter your email" />

// Password input
<Input type="password" placeholder="Enter your password" />
```

### Sizes

```tsx
import { Input } from "@telegraph/input";

// Small input
<Input size="1" placeholder="Small" />

// Medium input (default)
<Input size="2" placeholder="Medium" />

// Large input
<Input size="3" placeholder="Large" />
```

### Variants

```tsx
import { Input } from "@telegraph/input";

// Outline variant (default)
<Input variant="outline" placeholder="Outlined input" />

// Ghost variant
<Input variant="ghost" placeholder="Ghost input" />
```

### States

```tsx
import { Input } from "@telegraph/input";

// Error state
<Input errored placeholder="This has an error" />

// Disabled state
<Input disabled placeholder="This is disabled" />
```

### With Icons

```tsx
import { Input } from "@telegraph/input";
import { Icon } from "@telegraph/icon";
import { Search, Mail, Lock } from "lucide-react";

// Search input
<Input
  placeholder="Search..."
  LeadingComponent={<Icon icon={Search} alt="Search" />}
/>

// Email input
<Input
  type="email"
  placeholder="Enter email"
  LeadingComponent={<Icon icon={Mail} alt="Email" />}
/>

// Password input with toggle
<Input
  type="password"
  placeholder="Password"
  LeadingComponent={<Icon icon={Lock} alt="Password" />}
  TrailingComponent={
    <Icon 
      icon={Eye} 
      alt="Toggle password visibility"
      onClick={togglePasswordVisibility}
    />
  }
/>
```

## Advanced Usage

### Composition Pattern

Use `Input.Root` and `Input.Slot` for maximum control:

```tsx
import { Input } from "@telegraph/input";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Search, Filter } from "lucide-react";

export const AdvancedSearchInput = () => (
  <Input.Root placeholder="Search products...">
    <Input.Slot position="leading">
      <Icon icon={Search} alt="Search" />
    </Input.Slot>
    <Input.Slot position="trailing">
      <Button
        variant="ghost"
        size="1"
        icon={{ icon: Filter, alt: "Filter" }}
        onClick={openFilters}
      />
    </Input.Slot>
  </Input.Root>
);
```

### Form Integration

```tsx
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Icon } from "@telegraph/icon";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export const FormField = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (error) setError(""); // Clear error on change
  };

  return (
    <Stack gap="1">
      <Text as="label" htmlFor="email">Email Address</Text>
      <Input
        id="email"
        type="email"
        value={value}
        onChange={handleChange}
        errored={!!error}
        placeholder="Enter your email"
        LeadingComponent={<Icon icon={Mail} alt="Email" />}
      />
      {error && (
        <Stack direction="row" align="center" gap="1">
          <Icon icon={AlertCircle} alt="Error" color="red" size="1" />
          <Text size="1" color="red">{error}</Text>
        </Stack>
      )}
    </Stack>
  );
};
```

### Search with Clear Button

```tsx
import { Input } from "@telegraph/input";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Search, X } from "lucide-react";
import { useState } from "react";

export const SearchInput = () => {
  const [query, setQuery] = useState("");

  const clearSearch = () => setQuery("");

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      LeadingComponent={<Icon icon={Search} alt="Search" />}
      TrailingComponent={
        query && (
          <Button
            variant="ghost"
            size="1"
            icon={{ icon: X, alt: "Clear search" }}
            onClick={clearSearch}
          />
        )
      }
    />
  );
};
```

### Number Input with Controls

```tsx
import { Input } from "@telegraph/input";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export const NumberInput = ({ min = 0, max = 100 }) => {
  const [value, setValue] = useState(0);

  const increment = () => setValue(prev => Math.min(prev + 1, max));
  const decrement = () => setValue(prev => Math.max(prev - 1, min));

  return (
    <Input.Root 
      type="number" 
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      min={min}
      max={max}
    >
      <Input.Slot position="leading">
        <Button
          variant="ghost"
          size="1"
          icon={{ icon: Minus, alt: "Decrease" }}
          onClick={decrement}
          disabled={value <= min}
        />
      </Input.Slot>
      <Input.Slot position="trailing">
        <Button
          variant="ghost"
          size="1"
          icon={{ icon: Plus, alt: "Increase" }}
          onClick={increment}
          disabled={value >= max}
        />
      </Input.Slot>
    </Input.Root>
  );
};
```

### Polymorphic Usage

```tsx
import { Input } from "@telegraph/input";
import { forwardRef } from "react";

// Custom textarea component
const TextAreaInput = forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input.Root as="textarea" tgphRef={ref} {...props} />
));

// Usage
<TextAreaInput 
  placeholder="Enter your message..."
  rows={4}
/>
```

### Input with Validation

```tsx
import { Input } from "@telegraph/input";
import { Icon } from "@telegraph/icon";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const ValidatedInput = ({ validate, ...props }) => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (value) {
      setIsValid(validate(value));
    } else {
      setIsValid(null);
    }
  }, [value, validate]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      errored={isValid === false}
      TrailingComponent={
        isValid !== null && (
          <Icon
            icon={isValid ? CheckCircle : AlertCircle}
            color={isValid ? "green" : "red"}
            alt={isValid ? "Valid" : "Invalid"}
          />
        )
      }
    />
  );
};

// Usage
<ValidatedInput
  placeholder="Enter email"
  validate={(email) => /\S+@\S+\.\S+/.test(email)}
/>
```

## Design Tokens & Styling

The input component uses Telegraph design tokens for consistent styling:

### Size Tokens

**Container Heights:**
- Size `"1"`: `var(--tgph-spacing-6)` (24px)
- Size `"2"`: `var(--tgph-spacing-8)` (32px) 
- Size `"3"`: `var(--tgph-spacing-10)` (40px)

**Text Sizes:**
- Size `"1"`: `var(--tgph-text-1)`
- Size `"2"`: `var(--tgph-text-2)`
- Size `"3"`: `var(--tgph-text-3)`

### Color Tokens

**Outline Variant:**
- Background: `var(--tgph-surface-1)`
- Border: `var(--tgph-gray-6)`
- Hover Border: `var(--tgph-gray-7)`
- Focus Border: `var(--tgph-blue-8)`

**Ghost Variant:**
- Background: `transparent`
- Hover Background: `var(--tgph-gray-3)`
- Focus Background: `var(--tgph-gray-4)`

**Error State:**
- Border: `var(--tgph-red-6)`

### Custom Styling

```css
.tgph {
  /* Custom input styling */
  [data-tgph-input-container] {
    --custom-focus-color: var(--tgph-accent-8);
  }
  
  [data-tgph-input-container]:focus-within {
    border-color: var(--custom-focus-color);
  }
  
  /* Custom slot styling */
  [data-tgph-input-slot] {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  [data-tgph-input-container]:focus-within [data-tgph-input-slot] {
    opacity: 1;
  }
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support with proper tab order
- ✅ **Screen Reader Support**: Proper labeling and state announcements
- ✅ **Focus Management**: Clear focus indicators and focus trapping
- ✅ **ARIA Attributes**: Proper `aria-invalid`, `aria-describedby` support
- ✅ **Color Contrast**: All variants meet WCAG AA standards

### Accessibility Guidelines

1. **Labels**: Always provide labels for inputs
2. **Error Messages**: Associate error messages with inputs using `aria-describedby`
3. **Required Fields**: Use `aria-required` for required inputs
4. **Placeholder Text**: Don't rely solely on placeholders for instructions
5. **Interactive Elements**: Ensure buttons and icons in slots are keyboard accessible

```tsx
// ✅ Good accessibility practices
<Stack gap="1">
  <Text as="label" htmlFor="search">Search Products</Text>
  <Input
    id="search"
    placeholder="Enter product name..."
    aria-describedby={error ? "search-error" : undefined}
    aria-invalid={!!error}
    errored={!!error}
    LeadingComponent={<Icon icon={Search} alt="Search" />}
  />
  {error && (
    <Text id="search-error" size="1" color="red">
      {error}
    </Text>
  )}
</Stack>

// ❌ Poor accessibility
<Input placeholder="Search" /> {/* No label */}
<Input 
  LeadingComponent={<Icon icon={Search} />} {/* No alt text */}
/>
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Focus next element |
| `Shift + Tab` | Focus previous element |
| `Enter` | Submit form (if in form) |
| `Escape` | Clear input (if custom clear handler) |

### Best Practices

1. **Label Association**: Use `htmlFor` and `id` to associate labels with inputs
2. **Error Handling**: Provide clear, actionable error messages
3. **Required Indicators**: Mark required fields visually and with `aria-required`
4. **Placeholder Usage**: Use placeholders for examples, not instructions
5. **Focus Order**: Ensure logical tab order through form fields

## Testing

### Testing Library Example

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@telegraph/input";

test("renders input with placeholder", () => {
  render(<Input placeholder="Enter text" />);
  
  const input = screen.getByPlaceholderText("Enter text");
  expect(input).toBeInTheDocument();
});

test("handles user input", async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();
  
  render(<Input onChange={handleChange} />);
  
  const input = screen.getByRole("textbox");
  await user.type(input, "Hello World");
  
  expect(input).toHaveValue("Hello World");
  expect(handleChange).toHaveBeenCalledTimes(11); // One per character
});

test("shows error state", () => {
  const { container } = render(<Input errored />);
  
  const inputContainer = container.querySelector('[data-tgph-input-container]');
  expect(inputContainer).toHaveAttribute('data-tgph-input-container-state', 'error');
});
```

### Testing with Slots

```tsx
test("renders leading and trailing components", () => {
  render(
    <Input
      LeadingComponent={<span data-testid="leading">Search</span>}
      TrailingComponent={<button data-testid="trailing">Clear</button>}
    />
  );
  
  expect(screen.getByTestId("leading")).toBeInTheDocument();
  expect(screen.getByTestId("trailing")).toBeInTheDocument();
});

test("focuses input when clicking container", async () => {
  const user = userEvent.setup();
  
  const { container } = render(<Input placeholder="Click to focus" />);
  
  const inputContainer = container.querySelector('[data-tgph-input-container]');
  const input = screen.getByRole("textbox");
  
  await user.click(inputContainer!);
  
  expect(input).toHaveFocus();
});
```

### Form Testing

```tsx
test("integrates with form submission", async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  
  render(
    <form onSubmit={handleSubmit}>
      <Input name="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
  
  const input = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByRole("button", { name: "Submit" });
  
  await user.type(input, "test@example.com");
  await user.click(submitButton);
  
  expect(handleSubmit).toHaveBeenCalled();
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render(
    <div>
      <label htmlFor="test-input">Test Input</label>
      <Input id="test-input" placeholder="Enter text" />
    </div>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Examples

### Contact Form

```tsx
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { User, Mail, MessageSquare } from "lucide-react";

export const ContactForm = () => (
  <Stack gap="4" as="form">
    <Stack gap="1">
      <Text as="label" htmlFor="name">Full Name</Text>
      <Input
        id="name"
        placeholder="Enter your full name"
        LeadingComponent={<Icon icon={User} alt="Name" />}
      />
    </Stack>
    
    <Stack gap="1">
      <Text as="label" htmlFor="email">Email Address</Text>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
        LeadingComponent={<Icon icon={Mail} alt="Email" />}
      />
    </Stack>
    
    <Stack gap="1">
      <Text as="label" htmlFor="message">Message</Text>
      <Input.Root
        as="textarea"
        id="message"
        placeholder="Enter your message"
        rows={4}
      >
        <Input.Slot position="leading">
          <Icon icon={MessageSquare} alt="Message" />
        </Input.Slot>
      </Input.Root>
    </Stack>
    
    <Button type="submit">Send Message</Button>
  </Stack>
);
```

### E-commerce Search

```tsx
import { Input } from "@telegraph/input";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Search, Filter, ScanBarcode } from "lucide-react";
import { useState } from "react";

export const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search products..."
      size="3"
      LeadingComponent={<Icon icon={Search} alt="Search" />}
      TrailingComponent={
        <Stack direction="row" gap="1">
          <Button
            variant="ghost"
            size="1"
            icon={{ icon: ScanBarcode, alt: "Scan barcode" }}
            onClick={openBarcodeScanner}
          />
          <Button
            variant="ghost"
            size="1"
            icon={{ icon: Filter, alt: "Filter results" }}
            onClick={openFilters}
          />
        </Stack>
      }
    />
  );
};
```

### Authentication Inputs

```tsx
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack gap="4" as="form">
      <Input
        type="email"
        placeholder="Email address"
        LeadingComponent={<Icon icon={Mail} alt="Email" />}
      />
      
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        LeadingComponent={<Icon icon={Lock} alt="Password" />}
        TrailingComponent={
          <Button
            variant="ghost"
            size="1"
            icon={{ 
              icon: showPassword ? EyeOff : Eye, 
              alt: showPassword ? "Hide password" : "Show password" 
            }}
            onClick={() => setShowPassword(!showPassword)}
          />
        }
      />
      
      <Button type="submit">Sign In</Button>
    </Stack>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/input)
- [Design System Guidelines](https://github.com/knocklabs/telegraph)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this component:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Open Storybook: `pnpm storybook`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

