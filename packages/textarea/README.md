![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/button.svg)](https://www.npmjs.com/package/@telegraph/textarea)

# @telegraph/textarea

> A flexible multi-line text input component that follows Telegraph's design system.

## Installation

```bash
npm install @telegraph/textarea
```

### Add stylesheet

```css
@import "@telegraph/textarea";
```

## Usage

### Basic Usage

```tsx
import { TextArea } from "@telegraph/textarea";

export const MyForm = () => {
  return (
    <TextArea.Root
      placeholder="Enter your message..."
      onChange={(e) => console.log(e.target.value)}
    />
  );
};
```

### With Different Sizes

```tsx
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";

export const TextAreaSizes = () => {
  return (
    <Stack gap="4">
      <TextArea.Root size="1" placeholder="Small textarea" />
      <TextArea.Root size="2" placeholder="Default size textarea" />
      <TextArea.Root size="3" placeholder="Large textarea" />
    </Stack>
  );
};
```

### With Different Variants

```tsx
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";

export const TextAreaVariants = () => {
  return (
    <Stack gap="4">
      <TextArea.Root variant="outline" placeholder="Outline variant" />
      <TextArea.Root variant="ghost" placeholder="Ghost variant" />
    </Stack>
  );
};
```

### With Error State

```tsx
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";
import { Text } from "@telegraph/typography";

export const TextAreaWithError = () => {
  return (
    <Stack gap="2">
      <TextArea.Root errored placeholder="This field has an error" />
      <Text color="red-11" size="1">
        Please enter a valid message
      </Text>
    </Stack>
  );
};
```

### With Custom Resize Behavior

```tsx
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";

export const TextAreaResize = () => {
  return (
    <Stack gap="4">
      <TextArea.Root resize="both" placeholder="Resize both directions" />
      <TextArea.Root resize="vertical" placeholder="Resize vertically only" />
      <TextArea.Root
        resize="horizontal"
        placeholder="Resize horizontally only"
      />
      <TextArea.Root resize="none" placeholder="Cannot resize" />
    </Stack>
  );
};
```

## API Reference

### TextArea.Root

The main textarea component that renders a native `<textarea>` element.

#### Props

| Prop       | Type                                                                    | Default     | Description                              |
| ---------- | ----------------------------------------------------------------------- | ----------- | ---------------------------------------- |
| `size`     | `"1" \| "2" \| "3"`                                                     | `"2"`       | Controls the size of the textarea        |
| `variant`  | `"outline" \| "ghost"`                                                  | `"outline"` | The visual style variant                 |
| `errored`  | `boolean`                                                               | `false`     | Whether to show error styling            |
| `disabled` | `boolean`                                                               | `false`     | Whether the textarea is disabled         |
| `resize`   | `"both" \| "vertical" \| "horizontal" \| "none"`                        | `"both"`    | Controls how the textarea can be resized |
| `rounded`  | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "full"` | `"2"`       | Border radius of the textarea            |

Additionally, TextArea.Root accepts all standard HTML textarea attributes and Telegraph's Box component props.

### TextArea.Text

A helper component for rendering text associated with the textarea (e.g., labels, help text).

```tsx
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";

export const TextAreaWithLabel = () => {
  return (
    <Stack gap="2">
      <TextArea.Text as="label" htmlFor="message">
        Message
      </TextArea.Text>
      <TextArea.Root id="message" placeholder="Enter your message..." />
    </Stack>
  );
};
```

#### Props

TextArea.Text accepts all props from Telegraph's Text component.

## Accessibility

The TextArea component follows WAI-ARIA guidelines for form inputs:

- Uses native `<textarea>` element for optimal accessibility
- Supports standard ARIA attributes
- Maintains keyboard navigation
- Preserves browser functionality for resizing
- Supports disabled states with proper styling and behavior

## Examples

### Form Field with Label and Help Text

```tsx
import { Stack } from "@telegraph/layout";
import { TextArea } from "@telegraph/textarea";

export const FormField = () => {
  return (
    <Stack gap="2">
      <TextArea.Text as="label" htmlFor="bio" weight="medium">
        Bio
      </TextArea.Text>
      <TextArea.Root id="bio" placeholder="Tell us about yourself..." />
      <TextArea.Text size="1" color="gray-11">
        Maximum 500 characters
      </TextArea.Text>
    </Stack>
  );
};
```

### Auto-growing Textarea

```tsx
import { TextArea } from "@telegraph/textarea";
import { useEffect, useRef } from "react";

export const AutoGrowingTextArea = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  return (
    <TextArea.Root
      ref={textareaRef}
      placeholder="I grow as you type..."
      resize="none"
      rows={1}
    />
  );
};
```
