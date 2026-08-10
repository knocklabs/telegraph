# @telegraph/checkbox

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
