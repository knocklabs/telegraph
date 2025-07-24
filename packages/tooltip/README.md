# 💬 Tooltip

> Contextual information overlay component with smart positioning, customizable content, and comprehensive accessibility support.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/tooltip.svg)](https://www.npmjs.com/package/@telegraph/tooltip)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/tooltip)](https://bundlephobia.com/result?p=@telegraph/tooltip)
[![license](https://img.shields.io/npm/l/@telegraph/tooltip)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/tooltip
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/tooltip";
```

Via Javascript:
```tsx
import "@telegraph/tooltip/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";
import { Info } from "lucide-react";

export const TooltipExample = () => (
  <div>
    {/* Basic tooltip */}
    <Tooltip content="This button saves your changes">
      <Button>Save</Button>
    </Tooltip>

    {/* Rich content tooltip */}
    <Tooltip
      content={
        <div>
          <strong>Pro Tip:</strong><br />
          Use Ctrl+S to save quickly
        </div>
      }
    >
      <Button icon={{ icon: Info, alt: "Info" }}>
        Help
      </Button>
    </Tooltip>
  </div>
);
```

## API Reference

### `<Tooltip>`

The main tooltip component that wraps content and provides contextual information on hover or focus.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `ReactNode` | - | **Required.** Content to display in the tooltip |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Preferred placement side |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment relative to the trigger |
| `sideOffset` | `number` | `4` | Distance from the trigger element |
| `alignOffset` | `number` | `0` | Offset along the alignment axis |
| `delayDuration` | `number` | `700` | Delay before showing tooltip (ms) |
| `skipDelayDuration` | `number` | `300` | Skip delay if another tooltip was recently shown |
| `disableHoverableContent` | `boolean` | `false` | Prevent tooltip from staying open when hovering over content |
| `avoidCollisions` | `boolean` | `true` | Automatically flip tooltip to avoid viewport edges |
| `sticky` | `"partial" \| "always"` | `"partial"` | How tooltip follows the cursor |
| `hideWhenDetached` | `boolean` | `false` | Hide tooltip when trigger is not visible |

## Usage Patterns

### Basic Tooltip

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const BasicTooltip = () => (
  <Tooltip content="Click to save your work">
    <Button>Save</Button>
  </Tooltip>
);
```

### Different Positions

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const PositionedTooltips = () => (
  <div>
    <Tooltip content="Tooltip on top" side="top">
      <Button>Top</Button>
    </Tooltip>
    
    <Tooltip content="Tooltip on right" side="right">
      <Button>Right</Button>
    </Tooltip>
    
    <Tooltip content="Tooltip on bottom" side="bottom">
      <Button>Bottom</Button>
    </Tooltip>
    
    <Tooltip content="Tooltip on left" side="left">
      <Button>Left</Button>
    </Tooltip>
  </div>
);
```

### Rich Content

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";
import { User, Mail, Phone } from "lucide-react";

export const RichContentTooltip = () => (
  <Tooltip
    content={
      <div className="user-tooltip">
        <div className="user-header">
          <User size={20} />
          <strong>John Doe</strong>
        </div>
        <div className="user-details">
          <div><Mail size={16} /> john@example.com</div>
          <div><Phone size={16} /> +1 (555) 123-4567</div>
        </div>
      </div>
    }
  >
    <Button variant="ghost">View Profile</Button>
  </Tooltip>
);
```

### Custom Delays

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const CustomDelayTooltips = () => (
  <div>
    {/* Instant tooltip */}
    <Tooltip content="Shows immediately" delayDuration={0}>
      <Button>Instant</Button>
    </Tooltip>
    
    {/* Slow tooltip */}
    <Tooltip content="Takes time to show" delayDuration={1500}>
      <Button>Slow</Button>
    </Tooltip>
  </div>
);
```

### Disabled Elements

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const DisabledTooltip = () => (
  <Tooltip content="This action is not available right now">
    <span> {/* Wrapper needed for disabled elements */}
      <Button disabled>Disabled Action</Button>
    </span>
  </Tooltip>
);
```

## Advanced Usage

### Conditional Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const ConditionalTooltip = ({ showTooltip, user }) => (
  <Tooltip
    content={showTooltip ? `Hello, ${user.name}!` : undefined}
  >
    <Button>
      {user.isLoggedIn ? "Dashboard" : "Sign In"}
    </Button>
  </Tooltip>
);
```

### Interactive Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";
import { Link } from "next/link";

export const InteractiveTooltip = () => (
  <Tooltip
    content={
      <div className="interactive-tooltip">
        <p>Need help with this feature?</p>
        <div className="tooltip-actions">
          <Link href="/docs">
            <Button size="0" variant="ghost">View Docs</Button>
          </Link>
          <Button size="0" variant="outline">Contact Support</Button>
        </div>
      </div>
    }
    disableHoverableContent={false} // Allow hovering over tooltip content
    delayDuration={300}
  >
    <Button variant="ghost" icon={{ icon: HelpCircle, alt: "Help" }}>
      Help
    </Button>
  </Tooltip>
);
```

### Form Field Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Input } from "@telegraph/input";
import { HelpCircle } from "lucide-react";

export const FormWithTooltips = () => (
  <form className="form-with-tooltips">
    <div className="form-field">
      <label htmlFor="username">
        Username
        <Tooltip
          content="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
          side="right"
        >
          <HelpCircle size={16} className="help-icon" />
        </Tooltip>
      </label>
      <Input id="username" placeholder="Enter username" />
    </div>

    <div className="form-field">
      <label htmlFor="email">
        Email Address
        <Tooltip
          content="We'll use this email for account notifications and password recovery"
          side="right"
        >
          <HelpCircle size={16} className="help-icon" />
        </Tooltip>
      </label>
      <Input id="email" type="email" placeholder="Enter email" />
    </div>
  </form>
);
```

### Tooltip with Arrow Positioning

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const ArrowTooltips = () => (
  <div className="tooltip-demo-grid">
    <Tooltip content="Aligned to start" align="start">
      <Button>Start</Button>
    </Tooltip>
    
    <Tooltip content="Centered alignment" align="center">
      <Button>Center</Button>
    </Tooltip>
    
    <Tooltip content="Aligned to end" align="end">
      <Button>End</Button>
    </Tooltip>
  </div>
);
```

### Data Visualization Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";

export const ChartTooltip = ({ dataPoint }) => (
  <Tooltip
    content={
      <div className="chart-tooltip">
        <div className="tooltip-title">{dataPoint.label}</div>
        <div className="tooltip-value">
          <span className="value">{dataPoint.value}</span>
          <span className="unit">{dataPoint.unit}</span>
        </div>
        <div className="tooltip-change">
          <span className={`change ${dataPoint.change >= 0 ? 'positive' : 'negative'}`}>
            {dataPoint.change >= 0 ? '+' : ''}{dataPoint.change}%
          </span>
          <span className="period">vs last period</span>
        </div>
      </div>
    }
    side="top"
    sideOffset={8}
  >
    <div className="chart-bar" style={{ height: `${dataPoint.value}%` }} />
  </Tooltip>
);
```

### Keyboard Navigation Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Kbd } from "@telegraph/kbd";

export const KeyboardTooltips = () => (
  <div className="keyboard-shortcuts">
    <Tooltip
      content={
        <div>
          Quick save: <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
        </div>
      }
    >
      <Button>Save Document</Button>
    </Tooltip>
    
    <Tooltip
      content={
        <div>
          Copy: <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd><br />
          Paste: <Kbd>Ctrl</Kbd> + <Kbd>V</Kbd>
        </div>
      }
    >
      <Button>Edit</Button>
    </Tooltip>
  </div>
);
```

### Status Indicator Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";

export const StatusTooltips = ({ status }) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: "green",
      message: "Operation completed successfully"
    },
    warning: {
      icon: AlertCircle,
      color: "yellow",
      message: "Operation completed with warnings"
    },
    error: {
      icon: XCircle,
      color: "red",
      message: "Operation failed. Please try again"
    },
    pending: {
      icon: Clock,
      color: "blue",
      message: "Operation is still in progress"
    }
  };

  const config = statusConfig[status];

  return (
    <Tooltip content={config.message}>
      <config.icon 
        size={20} 
        className={`status-icon status-${config.color}`}
      />
    </Tooltip>
  );
};
```

### Multi-level Tooltips

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";
import { Settings, User } from "lucide-react";

export const NestedTooltips = () => (
  <div className="nested-tooltip-example">
    <Tooltip content="User account settings">
      <Button icon={{ icon: User, alt: "User" }}>
        Profile
      </Button>
    </Tooltip>
    
    <Tooltip
      content={
        <div>
          <div>Advanced Settings</div>
          <div className="nested-actions">
            <Tooltip content="Manage account preferences" side="right">
              <Button size="0" variant="ghost">Preferences</Button>
            </Tooltip>
            <Tooltip content="Security and privacy settings" side="right">
              <Button size="0" variant="ghost">Security</Button>
            </Tooltip>
          </div>
        </div>
      }
      disableHoverableContent={false}
    >
      <Button icon={{ icon: Settings, alt: "Settings" }}>
        Settings
      </Button>
    </Tooltip>
  </div>
);
```

