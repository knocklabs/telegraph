---
"@telegraph/menu": patch
---

Keep `Menu.Button` rendering as a standalone styled action when no `Menu.Root` is present as a deprecated compatibility fallback. This fallback will be removed in a future major release. Migrate popup action rows to `Combobox.Option` with `onSelect` or to plain buttons.
