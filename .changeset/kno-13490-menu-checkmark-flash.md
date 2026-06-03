---
"@telegraph/menu": patch
"@telegraph/combobox": patch
"@telegraph/select": patch
"@telegraph/filter": patch
"@telegraph/tabs": patch
---

Fix checkmark flash in Menu/Combobox/Select on open. Menu item checkmarks no longer briefly appear selected for every item before normalizing — the motion element now initializes at its target state (`initial={false}`) instead of flashing visible on mount. Also hoisted the `LazyMotion` provider from each `MenuItem` up into `Menu.Content` so it's instantiated once per menu rather than per item.
