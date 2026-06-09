# @telegraph/vite-config

## 0.0.17

### Patch Changes

- [#824](https://github.com/knocklabs/telegraph/pull/824) [`59808f3`](https://github.com/knocklabs/telegraph/commit/59808f3b4cd7db06bb57db4b3417c215867d7a1d) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump vite-plugin-dts from 4.5.4 to 5.0.1

- [#825](https://github.com/knocklabs/telegraph/pull/825) [`a566c9a`](https://github.com/knocklabs/telegraph/commit/a566c9ab8c6befd8330427c3c3f0ed64b9ddb436) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump vite from 8.0.13 to 8.0.14

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

- [#827](https://github.com/knocklabs/telegraph/pull/827) [`f71d0e6`](https://github.com/knocklabs/telegraph/commit/f71d0e6f91310a771393b01d0f3ab99579c8d5f3) Thanks [@kylemcd](https://github.com/kylemcd)! - fix(vite-config): externalize Node built-in modules in the Rolldown bundle

  The shared Vite build config only externalized each package's declared
  dependencies, never Node built-ins. Under Vite 8 / Rolldown, runtime
  `require("node:path")` / `require("node:fs")` calls were inlined as empty-object
  stubs, so `@telegraph/style-engine`'s PostCSS plugin threw
  `TypeError: t.dirname is not a function` and broke every consumer build.

  Add `builtinModules` (bare and `node:`-prefixed) to the Rolldown `external`
  list. Republishes `@telegraph/style-engine` (0.3.5) so its `dist/cjs/postcss.js`
  emits real `require("node:path")` / `require("node:fs")` again.

## 0.0.16

### Patch Changes

- [#812](https://github.com/knocklabs/telegraph/pull/812) [`2815652`](https://github.com/knocklabs/telegraph/commit/2815652e415e1e906eb7c074a285051ddf6ed890) Thanks [@dependabot](https://github.com/apps/dependabot)! - chore(deps): bump vite from 8.0.8 to 8.0.12

## 0.0.15

### Patch Changes

- [#490](https://github.com/knocklabs/telegraph/pull/490) [`def8e98`](https://github.com/knocklabs/telegraph/commit/def8e983fe8d90d3d35f8ffe81ceb9daa46e1b30) Thanks [@kylemcd](https://github.com/kylemcd)! - deprecate and remove legacy vanilla extract style engine

## 0.0.14

### Patch Changes

- [#384](https://github.com/knocklabs/telegraph/pull/384) [`552fb82`](https://github.com/knocklabs/telegraph/commit/552fb82a33203c87e58715b4a52ea0c360999636) Thanks [@dependabot](https://github.com/apps/dependabot)! - upgrade typescript dep

## 0.0.13

### Patch Changes

- [#407](https://github.com/knocklabs/telegraph/pull/407) [`2925a69`](https://github.com/knocklabs/telegraph/commit/2925a699379f14b08fc91d2c5f84a143dfda01eb) Thanks [@MikeCarbone](https://github.com/MikeCarbone)! - chore: upgrades Vite plugins, fixes peer dependency issues

## 0.0.11

### Patch Changes

- [#174](https://github.com/knocklabs/telegraph/pull/174) [`9ab56ad`](https://github.com/knocklabs/telegraph/commit/9ab56ad877b964e1f21ff24312957cc6df519756) Thanks [@kylemcd](https://github.com/kylemcd)! - audit and fix dependencies

- [#172](https://github.com/knocklabs/telegraph/pull/172) [`96ac617`](https://github.com/knocklabs/telegraph/commit/96ac61740a39fa8f769946afdf16e02434c39770) Thanks [@kylemcd](https://github.com/kylemcd)! - button style-engine migration

## 0.0.10

### Patch Changes

- [#162](https://github.com/knocklabs/telegraph/pull/162) [`5baffd9`](https://github.com/knocklabs/telegraph/commit/5baffd925a0abcd5c1cc0cbe75ec865271c30375) Thanks [@kylemcd](https://github.com/kylemcd)! - fixes issues stemming from the change to the new style engine

- [#161](https://github.com/knocklabs/telegraph/pull/161) [`1c2ac3b`](https://github.com/knocklabs/telegraph/commit/1c2ac3bed11f2811423587b5189db286359df062) Thanks [@kylemcd](https://github.com/kylemcd)! - style-engine build + integration into layout package

## 0.0.9

### Patch Changes

- [#92](https://github.com/knocklabs/telegraph/pull/92) [`efbea6a`](https://github.com/knocklabs/telegraph/commit/efbea6a62e1f783a6dc3d2799a0aaab1a34d5e90) Thanks [@kylemcd](https://github.com/kylemcd)! - Updates to support lucide icon

## 0.0.8

### Patch Changes

- [#52](https://github.com/knocklabs/telegraph/pull/52) [`fa40877`](https://github.com/knocklabs/telegraph/commit/fa408773387bf864fb3d38f13028ba889fef60a5) Thanks [@kylemcd](https://github.com/kylemcd)! - fixes esm build issues, removes semantic tokens, deprecates the core package

## 0.0.7

### Patch Changes

- [#48](https://github.com/knocklabs/telegraph/pull/48) [`14e9b48`](https://github.com/knocklabs/telegraph/commit/14e9b484a99b9e40460a91350297fefa9e98abd2) Thanks [@kylemcd](https://github.com/kylemcd)! - adds scoped css config that can be used to generate scoped taiwind classes in component packages

## 0.0.6

### Patch Changes

- [#36](https://github.com/knocklabs/telegraph/pull/36) [`06bf439`](https://github.com/knocklabs/telegraph/commit/06bf439773d05154e9cc4a6523382a73330c4060) Thanks [@kylemcd](https://github.com/kylemcd)! - adds documentation via the readme file

## 0.0.5

### Patch Changes

- [#17](https://github.com/knocklabs/telegraph/pull/17) [`615c6c4`](https://github.com/knocklabs/telegraph/commit/615c6c4f835819933ab292ecbdf12cba3b95f446) Thanks [@kylemcd](https://github.com/kylemcd)! - bump versions

## 0.0.4

### Patch Changes

- [#15](https://github.com/knocklabs/telegraph/pull/15) [`4c8c13d`](https://github.com/knocklabs/telegraph/commit/4c8c13d877b3065d03c156519646a5641185da17) Thanks [@kylemcd](https://github.com/kylemcd)! - bump versions

## 0.0.3

### Patch Changes

- [#13](https://github.com/knocklabs/telegraph/pull/13) [`cb2e132`](https://github.com/knocklabs/telegraph/commit/cb2e1322647c2f86c72bca4a1fe342c530ba9feb) Thanks [@kylemcd](https://github.com/kylemcd)! - bump versions

## 0.0.2

### Patch Changes

- [#11](https://github.com/knocklabs/telegraph/pull/11) [`4fe3fa2`](https://github.com/knocklabs/telegraph/commit/4fe3fa2eda03d14301ab58977a8ce4e122187d9d) Thanks [@kylemcd](https://github.com/kylemcd)! - Add package READMEs and dist folder

## 0.0.1

### Patch Changes

- [#7](https://github.com/knocklabs/telegraph/pull/7) [`82b7f89`](https://github.com/knocklabs/telegraph/commit/82b7f89254b8bb53f1a2ac0aacb27103acb76337) Thanks [@kylemcd](https://github.com/kylemcd)! - first iteration of shared config packages
