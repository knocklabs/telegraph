# 🛠️ Helpers

> TypeScript utilities, React components, and hooks for building robust Telegraph components.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/helpers.svg)](https://www.npmjs.com/package/@telegraph/helpers)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/helpers)](https://bundlephobia.com/result?p=@telegraph/helpers)
[![license](https://img.shields.io/npm/l/@telegraph/helpers)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/helpers
```

> **Note**: This package contains TypeScript utilities and React helpers. No stylesheets required.

## Quick Start

```tsx
import { 
  PolymorphicProps, 
  useDeterminateState, 
  RefToTgphRef 
} from "@telegraph/helpers";

// Type-safe polymorphic component
type ButtonProps<T extends TgphElement> = PolymorphicProps<T> & {
  variant?: "solid" | "outline";
};

// Hook for loading states with minimum duration
const { state } = useDeterminateState({
  value: isLoading ? "loading" : "idle",
  determinateValue: "loading",
  minDurationMs: 1000,
});
```

## API Reference

### Type Utilities

#### `Required<T, K>`

Make specific properties of a type required.

```tsx
import { Required } from "@telegraph/helpers";

type User = {
  name?: string;
  email?: string;
  age?: number;
};

// Make name and email required
type UserWithRequiredFields = Required<User, "name" | "email">;
// Result: { name: string; email: string; age?: number; }
```

#### `Optional<T, K>`

Make specific properties of a type optional.

```tsx
import { Optional } from "@telegraph/helpers";

type User = {
  name: string;
  email: string;
  age: number;
};

// Make age optional
type UserWithOptionalAge = Optional<User, "age">;
// Result: { name: string; email: string; age?: number; }
```

#### `RemappedOmit<T, K>`

Enhanced version of TypeScript's `Omit` that ensures complete field removal.

```tsx
import { RemappedOmit } from "@telegraph/helpers";

type User = {
  id: string;
  name: string;
  password: string;
};

// Remove sensitive fields
type PublicUser = RemappedOmit<User, "password">;
// Result: { id: string; name: string; }
```

### Polymorphic Component Types

#### `TgphElement`

Type alias for `React.ElementType` used throughout Telegraph.

```tsx
import { TgphElement } from "@telegraph/helpers";

type ComponentProps<T extends TgphElement> = {
  as?: T;
  children: React.ReactNode;
};
```

#### `TgphComponentProps<T>`

Type alias for `React.ComponentProps<T>`.

```tsx
import { TgphComponentProps } from "@telegraph/helpers";

type ButtonProps = TgphComponentProps<"button"> & {
  variant?: string;
};
```

#### `AsProp<C>`

Type for the `as` prop used in polymorphic components.

```tsx
import { AsProp } from "@telegraph/helpers";

type BaseProps = AsProp<React.ElementType> & {
  children: React.ReactNode;
};
```

#### `PolymorphicProps<E>`

Complete props type for polymorphic components.

```tsx
import { PolymorphicProps, TgphElement } from "@telegraph/helpers";

type BoxProps<T extends TgphElement> = PolymorphicProps<T> & {
  padding?: string;
  margin?: string;
};

const Box = <T extends TgphElement = "div">({ 
  as, 
  padding, 
  margin, 
  ...props 
}: BoxProps<T>) => {
  const Component = as || "div";
  return <Component style={{ padding, margin }} {...props} />;
};

// Usage examples:
<Box>Default div</Box>
<Box as="section">Semantic section</Box>
<Box as="button" onClick={() => {}}>Button element</Box>
```

#### `PolymorphicPropsWithTgphRef<E, R>`

Polymorphic props with Telegraph-specific ref handling.

```tsx
import { PolymorphicPropsWithTgphRef, TgphElement } from "@telegraph/helpers";

type InputProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<T, HTMLInputElement> & {
  placeholder?: string;
};

const Input = <T extends TgphElement = "input">({ 
  as, 
  tgphRef, 
  ...props 
}: InputProps<T>) => {
  const Component = as || "input";
  return <Component ref={tgphRef} {...props} />;
};
```

#### `PropsWithAs<C, P>`

Utility for combining element props with custom props.

```tsx
import { PropsWithAs } from "@telegraph/helpers";

type CustomButtonProps = PropsWithAs<"button", {
  variant: "primary" | "secondary";
  loading?: boolean;
}>;

const CustomButton = ({ as: Component = "button", variant, loading, ...props }: CustomButtonProps) => {
  return <Component disabled={loading} data-variant={variant} {...props} />;
};
```

## React Components

### `RefToTgphRef`

Component for handling ref forwarding between external libraries (like Radix) and Telegraph components.

```tsx
import { RefToTgphRef } from "@telegraph/helpers";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@telegraph/button";

// Radix expects a `ref` prop, but Telegraph uses `tgphRef`
<Popover.Trigger asChild>
  <RefToTgphRef>
    <Button>Open Popover</Button>
  </RefToTgphRef>
</Popover.Trigger>
```

#### Use Cases

**With Radix UI Primitives:**
```tsx
import { RefToTgphRef } from "@telegraph/helpers";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@telegraph/button";

const DialogExample = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <RefToTgphRef>
        <Button>Open Dialog</Button>
      </RefToTgphRef>
    </Dialog.Trigger>
    <Dialog.Content>
      {/* Dialog content */}
    </Dialog.Content>
  </Dialog.Root>
);
```

**With Form Libraries:**
```tsx
import { RefToTgphRef } from "@telegraph/helpers";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@telegraph/input";

const FormExample = () => {
  const { control } = useForm();
  
  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <RefToTgphRef>
          <Input {...field} placeholder="Email" />
        </RefToTgphRef>
      )}
    />
  );
};
```

## React Hooks

### `useDeterminateState`

Hook for managing state transitions with minimum duration guarantees.

```tsx
import { useDeterminateState } from "@telegraph/helpers";

