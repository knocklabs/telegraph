---
"@telegraph/segmented-control": patch
---

Restore radio-group accessibility semantics for single-select `SegmentedControl`. After the Base UI migration it rendered every option as a toggle button (`role="group"` + `aria-pressed`), which misrepresents a single-select control as independent multi-select toggles. Single-select now exposes `role="radiogroup"` + `role="radio"` + `aria-checked`, while `type="multiple"` keeps the correct toggle-button semantics. Also stops emitting the redundant `aria-disabled="false"` on enabled options.
