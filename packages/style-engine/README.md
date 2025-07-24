# ⚙️ Style Engine

> CSS-in-JS styling infrastructure that powers Telegraph's design system with type-safe prop-to-CSS-variable mapping and automated CSS bundling.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/style-engine.svg)](https://www.npmjs.com/package/@telegraph/style-engine)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/style-engine)](https://bundlephobia.com/result?p=@telegraph/style-engine)
[![license](https://img.shields.io/npm/l/@telegraph/style-engine)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/style-engine
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/style-engine";
```

Via Javascript:
```tsx
import "@telegraph/style-engine/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

### PostCSS Plugin Usage

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('@telegraph/style-engine/postcss'),
    // other plugins...
  ]
};
```

```css
/* styles.css */
@telegraph tokens;
@telegraph components;

/* Your custom styles here */
.custom-component {
  color: var(--tgph-blue-9);
}
```

### Component Development

```tsx
import { getStyleProp, useStyleEngine } from "@telegraph/style-engine";

// Define CSS variable mappings
const cssVars = {
  p: {
    cssVar: "--tgph-padding",
    value: "var(--tgph-space-VARIABLE)",
    direction: "all"
  },
  bg: {
    cssVar: "--tgph-background",
    value: "var(--tgph-color-VARIABLE)"
  }
} as const;

export const StyledBox = ({ children, ...props }) => {
  const { styleProp, otherProps } = useStyleEngine({ props, cssVars });

  return (
    <div style={styleProp} {...otherProps}>
      {children}
    </div>
  );
};

// Usage
<StyledBox p="4" bg="blue-3">Styled content</StyledBox>
```

## What is the Style Engine?

The Style Engine is the foundational CSS-in-JS system that enables Telegraph's design system. It provides:

- **Prop-to-CSS Mapping**: Converts React props to CSS custom properties
- **Type Safety**: Full TypeScript support for style props
- **Design Token Integration**: Seamless integration with Telegraph tokens
- **Build-time Optimization**: PostCSS plugin for automatic CSS bundling
- **Responsive Support**: Built-in responsive breakpoint system
- **Directional Styles**: Support for shorthand directional properties

## API Reference

### `getStyleProp(params)`

Core function that processes style props and returns CSS variables.

**Parameters:**
- `params.props` - React props object including style props
- `params.cssVars` - CSS variable mappings configuration

**Returns:**
```tsx
{
  styleProp: Record<string, string>;    // CSS custom properties
  otherProps: Record<string, unknown>;  // Non-style props
  interactive: boolean;                 // Whether component has interactive styles
}
```

### `useStyleEngine(params)`

React hook wrapper around `getStyleProp` with memoization.

**Parameters:**
Same as `getStyleProp`

**Returns:**
Same as `getStyleProp`

### `tokens`

CSS variables map exported from `@telegraph/tokens`.

```tsx
import { tokens } from "@telegraph/style-engine";

// Access token values
const blueColor = tokens["--tgph-blue-9"];
```

### CSS Variable Configuration

Define how props map to CSS variables:

```tsx
type CssVarProp = {
  cssVar: string;        // CSS custom property name
  value: string;         // Value template (use VARIABLE for prop value)
  direction?: Direction; // For directional properties
  interactive?: boolean; // Mark as interactive style
};

type Direction = 
  | "x" | "y"           // Horizontal/vertical
  | "top" | "bottom" | "left" | "right"  // Individual sides
  | "all"               // All sides
  | "side-top" | "side-bottom" | "side-left" | "side-right"; // Corner sides
```

## PostCSS Plugin

The PostCSS plugin automatically includes CSS from Telegraph packages.

### At-Rules

| Rule | Description |
|------|-------------|
| `@telegraph tokens` | Include default design tokens CSS |
| `@telegraph tokens-light` | Include light theme tokens |
| `@telegraph tokens-dark` | Include dark theme tokens |
| `@telegraph components` | Include all component stylesheets |

### Configuration

```js
// postcss.config.js
const telegraphPlugin = require('@telegraph/style-engine/postcss');

module.exports = {
  plugins: [
    telegraphPlugin(),
    require('autoprefixer'),
    // other plugins...
  ]
};
```

### Usage in CSS

```css
/* Base tokens (always include first) */
@telegraph tokens;

/* Theme-specific tokens */
@telegraph tokens-light;
@telegraph tokens-dark;

/* All component styles */
@telegraph components;

