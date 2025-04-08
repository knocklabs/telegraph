![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/layout.svg)](https://www.npmjs.com/package/@telegraph/layout)

# @telegraph/layout

> Flexible layout primitives for building consistent and responsive layouts with polymorphic components.

## Installation

```bash
npm install @telegraph/layout
```

### Add stylesheet

```css
@import "@telegraph/layout";
```

## Usage

### Box Component

The `Box` component is a polymorphic layout primitive that can render as any HTML element or component.

```tsx
import { Box } from "@telegraph/layout";

export const BoxExamples = () => {
  return (
    <>
      {/* Basic div with padding */}
      <Box p="4">Content</Box>

      {/* As a button */}
      <Box as="button" p="2" onClick={() => console.log("Clicked!")}>
        Click me
      </Box>

      {/* As a link */}
      <Box as="a" href="/" p="2" color="accent">
        Home
      </Box>

      {/* As a custom component */}
      <Box as={CustomComponent} customProp="value" p="4">
        Custom content
      </Box>
    </>
  );
};
```

### Stack Component

The `Stack` component provides an easy way to manage spacing between elements.

```tsx
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const StackExamples = () => {
  return (
    <>
      {/* Vertical stack */}
      <Stack gap="4">
        <Text>First item</Text>
        <Text>Second item</Text>
        <Text>Third item</Text>
      </Stack>

      {/* Horizontal stack */}
      <Stack direction="row" gap="2" align="center">
        <Icon icon={Lucide.User} />
        <Text>User profile</Text>
      </Stack>

      {/* Responsive stack */}
      <Stack direction={{ base: "column", md: "row" }} gap="4" wrap>
        <Card />
        <Card />
        <Card />
      </Stack>
    </>
  );
};
```

## API Reference

### Box

A polymorphic layout primitive that can be rendered as any HTML element or component.

#### Props

| Prop      | Type                | Default   | Description                       |
| --------- | ------------------- | --------- | --------------------------------- |
| `as`      | `React.ElementType` | `"div"`   | Element or component to render as |
| `variant` | `"ghost"`           | `"ghost"` | Visual variant                    |
| `p`       | `SpacingToken`      | -         | Padding on all sides              |
| `pt`      | `SpacingToken`      | -         | Padding top                       |
| `pr`      | `SpacingToken`      | -         | Padding right                     |
| `pb`      | `SpacingToken`      | -         | Padding bottom                    |
| `pl`      | `SpacingToken`      | -         | Padding left                      |
| `px`      | `SpacingToken`      | -         | Padding horizontal                |
| `py`      | `SpacingToken`      | -         | Padding vertical                  |
| `m`       | `SpacingToken`      | -         | Margin on all sides               |
| `mt`      | `SpacingToken`      | -         | Margin top                        |
| `mr`      | `SpacingToken`      | -         | Margin right                      |
| `mb`      | `SpacingToken`      | -         | Margin bottom                     |
| `ml`      | `SpacingToken`      | -         | Margin left                       |
| `mx`      | `SpacingToken`      | -         | Margin horizontal                 |
| `my`      | `SpacingToken`      | -         | Margin vertical                   |

Spacing tokens are defined in [@telegraph/tokens](https://github.com/knocklabs/telegraph/blob/main/packages/tokens/src/tokens/spacing.ts).

### Stack

A layout component for managing spacing between elements.

#### Props

| Prop        | Type                                        | Default    | Description                       |
| ----------- | ------------------------------------------- | ---------- | --------------------------------- |
| `as`        | `React.ElementType`                         | `"div"`    | Element or component to render as |
| `direction` | `"row" \| "column" \| ResponsiveValue`      | `"column"` | Stack direction                   |
| `gap`       | `SpacingToken \| ResponsiveValue`           | -          | Space between items               |
| `align`     | `"start" \| "center" \| "end" \| "stretch"` | -          | Cross-axis alignment              |
| `justify`   | `"start" \| "center" \| "end" \| "between"` | -          | Main-axis alignment               |
| `wrap`      | `boolean`                                   | `false`    | Whether items can wrap            |

## Examples

### Responsive Layout

```tsx
import { Box, Stack } from "@telegraph/layout";

export const ResponsiveLayout = () => {
  return (
    <Box p={{ base: "2", md: "4", lg: "6" }}>
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={{ base: "2", md: "4" }}
        align="center"
      >
        <Box as="aside" w={{ base: "full", md: "1/3" }}>
          Sidebar
        </Box>
        <Box as="main" flex="1">
          Main content
        </Box>
      </Stack>
    </Box>
  );
};
```

### Card Layout

```tsx
import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const Card = () => {
  return (
    <Box as="article" p="4" background="surface-1" rounded="2" shadow="1">
      <Stack gap="3">
        <Stack direction="row" gap="2" align="center">
          <Box
            as="img"
            src="/avatar.jpg"
            alt="User avatar"
            w="10"
            h="10"
            rounded="full"
          />
          <Stack gap="1">
            <Text weight="medium">John Doe</Text>
            <Text size="1" color="gray">
              Software Engineer
            </Text>
          </Stack>
        </Stack>
        <Text>Building beautiful interfaces with Telegraph</Text>
      </Stack>
    </Box>
  );
};
```

### Form Layout

```tsx
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const FormLayout = () => {
  return (
    <Stack as="form" gap="4">
      <Stack gap="1">
        <Text as="label" htmlFor="name">
          Name
        </Text>
        <Input id="name" />
      </Stack>

      <Stack gap="1">
        <Text as="label" htmlFor="email">
          Email
        </Text>
        <Input id="email" type="email" />
      </Stack>

      <Stack direction="row" gap="2" justify="end">
        <Button variant="ghost">Cancel</Button>
        <Button>Submit</Button>
      </Stack>
    </Stack>
  );
};
```
