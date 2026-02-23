# ⚡ Vite Config

> Shared Vite configuration for Telegraph projects with optimized build settings, CSS processing, and development experience enhancements.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/vite-config.svg)](https://www.npmjs.com/package/@telegraph/vite-config)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/vite-config)](https://bundlephobia.com/result?p=@telegraph/vite-config)
[![license](https://img.shields.io/npm/l/@telegraph/vite-config)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/vite-config
```

## Quick Start

### Default Configuration

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig(viteConfig);
```

### Scoped CSS Configuration

```typescript
// vite.config.ts
import { defaultViteConfig, scopedCssViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, scopedCssViteConfig);
```

## What's Included

This configuration provides optimized Vite settings specifically tailored for Telegraph projects:

- **Build Optimization**: Optimized bundle splitting and chunk handling
- **CSS Processing**: Telegraph-specific CSS handling and PostCSS configuration
- **Development Experience**: Enhanced HMR and development server settings
- **TypeScript Support**: Proper TypeScript configuration and path resolution
- **Asset Handling**: Optimized asset processing and public path configuration
- **Plugin Integration**: Pre-configured plugins for Telegraph development

## API Reference

### `viteConfig`

The main Vite configuration object with all Telegraph-specific optimizations.

**Type**: `UserConfig`

**Includes**:

- Build optimization settings
- CSS processing configuration
- Development server setup
- Plugin configurations
- Asset handling rules

### `defaultViteConfig`

Base Vite configuration without CSS scoping, suitable for most Telegraph projects.

**Type**: `UserConfig`

**Features**:

- Standard build settings
- Basic CSS processing
- Development server configuration
- Essential plugins

### `scopedCssViteConfig`

Additional configuration for CSS scoping, used when you need isolated CSS modules.

**Type**: `UserConfig`

**Features**:

- CSS module processing
- Scoped styling support
- Enhanced CSS optimization
- Module boundary enforcement

## Usage Patterns

### Basic Project Setup

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig(viteConfig);
```

## References

- [Vite Documentation](https://vitejs.dev/) - Official Vite documentation
- [Telegraph PostCSS Config](../postcss-config/README.md) - PostCSS configuration

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
