# 📋 DataList

> Flexible data list component for displaying label-value pairs in a structured, composable format.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/data-list.svg)](https://www.npmjs.com/package/@telegraph/data-list)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/data-list)](https://bundlephobia.com/result?p=@telegraph/data-list)
[![license](https://img.shields.io/npm/l/@telegraph/data-list)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/data-list
```

## Quick Start

```tsx
import { DataList } from "@telegraph/data-list";
import { Text } from "@telegraph/typography";

export const UserProfile = () => (
  <DataList.List>
    <DataList.Item label="Name">
      <Text as="span">John Doe</Text>
    </DataList.Item>
    <DataList.Item label="Email">
      <Text as="span">john@example.com</Text>
    </DataList.Item>
    <DataList.Item label="Role">
      <Text as="span">Administrator</Text>
    </DataList.Item>
  </DataList.List>
);
```

## API Reference

### `<DataList.List>`

Container component that wraps data list items.

| Prop          | Type                   | Default    | Description                           |
| ------------- | ---------------------- | ---------- | ------------------------------------- |
| `direction`   | `"column" \| "row"`    | `"column"` | Layout direction of list items        |
| `gap`         | `keyof tokens.spacing` | `"4"`      | Gap between list items                |
| All Box props | -                      | -          | Inherits all Box component properties |

### `<DataList.Item>`

Simplified API for label-value pairs. Combines Label and Value in one component.

| Prop        | Type                        | Default | Description                           |
| ----------- | --------------------------- | ------- | ------------------------------------- |
| `label`     | `React.ReactNode \| string` | -       | Label text or content                 |
| `icon`      | `IconProps`                 | -       | Optional icon to display before label |
| `direction` | `"row" \| "column"`         | `"row"` | Layout direction of item              |
| `gap`       | `keyof tokens.spacing`      | `"1"`   | Gap between label and value           |

### `<DataList.ListItem>`

Row container for composing custom label-value layouts.

| Prop        | Type                   | Default      | Description                      |
| ----------- | ---------------------- | ------------ | -------------------------------- |
| `direction` | `"row" \| "column"`    | `"row"`      | Layout direction                 |
| `gap`       | `keyof tokens.spacing` | `"1"`        | Gap between children             |
| `align`     | Flexbox align values   | `"baseline"` | Cross-axis alignment of children |

### `<DataList.Label>`

Label component for displaying field names.

| Prop        | Type                   | Default  | Description                     |
| ----------- | ---------------------- | -------- | ------------------------------- |
| `maxW`      | `keyof tokens.spacing` | `"36"`   | Maximum width of label          |
| `maxH`      | `keyof tokens.spacing` | `"6"`    | Maximum height of label         |
| `w`         | `keyof tokens.spacing` | `"full"` | Width of label                  |
| `icon`      | `IconProps`            | -        | Optional icon to display        |
| `textProps` | `TextProps`            | -        | Props to pass to Text component |

### `<DataList.Value>`

Value component for displaying field values.

| Prop            | Type | Default | Description                        |
| --------------- | ---- | ------- | ---------------------------------- |
| All Stack props | -    | -       | Inherits all Stack component props |

### Icon Props Structure

```tsx
type IconProps = TgphComponentProps<typeof Icon>;

// Example usage
icon={{ icon: Mail, color: "blue", size: "1" }}
```

## Usage Patterns

### Basic Data List

```tsx
import { DataList } from "@telegraph/data-list";
import { Text } from "@telegraph/typography";

export const BasicInfo = () => (
  <DataList.List>
    <DataList.Item label="First Name">
      <Text as="span">Jane</Text>
    </DataList.Item>
    <DataList.Item label="Last Name">
      <Text as="span">Smith</Text>
    </DataList.Item>
    <DataList.Item label="Status">
      <Text as="span">Active</Text>
    </DataList.Item>
  </DataList.List>
);
```

### With Icons

```tsx
import { DataList } from "@telegraph/data-list";
import { Text } from "@telegraph/typography";
import { Mail, MapPin, Phone } from "lucide-react";

export const ContactInfo = () => (
  <DataList.List>
    <DataList.Item label="Email" icon={{ icon: Mail }}>
      <Text as="span">jane@example.com</Text>
    </DataList.Item>
    <DataList.Item label="Phone" icon={{ icon: Phone }}>
      <Text as="span">+1 (555) 123-4567</Text>
    </DataList.Item>
    <DataList.Item label="Location" icon={{ icon: MapPin }}>
      <Text as="span">San Francisco, CA</Text>
    </DataList.Item>
  </DataList.List>
);
```

### With Long Text

```tsx
import { DataList } from "@telegraph/data-list";
import { Text } from "@telegraph/typography";

export const Description = () => (
  <DataList.List>
    <DataList.Item label="Summary">
      <Text as="span">
        This is a very long description that will wrap to multiple lines while
        keeping the label aligned with the first line of text.
      </Text>
    </DataList.Item>
  </DataList.List>
);
```

### Column Layout

```tsx
import { DataList } from "@telegraph/data-list";
import { Text } from "@telegraph/typography";

export const ColumnLayout = () => (
  <DataList.List>
    <DataList.Item label="Description" direction="column">
      <Text as="span">
        When you need more vertical space, use column direction to stack the
        label above the value.
      </Text>
    </DataList.Item>
  </DataList.List>
);
```

### With Form Inputs

```tsx
import { DataList } from "@telegraph/data-list";
import { Input } from "@telegraph/input";
import { TextArea } from "@telegraph/textarea";

export const EditableProfile = () => (
  <DataList.List>
    <DataList.Item label="Name">
      <Input placeholder="Enter name" />
    </DataList.Item>
    <DataList.Item label="Email">
      <Input type="email" placeholder="Enter email" />
    </DataList.Item>
    <DataList.Item label="Bio" direction="column">
      <TextArea placeholder="Tell us about yourself" rows={4} />
    </DataList.Item>
  </DataList.List>
);
```

## Advanced Usage

### Composition Pattern

For maximum control, use the composition API:

```tsx
import { DataList } from "@telegraph/data-list";
import { Icon } from "@telegraph/icon";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";
import { CheckCircle, User } from "lucide-react";

export const CustomDataList = () => (
  <DataList.List gap="3" maxW="120">
    <DataList.ListItem>
      <DataList.Label icon={{ icon: User }}>User</DataList.Label>
      <DataList.Value>
        <Stack direction="row" align="center" gap="2">
          <Text as="span">John Doe</Text>
          <Icon icon={CheckCircle} color="green" size="1" alt="Verified" />
        </Stack>
      </DataList.Value>
    </DataList.ListItem>

    <DataList.ListItem>
      <DataList.Label textProps={{ weight: "bold" }}>Status</DataList.Label>
      <DataList.Value>
        <Tag color="green">Active</Tag>
      </DataList.Value>
    </DataList.ListItem>
  </DataList.List>
);
```

### Custom Label Styling

```tsx
import { DataList } from "@telegraph/data-list";
import { Text } from "@telegraph/typography";

export const StyledLabels = () => (
  <DataList.List>
    <DataList.ListItem>
      <DataList.Label
        maxW="48"
        textProps={{ color: "blue", weight: "bold", size: "3" }}
      >
        Important Field
      </DataList.Label>
      <DataList.Value>
        <Text as="span">Custom styled label</Text>
      </DataList.Value>
    </DataList.ListItem>
  </DataList.List>
);
```

### Nested Data Lists

```tsx
import { DataList } from "@telegraph/data-list";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";

export const NestedList = () => (
  <DataList.List>
    <DataList.Item label="User Details">
      <Stack gap="2">
        <DataList.List gap="2">
          <DataList.Item label="Name">
            <Text as="span">John Doe</Text>
          </DataList.Item>
          <DataList.Item label="Email">
            <Text as="span">john@example.com</Text>
          </DataList.Item>
        </DataList.List>
      </Stack>
    </DataList.Item>
  </DataList.List>
);
```

### With Interactive Elements

```tsx
import { Button } from "@telegraph/button";
import { DataList } from "@telegraph/data-list";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Copy, ExternalLink } from "lucide-react";

export const InteractiveList = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DataList.List>
      <DataList.ListItem>
        <DataList.Label>API Key</DataList.Label>
        <DataList.Value>
          <Stack direction="row" align="center" gap="2">
            <Text as="span" color="gray">
              sk_test_****
            </Text>
            <Button
              variant="ghost"
              size="1"
              icon={{ icon: Copy, alt: "Copy API key" }}
              onClick={() => copyToClipboard("sk_test_1234")}
            />
          </Stack>
        </DataList.Value>
      </DataList.ListItem>

      <DataList.ListItem>
        <DataList.Label>Documentation</DataList.Label>
        <DataList.Value>
          <Button
            as="a"
            href="https://docs.example.com"
            variant="ghost"
            size="1"
            trailingIcon={{ icon: ExternalLink, alt: "" }}
          >
            View Docs
          </Button>
        </DataList.Value>
      </DataList.ListItem>
    </DataList.List>
  );
};
```

### User Settings Example

```tsx
import { DataList } from "@telegraph/data-list";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { Select } from "@telegraph/select";
import { Text } from "@telegraph/typography";
import { Bell, Globe, Lock, User } from "lucide-react";

