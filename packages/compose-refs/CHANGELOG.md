# @telegraph/compose-refs

## 0.0.9

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

## 0.0.8

### Patch Changes

- [#653](https://github.com/knocklabs/telegraph/pull/653) [`d6c6aa9`](https://github.com/knocklabs/telegraph/commit/d6c6aa9cb0e11ba96df7d7efd479c8e4652fc029) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump react and @types/react

## 0.0.7

### Patch Changes

- [#494](https://github.com/knocklabs/telegraph/pull/494) [`e769470`](https://github.com/knocklabs/telegraph/commit/e7694701fb63ebc65d9fe77d9a89c8f0bf557b67) Thanks [@kylemcd](https://github.com/kylemcd)! - update package exports to be in the correct order

## 0.0.6

### Patch Changes

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

## 0.0.5

### Patch Changes

- [#408](https://github.com/knocklabs/telegraph/pull/408) [`916d37c`](https://github.com/knocklabs/telegraph/commit/916d37cc78433eeb70a93e041b18f951d2d25bcd) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: minor upgrades to react, fixes peer dependency issues

- [#409](https://github.com/knocklabs/telegraph/pull/409) [`734b5c5`](https://github.com/knocklabs/telegraph/commit/734b5c5ee2ac0484a09f534148a4ca1cf23fb3d0) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: adds React 19 as a peer dependency

## 0.0.2

### Patch Changes

- [#174](https://github.com/knocklabs/telegraph/pull/174) [`9ab56ad`](https://github.com/knocklabs/telegraph/commit/9ab56ad877b964e1f21ff24312957cc6df519756) Thanks [@kylemcd](https://github.com/kylemcd)! - audit and fix dependencies

- [#172](https://github.com/knocklabs/telegraph/pull/172) [`96ac617`](https://github.com/knocklabs/telegraph/commit/96ac61740a39fa8f769946afdf16e02434c39770) Thanks [@kylemcd](https://github.com/kylemcd)! - button style-engine migration

## 0.0.1

### Patch Changes

- [`5b0ad10`](https://github.com/knocklabs/telegraph/commit/5b0ad10f29a0f850a4ec3c4a4e5096b5df3b4591) Thanks [@kylemcd](https://github.com/kylemcd)! - initial verison
