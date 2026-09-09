---
"@telegraph/style-engine": patch
"@telegraph/layout": patch
---

fix(layout): make directional border color props apply their token

`borderTopColor`, `borderBottomColor`, `borderLeftColor` and
`borderRightColor` expanded into `--border-color` with a `0` neutral on the
sides they did not set. `border-color: 0 0 <color> 0` is invalid CSS, so the
browser dropped the declaration and the border painted in `currentColor`.

Directional expansion now takes a per-property neutral, `transparent` for the
color props, and pads a value that is already there the way CSS expands a box
shorthand — so a base `borderColor` keeps applying to the sides a directional
prop leaves alone. Widths and radii keep their `0` neutral.
