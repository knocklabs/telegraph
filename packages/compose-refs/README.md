# 🔗 Compose Refs

> Utility functions for composing multiple React refs together safely.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/compose-refs.svg)](https://www.npmjs.com/package/@telegraph/compose-refs)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/compose-refs)](https://bundlephobia.com/result?p=@telegraph/compose-refs)
[![license](https://img.shields.io/npm/l/@telegraph/compose-refs)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/compose-refs
```

> **Note**: This is a utility package with no stylesheets required.

## Quick Start

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef } from "react";

const MyComponent = forwardRef<HTMLDivElement, {}>((props, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, internalRef);
  
  return <div ref={composedRef} {...props} />;
});
```

## API Reference

### `useComposedRefs(...refs)`

A React hook that composes multiple refs into a single ref callback.

**Parameters:**
- `...refs: PossibleRef<T>[]` - Any number of refs to compose

**Returns:**
- `(node: T) => void` - A callback ref that applies all provided refs

**Type Definition:**
```tsx
type PossibleRef<T> = React.Ref<T> | undefined;
function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
```

### `composeRefs(...refs)`

A utility function that composes multiple refs into a single callback ref (non-hook version).

**Parameters:**
- `...refs: PossibleRef<T>[]` - Any number of refs to compose

**Returns:**
- `(node: T) => void` - A callback ref that applies all provided refs

**Type Definition:**
```tsx
function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
```

## Usage Patterns

### Forwarding Refs with Internal Ref

The most common use case is when you need both a forwarded ref and an internal ref:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef, useEffect } from "react";

const Button = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
  ({ children, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(forwardedRef, internalRef);
    
    useEffect(() => {
      // Use internal ref for component logic
      const button = internalRef.current;
      if (button) {
        // Your internal logic here
        console.log('Button mounted:', button);
      }
    }, []);
    
    return (
      <button ref={composedRef} {...props}>
        {children}
      </button>
    );
  }
);
```

### Multiple Internal Refs

Compose multiple internal refs when you need different refs for different purposes:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef } from "react";

const ComplexComponent = forwardRef<HTMLDivElement, {}>(
  (props, forwardedRef) => {
    const measurementRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, measurementRef, observerRef);
    
    return <div ref={composedRef} {...props} />;
  }
);
```

### With Callback Refs

Works seamlessly with callback refs:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useCallback } from "react";

const ComponentWithCallback = forwardRef<HTMLInputElement, {}>(
  (props, forwardedRef) => {
    const callbackRef = useCallback((node: HTMLInputElement | null) => {
      if (node) {
        // Auto-focus on mount
        node.focus();
      }
    }, []);
    
    const composedRef = useComposedRefs(forwardedRef, callbackRef);
    
    return <input ref={composedRef} {...props} />;
  }
);
```

### Non-Hook Version

Use `composeRefs` outside of React components:

```tsx
import { composeRefs } from "@telegraph/compose-refs";
import { createRef } from "react";

const ref1 = createRef<HTMLDivElement>();
const ref2 = createRef<HTMLDivElement>();

const combinedRef = composeRefs(ref1, ref2);

// Use combinedRef as a callback ref
<div ref={combinedRef} />
```

## Advanced Usage

### Conditional Refs

Handle refs that may be undefined:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef } from "react";

type Props = {
  enableInternalRef?: boolean;
};

const ConditionalRefComponent = forwardRef<HTMLDivElement, Props>(
  ({ enableInternalRef, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    
    const composedRef = useComposedRefs(
      forwardedRef,
      enableInternalRef ? internalRef : undefined
    );
    
    return <div ref={composedRef} {...props} />;
  }
);
```

### With Custom Hooks

Integrate with custom hooks that return refs:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef } from "react";

// Custom hook that returns a ref
function useAutoResize() {
  const ref = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    const textarea = ref.current;
    if (textarea) {
      const autoResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      };
      textarea.addEventListener('input', autoResize);
      return () => textarea.removeEventListener('input', autoResize);
    }
  }, []);
  
  return ref;
}

