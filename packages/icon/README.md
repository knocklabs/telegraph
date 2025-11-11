# 🎯 Icon

> Beautiful, consistent icons from Lucide React with Telegraph design system theming.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/icon.svg)](https://www.npmjs.com/package/@telegraph/icon)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/icon)](https://bundlephobia.com/result?p=@telegraph/icon)
[![license](https://img.shields.io/npm/l/@telegraph/icon)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/icon
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/icon";
```

Via Javascript:

```tsx
import "@telegraph/icon/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Icon, Spinner } from "@telegraph/icon";
import { Bell, Settings, User } from "lucide-react";

export const IconExample = () => (
  <div>
    <Icon icon={Bell} alt="Notifications" />
    <Icon icon={User} alt="User profile" size="4" color="accent" />
    <Icon icon={Settings} aria-hidden={true} />
    <Spinner alt="Loading..." />
  </div>
);
```

## API Reference

### `<Icon>`

A wrapper around Lucide React icons that applies Telegraph design tokens.

| Prop          | Type                                                                                                                                   | Default     | Description                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------- |
| `icon`        | `LucideIcon`                                                                                                                           | required    | Lucide React icon component                     |
| `alt`         | `string`                                                                                                                               | required\*  | Alternative text for screen readers             |
| `aria-hidden` | `true`                                                                                                                                 | `undefined` | Hide from screen readers (makes `alt` optional) |
| `size`        | `"0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"`                                                                   | `"2"`       | Icon size                                       |
| `color`       | `"default" \| "gray" \| "accent" \| "red" \| "blue" \| "green" \| "yellow" \| "purple" \| "beige" \| "white" \| "black" \| "disabled"` | `"default"` | Icon color                                      |
| `variant`     | `"primary" \| "secondary"`                                                                                                             | `"primary"` | Color intensity variant                         |
| `animation`   | `"spin" \| "none"`                                                                                                                     | `"none"`    | Icon animation                                  |
| `as`          | `TgphElement`                                                                                                                          | `"span"`    | HTML element or component to render             |

\*Required unless `aria-hidden={true}` is provided

### `<Spinner>`

A specialized loading indicator component with accessibility features built in.

| Prop       | Type                                                                                                                                   | Default          | Description                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------- |
| `icon`     | `LucideIcon`                                                                                                                           | `LoaderCircle`   | Lucide React icon component         |
| `alt`      | `string`                                                                                                                               | `"Loading..."`   | Alternative text for screen readers |
| `size`     | `"0" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9"`                                                                   | `"2"`            | Icon size                           |
| `color`    | `"default" \| "gray" \| "accent" \| "red" \| "blue" \| "green" \| "yellow" \| "purple" \| "beige" \| "white" \| "black" \| "disabled"` | `"gray"`         | Icon color                          |
| `variant`  | `"primary" \| "secondary"`                                                                                                             | `"primary"`      | Color intensity variant             |
| `animation`| `"spin" \| "none"`                                                                                                                     | `"spin"`         | Icon animation                      |
| `as`       | `TgphElement`                                                                                                                          | `"span"`         | HTML element or component to render |

**Accessibility features:**
- Includes `role="status"` to identify as a status indicator
- Includes `aria-live="polite"` to announce loading state to screen readers
- Default loading text can be customized via the `alt` prop

## Usage Patterns

### Basic Icons

```tsx
import { Icon } from "@telegraph/icon";
import { Bell, Mail, Search } from "lucide-react";

// Basic usage
<Icon icon={Bell} alt="Notifications" />

// With custom size and color
<Icon icon={Mail} alt="Email" size="4" color="accent" />

// Decorative icon (hidden from screen readers)
<Icon icon={Search} aria-hidden={true} />
```

### Icon Sizes

```tsx
import { Icon } from "@telegraph/icon";
import { Star } from "lucide-react";

// Available sizes from 0-9
<Icon icon={Star} alt="Rating" size="0" /> // 12px
<Icon icon={Star} alt="Rating" size="1" /> // 14px
<Icon icon={Star} alt="Rating" size="2" /> // 16px (default)
<Icon icon={Star} alt="Rating" size="3" /> // 18px
<Icon icon={Star} alt="Rating" size="4" /> // 20px
<Icon icon={Star} alt="Rating" size="5" /> // 24px
<Icon icon={Star} alt="Rating" size="6" /> // 28px
<Icon icon={Star} alt="Rating" size="7" /> // 32px
<Icon icon={Star} alt="Rating" size="8" /> // 40px
<Icon icon={Star} alt="Rating" size="9" /> // 48px
```

### Color Variants

```tsx
import { Icon } from "@telegraph/icon";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

// Semantic colors
<Icon icon={CheckCircle} alt="Success" color="green" />
<Icon icon={AlertCircle} alt="Error" color="red" />
<Icon icon={Info} alt="Information" color="blue" />

// Brand colors
<Icon icon={Star} alt="Featured" color="accent" />

// Primary vs Secondary variants
<Icon icon={User} alt="User" color="gray" variant="primary" />   // Darker
<Icon icon={User} alt="User" color="gray" variant="secondary" /> // Lighter
```

### Animated Icons

```tsx
import { Icon } from "@telegraph/icon";
import { LoaderCircle, RefreshCw } from "lucide-react";

// Spinning loader
<Icon icon={LoaderCircle} alt="Loading" animation="spin" />

// Custom spinning icon
<Icon icon={RefreshCw} alt="Refreshing" animation="spin" color="accent" />
```

### Loading Spinners

```tsx
import { Spinner } from "@telegraph/icon";

// Basic spinner
<Spinner />

// Custom size and color
<Spinner size="4" color="accent" />

// Custom loading text
<Spinner alt="Saving changes..." />

// Different spinner icons
import { Loader2 } from "lucide-react";
<Spinner icon={Loader2} alt="Processing" />
```

## Advanced Usage

### Polymorphic Icons

Use the `as` prop to render icons as different elements:

```tsx
import { Icon } from "@telegraph/icon";
import { ExternalLink } from "lucide-react";

// As a button
<Icon
  as="button"
  icon={ExternalLink}
  alt="Open in new tab"
  onClick={() => window.open(url, '_blank')}
/>

// As a link
<Icon
  as="a"
  icon={ExternalLink}
  alt="External link"
  href="https://example.com"
  target="_blank"
/>
```

### Icon with Text

```tsx
import { Icon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Download } from "lucide-react";

export const DownloadButton = () => (
  <Stack direction="row" align="center" gap="2">
    <Icon icon={Download} alt="" aria-hidden={true} />
    <Text>Download File</Text>
  </Stack>
);
```

### Status Indicators

```tsx
import { Icon } from "@telegraph/icon";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

const StatusIcon = ({ status }: { status: string }) => {
  const statusConfig = {
    success: { icon: CheckCircle, color: "green", alt: "Success" },
    error: { icon: XCircle, color: "red", alt: "Error" },
    warning: { icon: AlertTriangle, color: "yellow", alt: "Warning" },
    pending: { icon: Clock, color: "gray", alt: "Pending" },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return <Icon {...config} />;
};
```

### Interactive Icons

```tsx
import { Icon } from "@telegraph/icon";
import { Heart } from "lucide-react";
import { useState } from "react";

export const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  return (
    <Icon
      as="button"
      icon={Heart}
      alt={liked ? "Unlike" : "Like"}
      color={liked ? "red" : "gray"}
      size="3"
      onClick={() => setLiked(!liked)}
      style={{
        cursor: "pointer",
        fill: liked ? "currentColor" : "transparent",
      }}
    />
  );
};
```

### Icon Grid Display

```tsx
import { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import * as Icons from "lucide-react";

export const IconShowcase = () => {
  const featuredIcons = [
    Icons.Bell,
    Icons.User,
    Icons.Settings,
    Icons.Search,
    Icons.Mail,
    Icons.Calendar,
    Icons.File,
    Icons.Home,
  ];

  return (
    <Stack direction="row" wrap="wrap" gap="4">
      {featuredIcons.map((IconComponent, index) => (
        <Box key={index} padding="3" border="1" rounded="2">
          <Icon
            icon={IconComponent}
            alt={IconComponent.displayName || `Icon ${index + 1}`}
            size="5"
          />
        </Box>
      ))}
    </Stack>
  );
};
```

## Design Tokens & Styling

The icon component uses Telegraph design tokens for consistent sizing and colors:

### Size Tokens

- `"0"` → `var(--tgph-spacing-3)` (12px)
- `"1"` → `var(--tgph-spacing-3_5)` (14px)
- `"2"` → `var(--tgph-spacing-4)` (16px)
- `"3"` → `1.125rem` (18px)
- `"4"` → `var(--tgph-spacing-5)` (20px)
- `"5"` → `var(--tgph-spacing-6)` (24px)
- `"6"` → `var(--tgph-spacing-7)` (28px)
- `"7"` → `var(--tgph-spacing-8)` (32px)
- `"8"` → `var(--tgph-spacing-10)` (40px)
- `"9"` → `var(--tgph-spacing-12)` (48px)

### Color Tokens

**Primary Variant (default):**

- `default` → `var(--tgph-gray-12)`
- `accent` → `var(--tgph-accent-11)`
- `red` → `var(--tgph-red-11)`
- `green` → `var(--tgph-green-11)`
- etc.

**Secondary Variant (lighter):**

- `default` → `var(--tgph-gray-11)`
- `accent` → `var(--tgph-accent-10)`
- `red` → `var(--tgph-red-10)`
- etc.

## Tree Shaking & Bundle Size

The icon package is optimized for tree shaking. Import only the icons you need:

```tsx
// ✅ Good - only imports specific icons
import { Bell, Settings, User } from "lucide-react";
// ❌ Avoid - imports entire library
import * as Icons from "lucide-react";
```

Bundle size impact:

- Base `@telegraph/icon`: ~2KB
- Each Lucide icon: ~1KB
- Total size scales with number of icons used

## Accessibility

- ✅ **Screen Reader Support**: Proper `alt` text and ARIA attributes
- ✅ **Semantic Icons**: Required `alt` prop for meaningful icons
- ✅ **Decorative Icons**: `aria-hidden` for purely visual icons
- ✅ **Interactive Icons**: Button/link semantics when interactive
- ✅ **Loading States**: Spinner component with `role="status"` and `aria-live="polite"`
- ✅ **Color Contrast**: All color variants meet WCAG AA standards

### Accessibility Guidelines

1. **Meaningful Icons**: Always provide `alt` text for icons that convey information
2. **Decorative Icons**: Use `aria-hidden={true}` for purely visual icons
3. **Interactive Icons**: Use semantic HTML (`button`, `a`) for clickable icons
4. **Loading Indicators**: Use `Spinner` component for accessible loading states
5. **Color Dependency**: Don't rely solely on color to convey information

```tsx
// ✅ Good accessibility practices
<Icon icon={Save} alt="Save document" />
<Icon icon={Star} aria-hidden={true} /> {/* Decorative */}
<Icon as="button" icon={Delete} alt="Delete item" onClick={handleDelete} />
<Spinner alt="Loading content..." /> {/* Auto-announces to screen readers */}

// ❌ Poor accessibility
<Icon icon={Save} /> {/* Missing alt text */}
<div onClick={handleDelete}>
  <Icon icon={Delete} alt="Delete" /> {/* Should be button */}
</div>
<Icon icon={LoaderCircle} animation="spin" alt="Loading" /> {/* Use Spinner instead */}
```

## TypeScript

### Icon Component Types

```tsx
import { Icon, Spinner, type LucideIcon } from "@telegraph/icon";
import type { ComponentProps } from "react";

// Extract icon props type
type IconProps = ComponentProps<typeof Icon>;
type SpinnerProps = ComponentProps<typeof Spinner>;

// Create custom icon component
type CustomIconProps = {
  iconName: LucideIcon;
  label: string;
  interactive?: boolean;
};

const CustomIcon = ({
  iconName,
  label,
  interactive,
  ...props
}: CustomIconProps) => {
  return (
    <Icon
      as={interactive ? "button" : "span"}
      icon={iconName}
      alt={label}
      {...props}
    />
  );
};

// Create loading wrapper
type LoadingWrapperProps = {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
};

const LoadingWrapper = ({
  isLoading,
  children,
  loadingText = "Loading...",
}: LoadingWrapperProps) => {
  if (isLoading) {
    return <Spinner alt={loadingText} />;
  }
  return <>{children}</>;
};
```

### Icon Type Safety

```tsx
import { Bell, User, Settings } from "lucide-react";
import type { LucideIcon } from "@telegraph/icon";

// Type-safe icon mapping
const iconMap: Record<string, LucideIcon> = {
  notifications: Bell,
  profile: User,
  settings: Settings,
} as const;

type IconName = keyof typeof iconMap;

const TypedIcon = ({ name, ...props }: { name: IconName } & Omit<IconProps, 'icon'>) => {
  return <Icon icon={iconMap[name]} {...props} />;
};

// Usage
<TypedIcon name="notifications" alt="Bell" /> // ✅ Type safe
<TypedIcon name="invalid" alt="Bell" />       // ❌ TypeScript error
```

## Examples

### Navigation Icons

```tsx
import { Icon } from "@telegraph/icon";
import { Bell, Home, Settings, User } from "lucide-react";

const Navigation = () => (
  <nav>
    <Icon as="a" href="/" icon={Home} alt="Home" />
    <Icon as="a" href="/profile" icon={User} alt="Profile" />
    <Icon as="a" href="/settings" icon={Settings} alt="Settings" />
    <Icon
      as="button"
      icon={Bell}
      alt="Notifications"
      onClick={showNotifications}
    />
  </nav>
);
```

### Status Badge

```tsx
import { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { AlertCircle, CheckCircle } from "lucide-react";

const StatusBadge = ({
  status,
  message,
}: {
  status: "success" | "error";
  message: string;
}) => (
  <Stack
    direction="row"
    align="center"
    gap="2"
    padding="2"
    background={status === "success" ? "green-2" : "red-2"}
    rounded="2"
  >
    <Icon
      icon={status === "success" ? CheckCircle : AlertCircle}
      color={status === "success" ? "green" : "red"}
      alt={status === "success" ? "Success" : "Error"}
      size="1"
    />
    <Text size="1">{message}</Text>
  </Stack>
);
```

### Icon Button Component

```tsx
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import type { LucideIcon } from "@telegraph/icon";

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "1" | "2" | "3";
  onClick?: () => void;
};

const IconButton = ({
  icon,
  label,
  variant = "ghost",
  size = "2",
  onClick,
}: IconButtonProps) => (
  <Button
    variant={variant}
    size={size}
    onClick={onClick}
    icon={{ icon, alt: label }}
  />
);

// Usage
<IconButton icon={Download} label="Download file" onClick={handleDownload} />;
```

### Loading States with Spinner

```tsx
import { Button } from "@telegraph/button";
import { Spinner } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useState } from "react";

const SaveButton = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveData();
    setIsSaving(false);
  };

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? (
        <>
          <Spinner size="1" />
          <Text>Saving...</Text>
        </>
      ) : (
        <Text>Save Changes</Text>
      )}
    </Button>
  );
};

// Loading overlay
const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <Box
      position="fixed"
      inset="0"
      display="flex"
      align="center"
      justify="center"
      background="gray-a-6"
    >
      <Stack align="center" gap="3">
        <Spinner size="6" color="accent" />
        <Text size="3" color="gray">
          Loading content...
        </Text>
      </Stack>
    </Box>
  );
};
```

## References

- [Lucide React Icons](https://lucide.dev/icons/)
- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/icon)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
