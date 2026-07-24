---
---

chore: adopt the oxc toolchain (oxlint + oxfmt) and a TS7 type-check

Replaces ESLint with oxlint and Prettier with oxfmt, and adds a standalone
TypeScript 7 (`tsgo --noEmit`) type-check of shipping source. Tooling-only —
no published package output changes, so no version bumps here. (The related
`@telegraph/link` a11y fix that the type-check surfaced has its own changeset.)
