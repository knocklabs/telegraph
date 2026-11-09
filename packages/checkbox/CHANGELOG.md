# @telegraph/checkbox

## 0.1.3

### Patch Changes

- [#1055](https://github.com/knocklabs/telegraph/pull/1055) [`7635d95`](https://github.com/knocklabs/telegraph/commit/7635d95e4081f882a584e9b1c8f0fcdb8b6a02ef) Thanks [@kylemcd](https://github.com/kylemcd)! - Publish from GitHub Actions through npm trusted publishing (OIDC) with signed provenance, and point each package's `repository` field at its directory in this repo.
- Updated dependencies [[`7635d95`](https://github.com/knocklabs/telegraph/commit/7635d95e4081f882a584e9b1c8f0fcdb8b6a02ef)]:
  - @telegraph/compose-refs@0.0.10
  - @telegraph/helpers@0.3.3
  - @telegraph/icon@0.6.3
  - @telegraph/layout@0.6.5
  - @telegraph/typography@0.5.4

## 0.1.2

### Patch Changes

- [#906](https://github.com/knocklabs/telegraph/pull/906) [`5e9e6b4`](https://github.com/knocklabs/telegraph/commit/5e9e6b40311e69c04f17ef0f7dff1d9adf877013) Thanks [@kylemcd](https://github.com/kylemcd)! - Bump `@base-ui/react` from `^1.5.0` to `^1.6.0`. No Telegraph component API changes.

- Updated dependencies [[`5e9e6b4`](https://github.com/knocklabs/telegraph/commit/5e9e6b40311e69c04f17ef0f7dff1d9adf877013)]:
  - @telegraph/helpers@0.3.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`5015089`](https://github.com/knocklabs/telegraph/commit/5015089fd7a94dde8214ef383fa78d86c3aec688)]:
  - @telegraph/helpers@0.3.0
  - @telegraph/icon@0.6.1
  - @telegraph/layout@0.6.2
  - @telegraph/typography@0.5.1

## 0.1.0

### Minor Changes

- [#923](https://github.com/knocklabs/telegraph/pull/923) [`2c3c9ef`](https://github.com/knocklabs/telegraph/commit/2c3c9efee54697732acbd7eeaed7476b4221c447) Thanks [@kylemcd](https://github.com/kylemcd)! - feat(checkbox): add `@telegraph/checkbox` with `Checkbox` and `CheckboxGroup`

  Builds on Base UI's `Checkbox` and `CheckboxGroup`, so it renders a real
  `<input type="checkbox">` with form participation, native `indeterminate`, and
  keyboard handling.
  - `size` (`"1" | "2"`) and `color` (the same palette as `@telegraph/button`)
  - Telegraph-idiomatic `value` / `defaultValue` / `onValueChange`, matching
    `Toggle`. Base UI's string form payload is exposed as `formValue`, and
    `uncheckedValue` submits a value when the box is unticked
  - `CheckboxGroup` with group-level `size` / `color` / `disabled` defaults
  - Select-all via a `parent` checkbox plus `allValues`, including
    disabled-aware selection
