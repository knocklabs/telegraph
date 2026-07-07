---
"@telegraph/popover": patch
---

Set the popover z-index on the Base UI positioner instead of only the popup. Base UI portals content to `<body>` and applies a `transform` to the positioner, making it the stacking-context root at `z-index: auto`; a z-index on the popup child alone was trapped inside that context, so popovers could render underneath app content with its own positive z-index. This matches how Menu and Tooltip already set their positioner z-index.
