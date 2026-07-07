---
"@telegraph/helpers": patch
"@telegraph/tabs": minor
---

Migrate Tabs from Radix primitives to Base UI while preserving Telegraph styling hooks and `tgphRef` support. `onValueChange` now honestly types the Base UI cleared-selection case as `string | null`, and list activation behavior is configured through `Tabs.List` props.
