---
"@telegraph/combobox": patch
---

Restore controlled search and popup keyboard propagation compatibility after the Base UI rewrite.

The synthetic option `focusin` signal and programmatic option-focus support are deprecated compatibility bridges for legacy virtualized consumers. Migrate to `onItemHighlighted` on `Combobox.Root`; both bridges will be removed in a future major release.
