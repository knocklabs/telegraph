# 💬 Popover

> Accessible popover component with positioning, animations, and portal rendering built on Radix UI.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/popover.svg)](https://www.npmjs.com/package/@telegraph/popover)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/popover)](https://bundlephobia.com/result?p=@telegraph/popover)
[![license](https://img.shields.io/npm/l/@telegraph/popover)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/popover
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/popover";
```

Via Javascript:
```tsx
import "@telegraph/popover/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";

export const QuickTip = () => (
  <Popover.Root>
    <Popover.Trigger>
      <Button variant="outline">Show Info</Button>
    </Popover.Trigger>
    
    <Popover.Content>
      <p>This is additional information about the feature.</p>
    </Popover.Content>
  </Popover.Root>
);
```

## API Reference

### `<Popover.Root>`

The root container that manages popover state and provides context.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback when open state changes |

### `<Popover.Trigger>`

The trigger element that opens/closes the popover. Must wrap a single focusable element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `true` | Whether to render as child element |
| `children` | `React.ReactNode` | required | Trigger element (usually a Button) |

### `<Popover.Content>`

The popover content container that appears in a portal.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Side to display popover |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to trigger |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `alignOffset` | `number` | `0` | Additional alignment offset |
| `gap` | `SpacingToken` | `"1"` | Gap between content items |
| `py` | `SpacingToken` | `"1"` | Vertical padding |
| `rounded` | `RoundedToken` | `"4"` | Border radius |
| `shadow` | `ShadowToken` | `"2"` | Drop shadow |
| `border` | `SpacingToken` | `"px"` | Border width |
| `borderColor` | `ColorToken` | `"gray-8"` | Border color |
| `bg` | `ColorToken` | `"surface-1"` | Background color |
| `skipAnimation` | `boolean` | `false` | Whether to skip enter/exit animations |

Inherits all Stack props for additional styling.

## Usage Patterns

### Basic Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";

<Popover.Root>
  <Popover.Trigger>
    <Button variant="ghost">Help</Button>
  </Popover.Trigger>
  
  <Popover.Content>
    <p>This feature helps you manage your data more efficiently.</p>
  </Popover.Content>
</Popover.Root>
```

### Positioned Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";

// Top placement
<Popover.Root>
  <Popover.Trigger>
    <Button>Above</Button>
  </Popover.Trigger>
  <Popover.Content side="top" align="center">
    <p>Content appears above</p>
  </Popover.Content>
</Popover.Root>

// Right placement with start alignment
<Popover.Root>
  <Popover.Trigger>
    <Button>Right</Button>
  </Popover.Trigger>
  <Popover.Content side="right" align="start" sideOffset={8}>
    <p>Content appears to the right</p>
  </Popover.Content>
</Popover.Root>
```

### Rich Content Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Avatar } from "@telegraph/avatar";

<Popover.Root>
  <Popover.Trigger>
    <Avatar src="/user.jpg" alt="User info" />
  </Popover.Trigger>
  
  <Popover.Content px="4" py="3" maxW="80">
    <Stack direction="column" gap="2">
      <Stack direction="row" align="center" gap="2">
        <Avatar size="sm" src="/user.jpg" alt="" />
        <Stack direction="column" gap="0">
          <strong>John Doe</strong>
          <span>Software Engineer</span>
        </Stack>
      </Stack>
      <p>
        John has been working on the platform team for 3 years, 
        focusing on infrastructure and developer tools.
      </p>
    </Stack>
  </Popover.Content>
</Popover.Root>
```

### Form in Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";

<Popover.Root>
  <Popover.Trigger>
    <Button>Quick Add</Button>
  </Popover.Trigger>
  
  <Popover.Content px="4" py="3">
    <Stack direction="column" gap="3" w="64">
      <h3>Add New Item</h3>
      <Stack direction="column" gap="2">
        <Input placeholder="Item name" />
        <Input placeholder="Description" />
      </Stack>
      <Stack direction="row" gap="2" justify="end">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Add</Button>
      </Stack>
    </Stack>
  </Popover.Content>
</Popover.Root>
```

### Action Menu Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { MoreVertical, Edit, Copy, Trash } from "lucide-react";

<Popover.Root>
  <Popover.Trigger>
    <Button variant="ghost" icon={{ icon: MoreVertical, alt: "Actions" }} />
  </Popover.Trigger>
  
  <Popover.Content align="end" px="2" py="1">
    <Stack direction="column" gap="0">
      <Button variant="ghost" justify="start" leadingIcon={{ icon: Edit, alt: "" }}>
        Edit
      </Button>
      <Button variant="ghost" justify="start" leadingIcon={{ icon: Copy, alt: "" }}>
        Duplicate
      </Button>
      <Button variant="ghost" justify="start" leadingIcon={{ icon: Trash, alt: "" }} color="red">
        Delete
      </Button>
    </Stack>
  </Popover.Content>
</Popover.Root>
```

## Advanced Usage

### Controlled Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { useState } from "react";

const ControlledPopover = () => {
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    // Perform save action
    console.log('Saving...');
    setOpen(false); // Close popover after action
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button>Settings</Button>
      </Popover.Trigger>
      
      <Popover.Content>
        <Stack direction="column" gap="3" p="4">
          <h3>Quick Settings</h3>
          <Stack direction="column" gap="2">
            {/* Settings content */}
          </Stack>
          <Stack direction="row" gap="2" justify="end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};
```

### Nested Popovers

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";

<Popover.Root>
  <Popover.Trigger>
    <Button>Main Menu</Button>
  </Popover.Trigger>
  
  <Popover.Content>
    <Stack direction="column" gap="1" p="2">
      <Button variant="ghost" justify="start">Option 1</Button>
      <Button variant="ghost" justify="start">Option 2</Button>
      
      {/* Nested popover */}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" justify="start">More Options →</Button>
        </Popover.Trigger>
        
        <Popover.Content side="right" sideOffset={-4}>
          <Stack direction="column" gap="1" p="2">
            <Button variant="ghost" justify="start">Sub Option 1</Button>
            <Button variant="ghost" justify="start">Sub Option 2</Button>
          </Stack>
        </Popover.Content>
      </Popover.Root>
    </Stack>
  </Popover.Content>
</Popover.Root>
```

### Tooltip-style Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Icon } from "@telegraph/icon";
import { HelpCircle } from "lucide-react";

<Popover.Root>
  <Popover.Trigger>
    <Icon icon={HelpCircle} alt="Help" />
  </Popover.Trigger>
  
  <Popover.Content side="top" maxW="64" px="3" py="2">
    <p>
      This setting controls how notifications are delivered to your users. 
      Choose the appropriate method based on urgency and user preferences.
    </p>
  </Popover.Content>
</Popover.Root>
```

### Popover with External Controls

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { useState, useEffect } from "react";

const ExternallyControlledPopover = () => {
  const [open, setOpen] = useState(false);

  // Close after 5 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (open) {
      timeout = setTimeout(() => setOpen(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <Stack direction="row" gap="2">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <Button>Hover to Open</Button>
        </Popover.Trigger>
        
        <Popover.Content>
          <p>This will auto-close in 5 seconds</p>
        </Popover.Content>
      </Popover.Root>
      
      {/* External controls */}
      <Button variant="outline" onClick={() => setOpen(true)}>
        Force Open
      </Button>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Force Close
      </Button>
    </Stack>
  );
};
```

### Popover with Form Validation

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Stack } from "@telegraph/layout";
import { useState } from "react";

const FormPopover = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log({ name, email });
      // Reset form
      setName("");
      setEmail("");
      setErrors({});
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button>Add Contact</Button>
      </Popover.Trigger>
      
      <Popover.Content px="4" py="3" w="80">
        <Stack direction="column" gap="3">
          <h3>Add New Contact</h3>
          
          <Stack direction="column" gap="2">
            <Stack direction="column" gap="1">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </Stack>
            
            <Stack direction="column" gap="1">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </Stack>
          </Stack>
          
          <Stack direction="row" gap="2" justify="end">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm" onClick={handleSubmit}>Add Contact</Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};
```

### Performance Optimized Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { useMemo } from "react";

const OptimizedPopover = ({ data }) => {
  // Memoize expensive computations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`,
    }));
  }, [data]);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button>View Data</Button>
      </Popover.Trigger>
      
      <Popover.Content 
        skipAnimation={true} // Skip animation for better performance
        maxW="96" 
        maxH="80"
      >
        <Stack direction="column" gap="1" p="2">
          {processedData.map((item) => (
            <div key={item.id}>{item.displayName}</div>
          ))}
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};
```

### Popover with Custom Animation

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { motion } from "motion/react";

<Popover.Root>
  <Popover.Trigger>
    <Button>Custom Animation</Button>
  </Popover.Trigger>
  
  <Popover.Content 
    as={motion.div}
    skipAnimation={true} // Skip built-in animation
    initial={{ opacity: 0, rotateX: -90 }}
    animate={{ opacity: 1, rotateX: 0 }}
    exit={{ opacity: 0, rotateX: -90 }}
    transition={{ duration: 0.3 }}
  >
    <p>Custom animated content</p>
  </Popover.Content>
</Popover.Root>
```

