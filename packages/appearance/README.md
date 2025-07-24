# 🎨 Appearance

> Utilities to manage light and dark appearance modes in Telegraph components.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/appearance.svg)](https://www.npmjs.com/package/@telegraph/appearance)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/appearance)](https://bundlephobia.com/result?p=@telegraph/appearance)
[![license](https://img.shields.io/npm/l/@telegraph/appearance)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/appearance
```

## Quick Start

```tsx
import { useAppearance } from "@telegraph/appearance";

export const ThemeToggle = () => {
  const { appearance, toggleAppearance } = useAppearance();

  return (
    <button onClick={toggleAppearance}>
      {appearance === "light" ? "🌙" : "☀️"} Toggle theme
    </button>
  );
};
```

## API Reference

### `useAppearance` Hook

The primary hook for managing appearance state throughout your application.

```tsx
const {
  appearance,
  setAppearance,
  toggleAppearance,
  invertedAppearance,
  appearanceProps,
  invertedAppearanceProps,
  lightAppearanceProps,
  darkAppearanceProps,
} = useAppearance({ appearanceOverride: "light" });
```

#### Parameters

| Prop                 | Type                | Default   | Description                     |
| -------------------- | ------------------- | --------- | ------------------------------- |
| `appearanceOverride` | `"light" \| "dark"` | `"light"` | Override the initial appearance |

#### Returns

| Property                  | Type                                      | Description                                   |
| ------------------------- | ----------------------------------------- | --------------------------------------------- |
| `appearance`              | `"light" \| "dark"`                       | Current appearance mode                       |
| `setAppearance`           | `(appearance: "light" \| "dark") => void` | Function to set appearance                    |
| `toggleAppearance`        | `() => void`                              | Function to toggle between light/dark         |
| `invertedAppearance`      | `"light" \| "dark"`                       | Opposite of current appearance                |
| `appearanceProps`         | `object`                                  | Props with current appearance data attribute  |
| `invertedAppearanceProps` | `object`                                  | Props with inverted appearance data attribute |
| `lightAppearanceProps`    | `object`                                  | Props that force light appearance             |
| `darkAppearanceProps`     | `object`                                  | Props that force dark appearance              |

### Wrapper Components

#### `<Appearance>`

Applies appearance to child elements via data attributes.

```tsx
import { Appearance } from "@telegraph/appearance";

<Appearance appearance="dark">
  <div>This content will use dark appearance</div>
</Appearance>;
```

| Prop         | Type                | Default                   | Description                                    |
| ------------ | ------------------- | ------------------------- | ---------------------------------------------- |
| `appearance` | `"light" \| "dark"` | Current global appearance | Specific appearance to apply                   |
| `inverted`   | `boolean`           | `false`                   | Whether to invert the current appearance       |
| `asChild`    | `boolean`           | `false`                   | Render as child element instead of div wrapper |

#### `<InvertedAppearance>`

Shorthand for applying inverted appearance.

```tsx
import { InvertedAppearance } from "@telegraph/appearance";

<InvertedAppearance>
  <div>This will use the opposite of current appearance</div>
</InvertedAppearance>;
```

#### `<OverrideAppearance>`

Forces a specific appearance regardless of global state.

```tsx
import { OverrideAppearance } from "@telegraph/appearance";

<OverrideAppearance appearance="light">
  <div>This will always use light appearance</div>
</OverrideAppearance>;
```

## Advanced Usage

### Global Appearance Setup

Set up appearance management at your app root:

```tsx
import { useAppearance } from "@telegraph/appearance";
import { useEffect } from "react";

export const App = () => {
  const { setAppearance } = useAppearance();

  useEffect(() => {
    // Initialize from localStorage or system preference
    const savedAppearance = localStorage.getItem("appearance");
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    setAppearance(savedAppearance || systemPreference);
  }, [setAppearance]);

  return (
    <div className="tgph">
      <YourApp />
    </div>
  );
};
```

### Custom Theme Context

Create a theme provider for your application:

```tsx
import { useAppearance } from "@telegraph/appearance";
import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const appearance = useAppearance();

  // Save to localStorage when appearance changes
  useEffect(() => {
    localStorage.setItem("appearance", appearance.appearance);
  }, [appearance.appearance]);

  return (
    <ThemeContext.Provider value={appearance}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

## Examples

### Basic Theme Toggle

```tsx
import { useAppearance } from "@telegraph/appearance";

export const ThemeToggle = () => {
  const { appearance, toggleAppearance } = useAppearance();

  return (
    <button
      onClick={toggleAppearance}
      aria-label={`Switch to ${appearance === "light" ? "dark" : "light"} mode`}
    >
      {appearance === "light" ? "🌙" : "☀️"}
    </button>
  );
};
```

### Sectioned Appearance

```tsx
import { Appearance } from "@telegraph/appearance";
import { Box } from "@telegraph/layout";

export const MixedAppearanceLayout = () => (
  <div>
    <Box>This uses global appearance</Box>

    <Appearance appearance="dark">
      <Box>This section is always dark</Box>
    </Appearance>

    <InvertedAppearance>
      <Box>This section uses inverted appearance</Box>
    </InvertedAppearance>
  </div>
);
```

### Complete Theme System

```tsx
import { useAppearance } from "@telegraph/appearance";
import { useEffect } from "react";

export const ThemeSystem = ({ children }) => {
  const { appearance, setAppearance } = useAppearance();

  // Initialize from stored preference or system
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setAppearance(stored);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setAppearance(prefersDark ? "dark" : "light");
    }
  }, [setAppearance]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("theme", appearance);
    document.documentElement.setAttribute("data-tgph-appearance", appearance);
  }, [appearance]);

  return <>{children}</>;
};
```

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
