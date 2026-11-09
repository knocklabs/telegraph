# @telegraph/nextjs

## 0.0.6

### Patch Changes

- [#1055](https://github.com/knocklabs/telegraph/pull/1055) [`7635d95`](https://github.com/knocklabs/telegraph/commit/7635d95e4081f882a584e9b1c8f0fcdb8b6a02ef) Thanks [@kylemcd](https://github.com/kylemcd)! - Publish from GitHub Actions through npm trusted publishing (OIDC) with signed provenance, and point each package's `repository` field at its directory in this repo.

## 0.0.5

### Patch Changes

- [#830](https://github.com/knocklabs/telegraph/pull/830) [`f9c6e1c`](https://github.com/knocklabs/telegraph/commit/f9c6e1c078a1bd3d6a8e5eb0ce2dd6713ccc781e) Thanks [@kylemcd](https://github.com/kylemcd)! - fix(vite-config): emit declaration files to a consistent `dist/types` root

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

## 0.0.4

### Patch Changes

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

## 0.0.3

### Patch Changes

- [#52](https://github.com/knocklabs/telegraph/pull/52) [`fa40877`](https://github.com/knocklabs/telegraph/commit/fa408773387bf864fb3d38f13028ba889fef60a5) Thanks [@kylemcd](https://github.com/kylemcd)! - fixes esm build issues, removes semantic tokens, deprecates the core package

## 0.0.2

### Patch Changes

- [#48](https://github.com/knocklabs/telegraph/pull/48) [`14e9b48`](https://github.com/knocklabs/telegraph/commit/14e9b484a99b9e40460a91350297fefa9e98abd2) Thanks [@kylemcd](https://github.com/kylemcd)! - fixes file resolutions after build changes from scoped css

## 0.0.1

### Patch Changes

- [#40](https://github.com/knocklabs/telegraph/pull/40) [`bb2d7ce`](https://github.com/knocklabs/telegraph/commit/bb2d7ce28795d607342b6a31a7ff1cb2c99f7a21) Thanks [@kylemcd](https://github.com/kylemcd)! - adds @telegraph/nextjs package for RSC use client directives
