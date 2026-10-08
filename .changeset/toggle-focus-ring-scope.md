---
"@telegraph/toggle": patch
---

Scope the toggle focus ring to the focused toggle's root.

An unscoped `:has([data-tgph-toggle-input]:focus-visible)` matched from the document, so focusing one toggle painted the ring on every `[data-tgph-toggle-switch]` on the page (KNO-15206).
