# 🎛️ Segmented Control

> Grouped toggle control for selecting between mutually exclusive or multiple options with a cohesive interface.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/segmented-control.svg)](https://www.npmjs.com/package/@telegraph/segmented-control)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/segmented-control)](https://bundlephobia.com/result?p=@telegraph/segmented-control)
[![license](https://img.shields.io/npm/l/@telegraph/segmented-control)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/segmented-control
```

### Add stylesheet

Pick one:

Via CSS (preferred):

```css
@import "@telegraph/segmented-control";
```

Via Javascript:

```tsx
import "@telegraph/segmented-control/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const ViewSelector = () => {
  const [view, setView] = useState("list");

  return (
    <SegmentedControl.Root type="single" value={view} onValueChange={setView}>
      <SegmentedControl.Option value="list">List</SegmentedControl.Option>
      <SegmentedControl.Option value="grid">Grid</SegmentedControl.Option>
      <SegmentedControl.Option value="card">Card</SegmentedControl.Option>
    </SegmentedControl.Root>
  );
};
```

## API Reference

### `<SegmentedControl.Root>`

The container component that manages the selection state and layout.

| Prop            | Type                                  | Default        | Description                             |
| --------------- | ------------------------------------- | -------------- | --------------------------------------- |
| `type`          | `"single" \| "multiple"`              | `"single"`     | Selection mode                          |
| `value`         | `string \| string[]`                  | `undefined`    | Controlled value(s)                     |
| `defaultValue`  | `string \| string[]`                  | `undefined`    | Default value(s) for uncontrolled usage |
| `onValueChange` | `(value: string \| string[]) => void` | `undefined`    | Called when selection changes           |
| `disabled`      | `boolean`                             | `false`        | Disable all options                     |
| `orientation`   | `"horizontal" \| "vertical"`          | `"horizontal"` | Layout orientation                      |
| `rovingFocus`   | `boolean`                             | `true`         | Enable keyboard navigation              |
| `loop`          | `boolean`                             | `true`         | Loop focus when reaching ends           |

### `<SegmentedControl.Option>`

Individual option button within the segmented control.

| Prop       | Type                              | Default | Description                       |
| ---------- | --------------------------------- | ------- | --------------------------------- |
| `value`    | `string`                          | -       | Unique identifier for this option |
| `disabled` | `boolean`                         | `false` | Disable this specific option      |
| `size`     | `"0" \| "1" \| "2" \| "3" \| "4"` | `"1"`   | Button size                       |
| `children` | `ReactNode`                       | -       | Content of the option             |

## Usage Patterns

### Single Selection

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const TimeRangeSelector = () => {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <SegmentedControl.Root
      type="single"
      value={timeRange}
      onValueChange={setTimeRange}
    >
      <SegmentedControl.Option value="day">Day</SegmentedControl.Option>
      <SegmentedControl.Option value="week">Week</SegmentedControl.Option>
      <SegmentedControl.Option value="month">Month</SegmentedControl.Option>
      <SegmentedControl.Option value="year">Year</SegmentedControl.Option>
    </SegmentedControl.Root>
  );
};
```

### Multiple Selection

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const NotificationSettings = () => {
  const [notifications, setNotifications] = useState(["email", "push"]);

  return (
    <SegmentedControl.Root
      type="multiple"
      value={notifications}
      onValueChange={setNotifications}
    >
      <SegmentedControl.Option value="email">Email</SegmentedControl.Option>
      <SegmentedControl.Option value="push">Push</SegmentedControl.Option>
      <SegmentedControl.Option value="sms">SMS</SegmentedControl.Option>
      <SegmentedControl.Option value="slack">Slack</SegmentedControl.Option>
    </SegmentedControl.Root>
  );
};
```

### With Icons

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { Card, Grid, List } from "lucide-react";

export const LayoutSelector = () => {
  const [layout, setLayout] = useState("list");

  return (
    <SegmentedControl.Root
      type="single"
      value={layout}
      onValueChange={setLayout}
    >
      <SegmentedControl.Option value="list">
        <List size={16} />
        List
      </SegmentedControl.Option>
      <SegmentedControl.Option value="grid">
        <Grid size={16} />
        Grid
      </SegmentedControl.Option>
      <SegmentedControl.Option value="card">
        <Card size={16} />
        Card
      </SegmentedControl.Option>
    </SegmentedControl.Root>
  );
};
```

### Vertical Layout

```tsx
<SegmentedControl.Root
  type="single"
  value={selectedOption}
  onValueChange={setSelectedOption}
  orientation="vertical"
>
  <SegmentedControl.Option value="option1">Option 1</SegmentedControl.Option>
  <SegmentedControl.Option value="option2">Option 2</SegmentedControl.Option>
  <SegmentedControl.Option value="option3">Option 3</SegmentedControl.Option>
</SegmentedControl.Root>
```

### Different Sizes

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const SizedControls = () => (
  <div>
    {/* Small */}
    <SegmentedControl.Root
      type="single"
      value="option1"
      onValueChange={console.log}
    >
      <SegmentedControl.Option value="option1" size="0">
        Small
      </SegmentedControl.Option>
      <SegmentedControl.Option value="option2" size="0">
        Small
      </SegmentedControl.Option>
    </SegmentedControl.Root>

    {/* Large */}
    <SegmentedControl.Root
      type="single"
      value="option1"
      onValueChange={console.log}
    >
      <SegmentedControl.Option value="option1" size="3">
        Large
      </SegmentedControl.Option>
      <SegmentedControl.Option value="option2" size="3">
        Large
      </SegmentedControl.Option>
    </SegmentedControl.Root>
  </div>
);
```

## Advanced Usage

### Form Integration

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  priority: string;
  categories: string[];
};

export const TaskForm = () => {
  const { control, handleSubmit } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <div>
        <label>Priority</label>
        <Controller
          name="priority"
          control={control}
          rules={{ required: "Priority is required" }}
          render={({ field, fieldState }) => (
            <div>
              <SegmentedControl.Root
                type="single"
                value={field.value}
                onValueChange={field.onChange}
              >
                <SegmentedControl.Option value="low">
                  Low
                </SegmentedControl.Option>
                <SegmentedControl.Option value="medium">
                  Medium
                </SegmentedControl.Option>
                <SegmentedControl.Option value="high">
                  High
                </SegmentedControl.Option>
              </SegmentedControl.Root>
              {fieldState.error && (
                <span className="error">{fieldState.error.message}</span>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <label>Categories</label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <SegmentedControl.Root
              type="multiple"
              value={field.value || []}
              onValueChange={field.onChange}
            >
              <SegmentedControl.Option value="work">
                Work
              </SegmentedControl.Option>
              <SegmentedControl.Option value="personal">
                Personal
              </SegmentedControl.Option>
              <SegmentedControl.Option value="urgent">
                Urgent
              </SegmentedControl.Option>
            </SegmentedControl.Root>
          )}
        />
      </div>
    </form>
  );
};
```

### Conditional Options

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const ConditionalSegmentedControl = ({ userRole, permissions }) => {
  const [view, setView] = useState("read");

  const availableViews = [
    { value: "read", label: "Read", requiredPermission: "read" },
    { value: "write", label: "Write", requiredPermission: "write" },
    { value: "admin", label: "Admin", requiredPermission: "admin" },
  ].filter((view) => permissions.includes(view.requiredPermission));

  return (
    <SegmentedControl.Root type="single" value={view} onValueChange={setView}>
      {availableViews.map((view) => (
        <SegmentedControl.Option key={view.value} value={view.value}>
          {view.label}
        </SegmentedControl.Option>
      ))}
    </SegmentedControl.Root>
  );
};
```

### Loading State

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { Box } from "@telegraph/layout";

export const SegmentedControlWithLoading = ({ loading, options, ...props }) => {
  if (loading) {
    return (
      <div className="segmented-control-skeleton">
        <Box w="80" h="8" bg="gray-3" rounded="2" />
      </div>
    );
  }

  return (
    <SegmentedControl.Root {...props}>
      {options.map((option) => (
        <SegmentedControl.Option key={option.value} value={option.value}>
          {option.label}
        </SegmentedControl.Option>
      ))}
    </SegmentedControl.Root>
  );
};
```

### Dynamic Options

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const DynamicSegmentedControl = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Fetch categories from API
    fetchCategories().then(setCategories);
  }, []);

  return (
    <SegmentedControl.Root
      type="single"
      value={selectedCategory}
      onValueChange={setSelectedCategory}
    >
      {categories.map((category) => (
        <SegmentedControl.Option
          key={category.id}
          value={category.id}
          disabled={!category.enabled}
        >
          {category.name}
          {category.count && ` (${category.count})`}
        </SegmentedControl.Option>
      ))}
    </SegmentedControl.Root>
  );
};
```

### Responsive Design

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { useEffect, useState } from "react";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export const ResponsiveSegmentedControl = ({ options, ...props }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SegmentedControl.Root
      orientation={isMobile ? "vertical" : "horizontal"}
      {...props}
    >
      {options.map((option) => (
        <SegmentedControl.Option
          key={option.value}
          value={option.value}
          size={isMobile ? "2" : "1"}
        >
          {isMobile ? option.shortLabel || option.label : option.label}
        </SegmentedControl.Option>
      ))}
    </SegmentedControl.Root>
  );
};
```

