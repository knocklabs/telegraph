---
"@telegraph/vite-config": patch
"@telegraph/style-engine": patch
---

fix(vite-config): externalize Node built-in modules in the Rolldown bundle

The shared Vite build config only externalized each package's declared
dependencies, never Node built-ins. Under Vite 8 / Rolldown, runtime
`require("node:path")` / `require("node:fs")` calls were inlined as empty-object
stubs, so `@telegraph/style-engine`'s PostCSS plugin threw
`TypeError: t.dirname is not a function` and broke every consumer build.

Add `builtinModules` (bare and `node:`-prefixed) to the Rolldown `external`
list. Republishes `@telegraph/style-engine` (0.3.5) so its `dist/cjs/postcss.js`
emits real `require("node:path")` / `require("node:fs")` again.
