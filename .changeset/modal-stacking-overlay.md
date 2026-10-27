---
"@telegraph/modal": minor
---

Stacked modals dim the modal beneath them. The overlay sits between the two z-indexes, and clicking it closes the top modal. `stackingBehavior` on `Modal.Root` defaults to `"overlay"`; set it to `"none"` to skip the overlay. The first modal still draws the page backdrop.