## Design Tokens & Styling

The Tooltip component uses Telegraph design tokens for consistent theming:

- `--tgph-gray-*` - Background and border colors
- `--tgph-space-*` - Padding and spacing
- `--tgph-radius-*` - Border radius values
- `--tgph-shadow-*` - Drop shadow effects
- `--tgph-font-size-*` - Typography sizing
- `--tgph-z-index-*` - Layering and depth

### Custom Theming

```css
.tgph {
  /* Customize tooltip appearance */
  [data-tgph-tooltip-content] {
    background: var(--tgph-gray-12);
    color: var(--tgph-gray-1);
    border-radius: var(--tgph-radius-2);
    padding: var(--tgph-space-2) var(--tgph-space-3);
    font-size: var(--tgph-font-size-1);
    box-shadow: var(--tgph-shadow-4);
    z-index: var(--tgph-z-index-tooltip);
    
    /* Smooth animations */
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  /* Tooltip arrow */
  [data-tgph-tooltip-arrow] {
    fill: var(--tgph-gray-12);
  }
  
  /* Custom tooltip variants */
  [data-tgph-tooltip-content][data-variant="info"] {
    background: var(--tgph-blue-9);
    color: var(--tgph-blue-contrast);
  }
  
  [data-tgph-tooltip-content][data-variant="warning"] {
    background: var(--tgph-yellow-9);
    color: var(--tgph-yellow-contrast);
  }
  
  [data-tgph-tooltip-content][data-variant="error"] {
    background: var(--tgph-red-9);
    color: var(--tgph-red-contrast);
  }
  
  /* Rich content tooltips */
  .rich-tooltip {
    max-width: 300px;
    padding: var(--tgph-space-3);
  }
  
  .rich-tooltip h4 {
    margin: 0 0 var(--tgph-space-2) 0;
    font-weight: 600;
  }
  
  .rich-tooltip p {
    margin: 0;
    line-height: 1.4;
  }
  
  /* Interactive tooltip content */
  .interactive-tooltip {
    display: flex;
    flex-direction: column;
    gap: var(--tgph-space-2);
  }
  
  .interactive-tooltip .tooltip-actions {
    display: flex;
    gap: var(--tgph-space-1);
  }
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support with proper focus management
- ✅ **Screen Reader Support**: Proper ARIA attributes and announcements
- ✅ **Focus Management**: Tooltips appear on focus for keyboard users
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Reduced Motion**: Respects user's motion preferences

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Show tooltip when element receives focus |
| `Escape` | Hide tooltip when focused |
| `Space` / `Enter` | Activate trigger element (button, link, etc.) |

### ARIA Attributes

- `role="tooltip"` - Applied to tooltip content
- `aria-describedby` - Links trigger to tooltip content
- `aria-hidden` - Properly manages tooltip visibility for screen readers
- `id` - Unique identifier linking tooltip to trigger

### Best Practices

1. **Concise Content**: Keep tooltip text brief and informative
2. **Essential Information**: Only include truly helpful information
3. **Avoid Interactive Content**: Use sparingly for complex interactions
4. **Keyboard Access**: Ensure tooltips work with keyboard navigation
5. **Mobile Considerations**: Consider touch interaction patterns

## Testing

### Testing Library Example

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

test("shows tooltip on hover", async () => {
  const user = userEvent.setup();

  render(
    <Tooltip content="Helpful information">
      <Button>Hover me</Button>
    </Tooltip>
  );

  const button = screen.getByRole("button", { name: "Hover me" });
  
  // Tooltip should not be visible initially
  expect(screen.queryByText("Helpful information")).not.toBeInTheDocument();

  // Hover over the button
  await user.hover(button);

  // Wait for tooltip to appear
  expect(await screen.findByText("Helpful information")).toBeInTheDocument();

  // Move away
  await user.unhover(button);

  // Tooltip should disappear
  await waitFor(() => {
    expect(screen.queryByText("Helpful information")).not.toBeInTheDocument();
  });
});

test("shows tooltip on keyboard focus", async () => {
  const user = userEvent.setup();

  render(
    <Tooltip content="Keyboard accessible">
      <Button>Focus me</Button>
    </Tooltip>
  );

  // Tab to focus the button
  await user.tab();

  const button = screen.getByRole("button", { name: "Focus me" });
  expect(button).toHaveFocus();

  // Tooltip should appear on focus
  expect(await screen.findByText("Keyboard accessible")).toBeInTheDocument();
});
```

