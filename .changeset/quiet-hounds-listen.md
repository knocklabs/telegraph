---
"@telegraph/popover": minor
"@telegraph/tooltip": minor
"@telegraph/modal": minor
"@telegraph/combobox": minor
---

`as` no longer replaces the animated element on `Popover.Content`, `Tooltip`'s popup label, `Modal.Root`, and Combobox's trigger indicator and trigger tag. Each renders a `framer-motion` element and then spread the caller's rest props after it, so a caller-supplied `as` won that spread. The animation stopped running, motion props reached a plain DOM node, and for `Popover.Content` the popup could stay mounted after close, because `onAnimationComplete` never fired on a non-motion element.

`as` is now dropped from each props type and discarded at runtime. Passing it is a type error, and a spread cannot smuggle it through.

`Modal.Root` needed one more change to keep that promise. The cast that let the body destructure `as` sat on the parameter. That put `as` straight back into the public type, so `<Modal.Root as="div">` compiled and did nothing. The cast now sits in the body.

`Tooltip` also drops `asChild`. It declared the prop and never read it. Tooltip always merges its props onto its child, so `asChild` had no meaning. Passing it is now a type error, and you can remove it.

`Combobox.Primitives.TriggerIndicator` also drops `alt`. The body discards it, because `Button.Icon` rejects `alt` and `aria-hidden` together. Leaving `alt` in the type promised an accessible name that never rendered.
