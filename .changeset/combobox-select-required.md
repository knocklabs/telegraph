---
"@telegraph/combobox": minor
"@telegraph/select": minor
---

Add `required` (and `name`) props to `Combobox.Root` and `Select.Root` for native form integration. Base UI's combobox engine renders a hidden form input for the selection, so `required` enforces client-side required validation on submit — matching `<select required>` — and `name` submits the selected value under that key. `Select.Root` inherits both by forwarding to `Combobox.Root`.

For a multi-select, `required` behaves as "at least one": the form is invalid while nothing is selected and validates once any value is chosen.

Resolves KNO-14400.
