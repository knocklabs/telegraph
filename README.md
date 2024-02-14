![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

# Telegraph
> The design system at [Knock](https://knock.app)

## Installation Instructions

```
npm install @telegraph/core @telegraph/tokens
```

### Add stylesheets
Pick one:

Via CSS (preferred):
```
@import "@telegraph/core";
@import "@telegraph/tokens"; (option: default.css, dark.css, light.css)
```

Via Javascript:
```
import "@telegraph/core/style.css";
import "@telegraph/tokens/default.css"; (options: default.css, dark.css, light.css)
```

> If your project is already using tailwind, you can avoid collisions with Telegraph's tailwind classes by importing the scoped versions of css files: `@import "@telegraph/core/scoped";`. Then, include `className="tgph"` on the nearest element wrapping a Telegraph component.

## Packages

### Core Packages

| Name | Version |
| ---- | ------- |
| [@telegraph/core](https://github.com/knocklabs/telegraph/tree/main/packages/core) | [![npm version](https://img.shields.io/npm/v/@telegraph/core.svg)](https://www.npmjs.com/package/@telegraph/core) |
| [@telegraph/nextjs](https://github.com/knocklabs/telegraph/tree/main/packages/nextjs) | [![npm version](https://img.shields.io/npm/v/@telegraph/nextjs.svg)](https://www.npmjs.com/package/@telegraph/nextjs) |
| [@telegraph/tokens](https://github.com/knocklabs/telegraph/tree/main/packages/tokens) | [![npm version](https://img.shields.io/npm/v/@telegraph/tokens.svg)](https://www.npmjs.com/package/@telegraph/tokens) |
| [@telegraph/typography](https://github.com/knocklabs/telegraph/tree/main/packages/typography) | [![npm version](https://img.shields.io/npm/v/@telegraph/typography.svg)](https://www.npmjs.com/package/@telegraph/typography) |

### Internal Packages

| Name | Version |
| ---- | ------- |
| [@telegraph/postcss-config](https://github.com/knocklabs/telegraph/tree/main/packages/postcss-config) | [![npm version](https://img.shields.io/npm/v/@telegraph/postcss-config.svg)](https://www.npmjs.com/package/@telegraph/postcss-config) |
| [@telegraph/prettier-config](https://github.com/knocklabs/telegraph/tree/main/packages/prettier-config) | [![npm version](https://img.shields.io/npm/v/@telegraph/prettier-config.svg)](https://www.npmjs.com/package/@telegraph/prettier-config) |
| [@telegraph/tailwind-config](https://github.com/knocklabs/telegraph/tree/main/packages/tailwind-config) | [![npm version](https://img.shields.io/npm/v/@telegraph/tailwind-config.svg)](https://www.npmjs.com/package/@telegraph/tailwind-config) |
| [@telegraph/vite-config](https://github.com/knocklabs/telegraph/tree/main/packages/vite-config) | [![npm version](https://img.shields.io/npm/v/@telegraph/vite-config.svg)](https://www.npmjs.com/package/@telegraph/vite-config) |
| [@telegraph/vitest-config](https://github.com/knocklabs/telegraph/tree/main/packages/vitest-config) | [![npm version](https://img.shields.io/npm/v/@telegraph/vitest-config.svg)](https://www.npmjs.com/package/@telegraph/vitest-config) |


### Upcoming Packages

| Name | Status |
| ---- | ------- |
| @telegraph/button | In Development |
| @telegraph/link | In Development |
| @telegraph/code | In Development |
| @telegraph/divider | In Development |
| @telegraph/select | In Development |
| @telegraph/badge | In Development |
| @telegraph/combobox | Planned |
| @telegraph/form | Planned |
