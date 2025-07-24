# 🏷️ Tag

> Flexible tag component with optional interactive features like removal and copying, supporting multiple variants and colors.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/tag.svg)](https://www.npmjs.com/package/@telegraph/tag)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/tag)](https://bundlephobia.com/result?p=@telegraph/tag)
[![license](https://img.shields.io/npm/l/@telegraph/tag)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/tag
```

### Add stylesheet

Pick one:

Via CSS (preferred):
```css
@import "@telegraph/tag";
```

Via Javascript:
```tsx
import "@telegraph/tag/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components

## Quick Start

```tsx
import { Tag } from "@telegraph/tag";
import { User, AlertCircle } from "lucide-react";

export const TagExamples = () => (
  <div>
    {/* Basic tag */}
    <Tag>New Feature</Tag>

    {/* Tag with icon */}
    <Tag icon={{ icon: User, alt: "User" }}>John Doe</Tag>

    {/* Interactive tag with remove */}
    <Tag onRemove={() => console.log("removed")}>
      Removable Tag
    </Tag>

    {/* Tag with copy functionality */}
    <Tag 
      onCopy={() => console.log("copied")} 
      textToCopy="api-key-12345"
    >
      API Key
    </Tag>

    {/* Different variants and colors */}
    <Tag variant="solid" color="blue">Status: Active</Tag>
    <Tag variant="soft" color="red" icon={{ icon: AlertCircle, alt: "Error" }}>
      Error
    </Tag>
  </div>
);
```

## API Reference

### `<Tag>`

The main tag component with built-in interactive features.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"0" \| "1" \| "2"` | `"1"` | Size of the tag |
| `color` | `TagColor` | `"default"` | Color scheme of the tag |
| `variant` | `"soft" \| "solid"` | `"soft"` | Visual style variant |
| `icon` | `IconProps` | `undefined` | Icon to display at the start |
| `onRemove` | `() => void` | `undefined` | Makes tag removable with X button |
| `onCopy` | `() => void` | `undefined` | Adds copy button functionality |
| `textToCopy` | `string` | `undefined` | Text to copy (defaults to children) |
| `textProps` | `TextProps` | `{ maxW: "40" }` | Props passed to the text component |

#### TagColor Type

```tsx
type TagColor = 
  | "default" 
  | "gray" 
  | "red" 
  | "accent" 
  | "blue" 
  | "green" 
  | "yellow" 
  | "purple";
```

#### IconProps Type

```tsx
type IconProps = {
  icon: LucideIcon;
  alt: string;
};
```

### Composition Components

For custom layouts, use the individual components:

- **`<Tag.Root>`** - Container component that provides context
- **`<Tag.Text>`** - Text content with overflow handling
- **`<Tag.Icon>`** - Icon component with contextual styling
- **`<Tag.Button>`** - Remove button
- **`<Tag.CopyButton>`** - Copy button with animation

For detailed props of each component, see the [Complete Component Reference](#complete-component-reference) section below.

## Usage Patterns

### Basic Tags

```tsx
import { Tag } from "@telegraph/tag";

export const StatusTags = () => (
  <div>
    <Tag>Draft</Tag>
    <Tag color="blue">Published</Tag>
    <Tag color="yellow">Pending Review</Tag>
    <Tag color="green">Approved</Tag>
    <Tag color="red">Rejected</Tag>
  </div>
);
```

### Different Sizes

```tsx
<div>
  <Tag size="0">Small Tag</Tag>
  <Tag size="1">Medium Tag</Tag>
  <Tag size="2">Large Tag</Tag>
</div>
```

### Solid Variant

```tsx
<div>
  <Tag variant="solid" color="blue">Blue Solid</Tag>
  <Tag variant="solid" color="green">Green Solid</Tag>
  <Tag variant="solid" color="red">Red Solid</Tag>
</div>
```

### With Icons

```tsx
import { Tag } from "@telegraph/tag";
import { User, Calendar, MapPin, Star } from "lucide-react";

export const IconTags = () => (
  <div>
    <Tag icon={{ icon: User, alt: "User" }}>John Doe</Tag>
    <Tag icon={{ icon: Calendar, alt: "Date" }} color="blue">
      Due: Dec 25
    </Tag>
    <Tag icon={{ icon: MapPin, alt: "Location" }} color="green">
      San Francisco
    </Tag>
    <Tag icon={{ icon: Star, alt: "Rating" }} color="yellow">
      4.8 Rating
    </Tag>
  </div>
);
```

### Interactive Tags

```tsx
import { Tag } from "@telegraph/tag";
import { useState } from "react";

export const InteractiveTags = () => {
  const [tags, setTags] = useState(["React", "TypeScript", "Next.js"]);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      {tags.map(tag => (
        <Tag 
          key={tag} 
          onRemove={() => removeTag(tag)}
          color="blue"
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};
```

### Copy Functionality

```tsx
import { Tag } from "@telegraph/tag";

export const CopyableTags = () => (
  <div>
    <Tag 
      onCopy={() => navigator.clipboard.writeText("api-key-12345")}
      textToCopy="api-key-12345"
      color="accent"
    >
      API Key
    </Tag>
    
    <Tag 
      onCopy={() => navigator.clipboard.writeText("user-id-67890")}
      textToCopy="user-id-67890"
      color="blue"
    >
      User ID
    </Tag>
  </div>
);
```

## Advanced Usage

### Custom Composition

```tsx
import { Tag } from "@telegraph/tag";
import { Crown, X } from "lucide-react";

export const CustomTag = ({ onRemove, isPremium }) => (
  <Tag.Root color={isPremium ? "yellow" : "gray"} variant="soft" size="2">
    {isPremium && <Tag.Icon icon={Crown} alt="Premium user" />}
    <Tag.Text>Premium User</Tag.Text>
    {onRemove && (
      <Tag.Button 
        onClick={onRemove}
        icon={{ icon: X, alt: "Remove premium status" }}
      />
    )}
  </Tag.Root>
);
```

### Dynamic Tag Management

```tsx
import { Tag } from "@telegraph/tag";
import { useState } from "react";
import { Plus } from "lucide-react";

export const TagManager = () => {
  const [tags, setTags] = useState([
    { id: 1, label: "Frontend", color: "blue" },
    { id: 2, label: "Backend", color: "green" },
    { id: 3, label: "Design", color: "purple" }
  ]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { 
        id: Date.now(), 
        label: newTag, 
        color: "default" 
      }]);
      setNewTag("");
    }
  };

  const removeTag = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  return (
    <div>
      <div className="tag-list">
        {tags.map(tag => (
          <Tag 
            key={tag.id}
            color={tag.color}
            onRemove={() => removeTag(tag.id)}
          >
            {tag.label}
          </Tag>
        ))}
      </div>
      
      <div className="add-tag">
        <input 
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add new tag..."
          onKeyPress={(e) => e.key === 'Enter' && addTag()}
        />
        <button onClick={addTag}>
          <Plus size={16} /> Add Tag
        </button>
      </div>
    </div>
  );
};
```

### Tag Filtering

```tsx
import { Tag } from "@telegraph/tag";
import { useState } from "react";

export const TagFilter = ({ items, onFilter }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  
  const availableTags = [...new Set(items.flatMap(item => item.tags))];

  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    onFilter(newSelectedTags);
  };

  return (
    <div>
      <h3>Filter by tags:</h3>
      <div className="tag-filters">
        {availableTags.map(tag => (
          <Tag
            key={tag}
            variant={selectedTags.includes(tag) ? "solid" : "soft"}
            color="blue"
            onClick={() => toggleTag(tag)}
            style={{ cursor: "pointer" }}
          >
            {tag}
          </Tag>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="active-filters">
          <span>Active filters: </span>
          {selectedTags.map(tag => (
            <Tag
              key={tag}
              color="accent"
              onRemove={() => toggleTag(tag)}
              size="0"
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Polymorphic Usage

```tsx
import { Tag } from "@telegraph/tag";
import { Link } from "next/link";

export const TagLinks = () => (
  <div>
    {/* Tag as a link */}
    <Tag.Root as={Link} href="/category/frontend" color="blue">
      <Tag.Text>Frontend</Tag.Text>
    </Tag.Root>

    {/* Tag as a button */}
    <Tag.Root as="button" onClick={() => console.log("clicked")} color="green">
      <Tag.Text>Clickable Tag</Tag.Text>
    </Tag.Root>
  </div>
);
```

### Form Integration

```tsx
import { Tag } from "@telegraph/tag";
import { useState } from "react";

export const TagInput = ({ value = [], onChange, placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="tag-input">
      <div className="tag-list">
        {value.map(tag => (
          <Tag 
            key={tag}
            onRemove={() => removeTag(tag)}
            color="blue"
            size="0"
          >
            {tag}
          </Tag>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className="tag-input-field"
        />
      </div>
    </div>
  );
};
```

### Animated Tag Groups

```tsx
import { Tag } from "@telegraph/tag";
import { AnimatePresence, motion } from "motion/react";

export const AnimatedTags = ({ tags, onRemove }) => (
  <div className="animated-tags">
    <AnimatePresence>
      {tags.map(tag => (
        <motion.div
          key={tag.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <Tag
            color={tag.color}
            onRemove={() => onRemove(tag.id)}
          >
            {tag.label}
          </Tag>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
```

## Design Tokens & Styling

The Tag component uses Telegraph design tokens for consistent theming:

- `--tgph-gray-*`, `--tgph-blue-*`, etc. - Color scale tokens
- `--tgph-space-*` - Spacing and padding values
- `--tgph-radius-*` - Border radius values
- `--tgph-font-size-*` - Typography sizing

### Color Mappings

#### Soft Variant
- Background uses `-3` color tokens (e.g., `--tgph-blue-3`)
- Text and icons use matching color names (e.g., `blue`)

#### Solid Variant  
- Background uses `-9` color tokens (e.g., `--tgph-blue-9`)
- Text and icons use `white` for contrast

### Custom Theming

```css
.tgph {
  /* Customize tag spacing */
  .tgph-tag {
    gap: var(--tgph-space-1);
  }
  
  /* Custom tag variants */
  .tgph-tag[data-variant="custom"] {
    background: linear-gradient(135deg, var(--tgph-blue-9), var(--tgph-purple-9));
    color: white;
  }
  
  /* Hover states for interactive tags */
  .tgph-tag:has(button):hover {
    transform: translateY(-1px);
    box-shadow: var(--tgph-shadow-2);
    transition: all 0.2s ease;
  }
  
  /* Copy button animation refinement */
  .tgph-tag [data-tgph-button] {
    transition: all 0.15s ease;
  }
  
  .tgph-tag [data-tgph-button]:hover {
    background: var(--tgph-gray-5);
  }
}
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support for interactive elements
- ✅ **Screen Reader Support**: Proper ARIA labels and descriptions
- ✅ **Focus Management**: Clear focus indicators for buttons
- ✅ **High Contrast**: Compatible with high contrast modes
- ✅ **Icon Alt Text**: Required alt text for all icons

### Best Practices

1. **Provide Icon Alt Text**: Always include meaningful alt text for icons
2. **Meaningful Labels**: Use descriptive text that explains the tag's purpose
3. **Action Feedback**: Copy and remove actions provide immediate feedback
4. **Keyboard Accessible**: All interactive elements are keyboard accessible
5. **Color Independence**: Don't rely solely on color to convey meaning

### ARIA Attributes

- Icons include proper `alt` attributes or `aria-hidden="true"`
- Copy button includes tooltip with descriptive text
- Remove button includes clear action description
- Motion respects `prefers-reduced-motion` preference

## Testing

### Testing Library Example

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tag } from "@telegraph/tag";

test("renders tag with text content", () => {
  render(<Tag>Test Tag</Tag>);
  
  expect(screen.getByText("Test Tag")).toBeInTheDocument();
});

test("calls onRemove when remove button is clicked", async () => {
  const user = userEvent.setup();
  const handleRemove = jest.fn();

  render(<Tag onRemove={handleRemove}>Removable Tag</Tag>);

  const removeButton = screen.getByRole("button", { name: /remove/i });
  await user.click(removeButton);

  expect(handleRemove).toHaveBeenCalledTimes(1);
});

test("copies text when copy button is clicked", async () => {
  const user = userEvent.setup();
  const mockWriteText = jest.fn();
  
  Object.assign(navigator, {
    clipboard: {
      writeText: mockWriteText,
    },
  });

  render(
    <Tag onCopy={() => {}} textToCopy="test-text">
      Copyable Tag
    </Tag>
  );

  const copyButton = screen.getByRole("button", { name: /copy/i });
  await user.click(copyButton);

  expect(mockWriteText).toHaveBeenCalledWith("test-text");
});
```

### Keyboard Navigation Testing

```tsx
test("supports keyboard navigation", async () => {
  const user = userEvent.setup();
  const handleRemove = jest.fn();

  render(<Tag onRemove={handleRemove}>Test Tag</Tag>);

  // Tab to the remove button
  await user.tab();
  
  const removeButton = screen.getByRole("button", { name: /remove/i });
  expect(removeButton).toHaveFocus();

  // Press Enter to remove
  await user.keyboard("{Enter}");
  expect(handleRemove).toHaveBeenCalled();
});
```

### Custom Composition Testing

```tsx
test("custom composition works correctly", () => {
  render(
    <Tag.Root color="blue" variant="solid">
      <Tag.Icon icon={User} alt="User" />
      <Tag.Text>John Doe</Tag.Text>
      <Tag.Button onClick={jest.fn()} />
    </Tag.Root>
  );

  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByRole("img", { name: "User" })).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render(
    <Tag 
      icon={{ icon: User, alt: "User" }}
      onRemove={() => {}}
      onCopy={() => {}}
    >
      Test Tag
    </Tag>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Complete Component Reference

### `<Tag.Root>`

The container component that provides context for all child components.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"0" \| "1" \| "2"` | `"1"` | Size of the tag |
| `color` | `TagColor` | `"default"` | Color scheme |
| `variant` | `"soft" \| "solid"` | `"soft"` | Visual style |
| `as` | `TgphElement` | `"span"` | Polymorphic element type |

### `<Tag.Text>`

Text content component with overflow handling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxW` | `string` | `"40"` | Maximum width (in design tokens) |
| `overflow` | `string` | `"hidden"` | CSS overflow behavior |
| `as` | `TgphElement` | `"span"` | Polymorphic element type |

### `<Tag.Icon>`

Icon component with contextual styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `LucideIcon` | - | **Required.** Icon component to render |
| `alt` | `string` | - | **Required.** Alternative text |

### `<Tag.Button>`

Remove button component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | - | Click handler for removal |
| `icon` | `IconProps` | `{ icon: X, alt: "close" }` | Button icon configuration |

### `<Tag.CopyButton>`

Copy functionality button with animation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | - | Additional click handler |
| `textToCopy` | `string` | - | Text to copy to clipboard |

## Examples

### Basic Example

```tsx
import { Tag } from "@telegraph/tag";

export const ProductTags = () => (
  <div className="product-tags">
    <Tag color="green">In Stock</Tag>
    <Tag color="blue">Free Shipping</Tag>
    <Tag color="yellow">Limited Time</Tag>
    <Tag color="purple">Premium</Tag>
  </div>
);
```

### Advanced Example

```tsx
import { Tag } from "@telegraph/tag";
import { useState } from "react";
import { Star, User, Calendar, Copy } from "lucide-react";

export const AdvancedTagExample = () => {
  const [skills, setSkills] = useState([
    { id: 1, name: "React", level: "expert", color: "blue" },
    { id: 2, name: "TypeScript", level: "advanced", color: "blue" },
    { id: 3, name: "Node.js", level: "intermediate", color: "green" }
  ]);

  const removeSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const copySkill = (skillName: string) => {
    navigator.clipboard.writeText(skillName);
    console.log(`Copied ${skillName} to clipboard`);
  };

  return (
    <div className="skill-tags">
      <h3>Technical Skills</h3>
      
      <div className="tags-grid">
        {skills.map(skill => (
          <Tag
            key={skill.id}
            color={skill.color}
            variant={skill.level === "expert" ? "solid" : "soft"}
            size="1"
            icon={{ 
              icon: skill.level === "expert" ? Star : User, 
              alt: skill.level 
            }}
            onRemove={() => removeSkill(skill.id)}
            onCopy={() => copySkill(skill.name)}
            textToCopy={skill.name}
          >
            {skill.name}
          </Tag>
        ))}
      </div>

      <div className="meta-tags">
        <Tag 
          icon={{ icon: Calendar, alt: "Updated" }}
          color="gray"
          size="0"
        >
          Updated Today
        </Tag>
        
        <Tag
          icon={{ icon: Copy, alt: "Copy all" }}
          color="accent"
          size="0"
          onCopy={() => {
            const allSkills = skills.map(s => s.name).join(", ");
            navigator.clipboard.writeText(allSkills);
          }}
          textToCopy={skills.map(s => s.name).join(", ")}
        >
          Copy All Skills
        </Tag>
      </div>
    </div>
  );
};
```

### Real-world Example

```tsx
import { Tag } from "@telegraph/tag";
import { useState, useEffect } from "react";
import { Filter, X, Plus } from "lucide-react";

export const TaskManagerTags = () => {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Design Homepage", 
      tags: ["design", "frontend", "urgent"] 
    },
    { 
      id: 2, 
      title: "API Integration", 
      tags: ["backend", "api"] 
    },
    { 
      id: 3, 
      title: "User Testing", 
      tags: ["research", "ux"] 
    }
  ]);

  const [activeFilters, setActiveFilters] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const uniqueTags = [...new Set(tasks.flatMap(task => task.tags))];
    setAllTags(uniqueTags);
  }, [tasks]);

  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const filteredTasks = tasks.filter(task =>
    activeFilters.length === 0 || 
    activeFilters.some(filter => task.tags.includes(filter))
  );

  const getTagColor = (tag: string) => {
    const colorMap = {
      urgent: "red",
      design: "purple", 
      frontend: "blue",
      backend: "green",
      api: "yellow",
      research: "accent",
      ux: "purple"
    };
    return colorMap[tag] || "default";
  };

  return (
    <div className="task-manager">
      <div className="filter-section">
        <h3>
          <Filter size={20} />
          Filter by Tags
        </h3>
        
        <div className="available-filters">
          {allTags.map(tag => (
            <Tag
              key={tag}
              color={getTagColor(tag)}
              variant={activeFilters.includes(tag) ? "solid" : "soft"}
              onClick={() => toggleFilter(tag)}
              style={{ cursor: "pointer" }}
            >
              {tag}
            </Tag>
          ))}
        </div>

        {activeFilters.length > 0 && (
          <div className="active-filters">
            <span>Active filters:</span>
            {activeFilters.map(filter => (
              <Tag
                key={filter}
                color={getTagColor(filter)}
                onRemove={() => toggleFilter(filter)}
                size="0"
              >
                {filter}
              </Tag>
            ))}
            <button onClick={clearFilters} className="clear-all">
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="tasks-section">
        <h3>Tasks ({filteredTasks.length})</h3>
        
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card">
            <h4>{task.title}</h4>
            <div className="task-tags">
              {task.tags.map(tag => (
                <Tag
                  key={tag}
                  color={getTagColor(tag)}
                  size="0"
                  onClick={() => toggleFilter(tag)}
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/tag)
- [Icon Component](../icon/README.md) - Used for tag icons
- [Button Component](../button/README.md) - Used for interactive buttons
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
