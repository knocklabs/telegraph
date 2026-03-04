# Telegraph + React Server Components (RSC) Integration Analysis

This document explores why Telegraph components cannot currently work within React Server Components and outlines potential approaches for addressing this in the future.

## Table of Contents
1. [Understanding the Problem](#understanding-the-problem)
2. [Why Telegraph Components Cannot Work with RSC](#why-telegraph-components-cannot-work-with-rsc)
3. [Current Workaround](#current-workaround)
4. [Potential Approaches for RSC Integration](#potential-approaches-for-rsc-integration)
5. [Recommended Path Forward](#recommended-path-forward)

---

## Understanding the Problem

React Server Components (RSC) introduce a new paradigm where components can render entirely on the server, without shipping any JavaScript to the client. However, RSC has strict requirements:

**Server Components CANNOT:**
- Use React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)
- Use browser-only APIs (`document`, `window`, event listeners, etc.)
- Have event handlers (`onClick`, `onChange`, etc.)
- Import modules that use any of the above

**Server Components CAN:**
- `await` async operations
- Access backend resources directly
- Pass serializable props to Client Components
- Render Client Components as children

---

## Why Telegraph Components Cannot Work with RSC

Based on analysis of the Telegraph codebase, there are **5 core reasons** why components are incompatible with React Server Components:

### 1. Extensive React Hooks Usage

Telegraph components heavily rely on React hooks that are client-only:

| Hook | Usage Count | Example Files |
|------|-------------|---------------|
| `useState` | 233+ matches | Modal, Popover, SegmentedControl |
| `useEffect` | 100+ matches | useAppearance, Tooltip, SegmentedControl |
| `useRef` | Widespread | Button, Modal, Input |
| `useContext` | 14 components | Button, Popover, SegmentedControl |
| `useMemo/useCallback` | 35+ files | Button, SegmentedControl |

**Example from Button component:**
```tsx
// packages/button/src/Button/Button.tsx
const Root = <T extends TgphElement>({ ... }: RootProps<T>) => {
  const state = useDeterminateState<DefaultProps<T>["state"]>({
    value: derivedState,
    determinateValue: "loading",
    minDurationMs: 1200,
  });

  const { styleProp, otherProps } = useStyleEngine({
    props: { ...BUTTON_COLOR_MAP[variant][color], style },
    cssVars,
  });

  const layout = React.useMemo<InternalProps["layout"]>(() => {
    // ... derives layout from children
  }, [children]);
  
  return (
    <ButtonContext.Provider value={{ variant, size, color, state, layout, active }}>
      {/* ... */}
    </ButtonContext.Provider>
  );
};
```

### 2. React Context Usage

Telegraph uses Context extensively for component composition patterns:

| Context | Component | Purpose |
|---------|-----------|---------|
| `ButtonContext` | Button | Share variant/size/state with Icon/Text subcomponents |
| `PopoverContext` | Popover | Share open state between Trigger and Content |
| `ModalStackingContext` | Modal | Manage stacked modal layers |
| `SegmentedControlContextState` | SegmentedControl | Share value/size between Root and Options |
| `TooltipContext` | Tooltip | Coordinate tooltip group behavior |

Context requires `useContext` to consume and Provider components that manage state—both are client-only features.

### 3. Browser DOM APIs

Several components directly access browser-only APIs:

**`useAppearance` hook:**
```tsx
// packages/appearance/src/useAppearance.tsx
React.useEffect(() => {
  if (!document) return;

  const mutationsCallback = (mutations: MutationRecord[]) => {
    // Uses MutationObserver
  };

  const observer = new MutationObserver(mutationsCallback);
  observer.observe(document.documentElement, { attributes: true });

  return () => observer.disconnect();
}, []);
```

**`SegmentedControl` scroll handling:**
```tsx
// packages/segmented-control/src/SegmentedControl/SegmentedControl.tsx
React.useEffect(() => {
  if (!containerRef.current) return;
  const container = containerRef.current;
  
  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [handleScroll]);
```

### 4. Third-Party Client-Only Dependencies

Telegraph depends on libraries that are inherently client-side:

| Dependency | Usage | Why Client-Only |
|------------|-------|-----------------|
| `@radix-ui/react-*` | Modal, Popover, Tooltip, Select, etc. | Uses hooks, portals, event handling |
| `motion/react` | Modal, Popover, Tooltip, SegmentedControl | Animations require DOM |
| `@radix-ui/react-use-controllable-state` | Most interactive components | Uses useState internally |
| `lucide-react` | Icons | Generally RSC-safe, but used in client contexts |

### 5. Interactive Event Handlers

Almost every component has interactive behavior requiring JavaScript:

- `Button`: `onClick`, loading states
- `Modal`: `onOpenChange`, escape key handling, click outside
- `Tooltip`: hover detection, delay management
- `Input`: `onChange`, focus management
- `Combobox`: keyboard navigation, selection, filtering

---

## Current Workaround

The `@telegraph/nextjs` package provides a Webpack loader that automatically prepends `"use client"` to all Telegraph component files:

```js
// packages/nextjs/src/use-client-loader.js
module.exports = function (source) {
  return `"use client";\n` + source;
};
```

```ts
// packages/nextjs/src/with-telegraph.ts
export const withTelegraph = () => () => {
  return {
    webpack: function (config: any) {
      config.module.rules.push({
        test: [
          /node_modules\/(?:[^/]+\/)*?@telegraph\/[^/]+(?:\/[^/]*)*\.js$/,
        ],
        use: {
          loader: "@telegraph/nextjs/loader",
        },
      });
      return config;
    },
  };
};
```

**Implications of this approach:**
- ✅ Telegraph components work in Next.js App Router
- ❌ All Telegraph components become client components
- ❌ No benefit from RSC's reduced JavaScript bundle
- ❌ Components cannot be rendered on the server without hydration

---

## Potential Approaches for RSC Integration

### Approach 1: Component Splitting (Static + Interactive)

Create two versions of components—one RSC-safe for static rendering, one interactive for full functionality.

**Structure:**
```
packages/button/
├── src/
│   ├── Button/
│   │   ├── Button.tsx           # Full interactive version
│   │   ├── Button.static.tsx    # RSC-safe version
│   │   └── index.ts
```

**Example implementation:**
```tsx
// Button.static.tsx - RSC-safe
import { Stack } from "@telegraph/layout/static";
import { Text } from "@telegraph/typography/static";

type StaticButtonProps = {
  variant?: "solid" | "outline" | "ghost";
  color?: "default" | "accent" | "danger";
  size?: "1" | "2" | "3";
  children: React.ReactNode;
};

export const Button = ({ variant = "solid", color = "default", size = "2", children }: StaticButtonProps) => {
  return (
    <Stack
      as="button"
      className={`tgph-button tgph-button-${variant}-${color}`}
      data-tgph-button-variant={variant}
      data-tgph-button-color={color}
      data-tgph-button-size={size}
    >
      <Text>{children}</Text>
    </Stack>
  );
};
```

**Pros:**
- Clear separation of concerns
- Maximum RSC optimization for static content
- Explicit choice for developers

**Cons:**
- Doubles the API surface
- Potential for API drift between versions
- More maintenance burden

---

### Approach 2: Source-Level "use client" Directives

Add `"use client"` directives directly to source files instead of via Webpack loader.

**Structure:**
```tsx
// packages/button/src/Button/Button.tsx
"use client";

import React from "react";
// ... rest of component
```

**Pros:**
- Explicit and standard approach
- Works without custom loaders
- Future-proof for React ecosystem

**Cons:**
- Still marks all components as client-only
- No RSC benefits
- Breaking change for build configurations

---

### Approach 3: Prop-Based Progressive Enhancement

Design components to work as RSC by default, but upgrade to client components when interactive props are provided.

**Implementation pattern:**
```tsx
// ButtonWrapper.tsx (RSC-safe wrapper)
import { StaticButton } from "./Button.static";
import { InteractiveButton } from "./Button.client";

type ButtonProps = StaticButtonProps & {
  onClick?: () => void;
  state?: "loading" | "default";
};

export const Button = (props: ButtonProps) => {
  const needsClient = props.onClick || props.state === "loading";
  
  if (needsClient) {
    return <InteractiveButton {...props} />;
  }
  
  return <StaticButton {...props} />;
};
```

**Pros:**
- Single API for developers
- Automatic optimization based on usage
- Graceful degradation

**Cons:**
- Complex implementation
- Build tooling challenges
- May cause hydration mismatches

---

### Approach 4: CSS-Only Component Variants

For components where interactivity isn't needed, provide pure CSS implementations.

**Example - Icon:**
```tsx
// Icon.server.tsx
export const Icon = ({ icon: IconComponent, size, color }: IconProps) => {
  return (
    <span 
      className={`tgph-icon tgph-icon-${size} tgph-icon-${color}`}
      aria-hidden="true"
    >
      <IconComponent />
    </span>
  );
};
```

**Good candidates:**
- `Icon` (without animations)
- `Text` / typography components
- `Box` / `Stack` layout primitives
- `Tag` (static display)

---

### Approach 5: Hybrid Package Architecture

Restructure packages to have explicit client and server exports.

**Package structure:**
```
packages/button/
├── src/
│   ├── server/
│   │   └── Button.tsx    # RSC-safe
│   ├── client/
│   │   └── Button.tsx    # Full interactive
│   └── index.ts          # Re-exports client by default
├── server.ts             # Entry for server imports
└── package.json          # With "exports" field
```

**package.json exports:**
```json
{
  "exports": {
    ".": "./dist/index.js",
    "./server": "./dist/server/index.js"
  }
}
```

**Usage:**
```tsx
// For client components (default)
import { Button } from "@telegraph/button";

// For RSC contexts
import { Button } from "@telegraph/button/server";
```

---

## Recommended Path Forward

Based on the analysis, here's a recommended phased approach:

### Phase 1: Identify RSC-Safe Components
Audit which components could theoretically work as RSC with minimal changes:
- Layout primitives (`Box`, `Stack`)
- Typography (`Text`, `Heading`, `Code`)
- Static display components (`Icon`, `Tag` static variant)

### Phase 2: Evaluate Radix Primitives
Investigate:
- Are there RSC-compatible versions of Radix components?
- Can we create thin RSC wrappers for Radix?
- Alternative primitive libraries with RSC support?

### Phase 3: Pilot Implementation
Choose 2-3 simple components for pilot RSC support:
1. `Box` / `Stack` - pure layout, no hooks needed
2. `Text` - pure typography
3. `Icon` - could work without animations

### Phase 4: Architecture Decision
Based on pilot learnings, decide between:
- **Approach 1** (Component Splitting) - if clear distinction is valuable
- **Approach 5** (Hybrid Packages) - if seamless experience is priority

### Phase 5: Incremental Migration
- Add RSC support to components incrementally
- Maintain backwards compatibility
- Document migration path for consumers

---

## Questions to Explore

1. **What's the actual performance benefit?** Measure bundle size savings for real applications.

2. **What do consumers actually need?** Survey Telegraph users about RSC usage patterns.

3. **How do other design systems handle this?** Research Chakra UI, Radix Themes, shadcn/ui approaches.

4. **Can we maintain a single API?** Explore if build-time transforms can handle the split.

5. **What about streaming and Suspense?** Consider how RSC streaming affects component behavior.

---

## Resources

- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Radix UI and RSC Discussion](https://github.com/radix-ui/primitives/discussions)
- [Patterns for Composing React Components](https://frontendmastery.com/posts/advanced-react-component-composition-guide/)
