# 🧩 \<Package Name\>

> Short tagline (1 sentence) describing the component's purpose.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/\<package-name\>.svg)](https://www.npmjs.com/package/@telegraph/\<package-name\>)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/\<package-name\>)](https://bundlephobia.com/result?p=@telegraph/\<package-name\>)
[![license](https://img.shields.io/npm/l/@telegraph/\<package-name\>)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/\<package-name\>
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/\<package-name\>";
```

Via Javascript:
```tsx
import "@telegraph/\<package-name\>/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { \<Component\> } from "@telegraph/\<package-name\>";

export const Example = () => (
  <\<Component\> …props />
);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Controlled value. |
| `onValueChange` | `(value: string) => void` | `undefined` | Callback when value changes. |

## Variants & Constants

Explain any exported constants like `BUTTON_COLORS`, `BUTTON_VARIANTS`, etc.

```tsx
import { COMPONENT_COLORS } from "@telegraph/\<package-name\>";

// Available colors: 
// COMPONENT_COLORS.red, COMPONENT_COLORS.blue, etc.
```

## Advanced Usage

### Composition Patterns

Show how to compose with other Telegraph components:

```tsx
import { Box } from "@telegraph/layout";
import { \<Component\> } from "@telegraph/\<package-name\>";

export const ComposedExample = () => (
  <Box padding="4">
    <\<Component\>.\<SubComponent\> />
  </Box>
);
```

### Controlled vs Uncontrolled

```tsx
// Controlled
const [value, setValue] = useState("");
<\<Component\> value={value} onValueChange={setValue} />

// Uncontrolled  
<\<Component\> defaultValue="initial" />
```

### Using with TypeScript

```tsx
import type { \<Component\>Props } from "@telegraph/\<package-name\>";

const CustomComponent = (props: \<Component\>Props) => {
  return <\<Component\> {...props} />;
};
```

## Design Tokens & Styling

This component consumes the following design tokens:

- `--tgph-colors-\<token-name\>` - Description
- `--tgph-spacing-\<token-name\>` - Description

### Theming

```css
.tgph {
  --tgph-colors-\<component\>-background: \<custom-value\>;
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Supports arrow keys, Enter, Space, Escape
- ✅ **Screen Readers**: ARIA labels and roles properly configured
- ✅ **Focus Management**: Focus is managed correctly
- ✅ **Color Contrast**: Meets WCAG AA standards

### ARIA Attributes

- `role="\<role\>"` - Describes the component's purpose
- `aria-label` - Provides accessible name when needed
- `aria-expanded` - Indicates expanded/collapsed state

## Testing

### Testing Library Example

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { \<Component\> } from "@telegraph/\<package-name\>";

test("component works correctly", async () => {
  const user = userEvent.setup();
  
  render(<\<Component\> data-testid="component" />);
  
  const component = screen.getByTestId("component");
  expect(component).toBeInTheDocument();
  
  await user.click(component);
  // Add assertions
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render(<\<Component\> />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Examples

### Basic Example

```tsx
// Basic usage with minimal props
```

### Advanced Example  

```tsx
// Complex usage showing multiple features
```

### Real-world Example

```tsx
// Realistic usage in an application context
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/\<package\>)
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