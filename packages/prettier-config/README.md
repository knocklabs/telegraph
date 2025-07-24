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

## References

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Import Sort Plugin](https://github.com/trivago/prettier-plugin-sort-imports)

## Contributing

See our [Contributing Guide](../../CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
