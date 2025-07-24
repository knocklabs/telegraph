# {{emoji}} {{package_display_name}}

> {{package_description}}

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/{{package_name}}.svg)](https://www.npmjs.com/package/@telegraph/{{package_name}})
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/{{package_name}})](https://bundlephobia.com/result?p=@telegraph/{{package_name}})
[![license](https://img.shields.io/npm/l/@telegraph/{{package_name}})](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/{{package_name}}
```

### Add stylesheet

{{#if has_stylesheet}}
Pick one:

Via CSS (preferred):
```css
@import "@telegraph/{{package_name}}";
```

Via Javascript:
```tsx
import "@telegraph/{{package_name}}/default.css";
```

> Then, include `className="tgph"` on the farthest parent element wrapping the telegraph components
{{else}}
> **Note**: This package has no stylesheets required.
{{/if}}

## Quick Start

```tsx
import { {{main_component}} } from "@telegraph/{{package_name}}";

export const Example = () => (
  <{{main_component}} {{example_props}}>
    {{example_content}}
  </{{main_component}}>
);
```

## API Reference

### `<{{main_component}}{{#if has_subcomponents}}.Root{{/if}}>`

{{main_component_description}}

| Prop | Type | Default | Description |
|------|------|---------|-------------|
{{#each main_props}}
| `{{name}}` | `{{type}}` | `{{default}}` | {{description}} |
{{/each}}

{{#if has_subcomponents}}
### Other Components

{{#each subcomponents}}
- **`<{{main_component}}.{{name}}>`** - {{description}}
{{/each}}

For detailed props of each component, see the [Complete Component Reference](#complete-component-reference) section below.
{{/if}}

{{#if has_variants}}
## Variants & Constants

{{variants_description}}

```tsx
import { {{constants_export}} } from "@telegraph/{{package_name}}";

// Available variants:
{{#each variants}}
// {{name}}: {{values}}
{{/each}}
```
{{/if}}

## Advanced Usage

{{#each advanced_examples}}
### {{title}}

{{description}}

```tsx
{{code}}
```
{{/each}}

{{#if has_design_tokens}}
## Design Tokens & Styling

{{design_tokens_description}}

{{#each design_tokens}}
- `{{token}}` - {{description}}
{{/each}}

### Custom Theming

```css
.tgph {
  {{#each custom_css_examples}}
  /* {{description}} */
  {{selector}} {
    {{properties}}
  }
  {{/each}}
}
```
{{/if}}

## Accessibility

{{#each accessibility_features}}
- ✅ **{{title}}**: {{description}}
{{/each}}

{{#if has_keyboard_shortcuts}}
### Keyboard Shortcuts

| Key | Action |
|-----|--------|
{{#each keyboard_shortcuts}}
| `{{key}}` | {{action}} |
{{/each}}
{{/if}}

{{#if has_aria_attributes}}
### ARIA Attributes

{{#each aria_attributes}}
- `{{attribute}}` - {{description}}
{{/each}}
{{/if}}

### Best Practices

{{#each best_practices}}
{{index}}. **{{title}}**: {{description}}
{{/each}}

## Testing

### Testing Library Example

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { {{main_component}} } from "@telegraph/{{package_name}}";

test("{{test_description}}", async () => {
  const user = userEvent.setup();
  {{test_setup}}
  
  render({{test_render}});
  
  {{test_interactions}}
  
  {{test_assertions}}
});
```

{{#if has_custom_testing}}
### {{custom_test_title}}

```tsx
{{custom_test_code}}
```
{{/if}}

### Accessibility Testing

```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("has no accessibility violations", async () => {
  const { container } = render({{accessibility_test_render}});
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

{{#if has_complete_reference}}
## Complete Component Reference

{{#each complete_reference_components}}
### `<{{main_component}}.{{name}}>`

{{description}}

| Prop | Type | Default | Description |
|------|------|---------|-------------|
{{#each props}}
| `{{name}}` | `{{type}}` | `{{default}}` | {{description}} |
{{/each}}
{{/each}}
{{/if}}

## Examples

### Basic Example

```tsx
{{basic_example}}
```

### Advanced Example

```tsx
{{advanced_example}}
```

### Real-world Example

```tsx
{{real_world_example}}
```

## References

- [Storybook Demo](https://storybook.telegraph.dev/?path=/docs/{{package_name}})
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
