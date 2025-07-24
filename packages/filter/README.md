# 🔽 Filter

> A flexible, composable filter system with search, multi-select, and nested menu support.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/filter.svg)](https://www.npmjs.com/package/@telegraph/filter)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/filter)](https://bundlephobia.com/result?p=@telegraph/filter)
[![license](https://img.shields.io/npm/l/@telegraph/filter)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

> **Note**: This package is currently in development and marked as private.

## Installation

```bash
npm install @telegraph/filter
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/filter";
```

Via Javascript:
```tsx
import "@telegraph/filter/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Filter } from "@telegraph/filter";
import { Button } from "@telegraph/button";
import { ListFilter, Users, Tag } from "lucide-react";

export const BasicFilter = () => {
  return (
    <Filter.Root>
      <Filter.Trigger>
        <Button leadingIcon={{ icon: ListFilter, alt: "Filter" }}>
          Filters
        </Button>
      </Filter.Trigger>
      
      <Filter.Content>
        <Filter.Parameter 
          name="Status" 
          value="status" 
          icon={Tag}
          isMulti={true}
          pluralNoun="statuses"
        >
          <Filter.Option value="active" name="Active" />
          <Filter.Option value="inactive" name="Inactive" />
          <Filter.Option value="pending" name="Pending" />
        </Filter.Parameter>
        
        <Filter.Parameter 
          name="Department" 
          value="department" 
          icon={Users}
          isMulti={false}
        >
          <Filter.Option value="engineering" name="Engineering" />
          <Filter.Option value="design" name="Design" />
          <Filter.Option value="marketing" name="Marketing" />
        </Filter.Parameter>
      </Filter.Content>
      
      <Filter.ChipDisplay />
    </Filter.Root>
  );
};
```

## API Reference

### `<Filter.Root>`

The root component that manages filter state and context.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Filter content and components |

### `<Filter.Trigger>`

Trigger button for opening the filter menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Trigger content (usually a Button) |

### `<Filter.Content>`

Container for filter options with optional search functionality.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Filter parameters and options |
| `isTopSearchable` | `boolean` | `false` | Enable search at top level |

### `<Filter.Parameter>`

Wrapper for a group of filter options with shared configuration.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Display name for the parameter |
| `value` | `string` | required | Unique key for this parameter |
| `icon` | `LucideIcon` | `undefined` | Icon for the parameter |
| `isMulti` | `boolean` | `false` | Allow multiple selections |
| `pluralNoun` | `string` | `"items"` | Plural form for display |

### `<Filter.Option>`

Individual selectable option within a parameter.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | Option value |
| `name` | `string` | `value` | Display name |
| `icon` | `LucideIcon` | `undefined` | Option icon |

### `<Filter.Menu>`

Creates a nested submenu for organizing complex filter hierarchies.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Menu display name |
| `icon` | `LucideIcon` | `undefined` | Menu icon |
| `isSearchable` | `boolean` | `false` | Enable search in submenu |
| `children` | `ReactNode` | required | Submenu content |

### `<Filter.ChipDisplay>`

Displays active filters as removable chips.

### `<Filter.Chip>`

Individual filter chip component (usually used internally).

| Prop | Type | Description |
|------|------|-------------|
| `filterKey` | `string` | Filter parameter key |
| `active` | `FilterOption \| FilterOption[]` | Selected option(s) |
| `operator` | `OperatorValue` | Filter operator |
| `filterName` | `string` | Parameter display name |
| `icon` | `LucideIcon` | Parameter icon |

## Advanced Usage

### Multi-Select Filters

```tsx
import { Filter } from "@telegraph/filter";
import { Tags } from "lucide-react";

export const MultiSelectFilter = () => {
  return (
    <Filter.Root>
      <Filter.Trigger>
        <Button>Select Tags</Button>
      </Filter.Trigger>
      
      <Filter.Content>
        <Filter.Parameter 
          name="Tags" 
          value="tags" 
          icon={Tags}
          isMulti={true}
          pluralNoun="tags"
        >
          <Filter.Option value="urgent" name="Urgent" />
          <Filter.Option value="feature" name="Feature" />
          <Filter.Option value="bug" name="Bug" />
          <Filter.Option value="enhancement" name="Enhancement" />
        </Filter.Parameter>
      </Filter.Content>
      
      <Filter.ChipDisplay />
    </Filter.Root>
  );
};
```

### Searchable Filters

```tsx
import { Filter } from "@telegraph/filter";
import { Users } from "lucide-react";

export const SearchableFilter = () => {
  return (
    <Filter.Root>
      <Filter.Trigger>
        <Button>Select Users</Button>
      </Filter.Trigger>
      
      <Filter.Content isTopSearchable={true}>
        <Filter.Parameter 
          name="Assignee" 
          value="assignee" 
          icon={Users}
          isMulti={false}
        >
          <Filter.Option value="john" name="John Doe" />
          <Filter.Option value="jane" name="Jane Smith" />
          <Filter.Option value="bob" name="Bob Johnson" />
          <Filter.Option value="alice" name="Alice Wilson" />
          {/* More users... search will filter these */}
        </Filter.Parameter>
      </Filter.Content>
      
      <Filter.ChipDisplay />
    </Filter.Root>
  );
};
```

### Nested Filter Menus

```tsx
import { Filter } from "@telegraph/filter";
import { Building, Users, MapPin } from "lucide-react";

export const NestedFilter = () => {
  return (
    <Filter.Root>
      <Filter.Trigger>
        <Button>Advanced Filters</Button>
      </Filter.Trigger>
      
      <Filter.Content>
        <Filter.Menu name="Organization" icon={Building} isSearchable={true}>
          <Filter.Parameter 
            name="Department" 
            value="department" 
            icon={Users}
            isMulti={true}
          >
            <Filter.Option value="eng" name="Engineering" />
            <Filter.Option value="design" name="Design" />
            <Filter.Option value="marketing" name="Marketing" />
          </Filter.Parameter>
          
          <Filter.Menu name="Location" icon={MapPin}>
            <Filter.Parameter 
              name="Office" 
              value="office" 
              icon={Building}
              isMulti={false}
            >
              <Filter.Option value="sf" name="San Francisco" />
              <Filter.Option value="ny" name="New York" />
              <Filter.Option value="london" name="London" />
            </Filter.Parameter>
          </Filter.Menu>
        </Filter.Menu>
      </Filter.Content>
      
      <Filter.ChipDisplay />
    </Filter.Root>
  );
};
```

### Using Filter State

Access filter state using the `useFilter` hook:

```tsx
import { Filter, useFilter } from "@telegraph/filter";
import { useEffect } from "react";

const FilterConsumer = () => {
  const { stateControl } = useFilter();
  
  useEffect(() => {
    // Log filter changes
    console.log('Current filters:', stateControl.state);
  }, [stateControl.state]);
  
  const handleClearAll = () => {
    stateControl.reset();
  };
  
  return (
    <div>
      <Filter.ChipDisplay />
      <Button onClick={handleClearAll}>Clear All Filters</Button>
    </div>
  );
};

export const FilterWithState = () => {
  return (
    <Filter.Root>
      {/* Filter components */}
      <FilterConsumer />
    </Filter.Root>
  );
};
```

### Custom Filter Logic

```tsx
import { Filter, useFilter } from "@telegraph/filter";

const CustomFilterControls = () => {
  const { stateControl } = useFilter();
  
  const hasActiveFilters = Object.keys(stateControl.state).length > 0;
  
  const handlePresetFilter = () => {
    // Apply a preset filter combination
    stateControl.add("status", {
      filterKey: "status",
      filterName: "Status",
      option: { value: "active", name: "Active" },
      isMulti: false,
      operator: "is",
    });
  };
  
  return (
    <div>
      <Button onClick={handlePresetFilter} disabled={hasActiveFilters}>
        Quick Filter: Active Items
      </Button>
      
      {hasActiveFilters && (
        <Text>
          {Object.keys(stateControl.state).length} filter(s) active
        </Text>
      )}
    </div>
  );
};
```

## Filter State Structure

The filter state follows this structure:

```tsx
type FilterState = {
  [filterKey: string]: {
    filterKey: string;
    filterName: string;
    active: FilterOption | FilterOption[];
    operator: "is" | "is_any_of" | "is_all_of";
    isMulti: boolean;
    icon?: LucideIcon;
    pluralNoun?: string;
  };
};

type FilterOption = {
  value: string;
  name: string;
  icon?: LucideIcon;
};
```

Example state:
```json
{
  "status": {
    "filterKey": "status",
    "filterName": "Status",
    "active": [
      { "value": "active", "name": "Active" },
      { "value": "pending", "name": "Pending" }
    ],
    "operator": "is_any_of",
    "isMulti": true,
    "pluralNoun": "statuses"
  },
  "department": {
    "filterKey": "department", 
    "filterName": "Department",
    "active": { "value": "engineering", "name": "Engineering" },
    "operator": "is",
    "isMulti": false
  }
}
```

## Design Tokens & Styling

The filter system uses standard Telegraph design tokens:

- `--tgph-colors-surface-{scale}` - Menu backgrounds
- `--tgph-colors-gray-{scale}` - Borders and text
- `--tgph-spacing-{scale}` - Padding and margins
- `--tgph-radii-{scale}` - Border radius

### Custom Styling

```css
.tgph {
  /* Customize filter menu appearance */
  [data-tgph-menu-content] {
    min-width: 250px;
    max-height: 400px;
  }
  
  /* Customize filter chips */
  [data-tgph-button][data-tgph-button-variant="outline"] {
    border-color: var(--tgph-colors-accent-6);
  }
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support with arrow keys and Enter
- ✅ **Screen Readers**: ARIA labels and proper menu semantics
- ✅ **Focus Management**: Logical focus flow through menu options
- ✅ **Search Support**: Screen reader announcements for search results

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` / `↑` | Navigate menu options |
| `Enter` / `Space` | Select option |
| `Escape` | Close menu |
| `Tab` | Move to next focusable element |

### Best Practices

1. **Meaningful Labels**: Use clear, descriptive names for parameters and options
2. **Logical Grouping**: Group related options under the same parameter
3. **Search for Large Lists**: Enable search when there are many options
4. **Visual Hierarchy**: Use icons and nesting to create clear information hierarchy

## Testing

### Testing Library Example

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filter } from "@telegraph/filter";
import { Button } from "@telegraph/button";

test("opens filter menu and selects option", async () => {
  const user = userEvent.setup();
  
  render(
    <Filter.Root>
      <Filter.Trigger>
        <Button>Filters</Button>
      </Filter.Trigger>
      <Filter.Content>
        <Filter.Parameter name="Status" value="status" isMulti={false}>
          <Filter.Option value="active" name="Active" />
          <Filter.Option value="inactive" name="Inactive" />
        </Filter.Parameter>
      </Filter.Content>
      <Filter.ChipDisplay />
    </Filter.Root>
  );
  
  // Open filter menu
  await user.click(screen.getByText("Filters"));
  
  // Select an option
  await user.click(screen.getByText("Active"));
  
  // Check if chip appears
  expect(screen.getByText("Status")).toBeInTheDocument();
});
```

### Testing Filter State

```tsx
import { renderHook, act } from "@testing-library/react";
import { useInternalFilterState } from "@telegraph/filter";

test("filter state management", () => {
  const { result } = renderHook(() => useInternalFilterState());
  
  act(() => {
    result.current.add("status", {
      filterKey: "status",
      filterName: "Status",
      option: { value: "active", name: "Active" },
      isMulti: false,
      operator: "is",
    });
  });
  
  expect(result.current.state.status).toBeDefined();
  expect(result.current.isKeyValueActive("status", "active")).toBe(true);
  
  act(() => {
    result.current.clearKey("status");
  });
  
  expect(result.current.state.status).toBeUndefined();
});
```

## Examples

### E-commerce Product Filter

```tsx
import { Filter } from "@telegraph/filter";
import { Package, DollarSign, Star, Truck } from "lucide-react";

export const ProductFilter = () => {
  return (
    <Filter.Root>
      <Filter.Trigger>
        <Button leadingIcon={{ icon: ListFilter, alt: "Filter products" }}>
          Filter Products
        </Button>
      </Filter.Trigger>
      
      <Filter.Content isTopSearchable={true}>
        <Filter.Parameter 
          name="Category" 
          value="category" 
          icon={Package}
          isMulti={true}
          pluralNoun="categories"
        >
          <Filter.Option value="electronics" name="Electronics" />
          <Filter.Option value="clothing" name="Clothing" />
          <Filter.Option value="books" name="Books" />
          <Filter.Option value="home" name="Home & Garden" />
        </Filter.Parameter>
        
        <Filter.Parameter 
          name="Price Range" 
          value="price" 
          icon={DollarSign}
          isMulti={false}
        >
          <Filter.Option value="under-25" name="Under $25" />
          <Filter.Option value="25-50" name="$25 - $50" />
          <Filter.Option value="50-100" name="$50 - $100" />
          <Filter.Option value="over-100" name="Over $100" />
        </Filter.Parameter>
        
        <Filter.Parameter 
          name="Rating" 
          value="rating" 
          icon={Star}
          isMulti={true}
          pluralNoun="ratings"
        >
          <Filter.Option value="5-star" name="5 Stars" />
          <Filter.Option value="4-star" name="4+ Stars" />
          <Filter.Option value="3-star" name="3+ Stars" />
        </Filter.Parameter>
        
        <Filter.Parameter 
          name="Shipping" 
          value="shipping" 
          icon={Truck}
          isMulti={false}
        >
          <Filter.Option value="free" name="Free Shipping" />
          <Filter.Option value="prime" name="Prime Eligible" />
          <Filter.Option value="express" name="Express Delivery" />
        </Filter.Parameter>
      </Filter.Content>
      
      <Filter.ChipDisplay />
    </Filter.Root>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/filter)
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
