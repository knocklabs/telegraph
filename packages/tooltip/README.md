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
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import { Info } from "lucide-react";

export const TooltipExample = () => (
  <div>
    {/* Basic tooltip */}
    <Tooltip label="This button saves your changes">
      <Button>Save</Button>
    </Tooltip>

    {/* Rich content tooltip */}
    <Tooltip
      label={
        <div>
          <strong>Pro Tip:</strong>
          <br />
          Use Ctrl+S to save quickly
        </div>
      }
    >
      <Button icon={{ icon: Info, alt: "Info" }}>Help</Button>
    </Tooltip>
  </div>
);
```

## API Reference

### `<Tooltip>`

The main tooltip component that wraps content and provides contextual information on hover or focus.

| Prop                      | Type                                     | Default     | Description                                                  |
| ------------------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------ |
| `label`                   | `string \| ReactNode`                    | -           | **Required.** Content to display in the tooltip              |
| `side`                    | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"`  | Preferred placement side                                     |
| `align`                   | `"start" \| "center" \| "end"`           | `"center"`  | Alignment relative to the trigger                            |
| `sideOffset`              | `number`                                 | `4`         | Distance from the trigger element                            |
| `alignOffset`             | `number`                                 | `0`         | Offset along the alignment axis                              |
| `delayDuration`           | `number`                                 | `400`       | Delay before showing tooltip (ms)                            |
| `skipDelayDuration`       | `number`                                 | -           | Skip delay if another tooltip was recently shown             |
| `disableHoverableContent` | `boolean`                                | `false`     | Prevent tooltip from staying open when hovering over content |
| `avoidCollisions`         | `boolean`                                | `true`      | Automatically flip tooltip to avoid viewport edges           |
| `sticky`                  | `"partial" \| "always"`                  | `"partial"` | How tooltip follows the cursor                               |
| `hideWhenDetached`        | `boolean`                                | `false`     | Hide tooltip when trigger is not visible                     |

## Usage Patterns

### Basic Tooltip

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const BasicTooltip = () => (
  <Tooltip label="Click to save your work">
    <Button>Save</Button>
  </Tooltip>
);
```

### Different Positions

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const PositionedTooltips = () => (
  <div>
    <Tooltip label="Tooltip on top" side="top">
      <Button>Top</Button>
    </Tooltip>

    <Tooltip label="Tooltip on right" side="right">
      <Button>Right</Button>
    </Tooltip>

    <Tooltip label="Tooltip on bottom" side="bottom">
      <Button>Bottom</Button>
    </Tooltip>

    <Tooltip label="Tooltip on left" side="left">
      <Button>Left</Button>
    </Tooltip>
  </div>
);
```

### Rich Content

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import { Mail, Phone, User } from "lucide-react";

