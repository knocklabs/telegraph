# 📐 Layout

> Fundamental layout primitives: Box and Stack components for building flexible, responsive layouts.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/layout.svg)](https://www.npmjs.com/package/@telegraph/layout)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/layout)](https://bundlephobia.com/result?p=@telegraph/layout)
[![license](https://img.shields.io/npm/l/@telegraph/layout)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/layout
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/layout";
```

Via Javascript:

```tsx
import "@telegraph/layout/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Box, Stack } from "@telegraph/layout";

export const LayoutExample = () => (
  <Box p="4" bg="surface-1" rounded="2">
    <Stack direction="column" gap="3">
      <Box p="2" bg="accent-3" rounded="1">
        Header
      </Box>
      <Stack direction="row" gap="2">
        <Box flex="1" p="2" bg="gray-3" rounded="1">
          Sidebar
        </Box>
        <Box flex="3" p="2" bg="gray-2" rounded="1">
          Content
        </Box>
      </Stack>
    </Stack>
  </Box>
);
```

## API Reference

### `<Box>`

The foundational layout primitive. Renders as any HTML element with comprehensive styling props.

#### Core Props

| Prop       | Type              | Default | Description                         |
| ---------- | ----------------- | ------- | ----------------------------------- |
| `as`       | `TgphElement`     | `"div"` | HTML element or component to render |
| `children` | `React.ReactNode` | -       | Child elements                      |

#### Spacing Props

| Prop                   | Type           | Description                              |
| ---------------------- | -------------- | ---------------------------------------- |
| `p` / `padding`        | `SpacingToken` | Padding on all sides                     |
| `px` / `paddingX`      | `SpacingToken` | Horizontal padding                       |
| `py` / `paddingY`      | `SpacingToken` | Vertical padding                         |
| `pt` / `paddingTop`    | `SpacingToken` | Top padding                              |
| `pr` / `paddingRight`  | `SpacingToken` | Right padding                            |
| `pb` / `paddingBottom` | `SpacingToken` | Bottom padding                           |
| `pl` / `paddingLeft`   | `SpacingToken` | Left padding                             |
| `m` / `margin`         | `SpacingToken` | Margin on all sides (supports negatives) |
| `mx` / `marginX`       | `SpacingToken` | Horizontal margin (supports negatives)   |
| `my` / `marginY`       | `SpacingToken` | Vertical margin (supports negatives)     |
| `mt` / `marginTop`     | `SpacingToken` | Top margin (supports negatives)          |
| `mr` / `marginRight`   | `SpacingToken` | Right margin (supports negatives)        |
| `mb` / `marginBottom`  | `SpacingToken` | Bottom margin (supports negatives)       |
| `ml` / `marginLeft`    | `SpacingToken` | Left margin (supports negatives)         |

#### Visual Props

| Prop                                             | Type                              | Description                       |
| ------------------------------------------------ | --------------------------------- | --------------------------------- |
| `bg` / `backgroundColor`                         | `ColorToken`                      | Background color                  |
| `borderColor`                                    | `ColorToken`                      | Border color                      |
| `border` / `borderWidth`                         | `SpacingToken`                    | Border width on all sides         |
| `borderTop` / `borderTopWidth`                   | `SpacingToken`                    | Top border width                  |
| `borderRight` / `borderRightWidth`               | `SpacingToken`                    | Right border width                |
| `borderBottom` / `borderBottomWidth`             | `SpacingToken`                    | Bottom border width               |
| `borderLeft` / `borderLeftWidth`                 | `SpacingToken`                    | Left border width                 |
| `borderX`                                        | `SpacingToken`                    | Horizontal border width           |
| `borderY`                                        | `SpacingToken`                    | Vertical border width             |
| `borderStyle`                                    | `"solid" \| "dashed" \| "dotted"` | Border style                      |
| `rounded` / `borderRadius`                       | `RoundedToken`                    | Border radius on all corners      |
| `roundedTop` / `borderTopRadius`                 | `RoundedToken`                    | Top corners border radius         |
| `roundedBottom` / `borderBottomRadius`           | `RoundedToken`                    | Bottom corners border radius      |
| `roundedLeft` / `borderLeftRadius`               | `RoundedToken`                    | Left corners border radius        |
| `roundedRight` / `borderRightRadius`             | `RoundedToken`                    | Right corners border radius       |
| `roundedTopLeft` / `borderTopLeftRadius`         | `RoundedToken`                    | Top-left corner border radius     |
| `roundedTopRight` / `borderTopRightRadius`       | `RoundedToken`                    | Top-right corner border radius    |
| `roundedBottomLeft` / `borderBottomLeftRadius`   | `RoundedToken`                    | Bottom-left corner border radius  |
| `roundedBottomRight` / `borderBottomRightRadius` | `RoundedToken`                    | Bottom-right corner border radius |
| `shadow` / `boxShadow`                           | `ShadowToken`                     | Box shadow                        |

#### Layout Props

| Prop                 | Type                                                               | Description                                 |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `display`            | `"block" \| "inline-block" \| "inline" \| "flex" \| "inline-flex"` | Display mode                                |
| `w` / `width`        | `SpacingToken`                                                     | Width                                       |
| `h` / `height`       | `SpacingToken`                                                     | Height                                      |
| `minW` / `minWidth`  | `SpacingToken`                                                     | Minimum width                               |
| `minH` / `minHeight` | `SpacingToken`                                                     | Minimum height                              |
| `maxW` / `maxWidth`  | `SpacingToken`                                                     | Maximum width                               |
| `maxH` / `maxHeight` | `SpacingToken`                                                     | Maximum height                              |
| `position`           | `"relative" \| "absolute" \| "fixed" \| "sticky"`                  | Position type                               |
| `top`                | `SpacingToken`                                                     | Top position offset (supports negatives)    |
| `right`              | `SpacingToken`                                                     | Right position offset (supports negatives)  |
| `bottom`             | `SpacingToken`                                                     | Bottom position offset (supports negatives) |
| `left`               | `SpacingToken`                                                     | Left position offset (supports negatives)   |
| `zIndex`             | `ZIndexToken`                                                      | Z-index stack order                         |
| `overflow`           | `"hidden" \| "visible" \| "scroll" \| "auto"`                      | Overflow behavior on both axes              |
| `overflowX`          | `"hidden" \| "visible" \| "scroll" \| "auto"`                      | Horizontal overflow behavior                |
| `overflowY`          | `"hidden" \| "visible" \| "scroll" \| "auto"`                      | Vertical overflow behavior                  |
| `alignSelf`          | `CSSProperties["alignSelf"]`                                       | Override flex alignment for this item       |

#### Interactive Props

| Prop                           | Type         | Description                            |
| ------------------------------ | ------------ | -------------------------------------- |
| `hover_backgroundColor`        | `ColorToken` | Background color on hover              |
| `focus_backgroundColor`        | `ColorToken` | Background color on focus              |
| `active_backgroundColor`       | `ColorToken` | Background color when active           |
| `focus_within_backgroundColor` | `ColorToken` | Background color when child is focused |
| `hover_borderColor`            | `ColorToken` | Border color on hover                  |
| `focus_borderColor`            | `ColorToken` | Border color on focus                  |
| `active_borderColor`           | `ColorToken` | Border color when active               |
| `focus_within_borderColor`     | `ColorToken` | Border color when child is focused     |

### `<Stack>`

A flexbox container built on top of Box for creating flexible layouts.

| Prop                          | Type                                                                                            | Default        | Description          |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | -------------- | -------------------- |
| `direction` / `flexDirection` | `"row" \| "column" \| "row-reverse" \| "column-reverse"`                                        | `"row"`        | Flex direction       |
| `align` / `alignItems`        | `"flex-start" \| "flex-end" \| "center" \| "stretch" \| "baseline"`                             | `"stretch"`    | Cross-axis alignment |
| `justify` / `justifyContent`  | `"flex-start" \| "flex-end" \| "center" \| "space-between" \| "space-around" \| "space-evenly"` | `"flex-start"` | Main-axis alignment  |
| `wrap` / `flexWrap`           | `"wrap" \| "nowrap" \| "wrap-reverse"`                                                          | `"nowrap"`     | Flex wrap behavior   |
| `gap`                         | `SpacingToken`                                                                                  | `"0"`          | Gap between items    |

Stack inherits all Box props for additional styling.

## Usage Patterns

### Basic Box

```tsx
import { Box } from "@telegraph/layout";

// Simple container
<Box p="4" bg="surface-1">
  Content
</Box>

// Card-like container
<Box p="4" bg="surface-1" rounded="2" shadow="1">
  Card content
</Box>

// Interactive button-like box
<Box
  as="button"
  p="3"
  bg="accent-3"
  hover_bg="accent-4"
  rounded="1"
  onClick={handleClick}
>
  Click me
</Box>
```

### Basic Stack

```tsx
import { Stack } from "@telegraph/layout";

// Vertical stack
<Stack direction="column" gap="2">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Horizontal stack with centering
<Stack direction="row" align="center" justify="center" gap="3">
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</Stack>

// Responsive stack with wrapping
<Stack direction="row" wrap="wrap" gap="2">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
```

### Spacing System

```tsx
import { Box } from "@telegraph/layout";

// Using shorthand props
<Box p="4" m="2" px="6" py="3" />

// Using full prop names
<Box padding="4" margin="2" paddingX="6" paddingY="3" />

// Specific sides
<Box pt="2" pr="4" pb="2" pl="4" />

// Different spacing values
<Box p="0_5" m="1_5" px="2_5" /> // Fractional values
<Box p="8" m="auto" /> // Larger values and auto

// Negative margins (useful for overlapping elements)
<Box ml="-2" mt="-4" /> // Negative values
<Box mx="-3" /> // Negative horizontal margins
```

#### Negative Spacing

Negative spacing values are supported for margins and positioning properties (`top`, `left`, `right`, `bottom`). This is useful for overlapping elements or creating pull effects:

```tsx
import { Box, Stack } from "@telegraph/layout";

// Overlap avatars in a stack
<Stack direction="row">
  <Box w="10" h="10" bg="accent-3" rounded="full" />
  <Box w="10" h="10" bg="blue-3" rounded="full" ml="-2" />
  <Box w="10" h="10" bg="green-3" rounded="full" ml="-2" />
</Stack>

// Pull content into previous section
<Stack direction="column" gap="4">
  <Box p="8" bg="accent-3" rounded="2">
    Header Section
  </Box>
  <Box p="6" bg="surface-1" rounded="2" shadow="2" mt="-6">
    This card overlaps the header
  </Box>
</Stack>

// Absolute positioning with negative offsets
<Box position="relative" w="64" h="64" bg="gray-2" rounded="2">
  <Box
    position="absolute"
    top="-2"
    right="-2"
    w="8"
    h="8"
    bg="red-9"
    rounded="full"
  >
    Badge
  </Box>
</Box>
```

### Border and Radius

```tsx
import { Box } from "@telegraph/layout";

// Simple border
<Box border="px" borderColor="gray-6" />

// Specific borders
<Box borderTop="px" borderBottom="2" borderLeft="0" borderRight="0" />

// Border radius
<Box rounded="1" /> {/* Small radius */}
<Box rounded="full" /> {/* Circular */}
<Box roundedTop="2" roundedBottom="0" /> {/* Specific corners */}
```

### Colors and Backgrounds

```tsx
import { Box } from "@telegraph/layout";

// Semantic colors
<Box bg="surface-1" borderColor="gray-6" />
<Box bg="accent-3" borderColor="accent-6" />
<Box bg="red-3" borderColor="red-6" />

// Transparent and special colors
<Box bg="transparent" />
<Box bg="alpha-black-4" />
```

## Advanced Usage

### Polymorphic Components

```tsx
import { Box, Stack } from "@telegraph/layout";

// Box as different elements
<Box as="main" p="4">
  Main content
</Box>

<Box as="article" p="4" bg="surface-1">
  Article content
</Box>

<Box as="button" p="2" bg="accent-3" hover_bg="accent-4">
  Button
</Box>

// Stack as different elements
<Stack as="nav" direction="row" gap="4">
  <a href="/">Home</a>
  <a href="/about">About</a>
</Stack>

<Stack as="ul" direction="column" gap="1">
  <li>Item 1</li>
  <li>Item 2</li>
</Stack>
```

### Interactive States

```tsx
import { Box } from "@telegraph/layout";

// Hover effects
<Box
  p="3"
  bg="surface-1"
  hover_backgroundColor="surface-2"
  hover_borderColor="accent-6"
  border="px"
  borderColor="gray-6"
  rounded="2"
>
  Hover me
</Box>

// Focus effects
<Box
  as="button"
  p="3"
  bg="accent-3"
  focus_backgroundColor="accent-4"
  focus_borderColor="accent-8"
  border="px"
  borderColor="accent-6"
  rounded="2"
>
  Focus me
</Box>

// Complex interactive card
<Box
  p="4"
  bg="surface-1"
  hover_backgroundColor="surface-2"
  hover_borderColor="accent-6"
  focus_within_backgroundColor="surface-2"
  focus_within_borderColor="accent-6"
  border="px"
  borderColor="gray-6"
  rounded="2"
  shadow="1"
>
  <input placeholder="Focus me to see container change" />
</Box>
```

### Flexbox Alignment

```tsx
import { Box, Stack } from "@telegraph/layout";

// Override alignment for specific items
<Stack direction="row" align="flex-start" gap="2" h="32">
  <Box p="4" bg="gray-3" rounded="1">
    Item 1
  </Box>
  <Box p="4" bg="gray-3" rounded="1" alignSelf="center">
    Centered Item
  </Box>
  <Box p="4" bg="gray-3" rounded="1" alignSelf="flex-end">
    Bottom Item
  </Box>
</Stack>

// Practical example: Icon with multi-line text
<Stack direction="row" align="baseline" gap="2">
  <Box alignSelf="center">
    <Icon icon={Mail} />
  </Box>
  <Box>
    <Text>
      This is a long text that might wrap to multiple lines.
      The icon will stay centered vertically.
    </Text>
  </Box>
</Stack>

// Stretch item to fill container
<Stack direction="row" gap="2" h="24">
  <Box p="2" bg="gray-3" rounded="1">
    Fixed size
  </Box>
  <Box p="2" bg="gray-3" rounded="1" alignSelf="stretch">
    Stretched to fill height
  </Box>
</Stack>
```

### Complex Layouts

```tsx
import { Box, Stack } from "@telegraph/layout";

// App layout
export const AppLayout = ({ children }) => (
  <Box minH="screen" bg="surface-1">
    {/* Header */}
    <Box
      as="header"
      p="4"
      bg="surface-2"
      borderBottom="px"
      borderColor="gray-6"
    >
      <Stack direction="row" align="center" justify="between">
        <Box>Logo</Box>
        <Stack direction="row" gap="4">
          <Box>Nav item 1</Box>
          <Box>Nav item 2</Box>
        </Stack>
      </Stack>
    </Box>

    {/* Main content */}
    <Stack direction="row" minH="0" flex="1">
      {/* Sidebar */}
      <Box
        as="aside"
        w="64"
        p="4"
        bg="surface-2"
        borderRight="px"
        borderColor="gray-6"
      >
        <Stack direction="column" gap="2">
          <Box p="2" rounded="1" hover_bg="gray-3">
            Sidebar item 1
          </Box>
          <Box p="2" rounded="1" hover_bg="gray-3">
            Sidebar item 2
          </Box>
        </Stack>
      </Box>

      {/* Content */}
      <Box as="main" flex="1" p="6">
        {children}
      </Box>
    </Stack>
  </Box>
);

// Card grid
export const CardGrid = ({ items }) => (
  <Stack direction="row" wrap="wrap" gap="4">
    {items.map((item, index) => (
      <Box
        key={index}
        p="4"
        bg="surface-1"
        rounded="2"
        shadow="1"
        hover_shadow="2"
        border="px"
        borderColor="gray-6"
        hover_borderColor="accent-6"
        minW="72"
        flex="1"
      >
        {item.content}
      </Box>
    ))}
  </Stack>
);
```

### Responsive Design

```tsx
import { Box, Stack } from "@telegraph/layout";

// Mobile-first responsive layout
export const ResponsiveLayout = () => (
  <Box p={{ base: "4", md: "6", lg: "8" }}>
    <Stack
      direction={{ base: "column", md: "row" }}
      gap={{ base: "4", md: "6" }}
      align={{ base: "stretch", md: "flex-start" }}
    >
      <Box w={{ base: "full", md: "1/3" }} p="4" bg="surface-1" rounded="2">
        Sidebar content
      </Box>
      <Box w={{ base: "full", md: "2/3" }} p="4" bg="surface-1" rounded="2">
        Main content
      </Box>
    </Stack>
  </Box>
);
```

### Form Layouts

```tsx
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";

export const FormLayout = () => (
  <Box maxW="md" mx="auto" p="6">
    <Stack direction="column" gap="4">
      <Box>
        <label htmlFor="name">Name</label>
        <Input id="name" />
      </Box>

      <Box>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" />
      </Box>

      <Stack direction="row" gap="2" justify="end">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </Stack>
    </Stack>
  </Box>
);
```

### Centering Patterns

```tsx
import { Box, Stack } from "@telegraph/layout";

// Center a single item
<Box display="flex" align="center" justify="center" minH="screen">
  <Box p="8" bg="surface-1" rounded="2">
    Centered content
  </Box>
</Box>

// Center with Stack
<Stack align="center" justify="center" minH="screen">
  <Box p="8" bg="surface-1" rounded="2">
    Centered with Stack
  </Box>
</Stack>

// Center text and content
<Box textAlign="center" p="8">
  <Stack align="center" gap="4">
    <Box w="20" h="20" bg="accent-3" rounded="full" />
    <Box>
      <h2>Centered heading</h2>
      <p>Centered description</p>
    </Box>
  </Stack>
</Box>
```

### Overflow and Scrolling

```tsx
import { Box } from "@telegraph/layout";

// Hide overflow on both axes
<Box w="64" h="32" overflow="hidden" bg="surface-1" rounded="1">
  <Box w="96" h="48" bg="accent-3">
    Content larger than container
  </Box>
</Box>

// Horizontal scrolling only
<Box w="64" h="32" overflowX="scroll" overflowY="hidden" bg="surface-1" rounded="1">
  <Box w="128" h="24" bg="accent-3">
    Wide content that scrolls horizontally
  </Box>
</Box>

// Vertical scrolling only
<Box w="64" h="32" overflowX="hidden" overflowY="scroll" bg="surface-1" rounded="1">
  <Stack direction="column" gap="2" p="2">
    {Array.from({ length: 20 }, (_, i) => (
      <Box key={i} p="2" bg="gray-3" rounded="1">
        Item {i + 1}
      </Box>
    ))}
  </Stack>
</Box>

// Auto overflow (scrolls when needed)
<Box w="64" maxH="48" overflowY="auto" bg="surface-1" rounded="1" border="px" borderColor="gray-6">
  <Box p="4">
    <p>Content that might be long enough to scroll...</p>
    <p>More content...</p>
    <p>Even more content...</p>
  </Box>
</Box>

// Scrollable container with specific axes
<Box
  w="96"
  h="64"
  overflow="hidden"  // Base: hide overflow
  overflowY="scroll" // Override: allow vertical scroll
  bg="surface-1"
  rounded="2"
  border="px"
  borderColor="gray-6"
  p="4"
>
  <Stack direction="column" gap="3">
    {Array.from({ length: 20 }, (_, i) => (
      <Box key={i} p="3" bg="gray-2" rounded="1">
        Scrollable item {i + 1}
      </Box>
    ))}
  </Stack>
</Box>
```

## Design Tokens & Styling

The layout components use Telegraph design tokens for consistent styling:

### Spacing Tokens

- `"0"` → `0px`
- `"0_5"` → `2px`
- `"1"` → `4px`
- `"1_5"` → `6px`
- `"2"` → `8px`
- `"3"` → `12px`
- `"4"` → `16px`
- `"5"` → `20px`
- `"6"` → `24px`
- `"8"` → `32px`
- `"10"` → `40px`
- `"12"` → `48px`
- `"16"` → `64px`
- `"20"` → `80px`
- `"24"` → `96px`
- `"32"` → `128px`
- `"40"` → `160px`
- `"48"` → `192px`
- `"56"` → `224px`
- `"64"` → `256px`
- `"auto"` → `auto`
- `"full"` → `100%`
- `"screen"` → `100vh`/`100vw`

### Color Tokens

**Surface Colors:**

- `"surface-1"` → Primary surface
- `"surface-2"` → Secondary surface

**Semantic Colors:**

- `"accent-1"` to `"accent-12"` → Brand colors
- `"gray-1"` to `"gray-12"` → Neutral grays
- `"red-1"` to `"red-12"` → Error/danger colors
- `"green-1"` to `"green-12"` → Success colors
- `"blue-1"` to `"blue-12"` → Info colors
- `"yellow-1"` to `"yellow-12"` → Warning colors

**Special Colors:**

- `"transparent"` → Transparent
- `"alpha-black-1"` to `"alpha-black-12"` → Semi-transparent black
- `"alpha-white-1"` to `"alpha-white-12"` → Semi-transparent white

### Rounded Tokens

- `"0"` → `0px`
- `"1"` → `4px`
- `"2"` → `8px`
- `"3"` → `12px`
- `"4"` → `16px`
- `"5"` → `20px`
- `"6"` → `24px`
- `"full"` → `9999px`

### Shadow Tokens

- `"0"` → No shadow
- `"1"` → Subtle shadow
- `"2"` → Small shadow
- `"3"` → Medium shadow
- `"4"` → Large shadow
- `"inner"` → Inset shadow

## Accessibility

- ✅ **Semantic HTML**: Use appropriate `as` prop for semantic elements
- ✅ **Focus Management**: Interactive elements receive proper focus styles
- ✅ **Color Contrast**: All color combinations meet WCAG AA standards
- ✅ **Keyboard Navigation**: Interactive elements are keyboard accessible
- ✅ **Screen Reader Support**: Semantic markup aids screen reader navigation

### Accessibility Guidelines

1. **Semantic Elements**: Use appropriate HTML elements via the `as` prop
2. **Interactive States**: Ensure interactive elements have clear focus indicators
3. **Color Dependency**: Don't rely solely on color to convey information
4. **Content Structure**: Use Stack and Box to create logical content hierarchy
5. **Focus Management**: Ensure focus moves logically through interactive elements

```tsx
// ✅ Good accessibility practices
<Box as="main" p="4">
  <Box as="section" p="4">
    <h2>Section heading</h2>
    <Stack direction="column" gap="2">
      <Box as="button"
           p="2"
           bg="accent-3"
           focus_bg="accent-4"
           focus_borderColor="accent-8"
           border="px"
           borderColor="accent-6"
           rounded="1">
        Accessible button
      </Box>
    </Stack>
  </Box>
</Box>

// ❌ Poor accessibility
<Box p="4"> {/* No semantic meaning */}
  <Box as="button" bg="red-3"> {/* No focus styles */}
    Button
  </Box>
</Box>
```

### Best Practices

1. **Semantic Structure**: Use appropriate HTML elements for content structure
2. **Focus Indicators**: Always provide clear focus styles for interactive elements
3. **Logical Flow**: Arrange content in a logical order using Stack
4. **Sufficient Contrast**: Ensure text and background colors meet contrast requirements
5. **Responsive Design**: Use layout components to create mobile-friendly layouts

## Examples

### Dashboard Layout

```tsx
import { Box, Stack } from "@telegraph/layout";

export const Dashboard = () => (
  <Box minH="screen" bg="surface-1">
    {/* Top bar */}
    <Box p="4" bg="surface-2" borderBottom="px" borderColor="gray-6">
      <Stack direction="row" align="center" justify="between">
        <h1>Dashboard</h1>
        <Box as="button" p="2" bg="accent-3" rounded="1">
          Profile
        </Box>
      </Stack>
    </Box>

    {/* Main content */}
    <Box p="6">
      <Stack direction="column" gap="6">
        {/* Stats grid */}
        <Stack direction="row" gap="4" wrap="wrap">
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              p="4"
              bg="surface-1"
              rounded="2"
              shadow="1"
              border="px"
              borderColor="gray-6"
              minW="60"
              flex="1"
            >
              <Stack direction="column" gap="2">
                <Box as="h3" color="gray">
                  Metric {i}
                </Box>
                <Box as="p" fontSize="2xl" fontWeight="bold">
                  1,234
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Content sections */}
        <Stack direction="row" gap="6">
          <Box flex="2">
            <Box p="4" bg="surface-1" rounded="2" shadow="1">
              <h2>Chart Section</h2>
              <Box h="64" bg="gray-2" rounded="1" mt="4">
                Chart placeholder
              </Box>
            </Box>
          </Box>

          <Box flex="1">
            <Box p="4" bg="surface-1" rounded="2" shadow="1">
              <h2>Activity Feed</h2>
              <Stack direction="column" gap="2" mt="4">
                {[1, 2, 3].map((i) => (
                  <Box key={i} p="2" rounded="1" hover_bg="gray-2">
                    Activity item {i}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  </Box>
);
```

### Modal Dialog

```tsx
import { Box, Stack } from "@telegraph/layout";

export const Modal = ({ children, onClose }) => (
  <>
    {/* Overlay */}
    <Box
      position="fixed"
      top="0"
      left="0"
      w="full"
      h="screen"
      bg="alpha-black-8"
      zIndex="modal"
      onClick={onClose}
    />

    {/* Modal */}
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      w="full"
      maxW="md"
      bg="surface-1"
      rounded="2"
      shadow="4"
      zIndex="modal"
      p="6"
    >
      <Stack direction="column" gap="4">
        {/* Header */}
        <Stack direction="row" align="center" justify="between">
          <h2>Modal Title</h2>
          <Box
            as="button"
            w="8"
            h="8"
            rounded="1"
            hover_bg="gray-3"
            onClick={onClose}
          >
            ×
          </Box>
        </Stack>

        {/* Content */}
        <Box>{children}</Box>

        {/* Actions */}
        <Stack direction="row" gap="2" justify="end">
          <Box as="button" p="2" px="4" rounded="1" hover_bg="gray-3">
            Cancel
          </Box>
          <Box
            as="button"
            p="2"
            px="4"
            bg="accent-3"
            hover_bg="accent-4"
            rounded="1"
          >
            Confirm
          </Box>
        </Stack>
      </Stack>
    </Box>
  </>
);
```

### Card Component

```tsx
import { Box, Stack } from "@telegraph/layout";

export const Card = ({ title, description, image, actions }) => (
  <Box
    p="4"
    bg="surface-1"
    rounded="2"
    shadow="1"
    hover_shadow="2"
    border="px"
    borderColor="gray-6"
    hover_borderColor="accent-6"
    maxW="sm"
  >
    <Stack direction="column" gap="3">
      {/* Image */}
      {image && (
        <Box w="full" h="48" bg="gray-2" rounded="1" overflow="hidden">
          <img
            src={image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      )}

      {/* Content */}
      <Stack direction="column" gap="2">
        <h3>{title}</h3>
        <p>{description}</p>
      </Stack>

      {/* Actions */}
      {actions && (
        <Stack direction="row" gap="2" justify="end">
          {actions}
        </Stack>
      )}
    </Stack>
  </Box>
);
```

## References

- [Telegraph Design Tokens](https://github.com/knocklabs/telegraph/tree/main/packages/tokens)
- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/layout)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
