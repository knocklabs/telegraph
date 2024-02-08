![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/9b5022e3-b02c-4582-ba57-3d6171e45e44)

[![npm version](https://img.shields.io/npm/v/@telegraph/vitest-config.svg)](https://www.npmjs.com/package/@telegraph/vitest-config)

# @telegraph/vitest-config
> Shared `Vitest` config for internal use in the telegraph project.


### Installation Instructions

```
npm install @telegraph/vitest-config
```

### Usage

vitest.d.ts
```
/// <reference types="@telegraph/vitest-config/dist/vitest-axe.d.ts" />
// NOTE: This file should not be editied
// This generates the correct types for vite `expect` to interacte with "vitest-axe"
```

vitest.config.mts
```
import { vitestConfig } from "@telegraph/vitest-config";
export default vitestConfig;
```