### Rich Content Testing

```tsx
test("displays rich content correctly", async () => {
  const user = userEvent.setup();

  const richContent = (
    <div>
      <strong>User Details</strong>
      <p>john@example.com</p>
    </div>
  );

  render(
    <Tooltip content={richContent}>
      <Button>User Info</Button>
    </Tooltip>
  );

  const button = screen.getByRole("button", { name: "User Info" });
  await user.hover(button);

  expect(await screen.findByText("User Details")).toBeInTheDocument();
  expect(screen.getByText("john@example.com")).toBeInTheDocument();
});
```

### Positioning Testing

```tsx
test("respects positioning props", async () => {
  const user = userEvent.setup();

  render(
    <Tooltip content="Bottom tooltip" side="bottom" align="start">
      <Button>Positioned</Button>
    </Tooltip>
  );

  const button = screen.getByRole("button", { name: "Positioned" });
  await user.hover(button);

  const tooltip = await screen.findByRole("tooltip");
  expect(tooltip).toHaveAttribute("data-side", "bottom");
  expect(tooltip).toHaveAttribute("data-align", "start");
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render(
    <Tooltip content="Accessible tooltip">
      <Button>Test button</Button>
    </Tooltip>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test("has proper ARIA attributes", async () => {
  const user = userEvent.setup();

  render(
    <Tooltip content="ARIA test">
      <Button>ARIA button</Button>
    </Tooltip>
  );

  const button = screen.getByRole("button", { name: "ARIA button" });
  await user.hover(button);

  const tooltip = await screen.findByRole("tooltip");
  
  expect(tooltip).toHaveAttribute("role", "tooltip");
  expect(button).toHaveAttribute("aria-describedby", tooltip.id);
});
```