/* Your custom styles */
.my-component {
  background: var(--tgph-gray-2);
  padding: var(--tgph-space-3);
  border-radius: var(--tgph-radius-2);
}
```

## Advanced Usage

### Building Custom Components

```tsx
import { useStyleEngine, type CssVarProp } from "@telegraph/style-engine";

// Define comprehensive CSS variable mappings
const cssVars = {
  // Spacing
  p: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "all" },
  pt: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "top" },
  pr: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "right" },
  pb: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "bottom" },
  pl: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "left" },
  px: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "x" },
  py: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "y" },
  
  // Margin
  m: { cssVar: "--tgph-margin", value: "var(--tgph-space-VARIABLE)", direction: "all" },
  mt: { cssVar: "--tgph-margin", value: "var(--tgph-space-VARIABLE)", direction: "top" },
  // ... more margin variants
  
  // Colors
  bg: { cssVar: "--tgph-background", value: "var(--tgph-color-VARIABLE)" },
  color: { cssVar: "--tgph-color", value: "var(--tgph-color-VARIABLE)" },
  
  // Layout
  w: { cssVar: "--tgph-width", value: "VARIABLE" },
  h: { cssVar: "--tgph-height", value: "VARIABLE" },
  
  // Interactive states
  hoverBg: { 
    cssVar: "--tgph-hover-background", 
    value: "var(--tgph-color-VARIABLE)",
    interactive: true 
  }
} as const;

type StyledBoxProps = {
  p?: string;
  pt?: string;
  pr?: string;
  pb?: string;
  pl?: string;
  px?: string;
  py?: string;
  m?: string;
  mt?: string;
  bg?: string;
  color?: string;
  w?: string;
  h?: string;
  hoverBg?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const StyledBox = ({ children, ...props }: StyledBoxProps) => {
  const { styleProp, otherProps, interactive } = useStyleEngine({ 
    props, 
    cssVars 
  });

  return (
    <div 
      className={interactive ? "tgph-interactive" : undefined}
      style={styleProp} 
      {...otherProps}
    >
      {children}
    </div>
  );
};
```

### Responsive Styles

```tsx
import { RESPONSIVE_STYLE_PROPS } from "@telegraph/style-engine";

// Define responsive CSS variables
const responsiveCssVars = {
  p: {
    cssVar: "--tgph-padding",
    value: "var(--tgph-space-VARIABLE)",
    direction: "all"
  }
} as const;

// Responsive component
export const ResponsiveBox = ({ children, ...props }) => {
  const { styleProp, otherProps } = useStyleEngine({ 
    props, 
    cssVars: responsiveCssVars 
  });

  return (
    <div 
      style={{
        ...styleProp,
        // Add responsive overrides
        [`@media ${RESPONSIVE_STYLE_PROPS.conditions.md["@media"]}`]: {
          "--tgph-padding": "var(--tgph-space-6)"
        }
      }} 
      {...otherProps}
    >
      {children}
    </div>
  );
};
```

### Theme Integration

```tsx
import { tokens } from "@telegraph/style-engine";

// Create theme-aware components
const createThemedCssVars = (theme: 'light' | 'dark') => ({
  bg: {
    cssVar: "--tgph-background",
    value: theme === 'dark' 
      ? "var(--tgph-gray-1-dark)" 
      : "var(--tgph-gray-1-light)"
  },
  color: {
    cssVar: "--tgph-color",
    value: theme === 'dark'
      ? "var(--tgph-gray-12-dark)"
      : "var(--tgph-gray-12-light)"
  }
});

export const ThemedBox = ({ theme = 'light', ...props }) => {
  const cssVars = createThemedCssVars(theme);
  const { styleProp, otherProps } = useStyleEngine({ props, cssVars });

  return <div style={styleProp} {...otherProps} />;
};
```

### Build Integration

#### Webpack

```js
// webpack.config.js
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('@telegraph/style-engine/postcss'),
                  require('autoprefixer')
                ]
              }
            }
          }
        ]
      }
    ]
  }
};
```

#### Vite

```js
// vite.config.js
import { defineConfig } from 'vite';
import telegraphPlugin from '@telegraph/style-engine/postcss';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        telegraphPlugin(),
        require('autoprefixer')
      ]
    }
  }
});
```

#### Next.js

```js
// next.config.js
module.exports = {
  experimental: {
    postcss: {
      plugins: [
        require('@telegraph/style-engine/postcss'),
        require('autoprefixer')
      ]
    }
  }
};
```

### Performance Optimization

```tsx
// Memoize CSS variable definitions
const cssVars = useMemo(() => ({
  p: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)" },
  bg: { cssVar: "--tgph-background", value: "var(--tgph-color-VARIABLE)" }
}), []);

