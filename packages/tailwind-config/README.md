![Telegraph by Knock](https://github.com/knocklabs/telegraph/assets/29106675/11a9e54e-2388-4c5d-9769-16099c5de9dc)

[![npm version](https://img.shields.io/npm/v/@telegraph/tailwind-config.svg)](https://www.npmjs.com/package/@telegraph/tailwind-config)

# @telegraph/tailwind-config
> Shared `Tailwind` config for internal use in the telegraph project.


### Installation Instructions

```
npm install @telegraph/tailwind-config
```

### Usage

tailwind.config.mts
```
import tailwindConfig from "@telegraph/tailwind-config";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  extend: {},
  presets: [tailwindConfig],
};
```

