---
"@telegraph/combobox": patch
---

fix(combobox): stop `Combobox.Trigger` stretching to a definite-height ancestor

The trigger hard-coded `h="full"` (`height: 100%`). Against an auto-height
ancestor that collapses to `auto` and does nothing, but inside any ancestor
with a definite height — a flex row with a fixed height, a sized block, a grid
row — the trigger filled it instead of using its own size. A size-`1` trigger
rendered 80px tall in an 80px container rather than 24px, and a parent's
`align-items: center` could not opt out of it.

`h` is now `auto`, so `minH` sets the floor and content drives growth. It is
set explicitly rather than dropped because `Button.Root` applies a fixed
per-size `h` underneath, which would otherwise clip the multi-select `wrap`
layout when tags run onto a second line.