### With Tooltips

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { Tooltip } from "@telegraph/tooltip";

export const SegmentedControlWithTooltips = () => {
  const [sorting, setSorting] = useState("name");

  const sortOptions = [
    { value: "name", label: "Name", tooltip: "Sort by name (A-Z)" },
    { value: "date", label: "Date", tooltip: "Sort by creation date" },
    { value: "size", label: "Size", tooltip: "Sort by file size" },
  ];

  return (
    <SegmentedControl.Root
      type="single"
      value={sorting}
      onValueChange={setSorting}
    >
      {sortOptions.map((option) => (
        <Tooltip key={option.value} content={option.tooltip}>
          <SegmentedControl.Option value={option.value}>
            {option.label}
          </SegmentedControl.Option>
        </Tooltip>
      ))}
    </SegmentedControl.Root>
  );
};
```

## Accessibility

- ✅ **Keyboard Navigation**: Arrow keys navigate between options
- ✅ **Screen Reader Support**: Proper ARIA roles and states
- ✅ **Focus Management**: Clear focus indicators and logical tab order
- ✅ **High Contrast**: Supports high contrast mode
- ✅ **Touch Targets**: Adequate touch target sizes

### Keyboard Shortcuts

| Key               | Action                                   |
| ----------------- | ---------------------------------------- |
| `Tab`             | Move focus to/from the segmented control |
| `Arrow Keys`      | Navigate between options                 |
| `Space` / `Enter` | Toggle the focused option                |
| `Home`            | Move to first option                     |
| `End`             | Move to last option                      |

### ARIA Attributes

- `role="group"` - Applied to the root container
- `role="button"` - Applied to each option
- `aria-pressed` - Indicates the selected state
- `aria-label` - Provides accessible names for options

### Best Practices

1. **Provide Clear Labels**: Use concise, descriptive labels for options
2. **Logical Grouping**: Group related options together
3. **Consistent Ordering**: Maintain logical order (e.g., temporal, alphabetical)
4. **Appropriate Defaults**: Set sensible default selections
5. **Error Handling**: Provide clear feedback for validation errors

## Examples

### Basic Example

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";

export const ThemeSelector = () => {
  const [theme, setTheme] = useState("system");

  return (
    <SegmentedControl.Root type="single" value={theme} onValueChange={setTheme}>
      <SegmentedControl.Option value="light">Light</SegmentedControl.Option>
      <SegmentedControl.Option value="dark">Dark</SegmentedControl.Option>
      <SegmentedControl.Option value="system">System</SegmentedControl.Option>
    </SegmentedControl.Root>
  );
};
```