## Design Tokens & Styling

The popover component uses Telegraph design tokens for consistent styling:

### Layout Tokens

- **Border radius**: `var(--tgph-rounded-4)`
- **Shadow**: `var(--tgph-shadow-2)`
- **Side offset**: `4px` from trigger
- **Padding**: `var(--tgph-spacing-1)` vertical

### Color Tokens

- **Background**: `var(--tgph-surface-1)`
- **Border**: `var(--tgph-gray-8)`

### Animation Tokens

- **Duration**: `0.1s` spring transition
- **Animation offset**: `5px` based on side
- **Scale**: `0.6` to `1.0` scale animation
- **Opacity**: `0.5` to `1.0` fade animation

### Z-Index

- **Popover content**: `var(--tgph-zIndex-popover)`

### Custom Styling

```css
.tgph {
  /* Custom popover styling */
  --popover-animation-duration: 0.2s;
  --popover-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  /* Override default colors */
  --popover-bg: var(--tgph-surface-2);
  --popover-border: var(--tgph-accent-6);
}

/* Custom popover content styling */
[data-tgph-popover-content] {
  backdrop-filter: blur(8px);
  border: 1px solid var(--popover-border);
  background: var(--popover-bg);
  box-shadow: var(--popover-shadow);
}

/* Custom animation overrides */
[data-tgph-popover-content] {
  animation-duration: var(--popover-animation-duration);
}

/* Custom positioning */
.custom-popover-offset {
  --side-offset: 12px;
  --align-offset: 8px;
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Arrow keys, Enter, Escape support
- ✅ **Focus Management**: Proper focus trapping and restoration
- ✅ **Screen Reader Support**: ARIA roles, states, and properties
- ✅ **Click Outside**: Closes popover when clicking outside
- ✅ **Escape Key**: Closes popover with Escape key
- ✅ **Portal Rendering**: Content rendered in document portal

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Open/close popover |
| `Escape` | Close popover |
| `Tab` | Navigate to next focusable element |
| `Shift + Tab` | Navigate to previous focusable element |

### ARIA Attributes

- `aria-expanded` on trigger
- `aria-haspopup` on trigger
- `role="dialog"` on content (when appropriate)
- `aria-labelledby` / `aria-describedby` for content relationships

### Accessibility Guidelines

1. **Meaningful Triggers**: Ensure trigger has clear accessible name
2. **Content Structure**: Use proper heading hierarchy in content
3. **Focus Management**: Let the component handle focus automatically
4. **Keyboard Access**: Ensure all interactive content is keyboard accessible
5. **Content Clarity**: Make popover content purpose clear

```tsx
// ✅ Good accessibility practices
<Popover.Root>
  <Popover.Trigger>
    <Button aria-label="Show user profile information">
      <Avatar src="/user.jpg" alt="" />
    </Button>
  </Popover.Trigger>
  
  <Popover.Content>
    <Stack direction="column" gap="2">
      <h3>User Profile</h3>
      <p>John Doe - Software Engineer</p>
      <Button>View Full Profile</Button>
    </Stack>
  </Popover.Content>
