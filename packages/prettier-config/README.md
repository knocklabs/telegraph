# ✨ Prettier Config

> Shared Prettier configuration for Telegraph projects with automatic import sorting and consistent code formatting.

![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/prettier-config.svg)](https://www.npmjs.com/package/@telegraph/prettier-config)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@telegraph/prettier-config)](https://bundlephobia.com/result?p=@telegraph/prettier-config)
[![license](https://img.shields.io/npm/l/@telegraph/prettier-config)](https://github.com/knocklabs/telegraph/blob/main/LICENSE)

## Installation

```bash
npm install @telegraph/prettier-config
```

> **Note**: This package has no stylesheets required.

## Quick Start

### Package.json

```json
{
  "prettier": "@telegraph/prettier-config"
}
```

### Prettier Config File

```js
// .prettierrc.js
module.exports = require("@telegraph/prettier-config");
```

```js
// Or with ES modules (.prettierrc.mjs)
import config from "@telegraph/prettier-config";
export default config;
```

## What's Included

This configuration provides consistent code formatting with intelligent import organization:

- **Import Sorting** - Automatically sorts and groups imports by type
- **Import Separation** - Adds blank lines between import groups for readability
- **Specifier Sorting** - Sorts named imports alphabetically within each import statement
- **Telegraph Standards** - Consistent formatting rules across all Telegraph projects

## API Reference

### Main Configuration

The package exports a Prettier configuration object with the following structure:

```js
{
  importOrder: [
    "<THIRD_PARTY_MODULES>",    // npm packages
    "^@/(.*|\/.)",              // absolute imports with @/ prefix
    "^(..)/.*",                 // relative parent imports
    "^(.)/.*"                   // relative same-level imports
  ],
  importOrderSeparation: true,      // Add blank lines between groups
  importOrderSortSpecifiers: true,  // Sort named imports alphabetically
  plugins: ["@trivago/prettier-plugin-sort-imports"]
}
```

## Usage Patterns

### Basic Setup

```json
// package.json
{
  "prettier": "@telegraph/prettier-config"
}
```

### With Existing Config

```js
// .prettierrc.js
const telegraphConfig = require("@telegraph/prettier-config");

module.exports = {
  ...telegraphConfig,
  // Override specific options
  semi: false,
  singleQuote: false,
};
```

### NPM Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "format:staged": "lint-staged"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"]
  }
}
```

### IDE Integration

#### VS Code

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "prettier.requireConfig": true
}
```

#### IntelliJ/WebStorm

1. Go to **Settings → Languages & Frameworks → JavaScript → Prettier**
2. Check "On 'Reformat Code' action"
3. Check "On save"
4. Set Prettier package path to `node_modules/prettier`

## Advanced Usage

### Import Order Behavior

The configuration sorts imports into these groups:

```js
// 1. Third-party modules (npm packages)
import React from "react";
import { Button } from "antd";
import clsx from "clsx";

// 2. Absolute imports with @/ prefix (path mapping)
import { utils } from "@/lib/utils";
import { ComponentA } from "@/components/ComponentA";

// 3. Relative parent directory imports
import { parentHelper } from "../helpers/parentHelper";
import { config } from "../../config";

// 4. Relative same-level imports
import { localUtil } from "./localUtil";
import styles from "./Component.module.css";
```

### Extending Configuration

```js
// .prettierrc.js
const telegraphConfig = require("@telegraph/prettier-config");

module.exports = {
  ...telegraphConfig,
  // Add custom import patterns
  importOrder: [
    ...telegraphConfig.importOrder,
    "^@/types/(.*)$",     // Custom types imports
    "^[./].*\\.types$",   // Type-only imports
  ],
  // Additional prettier options
  printWidth: 100,
  tabWidth: 4,
  semi: false,
};
```

### TypeScript Integration

```js
// .prettierrc.js
const telegraphConfig = require("@telegraph/prettier-config");

module.exports = {
  ...telegraphConfig,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@telegraph/(.*)$",      // Telegraph packages
    "^@/types/(.*)$",         // Type definitions
    "^@/(.*)",                // Other absolute imports
    "^[../]",                 // Relative imports
    "^[./]",                  // Same-level imports
  ],
  // TypeScript-specific parser
  overrides: [
    {
      files: "*.{ts,tsx}",
      options: {
        parser: "typescript",
      },
    },
  ],
};
```

### Monorepo Configuration

```js
// prettier.config.js (root)
const telegraphConfig = require("@telegraph/prettier-config");

module.exports = {
  ...telegraphConfig,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@telegraph/(.*)$",              // Telegraph packages
    "^@company/(.*)$",                // Internal packages
    "^~/(.*)$",                       // Workspace root imports
    "^@/(.*)",                        // Package-specific absolute
    "^[../]",                         // Relative parent
    "^[./]",                          // Relative same-level
  ],
};
```

### CI/CD Integration

#### GitHub Actions

```yaml
# .github/workflows/format.yml
name: Format Check
on: [push, pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run format:check
      
      - name: Comment PR
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ Code formatting check failed. Run `npm run format` to fix.'
            })
```

#### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css,scss,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### Custom File Patterns

```js
// .prettierrc.js
const telegraphConfig = require("@telegraph/prettier-config");

module.exports = {
  ...telegraphConfig,
  overrides: [
    {
      files: "*.{js,jsx,ts,tsx}",
      options: {
        ...telegraphConfig,
      },
    },
    {
      files: "*.json",
      options: {
        tabWidth: 2,
      },
    },
    {
      files: "*.md",
      options: {
        proseWrap: "always",
        printWidth: 80,
      },
    },
  ],
};
```

## Import Order Examples

### Before Formatting

```js
import styles from "./Component.module.css";
import { Button } from "@telegraph/button";
import React, { useState, useEffect } from "react";
import { validateEmail } from "../utils/validation";
import clsx from "clsx";
import { ApiService } from "@/services/ApiService";
import { UserType } from "./types";
```

### After Formatting

```js
import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { Button } from "@telegraph/button";

import { ApiService } from "@/services/ApiService";

import { validateEmail } from "../utils/validation";

import styles from "./Component.module.css";
import { UserType } from "./types";
```

## Configuration Options

### Import Order Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| `<THIRD_PARTY_MODULES>` | npm packages | `import react from "react"` |
| `^@/(.*)` | Absolute with @/ prefix | `import utils from "@/lib/utils"` |
| `^(..)/.*` | Relative parent imports | `import config from "../config"` |
| `^(.)/.*` | Relative same-level | `import styles from "./styles.css"` |

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `importOrder` | `string[]` | See config | Order patterns for imports |
| `importOrderSeparation` | `boolean` | `true` | Add blank lines between groups |
| `importOrderSortSpecifiers` | `boolean` | `true` | Sort named imports alphabetically |

## Testing

### Testing Configuration

```js
// __tests__/prettier.test.js
const prettier = require("prettier");
const config = require("@telegraph/prettier-config");

describe("Prettier Configuration", () => {
  test("formats imports correctly", async () => {
    const input = `
import styles from "./styles.css";
import { Button } from "@telegraph/button";
import React from "react";
import { utils } from "@/lib/utils";
    `;

    const output = await prettier.format(input, {
      ...config,
      parser: "typescript",
    });

    expect(output).toMatch(/import React from "react";\n\nimport { Button }/);
    expect(output).toMatch(/from "@telegraph\/button";\n\nimport { utils }/);
  });

  test("sorts named imports", async () => {
    const input = `import { useState, useEffect, useCallback } from "react";`;

    const output = await prettier.format(input, {
      ...config,
      parser: "typescript",
    });

    expect(output).toContain("useCallback, useEffect, useState");
  });
});
```

### Integration Testing

```js
// __tests__/integration.test.js
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("Prettier Integration", () => {
  test("formats all files without errors", async () => {
    const { stdout, stderr } = await execAsync("npm run format:check");
    
    expect(stderr).toBe("");
    expect(stdout).toContain("All matched files use Prettier code style");
  });

  test("auto-fixes formatting issues", async () => {
    await execAsync("npm run format");
    
    const { stdout } = await execAsync("git diff --name-only");
    
    // Should have formatted files
    expect(stdout).toMatch(/\.(js|jsx|ts|tsx|json|md)$/m);
  });
});
```

### IDE Testing

```js
// scripts/test-ide-integration.js
const fs = require("fs");
const path = require("path");

// Test VS Code settings
const vscodeSettings = path.join(".vscode", "settings.json");
if (fs.existsSync(vscodeSettings)) {
  const settings = JSON.parse(fs.readFileSync(vscodeSettings));
  
  console.log("✅ VS Code Prettier integration:", {
    defaultFormatter: settings["editor.defaultFormatter"],
    formatOnSave: settings["editor.formatOnSave"],
    requireConfig: settings["prettier.requireConfig"],
  });
}

// Test configuration file
try {
  const config = require("@telegraph/prettier-config");
  console.log("✅ Configuration loaded successfully");
  console.log("Import order patterns:", config.importOrder.length);
} catch (error) {
  console.error("❌ Configuration loading failed:", error.message);
}
```

## Troubleshooting

### Common Issues

**Prettier not formatting imports**
```bash
# Ensure the plugin is installed
npm install @trivago/prettier-plugin-sort-imports

# Check if config is being loaded
npx prettier --find-config-path .
```

**IDE not respecting configuration**
```json
// Ensure VS Code uses project config
{
  "prettier.requireConfig": true,
  "prettier.configPath": "./.prettierrc.js"
}
```

**Import order not working**
```js
// Verify plugin is included in config
module.exports = {
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  // ... other options
};
```

### Debug Mode

```bash
# Run prettier with debug logging
DEBUG=prettier:* npx prettier --write src/

# Check which config is being used
npx prettier --find-config-path src/Component.tsx
```

## Examples

### Basic Project Setup

```bash
# Install dependencies
npm install --save-dev prettier @telegraph/prettier-config

# Add to package.json
npm pkg set prettier="@telegraph/prettier-config"

# Add format scripts
npm pkg set scripts.format="prettier --write ."
npm pkg set scripts.format:check="prettier --check ."
```

### Advanced Monorepo Setup

```js
// prettier.config.js
const telegraphConfig = require("@telegraph/prettier-config");

module.exports = {
  ...telegraphConfig,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@company/(.*)$",        // Internal packages
    "^~/(.*)$",               // Workspace imports
    ...telegraphConfig.importOrder.slice(1), // Keep existing patterns
  ],
  overrides: [
    {
      files: "packages/*/src/**/*.{ts,tsx}",
      options: {
        importOrder: [
          "<THIRD_PARTY_MODULES>",
          "^@telegraph/(.*)$",
          "^@company/(.*)$",
          "^@/(.*)",
          "^[../]",
          "^[./]",
        ],
      },
    },
  ],
};
```

### Team Workflow Integration

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

```yaml
# .github/workflows/code-quality.yml
name: Code Quality
on: [push, pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run format:check
      
      - name: Auto-fix formatting
        if: failure()
        run: |
          npm run format
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add .
          git diff --staged --quiet || git commit -m "Auto-fix: Format code with Prettier"
          git push
```

## References

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Import Sort Plugin](https://github.com/trivago/prettier-plugin-sort-imports)
- [VS Code Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [CHANGELOG](./CHANGELOG.md)

## Contributing

To contribute to this configuration:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Make changes to `src/prettier-config.js`
4. Test: `pnpm test`
5. Build: `pnpm build`

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.

