![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/tag.svg)](https://www.npmjs.com/package/@telegraph/tag)

# @telegraph/tag

> A flexible tag component for displaying labels, categories, and statuses with optional interactivity.

## Installation

```bash
npm install @telegraph/tag
```

### Add stylesheet

```css
@import "@telegraph/tag";
```

## Usage

### Basic Usage

```tsx
import { Tag } from "@telegraph/tag";

export const BasicTag = () => {
  return <Tag>New</Tag>;
};
```

### With Different Variants

```tsx
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";

export const TagVariants = () => {
  return (
    <Stack gap="2" direction="row">
      <Tag variant="soft" color="blue">
        Soft Blue
      </Tag>
      <Tag variant="solid" color="red">
        Solid Red
      </Tag>
      <Tag variant="soft" color="green">
        Soft Green
      </Tag>
      <Tag variant="solid" color="purple">
        Solid Purple
      </Tag>
    </Stack>
  );
};
```

### With Icons

```tsx
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";

export const TagsWithIcons = () => {
  return (
    <Stack gap="2" direction="row">
      <Tag icon={{ icon: Lucide.Check, alt: "Success" }} color="green">
        Complete
      </Tag>
      <Tag icon={{ icon: Lucide.AlertCircle, alt: "Warning" }} color="yellow">
        Warning
      </Tag>
      <Tag icon={{ icon: Lucide.X, alt: "Error" }} color="red">
        Error
      </Tag>
    </Stack>
  );
};
```

### Interactive Tags

```tsx
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";

export const InteractiveTags = () => {
  return (
    <Stack gap="2" direction="row">
      <Tag onRemove={() => console.log("Remove clicked")} color="blue">
        Removable
      </Tag>
      <Tag onCopy={() => console.log("Copied!")} color="purple">
        Copyable
      </Tag>
      <Tag
        onRemove={() => console.log("Remove clicked")}
        onCopy={() => console.log("Copied!")}
        color="green"
      >
        Both
      </Tag>
    </Stack>
  );
};
```

## API Reference

### Tag

The main tag component for simple usage.

#### Props

| Prop       | Type                                                                                    | Default     | Description                          |
| ---------- | --------------------------------------------------------------------------------------- | ----------- | ------------------------------------ |
| `size`     | `"1" \| "2"`                                                                            | `"1"`       | Size of the tag                      |
| `color`    | `"default" \| "gray" \| "red" \| "accent" \| "blue" \| "green" \| "yellow" \| "purple"` | `"default"` | Color theme                          |
| `variant`  | `"soft" \| "solid"`                                                                     | `"soft"`    | Visual style variant                 |
| `icon`     | `{ icon: Icon; alt: string }`                                                           | -           | Leading icon configuration           |
| `onRemove` | `() => void`                                                                            | -           | Called when remove button is clicked |
| `onCopy`   | `() => void`                                                                            | -           | Called when copy button is clicked   |

### Tag.Root

The container component for custom tag layouts.

#### Props

| Prop      | Type                                                                                    | Default     | Description          |
| --------- | --------------------------------------------------------------------------------------- | ----------- | -------------------- |
| `size`    | `"1" \| "2"`                                                                            | `"1"`       | Size of the tag      |
| `color`   | `"default" \| "gray" \| "red" \| "accent" \| "blue" \| "green" \| "yellow" \| "purple"` | `"default"` | Color theme          |
| `variant` | `"soft" \| "solid"`                                                                     | `"soft"`    | Visual style variant |

### Tag.Text

Text content component that handles proper styling.

Accepts all props from Telegraph's Text component.

### Tag.Button

Interactive button component for actions like remove/copy.

Accepts all props from Telegraph's Button component.

### Tag.Icon

Icon component that maintains proper sizing and colors.

Accepts all props from Telegraph's Icon component.

## Examples

### Custom Tag Layout

```tsx
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";

export const CustomTag = () => {
  return (
    <Tag.Root color="blue" variant="soft" size="2">
      <Stack direction="row" gap="2" align="center">
        <Tag.Icon icon={Lucide.Bell} alt="Notification" />
        <Tag.Text>Custom Layout</Tag.Text>
        <Tag.Button
          icon={{ icon: Lucide.X, alt: "remove" }}
          onClick={() => console.log("Remove clicked")}
        />
      </Stack>
    </Tag.Root>
  );
};
```

### Status Tags

```tsx
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";

export const StatusTags = () => {
  const statuses = [
    {
      label: "Active",
      color: "green",
      icon: Lucide.CheckCircle,
    },
    {
      label: "Pending",
      color: "yellow",
      icon: Lucide.Clock,
    },
    {
      label: "Failed",
      color: "red",
      icon: Lucide.XCircle,
    },
  ];

  return (
    <Stack direction="row" gap="2">
      {statuses.map((status) => (
        <Tag
          key={status.label}
          color={status.color}
          icon={{ icon: status.icon, alt: status.label }}
        >
          {status.label}
        </Tag>
      ))}
    </Stack>
  );
};
```

### Removable Tag Group

```tsx
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { useState } from "react";

export const RemovableTags = () => {
  const [tags, setTags] = useState([
    { id: 1, label: "React", color: "blue" },
    { id: 2, label: "TypeScript", color: "purple" },
    { id: 3, label: "JavaScript", color: "yellow" },
  ]);

  const removeTag = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <Stack direction="row" gap="2" wrap>
      {tags.map((tag) => (
        <Tag key={tag.id} color={tag.color} onRemove={() => removeTag(tag.id)}>
          {tag.label}
        </Tag>
      ))}
    </Stack>
  );
};
```
