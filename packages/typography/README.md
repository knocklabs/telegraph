![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/typography)

# @telegraph/typography

> A comprehensive typography system with semantic components for consistent text styling across your application.

## Installation

```bash
npm install @telegraph/typography
```

### Add stylesheet

```css
@import "@telegraph/typography";
```

## Usage

### Basic Usage

```tsx
import { Heading, Text } from "@telegraph/typography";

export const BasicTypography = () => {
  return (
    <>
      <Heading size="3">Welcome to Telegraph</Heading>
      <Text>A beautiful design system for modern applications.</Text>
    </>
  );
};
```

### Text Variants

```tsx
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const TextVariants = () => {
  return (
    <Stack gap="2">
      <Text size="1">Small text for captions and labels</Text>
      <Text size="2">Default text size for body content</Text>
      <Text size="3">Larger text for emphasis</Text>
      <Text size="4">Even larger text for special cases</Text>
    </Stack>
  );
};
```

### Heading Hierarchy

```tsx
import { Stack } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";

export const HeadingHierarchy = () => {
  return (
    <Stack gap="4">
      <Heading size="1">Level 1 Heading</Heading>
      <Heading size="2">Level 2 Heading</Heading>
      <Heading size="3">Level 3 Heading</Heading>
      <Heading size="4">Level 4 Heading</Heading>
      <Heading size="5">Level 5 Heading</Heading>
      <Heading size="6">Level 6 Heading</Heading>
    </Stack>
  );
};
```

### Text Colors and Weights

```tsx
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const TextStyles = () => {
  return (
    <Stack gap="2">
      <Text color="default">Default text color</Text>
      <Text color="gray">Gray text for secondary content</Text>
      <Text color="accent">Accent colored text</Text>
      <Text weight="regular">Regular weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </Stack>
  );
};
```

## API Reference

### Text

The main text component for body content, labels, and general text.

#### Props

| Prop       | Type                                                            | Default     | Description                            |
| ---------- | --------------------------------------------------------------- | ----------- | -------------------------------------- |
| `size`     | `"1" \| "2" \| "3" \| "4"`                                      | `"2"`       | Text size variant                      |
| `color`    | `"default" \| "gray" \| "accent" \| "red" \| "green" \| "blue"` | `"default"` | Text color                             |
| `weight`   | `"regular" \| "medium" \| "semibold" \| "bold"`                 | `"regular"` | Font weight                            |
| `align`    | `"left" \| "center" \| "right"`                                 | `"left"`    | Text alignment                         |
| `truncate` | `boolean`                                                       | `false`     | Whether to truncate text with ellipsis |
| `as`       | `React.ElementType`                                             | `"p"`       | HTML element to render as              |

### Heading

The heading component for section titles and content hierarchy.

#### Props

| Prop     | Type                                                            | Default      | Description               |
| -------- | --------------------------------------------------------------- | ------------ | ------------------------- |
| `size`   | `"1" \| "2" \| "3" \| "4" \| "5" \| "6"`                        | `"3"`        | Heading size variant      |
| `color`  | `"default" \| "gray" \| "accent" \| "red" \| "green" \| "blue"` | `"default"`  | Heading color             |
| `weight` | `"regular" \| "medium" \| "semibold" \| "bold"`                 | `"semibold"` | Font weight               |
| `align`  | `"left" \| "center" \| "right"`                                 | `"left"`     | Text alignment            |
| `as`     | `React.ElementType`                                             | `"h2"`       | HTML element to render as |

## Examples

### Article Layout

```tsx
import { Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";

export const Article = () => {
  return (
    <Stack gap="4">
      <Heading size="2">The Future of Design Systems</Heading>
      <Text color="gray" size="2">
        Published on January 1, 2024
      </Text>
      <Text>
        Design systems have become an essential part of modern web development.
        They provide consistency, efficiency, and maintainability across large
        applications and teams.
      </Text>
      <Heading size="3">Why Design Systems Matter</Heading>
      <Text>
        A well-implemented design system can significantly reduce development
        time while ensuring a consistent user experience across all parts of
        your application.
      </Text>
    </Stack>
  );
};
```

### Rich Text Content

```tsx
import { Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";

export const RichTextContent = () => {
  return (
    <Stack gap="4">
      <Heading size="3" color="accent">
        Product Features
      </Heading>
      <Stack gap="2">
        <Text weight="semibold">1. Easy Integration</Text>
        <Text color="gray">
          Seamlessly integrate with your existing React applications with
          minimal configuration required.
        </Text>

        <Text weight="semibold">2. Customizable</Text>
        <Text color="gray">
          Extend and customize components to match your brand's unique design
          requirements.
        </Text>

        <Text weight="semibold">3. Accessible</Text>
        <Text color="gray">
          Built with accessibility in mind, ensuring your application is usable
          by everyone.
        </Text>
      </Stack>
    </Stack>
  );
};
```

### Interactive Text

```tsx
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { useState } from "react";

export const InteractiveText = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Stack gap="2">
      <Text truncate={!expanded}>
        This is a very long text that demonstrates the truncation feature of our
        Text component. When truncated, it will show an ellipsis at the end of
        the visible text.
      </Text>
      <Text as="button" color="accent" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Show Less" : "Read More"}
      </Text>
    </Stack>
  );
};
```
