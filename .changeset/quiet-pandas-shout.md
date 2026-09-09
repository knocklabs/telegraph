---
"@telegraph/style-engine": patch
"@telegraph/layout": patch
---

fix(layout): make directional border color props apply their token

`borderTopColor`, `borderBottomColor`, `borderLeftColor` and
`borderRightColor` expanded into `--border-color` with `0` in the sides they
did not set. `border-color: 0 0 <color> 0` is invalid CSS, so the browser
dropped the declaration and the border painted in `currentColor`.

Directional expansion now picks the empty slot from the variable it writes:
`transparent` for a color, `0` everywhere else. It also fills a value that is
already there the way CSS fills a box shorthand, so a base `borderColor` keeps
applying to the sides a directional prop leaves alone. No prop table or public
type changes.
