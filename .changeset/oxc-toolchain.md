---
"@telegraph/helpers": patch
"@telegraph/input": patch
"@telegraph/menu": patch
"@telegraph/popover": patch
"@telegraph/radio": patch
---

chore: replace ESLint with oxlint and Prettier with oxfmt

Consolidates the monorepo onto the oxc toolchain. A single root `.oxlintrc.json`
replaces the per-package `.eslintrc.js` files and a single `.oxfmtrc.json`
replaces the Prettier config. The rule set matches the dashboard's, so a rule
lands in both repos or neither.

The five bumped packages each gain a `displayName` on a `forwardRef` component
that did not have one, which is what React DevTools and React's own warnings
show. No props, types, or rendered output change.
(Stacked on the TypeScript 7 type-check PR.)