export const RichContentTooltip = () => (
  <Tooltip
    label={
      <div className="user-tooltip">
        <div className="user-header">
          <User size={20} />
          <strong>John Doe</strong>
        </div>
        <div className="user-details">
          <div>
            <Mail size={16} /> john@example.com
          </div>
          <div>
            <Phone size={16} /> +1 (555) 123-4567
          </div>
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
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const CustomDelayTooltips = () => (
  <div>
    {/* Instant tooltip */}
    <Tooltip label="Shows immediately" delayDuration={0}>
      <Button>Instant</Button>
    </Tooltip>

    {/* Slow tooltip */}
    <Tooltip label="Takes time to show" delayDuration={1500}>
      <Button>Slow</Button>
    </Tooltip>
  </div>
);
```

### Disabled Elements

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const DisabledTooltip = () => (
  <Tooltip label="This action is not available right now">
    <span>
      {" "}
      {/* Wrapper needed for disabled elements */}
      <Button disabled>Disabled Action</Button>
    </span>
  </Tooltip>
);
```

## Advanced Usage

### Conditional Tooltips

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const ConditionalTooltip = ({ showTooltip, user }) => (
  <Tooltip label={showTooltip ? `Hello, ${user.name}!` : "Sign in to continue"}>
    <Button>{user.isLoggedIn ? "Dashboard" : "Sign In"}</Button>
  </Tooltip>
);
```

### Interactive Tooltips

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import Link from "next/link";

export const InteractiveTooltip = () => (
  <Tooltip
    label={
      <div className="interactive-tooltip">
        <p>Need help with this feature?</p>
        <div className="tooltip-actions">
          <Link href="/docs">
            <Button size="0" variant="ghost">
              View Docs
            </Button>
          </Link>
          <Button size="0" variant="outline">
            Contact Support
          </Button>
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
import { Input } from "@telegraph/input";
import { Tooltip } from "@telegraph/tooltip";
import { HelpCircle } from "lucide-react";

export const FormWithTooltips = () => (
  <form className="form-with-tooltips">
    <div className="form-field">
      <label htmlFor="username">
        Username
        <Tooltip
          label="Username must be 3-20 characters long and contain only letters, numbers, and underscores"
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
          label="We'll use this email for account notifications and password recovery"
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
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const ArrowTooltips = () => (
  <div className="tooltip-demo-grid">
    <Tooltip label="Aligned to start" align="start">
      <Button>Start</Button>
    </Tooltip>

    <Tooltip label="Centered alignment" align="center">
      <Button>Center</Button>
    </Tooltip>

    <Tooltip label="Aligned to end" align="end">
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
    label={
      <div className="chart-tooltip">
        <div className="tooltip-title">{dataPoint.label}</div>
        <div className="tooltip-value">
          <span className="value">{dataPoint.value}</span>
          <span className="unit">{dataPoint.unit}</span>
        </div>
        <div className="tooltip-change">
          <span
            className={`change ${dataPoint.change >= 0 ? "positive" : "negative"}`}
          >
            {dataPoint.change >= 0 ? "+" : ""}
            {dataPoint.change}%
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
import { Kbd } from "@telegraph/kbd";
import { Tooltip } from "@telegraph/tooltip";

export const KeyboardTooltips = () => (
  <div className="keyboard-shortcuts">
    <Tooltip
      label={
        <div>
          Quick save: <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
        </div>
      }
    >
      <Button>Save Document</Button>
    </Tooltip>

    <Tooltip
      label={
        <div>
          Copy: <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
          <br />
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
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

export const StatusTooltips = ({ status }) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: "green",
      message: "Operation completed successfully",
    },
    warning: {
      icon: AlertCircle,
      color: "yellow",
      message: "Operation completed with warnings",
    },
    error: {
      icon: XCircle,
      color: "red",
      message: "Operation failed. Please try again",
    },
    pending: {
      icon: Clock,
      color: "blue",
      message: "Operation is still in progress",
    },
  };

  const config = statusConfig[status];

  return (
    <Tooltip label={config.message}>
      <config.icon size={20} className={`status-icon status-${config.color}`} />
    </Tooltip>
  );
};
```

### Multi-level Tooltips

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import { Settings, User } from "lucide-react";

export const NestedTooltips = () => (
  <div className="nested-tooltip-example">
    <Tooltip label="User account settings">
      <Button icon={{ icon: User, alt: "User" }}>Profile</Button>
    </Tooltip>

    <Tooltip
      label={
        <div>
          <div>Advanced Settings</div>
          <div className="nested-actions">
            <Tooltip label="Manage account preferences" side="right">
              <Button size="0" variant="ghost">
                Preferences
              </Button>
            </Tooltip>
            <Tooltip label="Security and privacy settings" side="right">
              <Button size="0" variant="ghost">
                Security
              </Button>
            </Tooltip>
          </div>
        </div>
      }
      disableHoverableContent={false}
    >
      <Button icon={{ icon: Settings, alt: "Settings" }}>Settings</Button>
    </Tooltip>
  </div>
);
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support with proper focus management
- ✅ **Screen Reader Support**: Proper ARIA attributes and announcements
- ✅ **Focus Management**: Tooltips appear on focus for keyboard users
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Reduced Motion**: Respects user's motion preferences

### Keyboard Shortcuts

| Key               | Action                                        |
| ----------------- | --------------------------------------------- |
| `Tab`             | Show tooltip when element receives focus      |
| `Escape`          | Hide tooltip when focused                     |
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

## Examples

### Basic Example

```tsx
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";

export const BasicExample = () => (
  <Tooltip label="This will save your current work">
    <Button>Save Changes</Button>
  </Tooltip>
);
```

### Advanced Example

```tsx
import { Tag } from "@telegraph/tag";
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import { Calendar, Mail, MapPin, User } from "lucide-react";

export const UserProfileTooltip = ({ user }) => (
  <Tooltip
    label={
      <div className="user-profile-tooltip">
        <div className="user-header">
          <div className="user-avatar">
            <User size={24} />
          </div>
          <div className="user-info">
            <h4>{user.name}</h4>
            <Tag variant="soft" color="green">
              Online
            </Tag>
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
          <Button size="0" variant="outline">
            View Profile
          </Button>
          <Button size="0" variant="ghost">
            Send Message
          </Button>
        </div>
      </div>
    }
    side="right"
    align="start"
    disableHoverableContent={false}
  >
    <div className="user-mention">@{user.username}</div>
  </Tooltip>
);
```

### Real-world Example

```tsx
import { Tag } from "@telegraph/tag";
import { Button } from "@telegraph/button";
import { Tooltip } from "@telegraph/tooltip";
import {
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  User,
  Zap,
} from "lucide-react";

export const ApplicationHeader = ({ user, notifications }) => (
  <header className="app-header">
    <div className="header-brand">
      <h1>MyApp</h1>
    </div>

    <nav className="header-nav">
      <Tooltip label="View all notifications">
        <Button variant="ghost" icon={{ icon: Bell, alt: "Notifications" }}>
          {notifications.length > 0 && (
            <Tag variant="solid" color="red" size="0">
              {notifications.length}
            </Tag>
          )}
        </Button>
      </Tooltip>

      <Tooltip
        label={
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
        label={
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
        <Button variant="ghost" icon={{ icon: HelpCircle, alt: "Help" }} />
      </Tooltip>

      <Tooltip
        label={
          <div className="user-menu-tooltip">
            <div className="user-info">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                <Tag
                  variant="soft"
                  color={user.plan === "premium" ? "purple" : "gray"}
                  size="0"
                >
                  {user.plan}
                </Tag>
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
          <span className="user-name-short">{user.name.split(" ")[0]}</span>
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

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
