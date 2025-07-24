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

> **Note**: This package has no stylesheets required.

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
import { defaultViteConfig, scopeCssViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, scopeCssViteConfig);
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

### `scopeCssViteConfig`

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

### React Project

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  ...viteConfig,
  plugins: [
    react(),
    ...viteConfig.plugins
  ]
});
```

### Library Development

```typescript
// vite.config.ts
import { defaultViteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  ...defaultViteConfig,
  build: {
    ...defaultViteConfig.build,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyLibrary",
      fileName: "my-library"
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
```

### Monorepo Configuration

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  ...viteConfig,
  resolve: {
    ...viteConfig.resolve,
    alias: {
      ...viteConfig.resolve?.alias,
      "@": resolve(__dirname, "src"),
      "@shared": resolve(__dirname, "../shared/src")
    }
  }
});
```

### CSS Modules with Scoping

```typescript
// vite.config.ts
import { defaultViteConfig, scopeCssViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(
  defaultViteConfig,
  scopeCssViteConfig,
  {
    css: {
      modules: {
        localsConvention: "camelCaseOnly",
        generateScopedName: "[name]__[local]___[hash:base64:5]"
      }
    }
  }
);
```

## Advanced Usage

### Custom Build Configuration

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig({
  ...viteConfig,
  build: {
    ...viteConfig.build,
    // Custom build settings
    target: "es2020",
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      ...viteConfig.build?.rollupOptions,
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          telegraph: ["@telegraph/button", "@telegraph/input"]
        }
      }
    }
  }
});
```

### Environment-Specific Configuration

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    ...viteConfig,
    define: {
      ...viteConfig.define,
      __APP_VERSION__: JSON.stringify(env.npm_package_version)
    },
    server: {
      ...viteConfig.server,
      port: mode === "development" ? 3000 : 4000,
      proxy: mode === "development" ? {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true
        }
      } : undefined
    }
  };
});
```

### Plugin Customization

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  ...viteConfig,
  plugins: [
    // Add plugins before Telegraph plugins
    customPlugin(),
    
    // Include Telegraph plugins
    ...viteConfig.plugins,
    
    // Add plugins after Telegraph plugins
    additionalPlugin({
      option: "value"
    })
  ]
});
```

### TypeScript Path Mapping

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  ...viteConfig,
  resolve: {
    ...viteConfig.resolve,
    alias: {
      ...viteConfig.resolve?.alias,
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@utils": resolve(__dirname, "src/utils"),
      "@types": resolve(__dirname, "src/types")
    }
  }
});
```

### CSS Preprocessing

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig({
  ...viteConfig,
  css: {
    ...viteConfig.css,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      },
      less: {
        modifyVars: {
          "primary-color": "#1890ff"
        }
      }
    }
  }
});
```

### Performance Optimization

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig({
  ...viteConfig,
  build: {
    ...viteConfig.build,
    // Enable source maps for production debugging
    sourcemap: true,
    
    // Optimize chunk splitting
    rollupOptions: {
      ...viteConfig.build?.rollupOptions,
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "react-vendor";
            }
            if (id.includes("@telegraph")) {
              return "telegraph";
            }
            return "vendor";
          }
        }
      }
    },
    
    // Minimize bundle size
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Testing Configuration

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test-setup.ts"
      ]
    }
  }
});
```

### Storybook Integration

```typescript
// .storybook/main.ts
import { mergeConfig } from "vite";
import { viteConfig } from "@telegraph/vite-config";

export default {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: (config) => {
    return mergeConfig(config, {
      ...viteConfig,
      // Storybook-specific overrides
      define: {
        ...viteConfig.define,
        global: "globalThis"
      }
    });
  }
};
```

