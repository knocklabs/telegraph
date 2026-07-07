---
"@telegraph/combobox": patch
"@telegraph/menu": minor
---

Migrate Menu internals to Base UI while preserving Telegraph dismissal callbacks, focus callbacks, `avoidCollisions`, `hideWhenDetached`, trigger refs, submenu state attributes, and portal styling. Combobox trigger aria labels now fall back to option values when labels are rendered as React nodes so assistive text remains string-safe.
