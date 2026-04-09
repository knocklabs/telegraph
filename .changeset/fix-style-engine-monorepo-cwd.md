---
"@telegraph/style-engine": patch
---

Fix PostCSS plugin not discovering @telegraph/\* deps in monorepo builds

The plugin always read from `process.cwd()/package.json` to find which packages to inject CSS for. In a Turborepo monorepo, `process.cwd()` is the repo root — which has no `@telegraph/*` deps — so nothing was injected. This caused `@telegraph/toggle` CSS to be silently missing when using `@telegraph components`.

The fix uses `root.source?.input?.file` (the absolute path of the CSS file being processed) to walk up and find the nearest `package.json`, which is always the consumer package rather than the repo root. Also fixes `dep.path` resolution for both `workspace:` and semver deps that are hoisted to the monorepo root's `node_modules`.