const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, {}>(
  (props, forwardedRef) => {
    const autoResizeRef = useAutoResize();
    const composedRef = useComposedRefs(forwardedRef, autoResizeRef);
    
    return <textarea ref={composedRef} {...props} />;
  }
);
```

## TypeScript

### Type Safety

The functions are fully typed and maintain type safety:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef } from "react";

// ✅ Correct - all refs are HTMLButtonElement
const ButtonComponent = forwardRef<HTMLButtonElement, {}>(
  (props, forwardedRef) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(forwardedRef, internalRef);
    return <button ref={composedRef} {...props} />;
  }
);

// ❌ TypeScript error - mismatched types
const MismatchedComponent = forwardRef<HTMLButtonElement, {}>(
  (props, forwardedRef) => {
    const divRef = useRef<HTMLDivElement>(null); // Different type!
    const composedRef = useComposedRefs(forwardedRef, divRef); // Error
    return <button ref={composedRef} {...props} />;
  }
);
```

### Generic Components

Works with generic components:

```tsx
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef } from "react";

type PolymorphicProps<T extends keyof JSX.IntrinsicElements> = {
  as?: T;
} & JSX.IntrinsicElements[T];

const PolymorphicComponent = forwardRef<HTMLElement, PolymorphicProps<any>>(
  ({ as: Component = "div", ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLElement>(null);
    const composedRef = useComposedRefs(forwardedRef, internalRef);
    
    return <Component ref={composedRef} {...props} />;
  }
);
```

## Why Use This Utility?

### Problem

React components sometimes need multiple refs on the same element:

```tsx
// ❌ This doesn't work - only the last ref is applied
const BrokenComponent = forwardRef((props, forwardedRef) => {
  const internalRef = useRef(null);
  
  return (
    <div 
      ref={internalRef}     // This gets overwritten
      ref={forwardedRef}    // Only this applies
      {...props} 
    />
  );
});
```

### Solution

Compose refs safely handles both callback and object refs:

```tsx
// ✅ This works - both refs are applied
const WorkingComponent = forwardRef((props, forwardedRef) => {
  const internalRef = useRef(null);
  const composedRef = useComposedRefs(forwardedRef, internalRef);
  
  return <div ref={composedRef} {...props} />;
});
```

## Testing

### Testing Library Example

```tsx
import { render } from "@testing-library/react";
import { useComposedRefs } from "@telegraph/compose-refs";
import { forwardRef, useRef, createRef } from "react";

const TestComponent = forwardRef<HTMLDivElement, { testId: string }>(
  ({ testId }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(forwardedRef, internalRef);
    
    return <div ref={composedRef} data-testid={testId} />;
  }
);

test("applies both forwarded and internal refs", () => {
  const externalRef = createRef<HTMLDivElement>();
  
  render(<TestComponent ref={externalRef} testId="test-element" />);
  
  // External ref should be populated
  expect(externalRef.current).toBeInTheDocument();
  expect(externalRef.current).toHaveAttribute("data-testid", "test-element");
});
```

### Unit Testing

```tsx
import { composeRefs } from "@telegraph/compose-refs";
import { createRef } from "react";

test("composeRefs applies value to all refs", () => {
  const ref1 = createRef<HTMLDivElement>();
  const ref2 = createRef<HTMLDivElement>();
  const callbackRef = jest.fn();
  
  const composedRef = composeRefs(ref1, ref2, callbackRef);
  const element = document.createElement("div");
  
  composedRef(element);
  
  expect(ref1.current).toBe(element);
  expect(ref2.current).toBe(element);
  expect(callbackRef).toHaveBeenCalledWith(element);
});

test("handles undefined refs gracefully", () => {
  const ref = createRef<HTMLDivElement>();
  const composedRef = composeRefs(ref, undefined, null);
  const element = document.createElement("div");
  
  expect(() => composedRef(element)).not.toThrow();
  expect(ref.current).toBe(element);
});
```

## References

- [React Forwarding Refs](https://react.dev/reference/react/forwardRef)
- [Radix UI Compose Refs](https://github.com/radix-ui/primitives/tree/main/packages/react/compose-refs) (Original implementation)
- [Design System Guidelines](https://github.com/knocklabs/telegraph)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this utility:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Run tests: `pnpm test`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

