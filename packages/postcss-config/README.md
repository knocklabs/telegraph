# ⚙️ PostCSS Config

> Shared PostCSS configuration for Telegraph projects with optimized plugins and design token integration.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/postcss-config.svg)](https://www.npmjs.com/package/@telegraph/postcss-config)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/postcss-config)](https://bundlephobia.com/result?p=@telegraph/postcss-config)
[![license](https://img.shields.io/npm/l/@telegraph/postcss-config)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/postcss-config
```

> **Note**: This package has no stylesheets required.

## Quick Start

```js
// postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

module.exports = styleEnginePostCssConfig;
```

```js
// Or with ES modules (postcss.config.mjs)
import { styleEnginePostCssConfig } from "@telegraph/postcss-config";

export default styleEnginePostCssConfig;
```

## What's Included

This configuration includes optimized PostCSS plugins specifically chosen for Telegraph projects:

- **`postcss-discard-empty`** - Removes empty CSS rules for cleaner output
- **`autoprefixer`** - Automatically adds vendor prefixes for browser compatibility
- **`@csstools/postcss-global-data`** - Provides Telegraph design tokens (breakpoints)
- **`postcss-custom-media`** - Enables custom media queries using Telegraph breakpoints

## API Reference

### `styleEnginePostCssConfig`

The main PostCSS configuration object that includes all Telegraph-specific plugins and settings.

**Type**: `PostCSSConfig`

**Returns**: PostCSS configuration object with plugins array

## Usage Patterns

### Basic PostCSS Config

```js
// postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

module.exports = styleEnginePostCssConfig;
```

### With Webpack

```js
// webpack.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: styleEnginePostCssConfig,
            },
          },
        ],
      },
    ],
  },
};
```

### With Vite

```js
// vite.config.js
import { defineConfig } from "vite";
import { styleEnginePostCssConfig } from "@telegraph/postcss-config";

export default defineConfig({
  css: {
    postcss: styleEnginePostCssConfig,
  },
});
```

### With Next.js

```js
// next.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

module.exports = {
  experimental: {
    postcss: styleEnginePostCssConfig,
  },
};
```

## Advanced Usage

### Extending the Configuration

```js
// postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

