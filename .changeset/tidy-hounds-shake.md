---
"@telegraph/checkbox": minor
---

feat(checkbox): add `@telegraph/checkbox` with `Checkbox` and `CheckboxGroup`

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
