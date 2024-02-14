![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/vite-config.svg)](https://www.npmjs.com/package/@telegraph/vite-config)

# @telegraph/vite-config
> Shared `Vite` config for internal use in the telegraph project.


### Installation Instructions

```
npm install @telegraph/vite-config
```

### Usage

#### Default

vite.config.mts
```
import { viteConfig } from "@telegraph/vite-config";
import { defineConfig } from "vite";

export default defineConfig(viteConfig);
```

#### Scoped CSS

vite.config.mts
```
import { defaultViteConfig, scopeCssViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, scopeCssViteConfig);
```
