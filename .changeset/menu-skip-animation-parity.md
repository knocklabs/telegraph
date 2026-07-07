---
"@telegraph/menu": patch
---

`Menu.Content` now accepts a `skipAnimation` prop for API parity with `Popover.Content`. Menu's popup is not motion-animated, so the prop is a no-op, but accepting it stops the prop from leaking onto the DOM node (and triggering React's "unknown prop" warning) when consumers pass it for symmetry with Popover.