// Use callback for complex prop processing
const processedProps = useCallback((props) => {
  return getStyleProp({ props, cssVars });
}, [cssVars]);
```

### Custom Directional Logic

```tsx
// Custom direction handling
const customCssVars = {
  borderRadius: {
    cssVar: "--tgph-border-radius",
    value: "var(--tgph-radius-VARIABLE)",
    direction: "side-top" // Affects top-left and top-right corners
  },
  shadowDirection: {
    cssVar: "--tgph-box-shadow",
    value: "VARIABLE 4px 8px rgba(0,0,0,0.1)", // Custom shadow template
    direction: "x" // Horizontal shadow direction
  }
} as const;
```

## Design Tokens & Styling

The Style Engine integrates deeply with Telegraph design tokens:

- **Color System**: `var(--tgph-blue-9)`, `var(--tgph-gray-3)`, etc.
- **Spacing Scale**: `var(--tgph-space-1)` through `var(--tgph-space-12)`
- **Typography**: Font sizes, weights, and line heights
- **Radius Scale**: Border radius values
- **Shadows**: Box shadow definitions
- **Breakpoints**: Responsive media query breakpoints

### Token Usage

```css
.custom-component {
  /* Spacing tokens */
  padding: var(--tgph-space-4);
  margin: var(--tgph-space-2) var(--tgph-space-3);
  
  /* Color tokens */
  background: var(--tgph-blue-3);
  color: var(--tgph-blue-11);
  border: 1px solid var(--tgph-blue-6);
  
  /* Typography tokens */
  font-size: var(--tgph-font-size-2);
  line-height: var(--tgph-line-height-2);
  
  /* Layout tokens */
  border-radius: var(--tgph-radius-2);
  box-shadow: var(--tgph-shadow-2);
}
```

## Build Process

The Style Engine PostCSS plugin performs the following optimizations:

1. **Dependency Detection**: Scans package.json for Telegraph dependencies
2. **CSS Extraction**: Extracts CSS from each Telegraph package's dist/css directory
3. **Bundle Creation**: Combines all CSS into a single optimized bundle
4. **Token Resolution**: Resolves design token references
5. **Duplicate Removal**: Eliminates duplicate CSS rules
6. **Minification**: Optimizes final CSS output

## Testing

### Testing Style Engine Components

```tsx
import { render } from "@testing-library/react";
import { getStyleProp } from "@telegraph/style-engine";

describe("Style Engine", () => {
  test("processes style props correctly", () => {
    const cssVars = {
      p: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)" }
    };
    
    const { styleProp, otherProps } = getStyleProp({
      props: { p: "4", onClick: jest.fn() },
      cssVars
    });

    expect(styleProp).toEqual({
      "--tgph-padding": "var(--tgph-space-4)"
    });
    expect(otherProps).toEqual({
      onClick: expect.any(Function)
    });
  });

  test("handles directional properties", () => {
    const cssVars = {
      px: { 
        cssVar: "--tgph-padding", 
        value: "var(--tgph-space-VARIABLE)", 
        direction: "x" 
      }
    };
    
    const { styleProp } = getStyleProp({
      props: { px: "2" },
      cssVars
    });

    expect(styleProp["--tgph-padding"]).toBe("0 var(--tgph-space-2) 0 var(--tgph-space-2)");
  });
});
```

### Testing PostCSS Plugin

```js
// test-postcss.js
const postcss = require('postcss');
const telegraphPlugin = require('@telegraph/style-engine/postcss');

test('processes @telegraph rules', async () => {
  const input = `
    @telegraph tokens;
    @telegraph components;
    
    .custom {
      color: red;
    }
  `;

  const result = await postcss([telegraphPlugin()]).process(input, {
    from: undefined
  });

  expect(result.css).toContain('--tgph-');
  expect(result.css).not.toContain('@telegraph');
});
```

## Troubleshooting

### Common Issues

**CSS Variables Not Working**
```tsx
// Ensure tgph class is on root element
<div className="tgph">
  <YourComponent />
