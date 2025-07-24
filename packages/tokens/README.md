# 🎨 Design Tokens

> Complete design token system providing consistent colors, spacing, typography, and layout values for the Telegraph design system.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/tokens.svg)](https://www.npmjs.com/package/@telegraph/tokens)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/tokens)](https://bundlephobia.com/result?p=@telegraph/tokens)
[![license](https://img.shields.io/npm/l/@telegraph/tokens)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/tokens
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/tokens";
```

Via Javascript:

```tsx
import "@telegraph/tokens/dark.css";
import "@telegraph/tokens/default.css";
import "@telegraph/tokens/light.css";
```

> **Note**: Include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```css
/* Using tokens in CSS */
.my-component {
  background: var(--tgph-blue-3);
  color: var(--tgph-blue-11);
  padding: var(--tgph-space-4);
  border-radius: var(--tgph-radius-2);
  font-size: var(--tgph-font-size-2);
}
```

```tsx
// Using tokens in JavaScript
import { tokens } from "@telegraph/tokens";

const MyComponent = () => (
  <div
    style={{
      background: tokens["--tgph-blue-3"],
      color: tokens["--tgph-blue-11"],
      padding: tokens["--tgph-space-4"],
      borderRadius: tokens["--tgph-radius-2"],
      fontSize: tokens["--tgph-font-size-2"],
    }}
  >
    Styled with tokens
  </div>
);
```

## What are Design Tokens?

Design tokens are the atomic values of a design system. They store visual design decisions such as colors, spacing, typography scale, and more. Telegraph tokens provide:

- **Consistency**: Unified visual language across all components
- **Maintainability**: Single source of truth for design values
- **Scalability**: Easy theme changes and brand customization
- **Accessibility**: Built-in contrast ratios and accessibility considerations
- **Multi-platform**: Usable across web, mobile, and other platforms

## Token Categories

### Color System

Telegraph uses a semantic color system with 12-step scales for each color, providing optimal contrast ratios and visual hierarchy.

#### Primary Colors

| Token            | Light Value | Dark Value | Usage                 |
| ---------------- | ----------- | ---------- | --------------------- |
| `--tgph-blue-1`  | `#fbfdff`   | `#0d1419`  | Subtle backgrounds    |
| `--tgph-blue-3`  | `#e1f0ff`   | `#1e2a35`  | Component backgrounds |
| `--tgph-blue-6`  | `#70b9ff`   | `#3d6b8c`  | Borders, separators   |
| `--tgph-blue-9`  | `#0066cc`   | `#4a9eff`  | Primary actions       |
| `--tgph-blue-11` | `#004499`   | `#70b9ff`  | Text, high contrast   |
| `--tgph-blue-12` | `#002244`   | `#c2e5ff`  | Headings, emphasis    |

#### Semantic Colors

| Color    | Scale | Primary Use Cases                      |
| -------- | ----- | -------------------------------------- |
| `gray`   | 1-12  | Neutral backgrounds, text, borders     |
| `red`    | 1-12  | Errors, destructive actions, alerts    |
| `green`  | 1-12  | Success states, positive actions       |
| `yellow` | 1-12  | Warnings, caution states               |
| `purple` | 1-12  | Secondary brand, special features      |
| `accent` | 1-12  | Contextual highlights, call-to-actions |

### Spacing Scale

Consistent spacing system based on a 4px grid with exponential scaling.

| Token             | Value  | Rem       | Usage                          |
| ----------------- | ------ | --------- | ------------------------------ |
| `--tgph-space-1`  | `4px`  | `0.25rem` | Minimal spacing, tight layouts |
| `--tgph-space-2`  | `8px`  | `0.5rem`  | Small gaps, compact components |
| `--tgph-space-3`  | `12px` | `0.75rem` | Component padding              |
| `--tgph-space-4`  | `16px` | `1rem`    | Standard spacing unit          |
| `--tgph-space-5`  | `20px` | `1.25rem` | Comfortable spacing            |
| `--tgph-space-6`  | `24px` | `1.5rem`  | Section spacing                |
| `--tgph-space-8`  | `32px` | `2rem`    | Large gaps                     |
| `--tgph-space-12` | `48px` | `3rem`    | Major layout spacing           |

### Typography Scale

Type system with optimal line heights and sizes for web interfaces.

| Token                | Size   | Line Height | Usage               |
| -------------------- | ------ | ----------- | ------------------- |
| `--tgph-font-size-0` | `12px` | `16px`      | Captions, meta text |
| `--tgph-font-size-1` | `14px` | `20px`      | Body text, labels   |
| `--tgph-font-size-2` | `16px` | `24px`      | Default body text   |
| `--tgph-font-size-3` | `18px` | `26px`      | Emphasized text     |
| `--tgph-font-size-4` | `20px` | `28px`      | Small headings      |
| `--tgph-font-size-5` | `24px` | `32px`      | Section headings    |
| `--tgph-font-size-6` | `30px` | `38px`      | Page headings       |
| `--tgph-font-size-7` | `36px` | `44px`      | Large headings      |
| `--tgph-font-size-8` | `48px` | `56px`      | Display text        |
| `--tgph-font-size-9` | `60px` | `68px`      | Hero text           |

### Border Radius

Consistent corner rounding for components and layouts.

| Token                | Value    | Usage                    |
| -------------------- | -------- | ------------------------ |
| `--tgph-radius-1`    | `3px`    | Small components, badges |
| `--tgph-radius-2`    | `6px`    | Standard components      |
| `--tgph-radius-3`    | `9px`    | Cards, panels            |
| `--tgph-radius-4`    | `12px`   | Large components         |
| `--tgph-radius-5`    | `15px`   | Prominent elements       |
| `--tgph-radius-6`    | `19px`   | Extra large radius       |
| `--tgph-radius-full` | `9999px` | Circular elements        |

### Shadows

Elevation system for depth and hierarchy.

| Token             | Value                         | Usage               |
| ----------------- | ----------------------------- | ------------------- |
| `--tgph-shadow-1` | `0 1px 2px rgba(0,0,0,0.05)`  | Subtle depth        |
| `--tgph-shadow-2` | `0 2px 4px rgba(0,0,0,0.1)`   | Component elevation |
| `--tgph-shadow-3` | `0 4px 8px rgba(0,0,0,0.12)`  | Card elevation      |
| `--tgph-shadow-4` | `0 8px 16px rgba(0,0,0,0.15)` | Modal, dropdown     |
| `--tgph-shadow-5` | `0 16px 32px rgba(0,0,0,0.2)` | Maximum elevation   |

### Breakpoints

Responsive design breakpoints for consistent layouts.

| Token                   | Value    | Usage          |
| ----------------------- | -------- | -------------- |
| `--tgph-breakpoint-xs`  | `480px`  | Mobile devices |
| `--tgph-breakpoint-sm`  | `640px`  | Small tablets  |
| `--tgph-breakpoint-md`  | `768px`  | Tablets        |
| `--tgph-breakpoint-lg`  | `1024px` | Laptops        |
| `--tgph-breakpoint-xl`  | `1280px` | Desktops       |
| `--tgph-breakpoint-2xl` | `1536px` | Large screens  |

## Usage Patterns

### Basic CSS Implementation

```css
/* Component styling with tokens */
.card {
  background: var(--tgph-gray-1);
  border: 1px solid var(--tgph-gray-6);
  border-radius: var(--tgph-radius-3);
  padding: var(--tgph-space-4);
  box-shadow: var(--tgph-shadow-2);
}

.card-title {
  color: var(--tgph-gray-12);
  font-size: var(--tgph-font-size-4);
  line-height: var(--tgph-line-height-4);
  margin-bottom: var(--tgph-space-2);
}

.card-content {
  color: var(--tgph-gray-11);
  font-size: var(--tgph-font-size-2);
  line-height: var(--tgph-line-height-2);
}
```

### JavaScript/TypeScript Usage

```tsx
import { tokens } from "@telegraph/tokens";

// Access individual tokens
const primaryColor = tokens["--tgph-blue-9"];
const spacing = tokens["--tgph-space-4"];

// Use in React styles
const Button = ({ children, variant = "primary" }) => {
  const styles = {
    backgroundColor:
      variant === "primary" ? tokens["--tgph-blue-9"] : tokens["--tgph-gray-3"],
    color:
      variant === "primary"
        ? tokens["--tgph-blue-contrast"]
        : tokens["--tgph-gray-11"],
    padding: `${tokens["--tgph-space-2"]} ${tokens["--tgph-space-4"]}`,
    borderRadius: tokens["--tgph-radius-2"],
    border: "none",
    fontSize: tokens["--tgph-font-size-2"],
  };

  return <button style={styles}>{children}</button>;
};
```

### Theme Customization

```css
/* Light theme overrides */
.tgph[data-theme="light"] {
  --tgph-gray-1: #ffffff;
  --tgph-gray-2: #fcfcfc;
  --tgph-gray-12: #1a1a1a;
}

/* Dark theme overrides */
.tgph[data-theme="dark"] {
  --tgph-gray-1: #0a0a0a;
  --tgph-gray-2: #111111;
  --tgph-gray-12: #ffffff;
}

/* Custom brand colors */
.tgph[data-brand="custom"] {
  --tgph-accent-9: #ff6b35;
  --tgph-accent-contrast: #ffffff;
}
```

## Advanced Usage

### Token Generation Scripts

```javascript
// scripts/generate-tokens.js
const fs = require("fs");
const tokens = require("@telegraph/tokens");

// Generate CSS custom properties
const generateCSS = (tokens) => {
  const css = Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `.tgph {\n${css}\n}`;
};

// Generate TypeScript definitions
const generateTypes = (tokens) => {
  const keys = Object.keys(tokens)
    .map((key) => `"${key}"`)
    .join(" | ");
  return `export type TokenKey = ${keys};\n`;
};

// Write files
fs.writeFileSync("dist/tokens.css", generateCSS(tokens));
fs.writeFileSync("dist/tokens.d.ts", generateTypes(tokens));
```

### CSS-in-JS Integration

```tsx
// Styled Components integration
// Emotion integration
import { css } from "@emotion/react";
import { tokens } from "@telegraph/tokens";
import styled from "styled-components";

const StyledCard = styled.div`
  background: ${tokens["--tgph-gray-1"]};
  border: 1px solid ${tokens["--tgph-gray-6"]};
  border-radius: ${tokens["--tgph-radius-3"]};
  padding: ${tokens["--tgph-space-4"]};
  box-shadow: ${tokens["--tgph-shadow-2"]};
`;

const cardStyles = css`
  background: ${tokens["--tgph-gray-1"]};
  border: 1px solid ${tokens["--tgph-gray-6"]};
  border-radius: ${tokens["--tgph-radius-3"]};
  padding: ${tokens["--tgph-space-4"]};
  box-shadow: ${tokens["--tgph-shadow-2"]};
`;
```

### Design System Documentation

```tsx
// Token documentation component
import { tokens } from "@telegraph/tokens";

const ColorSwatches = () => {
  const colorTokens = Object.entries(tokens)
    .filter(([key]) => key.includes("blue"))
    .map(([key, value]) => ({ key, value }));

  return (
    <div className="color-swatches">
      {colorTokens.map(({ key, value }) => (
        <div key={key} className="swatch">
          <div className="swatch-color" style={{ backgroundColor: value }} />
          <div className="swatch-info">
            <code>{key}</code>
            <span>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Design Tokens & Styling

The tokens package is the foundation of Telegraph's design system:

- **Semantic Naming**: Tokens use semantic names that describe their purpose
- **Scale-based Values**: Consistent mathematical relationships between values
- **Accessibility Built-in**: Color contrasts meet WCAG AA standards
- **Platform Agnostic**: Usable across web, mobile, and other platforms

### Token Naming Convention

```
--tgph-{category}-{variant}-{scale}

Examples:
--tgph-blue-9          // Color: blue, scale 9
--tgph-space-4         // Spacing: scale 4
--tgph-font-size-2     // Typography: font size scale 2
--tgph-radius-3        // Border radius: scale 3
```

### Color Contrast Guidelines

| Scale | Contrast Use          | Min Contrast |
| ----- | --------------------- | ------------ |
| 1-2   | Subtle backgrounds    | -            |
| 3-4   | Component backgrounds | 3:1          |
| 6-8   | Borders, non-text     | 3:1          |
| 9-10  | Interactive elements  | 4.5:1        |
| 11-12 | Text, high contrast   | 7:1          |

## Accessibility

- ✅ **WCAG Compliance**: All color combinations meet WCAG AA/AAA standards
- ✅ **High Contrast Support**: Compatible with high contrast modes
- ✅ **Color Independence**: Never rely solely on color to convey information
- ✅ **Consistent Focus**: Focus indicators use consistent color and spacing
- ✅ **Reduced Motion**: Respects user's motion preferences

### Best Practices

1. **Use Semantic Scales**: Choose the appropriate scale for your use case
2. **Maintain Contrast**: Ensure sufficient contrast between foreground and background
3. **Test with Users**: Validate accessibility with real users and tools
4. **Document Usage**: Clearly document when and how to use each token
5. **Stay Consistent**: Use tokens consistently across your application

## Examples

### Basic Example

```css
/* Simple component styling */
.notification {
  background: var(--tgph-blue-3);
  border: 1px solid var(--tgph-blue-6);
  color: var(--tgph-blue-11);
  padding: var(--tgph-space-3) var(--tgph-space-4);
  border-radius: var(--tgph-radius-2);
  font-size: var(--tgph-font-size-1);
}
```

### Advanced Example

```tsx
import { tokens } from "@telegraph/tokens";
import { useMemo } from "react";

export const ThemeableButton = ({
  variant = "primary",
  size = "medium",
  children,
}) => {
  const styles = useMemo(() => {
    const baseStyles = {
      border: "none",
      borderRadius: tokens["--tgph-radius-2"],
      fontFamily: "inherit",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    };

    const variantStyles = {
      primary: {
        backgroundColor: tokens["--tgph-blue-9"],
        color: tokens["--tgph-blue-contrast"],
      },
      secondary: {
        backgroundColor: tokens["--tgph-gray-3"],
        color: tokens["--tgph-gray-11"],
        border: `1px solid ${tokens["--tgph-gray-6"]}`,
      },
      ghost: {
        backgroundColor: "transparent",
        color: tokens["--tgph-gray-11"],
      },
    };

    const sizeStyles = {
      small: {
        padding: `${tokens["--tgph-space-1"]} ${tokens["--tgph-space-3"]}`,
        fontSize: tokens["--tgph-font-size-0"],
      },
      medium: {
        padding: `${tokens["--tgph-space-2"]} ${tokens["--tgph-space-4"]}`,
        fontSize: tokens["--tgph-font-size-1"],
      },
      large: {
        padding: `${tokens["--tgph-space-3"]} ${tokens["--tgph-space-5"]}`,
        fontSize: tokens["--tgph-font-size-2"],
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
    };
  }, [variant, size]);

  return <button style={styles}>{children}</button>;
};
```

### Real-world Example

```tsx
import { tokens } from "@telegraph/tokens";

export const DashboardCard = ({ title, value, trend, trendValue }) => {
  const cardStyles = {
    background: tokens["--tgph-gray-1"],
    border: `1px solid ${tokens["--tgph-gray-6"]}`,
    borderRadius: tokens["--tgph-radius-3"],
    padding: tokens["--tgph-space-6"],
    boxShadow: tokens["--tgph-shadow-2"],
    transition: "all 0.2s ease",
  };

  const titleStyles = {
    color: tokens["--tgph-gray-11"],
    fontSize: tokens["--tgph-font-size-1"],
    fontWeight: "500",
    marginBottom: tokens["--tgph-space-2"],
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const valueStyles = {
    color: tokens["--tgph-gray-12"],
    fontSize: tokens["--tgph-font-size-7"],
    fontWeight: "700",
    lineHeight: tokens["--tgph-line-height-7"],
    marginBottom: tokens["--tgph-space-3"],
  };

  const trendStyles = {
    display: "flex",
    alignItems: "center",
    gap: tokens["--tgph-space-2"],
    fontSize: tokens["--tgph-font-size-0"],
    fontWeight: "500",
    color:
      trend === "up"
        ? tokens["--tgph-green-11"]
        : trend === "down"
          ? tokens["--tgph-red-11"]
          : tokens["--tgph-gray-11"],
  };

  const indicatorStyles = {
    width: tokens["--tgph-space-2"],
    height: tokens["--tgph-space-2"],
    borderRadius: tokens["--tgph-radius-full"],
    backgroundColor:
      trend === "up"
        ? tokens["--tgph-green-9"]
        : trend === "down"
          ? tokens["--tgph-red-9"]
          : tokens["--tgph-gray-9"],
  };

  return (
    <div style={cardStyles}>
      <div style={titleStyles}>{title}</div>
      <div style={valueStyles}>{value}</div>
      <div style={trendStyles}>
        <div style={indicatorStyles} />
        <span>{trendValue}</span>
        <span>vs last month</span>
      </div>
    </div>
  );
};

// Usage
export const Dashboard = () => (
  <div className="dashboard-grid">
    <DashboardCard
      title="Total Revenue"
      value="$24,750"
      trend="up"
      trendValue="+12.5%"
    />
    <DashboardCard
      title="Active Users"
      value="1,432"
      trend="up"
      trendValue="+8.2%"
    />
    <DashboardCard
      title="Conversion Rate"
      value="3.24%"
      trend="down"
      trendValue="-2.1%"
    />
  </div>
);
```

## References

- [Design System Documentation](https://github.com/knocklabs/telegraph)
- [Color Theory and Accessibility](https://webaim.org/resources/contrastchecker/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Design Tokens W3C Specification](https://design-tokens.github.io/community-group/)
- [Radix Colors](https://www.radix-ui.com/colors)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
