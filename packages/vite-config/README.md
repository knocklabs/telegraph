![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/vite-config.svg)](https://www.npmjs.com/package/@telegraph/vite-config)

# @telegraph/vite-config

Vite configuration and plugins for Telegraph components.

## Interactive CSS Generator

The Interactive CSS Generator automatically creates hover, focus, active, and focus-within styles for all Telegraph components using a beautiful object-based API.

### ✨ **Object-Based Interactive API**

Instead of individual props, use clean object syntax:

```jsx
// ✅ Beautiful object-based API
<Box hover={{ bg: "blue-5", h: "10", rounded: "2" }}>
  Hover me for magic!
</Box>

// 🚫 Old way (no longer needed)
<Box hover_backgroundColor="blue-5" hover_height="10" hover_borderRadius="2">
  Hover me
</Box>
```

### 🎯 **Supported Interactive States**

- `hover={{ }}` - Mouse hover
- `focus={{ }}` - Keyboard focus
- `active={{ }}` - Click/press
- `focus_within={{ }}` - Child element focused

### 🔧 **How It Works**

1. **Runtime**: Components detect object props and generate synthetic CSS variables
2. **Build-time**: Plugin auto-generates CSS for ALL base properties
3. **Result**: Seamless interactive behavior with zero configuration

```jsx
// You write this:
<Stack hover={{ gap: "4", direction: "column" }}>
  <Text focus={{ color: "accent", fontSize: "4" }}>Focus me</Text>
  <Button active={{ bg: "red-5" }}>Click me</Button>
</Stack>

// Plugin generates this CSS automatically:
.tgph-stack:hover {
  --gap: var(--hover_gap);
  --direction: var(--hover_direction);
}

.tgph-text:focus-visible {
  --color: var(--focus_color);
  --font-size: var(--focus_fontSize);
}

.tgph-button:active {
  --background-color: var(--active_bg);
}
```

### 📦 **Setup**

The plugin is automatically included when using `@telegraph/vite-config`:

```ts
// vite.config.ts
import {
  defaultViteConfig,
  styleEngineViteConfig,
} from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, styleEngineViteConfig);
```

### 🎨 **All Properties Work**

Every component property automatically supports interactive states:

```jsx
<Box
  hover={{
    bg: "blue-5",
    h: "20",
    rounded: "3",
    shadow: "lg",
    borderColor: "accent-6",
  }}
  focus={{
    bg: "green-4",
    borderWidth: "2",
  }}
>
  Complete control over every property!
</Box>
```

### 🏗️ **Plugin Exports**

```ts
import {
  // Helper: generate CSS for component
  appendInteractiveBlock, // Helper: update default.css files
  // Main Vite plugin
  collectCssVars,
  // Helper: discover component cssVars
  generateInteractiveCss,
  tgphStyleEngine,
} from "@telegraph/vite-config";
```

### ⚡ **Benefits**

- ✅ **Zero config** - Just use the object syntax
- ✅ **Universal** - Works with ALL component properties
- ✅ **Type-safe** - Full TypeScript intellisense
- ✅ **Performance** - Auto-generated CSS, no runtime overhead
- ✅ **Clean API** - Beautiful, intuitive syntax
- ✅ **Hot reload** - Updates during development

---

The Interactive CSS Generator makes Telegraph components delightful to use with powerful, intuitive interactive styling! 🎉
