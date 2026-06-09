---
"@telegraph/vite-config": patch
"@telegraph/compose-refs": patch
"@telegraph/helpers": patch
"@telegraph/input": patch
"@telegraph/modal": patch
"@telegraph/nextjs": patch
"@telegraph/tokens": patch
---

fix(vite-config): emit declaration files to a consistent `dist/types` root

Pin the TypeScript declaration root to `src` in the shared dts plugin config so
every package emits its types to `dist/types/index.d.ts`. Previously, packages
whose tsconfig omitted `rootDir` emitted to `dist/types/src/index.d.ts`, which
did not match the `types` entrypoint declared in their `package.json`, so
consumers received no type definitions. Also corrects the stale top-level
`types` field in `@telegraph/tokens`.
