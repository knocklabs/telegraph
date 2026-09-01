---
"@telegraph/select": minor
---

Remove the internal compatibility workaround that discarded `legacyBehavior` before forwarding props to Combobox. Combobox no longer exposes that prop.

Correct the single-select `onValueChange` type to include `undefined`, which is reported when the selection is cleared. Multi-select callbacks continue to report string arrays.