export const UserSettings = () => (
  <Stack gap="6">
    <Stack gap="2">
      <Text as="h2" size="5" weight="semibold">
        Profile Settings
      </Text>
      <DataList.List>
        <DataList.Item label="Username" icon={{ icon: User }}>
          <Input defaultValue="johndoe" />
        </DataList.Item>
        <DataList.Item label="Email" icon={{ icon: User }}>
          <Input type="email" defaultValue="john@example.com" />
        </DataList.Item>
      </DataList.List>
    </Stack>

    <Stack gap="2">
      <Text as="h2" size="5" weight="semibold">
        Preferences
      </Text>
      <DataList.List>
        <DataList.Item label="Language" icon={{ icon: Globe }}>
          <Select defaultValue="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </Select>
        </DataList.Item>
        <DataList.Item label="Notifications" icon={{ icon: Bell }}>
          <Select defaultValue="all">
            <option value="all">All notifications</option>
            <option value="important">Important only</option>
            <option value="none">None</option>
          </Select>
        </DataList.Item>
      </DataList.List>
    </Stack>

    <Stack gap="2">
      <Text as="h2" size="5" weight="semibold">
        Security
      </Text>
      <DataList.List>
        <DataList.Item label="Password" icon={{ icon: Lock }}>
          <Input type="password" placeholder="Enter new password" />
        </DataList.Item>
      </DataList.List>
    </Stack>
  </Stack>
);
```

## Design Considerations

### Label Alignment

The DataList component automatically aligns labels with the first line of their values, even when values span multiple lines. This is achieved through baseline alignment on the ListItem component.

```tsx
// Labels stay aligned with first line of multi-line content
<DataList.Item label="Description">
  <Text as="span">
    This is a very long description that wraps to multiple lines. The label
    "Description" will align with the first line of this text.
  </Text>