### Development Server Configuration

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig({
  ...viteConfig,
  server: {
    ...viteConfig.server,
    host: true, // Listen on all addresses
    port: 3000,
    open: true, // Open browser on start
    cors: true,
    
    // Development proxy
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/ws": {
        target: "ws://localhost:8080",
        ws: true
      }
    }
  },
  
  preview: {
    port: 4173,
    open: true
  }
});
```

## Configuration Options

### Build Settings

The Vite configuration includes optimized build settings:

| Option | Default Value | Description |
|--------|---------------|-------------|
| `target` | `"es2015"` | Browser compatibility target |
| `outDir` | `"dist"` | Output directory for builds |
| `assetsDir` | `"assets"` | Directory for static assets |
| `sourcemap` | `false` | Generate source maps |
| `minify` | `"esbuild"` | Minification method |

### CSS Processing

| Option | Default | Description |
|--------|---------|-------------|
| `postcss` | Telegraph PostCSS config | PostCSS configuration |
| `modules` | Enabled for scoped config | CSS modules support |
| `devSourcemap` | `true` | Source maps in development |

### Development Server

| Option | Default | Description |
|--------|---------|-------------|
| `port` | `5173` | Development server port |
| `host` | `"localhost"` | Server host |
| `open` | `false` | Open browser on start |
| `cors` | `true` | Enable CORS |

## Design Tokens & Integration

The Vite configuration is optimized for Telegraph's design system:

- **PostCSS Integration**: Automatic processing of Telegraph design tokens
- **CSS Variable Support**: Full CSS custom property support
- **Theme Processing**: Optimized handling of light/dark themes
- **Asset Pipeline**: Efficient processing of Telegraph assets

### CSS Processing Pipeline

```typescript
// The config includes optimized CSS processing:
{
  css: {
    postcss: {
      plugins: [
        require("@telegraph/postcss-config"),
        require("autoprefixer"),
        require("cssnano")({ preset: "default" })
      ]
    },
    modules: {
      localsConvention: "camelCase"
    }
  }
}
```

## Performance Optimization

The configuration includes several performance optimizations:

- **Code Splitting**: Automatic vendor and component chunking
- **Tree Shaking**: Aggressive dead code elimination
- **Asset Optimization**: Optimized handling of images and fonts
- **Bundle Analysis**: Built-in bundle size analysis
- **Caching**: Optimized browser caching headers

## Testing

### Configuration Testing

```typescript
// __tests__/vite-config.test.ts
import { viteConfig, defaultViteConfig, scopeCssViteConfig } from "@telegraph/vite-config";

describe("Vite Configuration", () => {
  test("exports main configuration object", () => {
    expect(viteConfig).toBeDefined();
    expect(typeof viteConfig).toBe("object");
  });

  test("includes essential build settings", () => {
    expect(viteConfig.build).toBeDefined();
    expect(viteConfig.build?.target).toBeDefined();
  });

  test("includes CSS configuration", () => {
    expect(viteConfig.css).toBeDefined();
  });

  test("default config is valid", () => {
    expect(defaultViteConfig).toBeDefined();
    expect(defaultViteConfig.plugins).toBeDefined();
  });

  test("scoped CSS config has modules support", () => {
    expect(scopeCssViteConfig).toBeDefined();
    expect(scopeCssViteConfig.css?.modules).toBeDefined();
  });
});
```

### Build Testing

```typescript
// __tests__/build.test.ts
import { build } from "vite";
import { viteConfig } from "@telegraph/vite-config";

describe("Build Process", () => {
  test("builds successfully with Telegraph config", async () => {
    const result = await build({
      ...viteConfig,
      build: {
        ...viteConfig.build,
        write: false // Don't write files in test
      }
    });

    expect(result).toBeDefined();
  });

  test("generates correct chunk structure", async () => {
    const result = await build({
      ...viteConfig,
      build: {
        ...viteConfig.build,
        write: false,
        rollupOptions: {
          ...viteConfig.build?.rollupOptions,
          input: "src/index.ts"
        }
      }
    });

    // Verify chunks are created correctly
    expect(Array.isArray(result)).toBe(true);
  });
});
```

### Integration Testing

```typescript
// __tests__/integration.test.ts
describe("Vite Integration", () => {
  test("works with React", async () => {
    const { createServer } = await import("vite");
    const server = await createServer({
      ...viteConfig,
      server: { port: 0 } // Use random port
    });

    expect(server).toBeDefined();
    await server.close();
  });

  test("processes Telegraph components correctly", () => {
    // Test that Telegraph components are processed correctly
    // This would typically involve building a test app
  });
});
```

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install
```

