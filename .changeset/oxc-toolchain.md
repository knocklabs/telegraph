---
---

chore: replace ESLint with oxlint and Prettier with oxfmt

Consolidates the monorepo onto the oxc toolchain. A single root `.oxlintrc.json`
replaces the per-package `.eslintrc.js` files and a single `.oxfmtrc.json`
replaces the Prettier config. Tooling-only — no published package output
changes, so no version bumps. (Stacked on the TypeScript 7 type-check PR.)