</Popover.Root>

// ❌ Poor accessibility
<Popover.Root>
  <Popover.Trigger>
    <div>?</div> {/* Not focusable, unclear purpose */}
  </Popover.Trigger>
  
  <Popover.Content>
    Some text {/* No structure or context */}
  </Popover.Content>
</Popover.Root>
```

### Best Practices

1. **Clear Triggers**: Use descriptive buttons or clearly labeled interactive elements
2. **Structured Content**: Organize content with headings and clear hierarchy  
3. **Actionable Items**: Ensure buttons and links in popovers are clearly labeled
4. **Logical Flow**: Arrange content in logical reading order
5. **Close Options**: Provide clear ways to close the popover

## Testing

### Testing Library Example

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "@telegraph/popover";

test("opens and closes popover", async () => {
  const user = userEvent.setup();
  
  render(
    <Popover.Root>
      <Popover.Trigger>
        <button>Open Popover</button>
      </Popover.Trigger>
      <Popover.Content>
        <p>Popover content</p>
      </Popover.Content>
    </Popover.Root>
  );
  
  const trigger = screen.getByRole("button", { name: "Open Popover" });
  
  // Initially closed
  expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
  
  // Open popover
  await user.click(trigger);
  expect(screen.getByText("Popover content")).toBeInTheDocument();
  
  // Close with Escape
  await user.keyboard("{Escape}");
  expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
});

test("handles controlled state", async () => {
  const user = userEvent.setup();
  const handleOpenChange = jest.fn();
  
  const { rerender } = render(
    <Popover.Root open={false} onOpenChange={handleOpenChange}>
      <Popover.Trigger>
        <button>Toggle</button>
      </Popover.Trigger>
      <Popover.Content>
        <p>Content</p>
      </Popover.Content>
    </Popover.Root>
  );
  
  await user.click(screen.getByRole("button"));
  expect(handleOpenChange).toHaveBeenCalledWith(true);
  
  // Simulate state change
  rerender(
    <Popover.Root open={true} onOpenChange={handleOpenChange}>
      <Popover.Trigger>
        <button>Toggle</button>
      </Popover.Trigger>
      <Popover.Content>
        <p>Content</p>
      </Popover.Content>
    </Popover.Root>
  );
  
  expect(screen.getByText("Content")).toBeInTheDocument();
});
```