</DataList.Item>
```

### Icon Alignment

When using icons with labels, the icon is automatically vertically centered with the label text while maintaining baseline alignment with the value.

```tsx
// Icon is centered with label text
<DataList.Item label="Email" icon={{ icon: Mail }}>
  <Text as="span">john@example.com</Text>
</DataList.Item>
```

### Width Control

Control label widths to create consistent alignment across items:

```tsx
<DataList.List>
  <DataList.ListItem>
    <DataList.Label maxW="48">Short Label</DataList.Label>
    <DataList.Value>Value</DataList.Value>
  </DataList.ListItem>
  <DataList.ListItem>
    <DataList.Label maxW="48">Much Longer Label Name</DataList.Label>
    <DataList.Value>Value</DataList.Value>
  </DataList.ListItem>
</DataList.List>
```

## Accessibility

- ✅ **Semantic HTML**: Uses proper label and content semantics
- ✅ **Keyboard Navigation**: All interactive elements are keyboard accessible
- ✅ **Screen Reader Support**: Proper label associations and content structure
- ✅ **Focus Management**: Clear focus indicators for interactive elements
- ✅ **ARIA Attributes**: Proper use of labels and descriptions

### Best Practices

1. **Label Association**: Use meaningful labels that describe the content
2. **Interactive Elements**: Ensure all buttons and inputs are keyboard accessible
3. **Icon Accessibility**: Provide alt text for icons or use `aria-hidden` for decorative icons
4. **Form Integration**: Associate labels with form inputs using proper HTML attributes
5. **Content Structure**: Keep label-value pairs logically grouped

```tsx
// ✅ Good accessibility practices
<DataList.Item label="Email" icon={{ icon: Mail, "aria-hidden": true }}>
  <Input
    type="email"
    aria-label="Email address"
    defaultValue="john@example.com"
  />
</DataList.Item>

// ❌ Poor accessibility
<DataList.Item label="📧">  {/* Don't use emojis as labels */}
  <Input />  {/* No accessible label */}
</DataList.Item>
```

## Examples

### Product Details

```tsx
import { DataList } from "@telegraph/data-list";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";
import { Calendar, DollarSign, Package, Tag as TagIcon } from "lucide-react";

