---
"@telegraph/combobox": minor
---

Add a segmented "pages" arrangement to `Combobox`. A `Combobox.PageSelector` (holding `Combobox.PageButton`s) pinned in the popup switches between `Combobox.Page` panels of options. Left/Right arrows switch pages while the search is empty (or when there is no search); Up/Down keep navigating the active page's list. The active page is controllable via `page`/`defaultPage`/`onPageChange` on `Combobox.Root`, and only the active page's options mount so highlight bounds and `Combobox.Empty` stay correct. `loopPages` (default `true`) controls whether Left/Right wraps around at the first/last page — set it to `false` to clamp at the ends.

Switching pages slides the outgoing panel out and the incoming panel in from the side matching the move, while the popup's height animates to fit. The slide loads only for multi-page comboboxes and is disabled under `prefers-reduced-motion`. A pointer press on a page button no longer moves DOM focus off the search input, so its focus ring stays steady.