### Testing Popover Positioning

```tsx
test("positions popover correctly", () => {
  render(
    <Popover.Root defaultOpen>
      <Popover.Trigger>
        <button>Trigger</button>
      </Popover.Trigger>
      <Popover.Content side="top" align="start">
        <p>Top positioned content</p>
      </Popover.Content>
    </Popover.Root>
  );
  
  const content = screen.getByText("Top positioned content");
  expect(content).toBeInTheDocument();
  
  // Check for positioning attributes (these are set by Radix)
  const popoverContent = content.closest('[data-side="top"]');
  expect(popoverContent).toBeInTheDocument();
});
```

### Testing Form Interactions

```tsx
test("handles form submission in popover", async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();
  
  render(
    <Popover.Root defaultOpen>
      <Popover.Trigger>
        <button>Open Form</button>
      </Popover.Trigger>
      <Popover.Content>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" />
          <button type="submit">Submit</button>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
  
  const input = screen.getByPlaceholderText("Name");
  const submitButton = screen.getByRole("button", { name: "Submit" });
  
  await user.type(input, "John Doe");
  await user.click(submitButton);
  
  expect(handleSubmit).toHaveBeenCalled();
});
```

### Testing Custom Animations

```tsx
test("respects skipAnimation prop", () => {
  const { rerender } = render(
    <Popover.Root defaultOpen>
      <Popover.Trigger>
        <button>Trigger</button>
      </Popover.Trigger>
      <Popover.Content skipAnimation={false}>
        <p>Animated content</p>
      </Popover.Content>
    </Popover.Root>
  );
  
  let content = screen.getByText("Animated content");
  expect(content).toBeInTheDocument();
  
  rerender(
    <Popover.Root defaultOpen>
      <Popover.Trigger>
        <button>Trigger</button>
      </Popover.Trigger>
      <Popover.Content skipAnimation={true}>
        <p>Non-animated content</p>
      </Popover.Content>
    </Popover.Root>
  );
  
  content = screen.getByText("Non-animated content");
  expect(content).toBeInTheDocument();
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render(
    <Popover.Root defaultOpen>
      <Popover.Trigger>
        <button>Open Popover</button>
      </Popover.Trigger>
      <Popover.Content>
        <h3>Popover Title</h3>
        <p>Popover content with proper structure</p>
        <button>Action</button>
      </Popover.Content>
    </Popover.Root>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Examples

### User Profile Card

```tsx
import { Popover } from "@telegraph/popover";
import { Avatar } from "@telegraph/avatar";
import { Button } from "@telegraph/button";
import { Badge } from "@telegraph/badge";
import { Stack } from "@telegraph/layout";