const useDeterminateState = <T>({
  value: T;                    // Current value
  determinateValue: T;         // Value that should persist for minimum duration
  minDurationMs?: number;      // Minimum duration (default: 1000ms)
}): T
```

#### Basic Usage

```tsx
import { useDeterminateState } from "@telegraph/helpers";
import { useState } from "react";

const LoadingButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Ensure loading state persists for at least 1 second
  const buttonState = useDeterminateState({
    value: isLoading ? "loading" : "idle",
    determinateValue: "loading",
    minDurationMs: 1000,
  });
  
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setIsLoading(false); // Will transition back after minimum duration
    }
  };
  
  return (
    <button onClick={handleClick} disabled={buttonState === "loading"}>
      {buttonState === "loading" ? "Loading..." : "Click me"}
    </button>
  );
};
```

#### Advanced Usage

```tsx
import { useDeterminateState } from "@telegraph/helpers";

type FormState = "idle" | "submitting" | "success" | "error";

const FormWithFeedback = () => {
  const [formState, setFormState] = useState<FormState>("idle");
  
  // Ensure success/error states are visible for at least 2 seconds
  const displayState = useDeterminateState({
    value: formState,
    determinateValue: formState === "success" || formState === "error" ? formState : "idle",
    minDurationMs: 2000,
  });
  
  const handleSubmit = async () => {
    setFormState("submitting");
    try {
      await submitForm();
      setFormState("success");
      // Auto-reset after success is shown
      setTimeout(() => setFormState("idle"), 2500);
    } catch (error) {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 2500);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button disabled={displayState === "submitting"}>
        {displayState === "submitting" && "Submitting..."}
        {displayState === "success" && "✓ Saved!"}
        {displayState === "error" && "✗ Error"}
        {displayState === "idle" && "Save"}
      </button>
    </form>
  );
};
```

## Advanced Usage

### Creating Polymorphic Components

```tsx
import { forwardRef } from "react";
import { PolymorphicPropsWithTgphRef, TgphElement } from "@telegraph/helpers";

type TextProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<T, HTMLElement> & {
  size?: "small" | "medium" | "large";
  weight?: "normal" | "bold";
  color?: string;
};

const Text = forwardRef<HTMLElement, TextProps<TgphElement>>(
  <T extends TgphElement = "span">({
    as,
    size = "medium",
    weight = "normal",
    color,
    tgphRef,
    style,
    ...props
  }: TextProps<T>, ref) => {
    const Component = as || "span";
    
    return (
      <Component
        ref={tgphRef || ref}
        style={{
          fontSize: size === "small" ? "12px" : size === "large" ? "18px" : "14px",
          fontWeight: weight === "bold" ? "bold" : "normal",
          color,
          ...style,
        }}
        {...props}
      />
    );
  }
);

// Usage examples:
<Text>Default span text</Text>
<Text as="p" size="large" weight="bold">Paragraph text</Text>
<Text as="h1" color="blue">Heading text</Text>
<Text as={Link} href="/about">Link text</Text>
```

### Type-Safe Component APIs

```tsx
import { Required, Optional, TgphComponentProps } from "@telegraph/helpers";

// Base props with all optional styling
type BaseCardProps = {
  padding?: string;
  shadow?: boolean;
  rounded?: boolean;
  background?: string;
};

// Card variant that requires certain props
type PrimaryCardProps = Required<BaseCardProps, "background"> & {
  variant: "primary";
};

// Card variant with some optional props
type SecondaryCardProps = Optional<BaseCardProps, "padding"> & {
  variant: "secondary";
};

type CardProps = (PrimaryCardProps | SecondaryCardProps) & {
  children: React.ReactNode;
};

const Card = ({ variant, children, ...props }: CardProps) => {
  if (variant === "primary") {
    // TypeScript knows `background` is required here
    return <div style={{ background: props.background }} />;
  }
  
  // Handle secondary variant
  return <div>{children}</div>;
};

