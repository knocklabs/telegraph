# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Telegraph (`@knocklabs/telegraph`) is a React UI component design system by Knock, built as a Yarn 4 (Berry) + Turborepo monorepo with ~28 packages under `packages/`. There are no backend services, databases, or Docker containers. The entire product is frontend-only.

### Prerequisites

- **Node.js 22.x** (see `engines` in `package.json`)
- **Yarn 4.1.0** (bundled at `.yarn/releases/yarn-4.1.0.cjs`, configured in `.yarnrc.yml`)

### Key commands

See `package.json` scripts. The most important ones:

| Task | Command |
|------|---------|
| Install deps | `yarn install` |
| Build all packages | `yarn build:packages` |
| Dev watch (packages) | `yarn dev:packages` |
| Run tests | `yarn test` |
| Watch tests | `yarn test:watch` |
| Lint | `yarn lint` |
| Format | `yarn format` |
| Format check | `yarn format:check` |
| Storybook | `yarn dev:storybook` (port 3005) |

### Non-obvious caveats

- Packages must be built (`yarn build:packages`) before Storybook or tests can resolve cross-package imports. If you see module-not-found errors after a fresh install, build first.
- The `postinstall` hook runs `manypkg check`, which validates workspace dependency consistency. If it fails, run `yarn manypkg:fix`.
- Husky pre-commit hooks run `yarn lint` and `yarn format`. Commit messages must follow Conventional Commits (enforced by `commitlint` in the `commit-msg` hook).
- The combobox package has known TypeScript errors during build (TS2322 related to ref type mismatches). These do not block the build - Vite still emits output despite the type errors.
- Browserslist data warnings ("browsers data is X months old") are cosmetic and do not affect builds.