export const UserProfilePopover = ({ user }) => (
  <Popover.Root>
    <Popover.Trigger>
      <Avatar src={user.avatar} alt={`${user.name} profile`} />
    </Popover.Trigger>
    
    <Popover.Content side="bottom" align="start" px="4" py="3" maxW="80">
      <Stack direction="column" gap="3">
        {/* Header */}
        <Stack direction="row" align="center" gap="3">
          <Avatar src={user.avatar} alt="" />
          <Stack direction="column" gap="1">
            <Stack direction="row" align="center" gap="2">
              <strong>{user.name}</strong>
              {user.isOnline && <Badge variant="success">Online</Badge>}
            </Stack>
            <span>{user.role}</span>
          </Stack>
        </Stack>
        
        {/* Stats */}
        <Stack direction="row" gap="4">
          <Stack direction="column" align="center" gap="0">
            <strong>{user.projectsCount}</strong>
            <span>Projects</span>
          </Stack>
          <Stack direction="column" align="center" gap="0">
            <strong>{user.teamSize}</strong>
            <span>Team Members</span>
          </Stack>
        </Stack>
        
        {/* Actions */}
        <Stack direction="row" gap="2">
          <Button size="sm" flex="1">Message</Button>
          <Button size="sm" variant="outline" flex="1">View Profile</Button>
        </Stack>
      </Stack>
    </Popover.Content>
  </Popover.Root>
);
```

### Quick Actions Toolbar

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Copy, Download, Share, Archive, Trash } from "lucide-react";

export const QuickActionsPopover = ({ item, onAction }) => (
  <Popover.Root>
    <Popover.Trigger>
      <Button variant="ghost" size="sm">Actions</Button>
    </Popover.Trigger>
    
    <Popover.Content align="end" px="2" py="2">
      <Stack direction="column" gap="1">
        <Button
          variant="ghost"
          size="sm"
          justify="start"
          leadingIcon={{ icon: Copy, alt: "" }}
          onClick={() => onAction('copy', item)}
        >
          Copy Link
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          justify="start"
          leadingIcon={{ icon: Download, alt: "" }}
          onClick={() => onAction('download', item)}
        >
          Download
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          justify="start"
          leadingIcon={{ icon: Share, alt: "" }}
          onClick={() => onAction('share', item)}
        >
          Share
        </Button>
        
        <hr />
        
        <Button
          variant="ghost"
          size="sm"
          justify="start"
          leadingIcon={{ icon: Archive, alt: "" }}
          onClick={() => onAction('archive', item)}
        >
          Archive
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          justify="start"
          leadingIcon={{ icon: Trash, alt: "" }}
          color="red"
          onClick={() => onAction('delete', item)}
        >
          Delete
        </Button>
      </Stack>
    </Popover.Content>
  </Popover.Root>
);
```

