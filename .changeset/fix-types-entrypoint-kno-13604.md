---
"@telegraph/vite-config": patch
"@telegraph/compose-refs": patch
"@telegraph/helpers": patch
"@telegraph/input": patch
"@telegraph/modal": patch
"@telegraph/nextjs": patch
"@telegraph/tokens": patch
"@telegraph/tabs": patch
"@telegraph/layout": patch
---

fix(vite-config): emit declaration files to a consistent `dist/types` root

Pin the TypeScript declaration root to `src` in the shared dts plugin config so
every package emits its types to `dist/types/index.d.ts`. Previously, packages
whose tsconfig omitted `rootDir` emitted to `dist/types/src/index.d.ts`, which
did not match the `types` entrypoint declared in their `package.json`, so
consumers received no type definitions (`@telegraph/compose-refs`, `helpers`,
`input`, `modal`, `nextjs`, `tokens`).

Pinning the declaration root also repairs degraded type emission that depended
on the inferred root: `@telegraph/tabs` previously emitted a dangling
`TgphElement` reference (`error TS2304: Cannot find name 'TgphElement'` for
consumers), and `@telegraph/modal`'s `Content` prop type was widened to `any`.
Both now emit correct, fully-resolved types.

Also corrects the stale top-level `types` field in `@telegraph/tokens`.