// Usage:
<Card variant="primary" background="white">Content</Card> // ✓ Valid
<Card variant="primary">Content</Card> // ✗ TypeScript error - missing background
```

### Integration with External Libraries

```tsx
import { RefToTgphRef, PolymorphicProps } from "@telegraph/helpers";
import * as RadixPopover from "@radix-ui/react-popover";
import { Button } from "@telegraph/button";

type PopoverProps = PolymorphicProps<"div"> & {
  trigger: React.ReactNode;
  content: React.ReactNode;
};

const Popover = ({ trigger, content, ...props }: PopoverProps) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger asChild>
      <RefToTgphRef>{trigger}</RefToTgphRef>
    </RadixPopover.Trigger>
    <RadixPopover.Content {...props}>
      {content}
    </RadixPopover.Content>
  </RadixPopover.Root>
);

// Usage:
<Popover
  trigger={<Button>Open Menu</Button>}
  content={<div>Popover content</div>}
/>
```

## TypeScript

### Utility Type Examples

```tsx
import { Required, Optional, RemappedOmit } from "@telegraph/helpers";

// API response type
type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Create user payload (remove server-generated fields)
type CreateUserPayload = RemappedOmit<User, "id" | "createdAt" | "updatedAt">;

// Update user payload (make all fields optional except id)
type UpdateUserPayload = Required<
  Optional<User, "name" | "email" | "avatar">, 
  "id"
>;

// Public user (safe for client-side)
type PublicUser = RemappedOmit<User, "email">;
```

### Component Prop Patterns

```tsx
import { 
  PolymorphicProps, 
  TgphElement, 
  TgphComponentProps 
} from "@telegraph/helpers";

// Pattern 1: Simple polymorphic component
type SimpleProps<T extends TgphElement> = PolymorphicProps<T> & {
  variant?: string;
};

// Pattern 2: Component with ref forwarding
type WithRefProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<T, HTMLElement> & {
  variant?: string;
};

// Pattern 3: Extending native element props
type NativeProps = TgphComponentProps<"button"> & {
  loading?: boolean;
};

// Pattern 4: Conditional props based on variant
type ConditionalProps<T extends TgphElement> = PolymorphicProps<T> & (
  | { variant: "icon"; icon: React.ComponentType; label?: never; }
  | { variant: "text"; label: string; icon?: never; }
);
```

## Testing

### Testing Type Utilities

```tsx
import { Required, Optional, RemappedOmit } from "@telegraph/helpers";

// Type tests (compile-time verification)
type User = { name?: string; email?: string; };

// Test Required utility
type RequiredUser = Required<User, "name">;
const user1: RequiredUser = { name: "John" }; // ✓ Valid
const user2: RequiredUser = { email: "john@example.com" }; // ✗ Error: missing name

// Test Optional utility  
type PartialUser = Optional<{ name: string; email: string; }, "email">;
const user3: PartialUser = { name: "John" }; // ✓ Valid - email is optional

// Test RemappedOmit utility
type PublicUser = RemappedOmit<{ id: string; password: string; }, "password">;
const user4: PublicUser = { id: "123" }; // ✓ Valid - password is removed
```

### Testing React Hooks

```tsx
import { renderHook, act } from "@testing-library/react";
import { useDeterminateState } from "@telegraph/helpers";

test("useDeterminateState maintains minimum duration", async () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDeterminateState({
      value,
      determinateValue: "loading",
      minDurationMs: 100,
    }),
    { initialProps: { value: "idle" } }
  );
  
  expect(result.current).toBe("idle");
  
  // Start loading
  rerender({ value: "loading" });
  expect(result.current).toBe("loading");
  
  // Try to stop loading immediately
  rerender({ value: "idle" });
  expect(result.current).toBe("loading"); // Still loading due to minimum duration
  
  // Wait for minimum duration
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
  });
  
  expect(result.current).toBe("idle"); // Now transitioned
});
```

### Testing Components with Helpers

```tsx
import { render, screen } from "@testing-library/react";
import { RefToTgphRef } from "@telegraph/helpers";
import * as Popover from "@radix-ui/react-popover";

const TestComponent = () => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <RefToTgphRef>
        <button>Trigger</button>
      </RefToTgphRef>
    </Popover.Trigger>
  </Popover.Root>
);

test("RefToTgphRef forwards refs correctly", () => {
  render(<TestComponent />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

## Best Practices

### Type Utility Guidelines

1. **Use `RemappedOmit` over `Omit`**: Ensures complete field removal
2. **Prefer `Required`/`Optional` for partial updates**: More explicit than `Partial`
3. **Use `PolymorphicProps` for flexible components**: Enables `as` prop pattern
4. **Always provide default `TgphElement`**: Improves TypeScript inference

### Component Development

1. **Use `RefToTgphRef` with external libraries**: Ensures ref compatibility
2. **Implement `useDeterminateState` for loading states**: Improves UX with minimum durations
3. **Type polymorphic components properly**: Use appropriate helper types
4. **Test type constraints**: Verify TypeScript catches errors correctly

## References

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Design System Guidelines](https://github.com/knocklabs/telegraph)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to these utilities:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Run tests: `pnpm test`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.


