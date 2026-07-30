---
"@telegraph/toggle": patch
"@telegraph/menu": patch
---

Two props type-checked and did nothing. An AST sweep of every component found them, rather than a reader noticing.

`Toggle.Root` accepted `as` and never forwarded it to `Stack`, so it always rendered a `div`. It now renders the element you name.

`MenuItem` declared `fontWeight` to seed the label's weight, but never destructured it. The value reached the label and also landed on the DOM as a `font-weight` attribute. Every `Tabs.Tab` shipped one. The prop now stops at the label.
