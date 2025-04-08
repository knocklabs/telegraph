![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/appearance.svg)](https://www.npmjs.com/package/@telegraph/appearance)

# @telegraph/appearance

> Utilities for managing appearance (light/dark mode) in Telegraph applications.

## Installation

```bash
npm install @telegraph/appearance
```

## Components and Hooks

### useAppearance

The main hook for managing appearance state and transitions.

```tsx
import { useAppearance } from "@telegraph/appearance";

const {
  appearance,              // Current appearance ("light" | "dark")
  setAppearance,          // Function to update appearance
  toggleAppearance,       // Function to toggle between light/dark
  invertedAppearance,     // Opposite of current appearance
  appearanceProps,        // Props to apply current appearance
  invertedAppearanceProps,// Props to apply inverted appearance
  lightAppearanceProps,   // Props to force light appearance
  darkAppearanceProps     // Props to force dark appearance
} = useAppearance({
  appearanceOverride?: "light" | "dark" // Optional override
});
```

### Appearance Component

A component that applies appearance context to its children.

```tsx
import { Appearance } from "@telegraph/appearance";

// Basic usage
<Appearance>
  <YourComponent />
</Appearance>

// With specific appearance
<Appearance appearance="dark">
  <YourComponent />
</Appearance>

// With inverted appearance
<Appearance inverted>
  <YourComponent />
</Appearance>

// Using Radix UI's asChild pattern
<Appearance asChild>
  <button>Inherits appearance context</button>
</Appearance>
```

#### Props

| Prop         | Type                | Default | Description                                 |
| ------------ | ------------------- | ------- | ------------------------------------------- |
| `appearance` | `"light" \| "dark"` | -       | Optional appearance override                |
| `inverted`   | `boolean`           | `false` | Whether to use inverted appearance          |
| `asChild`    | `boolean`           | `false` | Whether to merge props with child component |
| `children`   | `React.ReactNode`   | -       | Child components                            |

### InvertedAppearance Component

A convenience component that always applies the inverted appearance to its children.

```tsx
import { InvertedAppearance } from "@telegraph/appearance";

<InvertedAppearance>
  <YourComponent /> {/* Will have inverted appearance */}
</InvertedAppearance>;
```

### OverrideAppearance Component

A component that explicitly sets a specific appearance, ignoring the parent context.

```tsx
import { OverrideAppearance } from "@telegraph/appearance";

<OverrideAppearance appearance="light">
  <YourComponent /> {/* Will always have light appearance */}
</OverrideAppearance>;
```

## Examples

### Basic Appearance Toggle

```tsx
import { Appearance, useAppearance } from "@telegraph/appearance";
import { Button } from "@telegraph/button";

export const AppearanceToggle = () => {
  const { appearance, toggleAppearance } = useAppearance();

  return (
    <Button onClick={toggleAppearance}>
      {appearance === "light" ? "Switch to Dark" : "Switch to Light"}
    </Button>
  );
};
```

### Nested Appearance Contexts

```tsx
import { Appearance, InvertedAppearance } from "@telegraph/appearance";

export const NestedAppearance = () => {
  return (
    <Appearance appearance="light">
      <div>Light mode content</div>

      <InvertedAppearance>
        <div>Dark mode content</div>

        <InvertedAppearance>
          <div>Back to light mode content</div>
        </InvertedAppearance>
      </InvertedAppearance>
    </Appearance>
  );
};
```

### Using with Radix UI Components

```tsx
import * as Dialog from "@radix-ui/react-dialog";
import { Appearance } from "@telegraph/appearance";

export const AppearanceAwareDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Appearance asChild>
          <Dialog.Content>
            {/* Content inherits appearance context */}
            <div>Dialog content</div>
          </Dialog.Content>
        </Appearance>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

### Persistent Appearance Preference

```tsx
import { useAppearance } from "@telegraph/appearance";
import { useEffect } from "react";

export const AppearanceManager = () => {
  const { appearance, setAppearance } = useAppearance();

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("appearance-preference");
    if (saved === "light" || saved === "dark") {
      setAppearance(saved);
    }
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem("appearance-preference", appearance);
  }, [appearance]);

  return null;
};
```