</div>
```

**PostCSS Plugin Errors**
```js
// Check Telegraph packages are installed
npm ls @telegraph/tokens @telegraph/button
```

**Type Errors with CSS Variables**
```tsx
// Ensure cssVars object uses 'as const'
const cssVars = {
  p: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)" }
} as const; // <- Important!
```

### Debug Mode

```js
// Enable debug logging
process.env.DEBUG = 'telegraph:style-engine';

// Or in PostCSS config
module.exports = {
  plugins: [
    require('@telegraph/style-engine/postcss')({
      debug: true
    })
  ]
};
```

## Examples

### Basic Example

```tsx
import { useStyleEngine } from "@telegraph/style-engine";

const cssVars = {
  p: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)" },
  bg: { cssVar: "--tgph-background", value: "var(--tgph-color-VARIABLE)" }
} as const;

export const SimpleBox = (props) => {
  const { styleProp, otherProps } = useStyleEngine({ props, cssVars });
  
  return <div style={styleProp} {...otherProps} />;
};

// Usage
<SimpleBox p="4" bg="blue-3">Content</SimpleBox>
```

### Advanced Example

```tsx
import { useStyleEngine, RESPONSIVE_STYLE_PROPS } from "@telegraph/style-engine";

const advancedCssVars = {
  // Spacing
  p: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "all" },
  pt: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "top" },
  pr: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "right" },
  pb: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "bottom" },
  pl: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "left" },
  px: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "x" },
  py: { cssVar: "--tgph-padding", value: "var(--tgph-space-VARIABLE)", direction: "y" },
  
  // Colors & States
  bg: { cssVar: "--tgph-background", value: "var(--tgph-color-VARIABLE)" },
  hoverBg: { cssVar: "--tgph-hover-bg", value: "var(--tgph-color-VARIABLE)", interactive: true },
  
  // Layout
  w: { cssVar: "--tgph-width", value: "VARIABLE" },
  h: { cssVar: "--tgph-height", value: "VARIABLE" },
  rounded: { cssVar: "--tgph-border-radius", value: "var(--tgph-radius-VARIABLE)" }
} as const;

export const AdvancedBox = ({ children, ...props }) => {
  const { styleProp, otherProps, interactive } = useStyleEngine({ 
    props, 
    cssVars: advancedCssVars 
  });

  return (
    <div 
      className={interactive ? "tgph-interactive" : undefined}
      style={{
        ...styleProp,
        transition: interactive ? "all 0.2s ease" : undefined
      }}
      {...otherProps}
    >
      {children}
    </div>
  );
};

// Usage
<AdvancedBox 
  p="4" 
  px="6" 
  bg="blue-3" 
  hoverBg="blue-4" 
  rounded="2"
  w="200px"
>
  Interactive Content
</AdvancedBox>
```

### Real-world Example

```tsx
// CustomButton.tsx
import { useStyleEngine } from "@telegraph/style-engine";
import { forwardRef } from "react";

const buttonCssVars = {
  size: {
    cssVar: "--tgph-button-size",
    value: "var(--tgph-button-size-VARIABLE)"
  },
  variant: {
    cssVar: "--tgph-button-variant",
    value: "var(--tgph-button-variant-VARIABLE)"
  },
  p: {
    cssVar: "--tgph-padding",
    value: "var(--tgph-space-VARIABLE)",
    direction: "all"
  }
} as const;

type CustomButtonProps = {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  p?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, ...props }, ref) => {
    const { styleProp, otherProps, interactive } = useStyleEngine({
      props,
      cssVars: buttonCssVars
    });

    return (
      <button
        ref={ref}
        className={`custom-button ${interactive ? "interactive" : ""}`}
        style={styleProp}
        {...otherProps}
      >
        {children}
      </button>
    );
  }
);

// Corresponding CSS
/* button.css */
@telegraph tokens;

.custom-button {
  background: var(--tgph-button-variant, var(--tgph-blue-9));
  padding: var(--tgph-padding, var(--tgph-space-2) var(--tgph-space-3));
  font-size: var(--tgph-button-size, var(--tgph-font-size-1));
  border-radius: var(--tgph-radius-2);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-button.interactive:hover {
  background: var(--tgph-blue-10);
}
```

## References

- [Telegraph Tokens](../tokens/README.md) - Design token system
- [PostCSS Documentation](https://postcss.org/) - PostCSS ecosystem
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) - CSS variables
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this package:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Test changes: `pnpm test`
5. Build: `pnpm build`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
