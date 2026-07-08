---
"@telegraph/tabs": patch
"@telegraph/modal": patch
---

Fix two visual regressions from the Base UI migration:

- **Tabs**: the root now renders a vertical `Stack` (`direction="column"`) by default so the tab list sits above the tab panel. Previously it rendered a bare `Box`, forcing consumers to pass `as={Stack} direction="column"` — which silently fell back to a horizontal `row` layout because `Box` emits `--flex-direction` while the `Stack` CSS reads `--direction`. Consumers can still override `direction` for side-by-side layouts.
- **Modal**: the content now slides in with a GPU-composited `translateY` transform instead of animating the `top` layout property. Animating `top` forced layout + paint on the main thread every frame, so on a busy page (e.g. a large list rendering as the modal opens) the spring dropped frames and the modal snapped into place. The resting position is now static and only the transform animates. Also settle the stack-depth scale at exactly `1` for a lone modal (it previously rested at `1.02`, ~2% too large).
