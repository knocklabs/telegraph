# 🔘 Button

> Flexible button component with multiple variants, colors, and states for Telegraph design system.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/button)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/button)](https://bundlephobia.com/result?p=@telegraph/button)
[![license](https://img.shields.io/npm/l/@telegraph/button)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/button
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/button";
```

Via Javascript:

```tsx
import "@telegraph/button/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Button } from "@telegraph/button";

export const Example = () => (
  <Button variant="solid" color="accent">
    Click me
  </Button>
);
```

## Props

### `<Button>` (Default Component)

| Prop           | Type                                                                                    | Default     | Description                    |
| -------------- | --------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| `variant`      | `"solid" \| "soft" \| "outline" \| "ghost"`                                             | `"solid"`   | Visual style variant           |
| `size`         | `"0" \| "1" \| "2" \| "3"`                                                              | `"2"`       | Button size                    |
| `color`        | `"default" \| "accent" \| "gray" \| "red" \| "green" \| "blue" \| "yellow" \| "purple"` | `"default"` | Button color theme             |
| `state`        | `"default" \| "loading"`                                                                | `"default"` | Button state                   |
| `active`       | `boolean`                                                                               | `false`     | Whether button appears pressed |
| `disabled`     | `boolean`                                                                               | `false`     | Whether button is disabled     |
| `type`         | `"button" \| "submit" \| "reset"`                                                       | `"button"`  | Button type attribute          |
| `leadingIcon`  | `IconProps`                                                                             | `undefined` | Icon before text               |
| `trailingIcon` | `IconProps`                                                                             | `undefined` | Icon after text                |
| `icon`         | `IconProps`                                                                             | `undefined` | Icon-only button               |

### Icon Props Structure

```tsx
type IconProps = {
  icon: LucideIcon;
  alt: string;
};
```

### Visual Examples

```tsx
// Solid buttons (high emphasis)
<Button variant="solid" color="accent">Primary Action</Button>
<Button variant="solid" color="red">Destructive</Button>

// Soft buttons (medium emphasis)
<Button variant="soft" color="accent">Secondary Action</Button>

// Outline buttons (medium emphasis with border)
<Button variant="outline" color="gray">Neutral Action</Button>

// Ghost buttons (low emphasis)
<Button variant="ghost" color="gray">Tertiary Action</Button>
```

## Advanced Usage

### Composition Pattern

Individual parts for complete customization:

```tsx
import { Button } from "@telegraph/button";
import { Check } from "lucide-react";

export const CustomButton = () => (
  <Button.Root variant="soft" color="green" size="3">
    <Button.Icon icon={Check} alt="Success" />
    <Button.Text>Save Changes</Button.Text>
  </Button.Root>
);
```

### Loading States

```tsx
import { Button } from "@telegraph/button";
import { useState } from "react";

export const LoadingButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Button
      state={loading ? "loading" : "default"}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Saving..." : "Save"}
    </Button>
  );
};
```

### Icon Buttons

```tsx
import { Button } from "@telegraph/button";
import { Settings, ChevronRight, X } from "lucide-react";

// Icon only
<Button icon={{ icon: Settings, alt: "Settings" }} />

// With leading icon
<Button leadingIcon={{ icon: ChevronRight, alt: "" }}>
  Next Step
</Button>

// With trailing icon
<Button trailingIcon={{ icon: X, alt: "Close" }}>
  Close Dialog
</Button>
```

### Button Groups

```tsx
import { Button } from "@telegraph/button";
import { Box } from "@telegraph/layout";

export const ButtonGroup = () => (
  <Box display="flex" gap="2">
    <Button variant="outline">Cancel</Button>
    <Button variant="solid" color="accent">
      Confirm
    </Button>
  </Box>
);
```

### Using with TypeScript

```tsx
import { Button } from "@telegraph/button";
import type { ComponentProps } from "react";

type CustomButtonProps = ComponentProps<typeof Button> & {
  customProp?: string;
};

const CustomButton = ({ customProp, ...props }: CustomButtonProps) => {
  return <Button {...props} />;
};
```

### Polymorphic Usage

```tsx
import { Button } from "@telegraph/button";
import Link from "next/link";

// As a link
<Button as={Link} href="/dashboard">
  Go to Dashboard
</Button>

// As external link
<Button as="a" href="https://example.com" target="_blank">
  External Link
</Button>
```

## Accessibility

- ✅ **Keyboard Navigation**: Focusable with Tab, activated with Space/Enter
- ✅ **Screen Readers**: Proper button semantics and ARIA attributes
- ✅ **Loading States**: Disabled during loading with appropriate feedback
- ✅ **Color Contrast**: All variants meet WCAG AA standards
- ✅ **Focus Indicators**: Clear focus outlines for keyboard users

### ARIA Attributes

- `role="button"` - Implicit button role
- `aria-disabled="true"` - When disabled or loading
- `aria-pressed` - For toggle buttons (use `active` prop)
- Icon `alt` attributes for accessibility

### Best Practices

1. **Use semantic HTML**: Button renders as `<button>` by default
2. **Loading feedback**: Use `state="loading"` for async actions
3. **Icon accessibility**: Provide meaningful `alt` text for icons
4. **Keyboard support**: All buttons are keyboard accessible

## Examples

### Basic Usage

```tsx
import { Button } from "@telegraph/button";

// Simple button
<Button>Default Button</Button>

// Accent button
<Button variant="solid" color="accent">
  Primary Action
</Button>

// Destructive action
<Button variant="solid" color="red">
  Delete Item
</Button>
```

### Complex Composition

```tsx
import { Button } from "@telegraph/button";
import { Check, Loader, X } from "lucide-react";

export const ActionButtons = ({ loading, onSave, onCancel }) => (
  <div style={{ display: "flex", gap: "8px" }}>
    <Button
      variant="outline"
      onClick={onCancel}
      disabled={loading}
      leadingIcon={{ icon: X, alt: "" }}
    >
      Cancel
    </Button>

    <Button
      variant="solid"
      color="accent"
      state={loading ? "loading" : "default"}
      onClick={onSave}
      leadingIcon={loading ? undefined : { icon: Check, alt: "" }}
    >
      {loading ? "Saving..." : "Save Changes"}
    </Button>
  </div>
);
```

### Real-world Example

```tsx
import { Button } from "@telegraph/button";
import { Box } from "@telegraph/layout";
import { Download, MoreHorizontal, Share } from "lucide-react";

export const DocumentActions = ({ onDownload, onShare, onMore }) => (
  <Box display="flex" gap="2" align="center">
    <Button
      variant="ghost"
      size="1"
      icon={{ icon: Download, alt: "Download document" }}
      onClick={onDownload}
    />

    <Button
      variant="ghost"
      size="1"
      icon={{ icon: Share, alt: "Share document" }}
      onClick={onShare}
    />

    <Button
      variant="ghost"
      size="1"
      icon={{ icon: MoreHorizontal, alt: "More actions" }}
      onClick={onMore}
    />

    <Button variant="solid" color="accent">
      Edit Document
    </Button>
  </Box>
);
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/button)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