### Color Picker Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Box } from "@telegraph/layout";
import { useState } from "react";

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

export const ColorPickerPopover = ({ value, onChange }) => {
  const [selectedColor, setSelectedColor] = useState(value);

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="outline" p="1">
          <Box w="6" h="6" bg={selectedColor} rounded="1" />
        </Button>
      </Popover.Trigger>
      
      <Popover.Content px="3" py="3">
        <Stack direction="column" gap="3">
          <h4>Choose Color</h4>
          
          <Stack direction="row" wrap="wrap" gap="2" maxW="48">
            {colors.map((color) => (
              <Box
                key={color}
                w="8"
                h="8"
                bg={color}
                rounded="1"
                border="2"
                borderColor={selectedColor === color ? "accent-9" : "transparent"}
                onClick={() => {
                  setSelectedColor(color);
                  onChange(color);
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
          
          <Stack direction="row" gap="2" justify="end">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm" onClick={() => onChange(selectedColor)}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};
```

### Search Filter Popover

```tsx
import { Popover } from "@telegraph/popover";
import { Button } from "@telegraph/button";
import { Input } from "@telegraph/input";
import { Checkbox } from "@telegraph/checkbox";
import { Select } from "@telegraph/select";
import { Stack } from "@telegraph/layout";
import { Filter } from "lucide-react";
import { useState } from "react";

export const SearchFilterPopover = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    inStock: false,
    featured: false,
    dateRange: 'all'
  });

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      inStock: false,
      featured: false,
      dateRange: 'all'
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button 
          variant="outline" 
          leadingIcon={{ icon: Filter, alt: "" }}
        >
          Filters
        </Button>
      </Popover.Trigger>
      
      <Popover.Content px="4" py="4" w="80">
        <Stack direction="column" gap="4">
          <h3>Filter Products</h3>
          
          <Stack direction="column" gap="3">
            {/* Search */}
            <Stack direction="column" gap="1">
              <label>Search</label>
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  search: e.target.value 
                }))}
              />
            </Stack>
            
            {/* Category */}
            <Stack direction="column" gap="1">
              <label>Category</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  category: value 
                }))}
                placeholder="All categories"
              >
                <Select.Option value="electronics">Electronics</Select.Option>
                <Select.Option value="clothing">Clothing</Select.Option>
                <Select.Option value="books">Books</Select.Option>
                <Select.Option value="home">Home & Garden</Select.Option>
              </Select>
            </Stack>
            
            {/* Checkboxes */}
            <Stack direction="column" gap="2">
              <Checkbox
                checked={filters.inStock}
                onCheckedChange={(checked) => setFilters(prev => ({ 
                  ...prev, 
                  inStock: checked 
                }))}
              >
                In Stock Only
              </Checkbox>
              
              <Checkbox
                checked={filters.featured}
                onCheckedChange={(checked) => setFilters(prev => ({ 
                  ...prev, 
                  featured: checked 
                }))}
              >
                Featured Products
              </Checkbox>
            </Stack>
          </Stack>
          
          {/* Actions */}
          <Stack direction="row" gap="2" justify="end">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply Filters
            </Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  );
};
```

## References

- [Radix UI Popover](https://www.radix-ui.com/docs/primitives/components/popover)
- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/popover)
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