module.exports = {
  ...styleEnginePostCssConfig,
  plugins: [
    ...styleEnginePostCssConfig.plugins,
    // Add your custom plugins
    require("postcss-nested"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
```

### Custom Media Queries Usage

With this configuration, you can use Telegraph breakpoints in your CSS:

```css
/* Input CSS */
@custom-media --mobile-and-up (min-width: 480px);
@custom-media --tablet-and-up (min-width: 768px);
@custom-media --desktop-and-up (min-width: 1024px);

.component {
  padding: 1rem;
}

@media (--tablet-and-up) {
  .component {
    padding: 2rem;
  }
}

@media (--desktop-and-up) {
  .component {
    padding: 3rem;
  }
}
```

### Framework-Specific Integration

#### Astro

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import { styleEnginePostCssConfig } from "@telegraph/postcss-config";

export default defineConfig({
  vite: {
    css: {
      postcss: styleEnginePostCssConfig,
    },
  },
});
```

#### SvelteKit

```js
// vite.config.js
import { sveltekit } from "@sveltejs/kit/vite";
import { styleEnginePostCssConfig } from "@telegraph/postcss-config";

export default {
  plugins: [sveltekit()],
  css: {
    postcss: styleEnginePostCssConfig,
  },
};
```

### Development vs Production

```js
// postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  ...styleEnginePostCssConfig,
  plugins: [
    ...styleEnginePostCssConfig.plugins,
    // Add production-only optimizations
    ...(isProduction
      ? [
          require("cssnano")({
            preset: ["default", { discardComments: { removeAll: true } }],
          }),
        ]
      : []),
  ],
};
```

## Design Tokens Integration

This configuration automatically integrates Telegraph design tokens:

- **Breakpoints** - Custom media queries from `@telegraph/tokens`
- **Responsive Design** - Consistent breakpoint usage across projects
- **Design System Compliance** - Ensures all projects use the same responsive patterns

### Available Breakpoints

The configuration provides access to Telegraph's responsive breakpoints:

```css
/* These are automatically available in your CSS */
@media (--mobile-and-up) { /* 480px+ */ }
@media (--tablet-and-up) { /* 768px+ */ }
@media (--desktop-and-up) { /* 1024px+ */ }
@media (--large-desktop-and-up) { /* 1280px+ */ }
```

## Browser Support

The autoprefixer plugin ensures compatibility with:

- **Chrome**: Last 2 versions
- **Firefox**: Last 2 versions  
- **Safari**: Last 2 versions
- **Edge**: Last 2 versions
- **iOS Safari**: Last 2 versions

## Performance Optimization

This configuration is optimized for performance:

- **Tree Shaking**: Only includes necessary PostCSS plugins
- **Build Speed**: Minimal plugin overhead
- **Output Size**: Removes empty rules and optimizes CSS
- **Caching**: PostCSS plugins support caching for faster rebuilds

## Testing

### Testing PostCSS Configuration

```js
// __tests__/postcss.test.js
import postcss from "postcss";
import { styleEnginePostCssConfig } from "@telegraph/postcss-config";

describe("PostCSS Configuration", () => {
  test("processes CSS with Telegraph plugins", async () => {
    const input = `
      .component {
        display: flex;
      }
      
      .empty-rule {
      }
      
      @media (--tablet-and-up) {
        .component {
          padding: 2rem;
        }
      }
    `;

    const result = await postcss(styleEnginePostCssConfig.plugins).process(
      input,
      { from: undefined }
    );

    // Should remove empty rules
    expect(result.css).not.toContain(".empty-rule");
    
    // Should process custom media
    expect(result.css).toContain("min-width");
    
    // Should add autoprefixer when needed
    expect(result.css).toContain("display: flex");
  });

  test("includes all required plugins", () => {
    const plugins = styleEnginePostCssConfig.plugins;
    
    expect(plugins).toHaveLength(4);
    expect(plugins.some(p => p.pluginName === "postcss-discard-empty")).toBe(true);
    expect(plugins.some(p => p.pluginName === "autoprefixer")).toBe(true);
  });
});
```

### Integration Testing

```js
// __tests__/integration.test.js
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("PostCSS Integration", () => {
  test("works with webpack build", async () => {
    const { stdout, stderr } = await execAsync("npm run build:webpack");
    
    expect(stderr).toBe("");
    expect(stdout).toContain("compiled successfully");
  });

  test("works with vite build", async () => {
    const { stdout, stderr } = await execAsync("npm run build:vite");
    
    expect(stderr).toBe("");
    expect(stdout).toContain("built in");
  });
});
```

## Troubleshooting

### Common Issues

**Plugin not found errors**
```bash
# Ensure all peer dependencies are installed
npm install postcss autoprefixer
```

**Custom media not working**
```js
// Make sure @telegraph/tokens is installed
npm install @telegraph/tokens
```

**Autoprefixer not adding prefixes**
```js
// Check your browserslist configuration
// .browserslistrc or package.json "browserslist" field
```

### Debug Configuration

```js
// postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

console.log("PostCSS plugins:", styleEnginePostCssConfig.plugins.map(p => p.pluginName));

module.exports = styleEnginePostCssConfig;
```

## Examples

### Basic Setup

```js
// postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

module.exports = styleEnginePostCssConfig;
```

### Advanced Build Pipeline

```js
// build.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");
const postcss = require("postcss");
const fs = require("fs");

async function buildCSS() {
  const css = fs.readFileSync("src/styles.css", "utf8");
  
  const result = await postcss(styleEnginePostCssConfig.plugins).process(css, {
    from: "src/styles.css",
    to: "dist/styles.css",
  });

  fs.writeFileSync("dist/styles.css", result.css);
  
  if (result.map) {
    fs.writeFileSync("dist/styles.css.map", result.map.toString());
  }
}

buildCSS().catch(console.error);
```

### Monorepo Configuration

```js
// packages/shared/postcss.config.js
const { styleEnginePostCssConfig } = require("@telegraph/postcss-config");

// Shared configuration for all packages
module.exports = {
  ...styleEnginePostCssConfig,
  plugins: [
    ...styleEnginePostCssConfig.plugins,
    // Add monorepo-specific plugins
    require("postcss-import")({
      resolve: (id) => {
        // Custom resolution for monorepo packages
        if (id.startsWith("@company/")) {
          return path.resolve(__dirname, `../${id.split("/")[1]}/src/styles`);
        }
        return id;
      },
    }),
  ],
};
```

## References

- [PostCSS Documentation](https://postcss.org/)
- [Autoprefixer Documentation](https://github.com/postcss/autoprefixer)
- [Telegraph Tokens](../tokens/README.md)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this configuration:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Make changes to `src/style-engine-postcss-config.ts`
4. Test: `pnpm test`
5. Build: `pnpm build`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

