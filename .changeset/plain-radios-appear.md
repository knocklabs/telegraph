---
"@telegraph/radio": minor
---

feat(radio): add a standalone `Radio` and `RadioGroup`

A plain radio to sit beside `@telegraph/checkbox`: rounded with a dot rather
than squared with a check, and matching it on every other axis. It renders a
real `<input type="radio">`, so form submission, keyboard support, and roving
focus come from the platform and Base UI.

- `size` (`"1" | "2"`) and `color` (the same palette as `@telegraph/button`)
- `RadioGroup` with group-level `size` / `color` / `disabled` defaults, and
  `value` / `defaultValue` / `onValueChange` matching `Toggle` and `Checkbox`
- Composable `Radio.Root` / `Radio.Control` / `Radio.Label`, plus a
  `Radio.Default` that renders the control and label together

`RadioCards` is untouched.
