---
"@telegraph/popover": minor
"@telegraph/tooltip": minor
"@telegraph/modal": minor
"@telegraph/combobox": minor
---

`as` no longer replaces the animated element on `Popover.Content`, `Tooltip`'s popup label, `Modal.Root`, and Combobox's trigger indicator and trigger tag. Each renders a `framer-motion` element and then spread the caller's rest props after it, so a caller-supplied `as` won that spread. The animation stopped running, motion props reached a plain DOM node, and for `Popover.Content` the popup could stay mounted after close, because `onAnimationComplete` never fired on a non-motion element.

`as` is now dropped from each props type and discarded at runtime. Passing it is a type error, and a spread cannot smuggle it through.
