---
"@telegraph/combobox": minor
---

Rebase `@telegraph/combobox` onto the Base UI combobox engine (`@base-ui/react/combobox`) instead of `@telegraph/menu`. The compound-component API and its props are preserved, apart from the two deliberate changes noted at the end.

Options now use virtual focus: DOM focus stays on the popup's input and the active option is tracked with `aria-activedescendant` / `data-highlighted` rather than roving DOM focus. Selection, multi-select tags, `Create`, `Empty`, search filtering, and scroll-to-selected are preserved. Per the ARIA combobox pattern, the option matching the current value is highlighted on open (arrow keys move that highlight) and list wrap-around includes a no-highlight stop.

`@telegraph/combobox` no longer depends on `@telegraph/menu`: the styled option row is now an in-package presentational component, so consumers no longer pull in the menu package (and its Base UI menu / motion deps) transitively.

Two small API changes: `Combobox.Content` no longer forwards the `onInteractOutside` / `onPointerDownOutside` / `onFocusOutside` dismissal callbacks (`onEscapeKeyDown`, `onCloseAutoFocus`, and `onOpenAutoFocus` remain), and `Combobox.Search` is now write-only — Base UI owns the input value, so a controlled search reads/updates the query through `onValueChange` rather than `value`.