### Advanced Example

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { BarChart, LineChart, PieChart } from "lucide-react";

export const ChartTypeSelector = () => {
  const [chartType, setChartType] = useState("line");
  const [dataViews, setDataViews] = useState(["table", "export"]);

  return (
    <div className="chart-controls">
      <div>
        <label>Chart Type</label>
        <SegmentedControl.Root
          type="single"
          value={chartType}
          onValueChange={setChartType}
        >
          <SegmentedControl.Option value="line">
            <LineChart size={16} />
            Line
          </SegmentedControl.Option>
          <SegmentedControl.Option value="bar">
            <BarChart size={16} />
            Bar
          </SegmentedControl.Option>
          <SegmentedControl.Option value="pie">
            <PieChart size={16} />
            Pie
          </SegmentedControl.Option>
        </SegmentedControl.Root>
      </div>

      <div>
        <label>Data Views</label>
        <SegmentedControl.Root
          type="multiple"
          value={dataViews}
          onValueChange={setDataViews}
        >
          <SegmentedControl.Option value="table">Table</SegmentedControl.Option>
          <SegmentedControl.Option value="export">
            Export
          </SegmentedControl.Option>
          <SegmentedControl.Option value="share">Share</SegmentedControl.Option>
        </SegmentedControl.Root>
      </div>
    </div>
  );
};
```

### Real-world Example

```tsx
import { SegmentedControl } from "@telegraph/segmented-control";
import { useForm } from "react-hook-form";

export const ProjectSettingsForm = () => {
  const { register, watch, handleSubmit } = useForm({
    defaultValues: {
      visibility: "private",
      notifications: ["comments", "mentions"],
    },
  });

  const visibility = watch("visibility");
  const notifications = watch("notifications");

  return (
    <form onSubmit={handleSubmit(console.log)} className="project-settings">
      <div className="form-group">
        <label>Project Visibility</label>
        <SegmentedControl.Root
          type="single"
          value={visibility}
          onValueChange={(value) =>
            register("visibility").onChange({ target: { value } })
          }
        >
          <SegmentedControl.Option value="private">
            Private
          </SegmentedControl.Option>
          <SegmentedControl.Option value="team">
            Team Only
          </SegmentedControl.Option>
          <SegmentedControl.Option value="public">
            Public
          </SegmentedControl.Option>
        </SegmentedControl.Root>
        <p className="help-text">
          {visibility === "private" && "Only you can see this project"}
          {visibility === "team" && "Team members can access this project"}
          {visibility === "public" && "Anyone can view this project"}
        </p>
      </div>

      <div className="form-group">
        <label>Email Notifications</label>
        <SegmentedControl.Root
          type="multiple"
          value={notifications}
          onValueChange={(value) =>
            register("notifications").onChange({ target: { value } })
          }
        >
          <SegmentedControl.Option value="comments">
            Comments
          </SegmentedControl.Option>
          <SegmentedControl.Option value="mentions">
            @Mentions
          </SegmentedControl.Option>
          <SegmentedControl.Option value="updates">
            Updates
          </SegmentedControl.Option>
          <SegmentedControl.Option value="releases">
            Releases
          </SegmentedControl.Option>
        </SegmentedControl.Root>
      </div>

      <button type="submit">Save Settings</button>
    </form>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/segmented-control)
- [Radix UI Toggle Group](https://www.radix-ui.com/primitives/docs/components/toggle-group)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