**CSS Module Issues**
```typescript
// Ensure correct CSS module configuration
export default defineConfig({
  css: {
    modules: {
      localsConvention: "camelCaseOnly"
    }
  }
});
```

**TypeScript Path Resolution**
```typescript
// Update tsconfig.json paths to match Vite aliases
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

### Debug Mode

```typescript
// Enable debug logging
export default defineConfig({
  ...viteConfig,
  logLevel: "info",
  build: {
    ...viteConfig.build,
    // Enable verbose build logs
    minify: false,
    sourcemap: true
  }
});
```

## Examples

### Basic Example

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig(viteConfig);
```

### Advanced Example

```typescript
// vite.config.ts
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  ...viteConfig,
  
  plugins: [
    react(),
    ...viteConfig.plugins
  ],
  
  resolve: {
    ...viteConfig.resolve,
    alias: {
      ...viteConfig.resolve?.alias,
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@utils": resolve(__dirname, "src/utils")
    }
  },
  
  build: {
    ...viteConfig.build,
    rollupOptions: {
      ...viteConfig.build?.rollupOptions,
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          telegraph: ["@telegraph/button", "@telegraph/input", "@telegraph/layout"]
        }
      }
    }
  },
  
  server: {
    ...viteConfig.server,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true
      }
    }
  }
});
```

### Real-world Example

```typescript
// vite.config.ts - Production-ready configuration
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production";

  return {
    ...viteConfig,
    
    define: {
      ...viteConfig.define,
      __APP_VERSION__: JSON.stringify(env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"]
        }
      }),
      ...viteConfig.plugins,
      
      // Bundle analyzer for production
      isProduction && visualizer({
        filename: "dist/stats.html",
        open: true
      })
    ].filter(Boolean),
    
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        "@": resolve(__dirname, "src"),
        "@components": resolve(__dirname, "src/components"),
        "@hooks": resolve(__dirname, "src/hooks"),
        "@utils": resolve(__dirname, "src/utils"),
        "@types": resolve(__dirname, "src/types"),
        "@assets": resolve(__dirname, "src/assets")
      }
    },
    
    build: {
      ...viteConfig.build,
      sourcemap: isProduction ? "hidden" : true,
      
      rollupOptions: {
        ...viteConfig.build?.rollupOptions,
        output: {
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom")) {
                return "react-vendor";
              }
              if (id.includes("@emotion") || id.includes("styled-components")) {
                return "styling-vendor";
              }
              if (id.includes("@telegraph")) {
                return "telegraph";
              }
              if (id.includes("lucide-react")) {
                return "icons";
              }
              return "vendor";
            }
            
            // App chunks
            if (id.includes("src/components")) {
              return "components";
            }
            if (id.includes("src/utils")) {
              return "utils";
            }
          }
        }
      },
      
      // Production optimizations
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction
        }
      }
    },
    
    server: {
      ...viteConfig.server,
      port: parseInt(env.VITE_PORT) || 3000,
      host: env.VITE_HOST || "localhost",
      
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        "/ws": {
          target: env.VITE_WS_URL || "ws://localhost:8080",
          ws: true
        }
      }
    },
    
    preview: {
      port: 4173,
      host: true
    },
    
    // Environment-specific CSS
    css: {
      ...viteConfig.css,
      devSourcemap: !isProduction
    }
  };
});
```

## References

- [Vite Documentation](https://vitejs.dev/) - Official Vite documentation
- [Telegraph PostCSS Config](../postcss-config/README.md) - PostCSS configuration
- [Design System Guidelines](https://github.com/knocklabs/telegraph)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this configuration:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Make changes to `src/vite-config.ts`
4. Test changes: `pnpm test`
5. Build: `pnpm build`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