export const ProductDetails = () => (
  <DataList.List maxW="120">
    <DataList.Item label="Product Name" icon={{ icon: Package }}>
      <Text as="span" weight="semibold">
        Premium Wireless Headphones
      </Text>
    </DataList.Item>

    <DataList.Item label="Price" icon={{ icon: DollarSign }}>
      <Text as="span" size="4" weight="bold">
        $299.99
      </Text>
    </DataList.Item>

    <DataList.Item label="Release Date" icon={{ icon: Calendar }}>
      <Text as="span">March 15, 2024</Text>
    </DataList.Item>

    <DataList.Item label="Tags" icon={{ icon: TagIcon }}>
      <Stack direction="row" gap="2" wrap="wrap">
        <Tag color="blue">Electronics</Tag>
        <Tag color="green">Featured</Tag>
        <Tag color="purple">New</Tag>
      </Stack>
    </DataList.Item>

    <DataList.Item label="Description" direction="column">
      <Text as="p" color="gray">
        Experience premium sound quality with active noise cancellation, 40-hour
        battery life, and comfortable over-ear design perfect for long listening
        sessions.
      </Text>
    </DataList.Item>
  </DataList.List>
);
```

### API Response Viewer

```tsx
import { Button } from "@telegraph/button";
import { DataList } from "@telegraph/data-list";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";
import { CheckCircle, Clock, Copy, XCircle } from "lucide-react";

export const APIResponseViewer = ({ response }) => {
  const statusColor = response.status === 200 ? "green" : "red";
  const statusIcon = response.status === 200 ? CheckCircle : XCircle;

  return (
    <DataList.List>
      <DataList.ListItem>
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>
          <Stack direction="row" align="center" gap="2">
            <Icon icon={statusIcon} color={statusColor} size="1" alt="" />
            <Tag color={statusColor}>{response.status}</Tag>
          </Stack>
        </DataList.Value>
      </DataList.ListItem>

      <DataList.Item label="Endpoint">
        <Stack direction="row" align="center" gap="2">
          <Text as="code">{response.endpoint}</Text>
          <Button
            variant="ghost"
            size="1"
            icon={{ icon: Copy, alt: "Copy endpoint" }}
            onClick={() => navigator.clipboard.writeText(response.endpoint)}
          />
        </Stack>
      </DataList.Item>

      <DataList.Item label="Response Time" icon={{ icon: Clock }}>
        <Text as="span">{response.responseTime}ms</Text>
      </DataList.Item>

      <DataList.Item label="Response Body" direction="column">
        <Text
          as="pre"
          style={{
            background: "var(--tgph-gray-2)",
            padding: "var(--tgph-spacing-3)",
            borderRadius: "var(--tgph-rounded-2)",
            overflow: "auto",
          }}
        >
          {JSON.stringify(response.body, null, 2)}
        </Text>
      </DataList.Item>
    </DataList.List>
  );
};
```

### Invoice Details

```tsx
import { DataList } from "@telegraph/data-list";
import { Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { Text } from "@telegraph/typography";
import { Calendar, DollarSign, FileText, User } from "lucide-react";

export const InvoiceDetails = () => (
  <Stack gap="4">
    <DataList.List>
      <DataList.Item label="Invoice Number" icon={{ icon: FileText }}>
        <Text as="span" weight="semibold">
          INV-2024-001
        </Text>
      </DataList.Item>

      <DataList.Item label="Customer" icon={{ icon: User }}>
        <Text as="span">Acme Corporation</Text>
      </DataList.Item>

      <DataList.Item label="Issue Date" icon={{ icon: Calendar }}>
        <Text as="span">March 1, 2024</Text>
      </DataList.Item>

      <DataList.Item label="Due Date" icon={{ icon: Calendar }}>
        <Text as="span">March 31, 2024</Text>
      </DataList.Item>

      <DataList.Item label="Status">
        <Tag color="green">Paid</Tag>
      </DataList.Item>
    </DataList.List>

    <Stack gap="2">
      <Text as="h3" size="3" weight="semibold">
        Line Items
      </Text>
      <DataList.List gap="2">
        <DataList.Item label="Consulting Services">
          <Text as="span">$5,000.00</Text>
        </DataList.Item>
        <DataList.Item label="Development Hours">
          <Text as="span">$3,500.00</Text>
        </DataList.Item>
        <DataList.Item label="Tax (10%)">
          <Text as="span">$850.00</Text>
        </DataList.Item>
      </DataList.List>
    </Stack>

    <DataList.List>
      <DataList.Item label="Total Amount" icon={{ icon: DollarSign }}>
        <Text as="span" size="5" weight="bold">
          $9,350.00
        </Text>
      </DataList.Item>
    </DataList.List>
  </Stack>
);
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/datalist)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
