---
"@telegraph/combobox": minor
---

Rebase `@telegraph/combobox` onto the Base UI combobox engine (`@base-ui/react/combobox`) instead of `@telegraph/menu`, with the public API unchanged.

Options now use virtual focus: DOM focus stays on the popup's input and the active option is tracked with `aria-activedescendant` / `data-highlighted` rather than roving DOM focus. Selection, multi-select tags, `Create`, `Empty`, search filtering, and scroll-to-selected are preserved. Per the ARIA combobox pattern, the option matching the current value is highlighted on open (arrow keys move that highlight) and list wrap-around includes a no-highlight stop.
