![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/11a9e54e-2388-4c5d-9769-16099c5de9dc)

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

