---
"@telegraph/combobox": minor
---

**Breaking:** Remove the deprecated `legacyBehavior` prop and `{ value, label }` selection values. `value`, `defaultValue`, and `onValueChange` now use strings or string arrays only. `Combobox.Create` values and `onCreate` are string-only too.

Store only the option value in state. The trigger derives its display text from the matching mounted `Combobox.Option`, using its `label`, then its children, then its value. Async and paginated lists must keep the selected item mounted as an Option so the trigger can display its label.

`ComboboxRootProps` now accepts one generic parameter. Change `ComboboxRootProps<string, true>` to `ComboboxRootProps<string>`.