## Examples

### Basic Example

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";

export const BasicExample = () => (
  <Tooltip content="This will save your current work">
    <Button>Save Changes</Button>
  </Tooltip>
);
```

### Advanced Example

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";
import { Badge } from "@telegraph/badge";
import { User, Mail, MapPin, Calendar } from "lucide-react";

export const UserProfileTooltip = ({ user }) => (
  <Tooltip
    content={
      <div className="user-profile-tooltip">
        <div className="user-header">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <Badge variant="soft" color="green">Online</Badge>
          </div>
        </div>
        
        <div className="user-details">
          <div className="detail-item">
            <Mail size={14} />
            <span>{user.email}</span>
          </div>
          <div className="detail-item">
            <MapPin size={14} />
            <span>{user.location}</span>
          </div>
          <div className="detail-item">
            <Calendar size={14} />
            <span>Joined {user.joinDate}</span>
          </div>
        </div>
        
        <div className="user-actions">
          <Button size="0" variant="outline">View Profile</Button>
          <Button size="0" variant="ghost">Send Message</Button>
        </div>
      </div>
    }
    side="right"
    align="start"
    disableHoverableContent={false}
  >
    <div className="user-mention">
      @{user.username}
    </div>
  </Tooltip>
);
```

### Real-world Example

```tsx
import { Tooltip } from "@telegraph/tooltip";
import { Button } from "@telegraph/button";
import { Badge } from "@telegraph/badge";
import { 
  Settings, 
  HelpCircle, 
  Bell, 
  User, 
  LogOut,
  Zap,
  Shield,
  CreditCard 
} from "lucide-react";

export const ApplicationHeader = ({ user, notifications }) => (
  <header className="app-header">
    <div className="header-brand">
      <h1>MyApp</h1>
    </div>

    <nav className="header-nav">
      <Tooltip content="View all notifications">
        <Button 
          variant="ghost" 
          icon={{ icon: Bell, alt: "Notifications" }}
        >
          {notifications.length > 0 && (
            <Badge variant="solid" color="red" size="0">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </Tooltip>

      <Tooltip
        content={
          <div className="feature-tooltip">
            <div className="tooltip-header">
              <Zap size={16} />
              <strong>Premium Features</strong>
            </div>
            <ul>
              <li>Advanced analytics</li>
              <li>Priority support</li>
              <li>Custom integrations</li>
            </ul>
            <Button size="0" variant="outline">
              Upgrade Now
            </Button>
          </div>
        }
        side="bottom"
        align="end"
        disableHoverableContent={false}
      >
        <Button variant="ghost" icon={{ icon: Zap, alt: "Premium" }}>
          Premium
        </Button>
      </Tooltip>

      <Tooltip
        content={
          <div className="help-tooltip">
            <div className="help-section">
              <h4>Need Help?</h4>
              <div className="help-links">
                <a href="/docs">Documentation</a>
                <a href="/support">Contact Support</a>
                <a href="/tutorials">Video Tutorials</a>
              </div>
            </div>
            <div className="help-shortcuts">
              <h5>Keyboard Shortcuts</h5>
              <div className="shortcut">
                <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> - Command palette
              </div>
              <div className="shortcut">
                <Kbd>?</Kbd> - Show all shortcuts
              </div>
            </div>
          </div>
        }
        side="bottom"
        disableHoverableContent={false}
      >
        <Button 
          variant="ghost" 
          icon={{ icon: HelpCircle, alt: "Help" }}
        />
      </Tooltip>

      <Tooltip
        content={
          <div className="user-menu-tooltip">
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                <Badge 
                  variant="soft" 
                  color={user.plan === 'premium' ? 'purple' : 'gray'}
                  size="0"
                >
                  {user.plan}
                </Badge>
              </div>
            </div>
            
            <div className="menu-divider" />
            
            <div className="menu-items">
              <div className="menu-item">
                <User size={16} />
                <span>Profile Settings</span>
              </div>
              <div className="menu-item">
                <Shield size={16} />
                <span>Privacy & Security</span>
              </div>
              <div className="menu-item">
                <CreditCard size={16} />
                <span>Billing</span>
              </div>
              <div className="menu-item">
                <Settings size={16} />
                <span>Preferences</span>
              </div>
            </div>
            
            <div className="menu-divider" />
            
            <div className="menu-item danger">
              <LogOut size={16} />
              <span>Sign Out</span>
            </div>
          </div>
        }
        side="bottom"
        align="end"
        disableHoverableContent={false}
      >
        <Button variant="ghost" className="user-menu-trigger">
          <div className="user-avatar-small">
            <User size={16} />
          </div>
          <span className="user-name-short">{user.name.split(' ')[0]}</span>
        </Button>
      </Tooltip>
    </nav>
  </header>
);
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/tooltip)
- [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) - Base primitive
- [Popover Component](../popover/README.md) - Related overlay component
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
