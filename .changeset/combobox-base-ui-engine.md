---
"@telegraph/combobox": minor
"@telegraph/select": patch
---

Rebase `@telegraph/combobox` onto the Base UI combobox engine (`@base-ui/react/combobox`) instead of `@telegraph/menu`. The compound-component API and its props are preserved, apart from the deliberate changes noted below.

Options now use virtual focus: DOM focus stays on the popup's input and the active option is tracked with `aria-activedescendant` / `data-highlighted` rather than roving DOM focus. Selection, multi-select tags, `Create`, `Empty`, and scroll-to-selected are preserved.

`@telegraph/combobox` no longer depends on `@telegraph/menu`: the styled option row is now an in-package presentational component, so consumers no longer pull in the menu package (and its Base UI menu / motion deps) transitively.

### Behavior changes from the engine swap

These follow from adopting the Base UI combobox pattern and affect every consumer, including `@telegraph/select`:

- **Type-to-filter instead of typeahead.** In an arrangement without a `Combobox.Search` (e.g. every `Select`), typing now filters the options in place through a hidden input rather than jumping DOM focus to the first match. A `Select` gains a default `Combobox.Empty`, so a non-matching query shows "No results found" instead of an empty popup. Matching is a case-insensitive substring (previously a prefix typeahead).
- **Open highlight follows ARIA.** On open, the option matching the current value is highlighted; with no selection nothing is highlighted, so the canonical empty-select flow becomes ArrowDown (open) → ArrowDown (highlight first) → Enter. Pressing Enter with nothing highlighted closes the popup (Base UI's "allow form submission" behavior) rather than selecting the first option.
- **Space no longer selects.** Under virtual focus a space is typed into the filter input; Enter and click still select. Disabled options remain keyboard-highlightable (deliberate Base UI behavior — they still cannot be selected).

### API changes

- `Combobox.Content` no longer forwards the `onInteractOutside` / `onPointerDownOutside` / `onFocusOutside` dismissal callbacks. `onEscapeKeyDown`, `onCloseAutoFocus`, and `onOpenAutoFocus` remain.
- `Combobox.Search` is now write-only — Base UI owns the input value, so a controlled search reads/updates the query through `onValueChange` rather than `value`.
- New `manualFiltering` prop on `Combobox.Root`: disables the built-in option filter so a consumer that already narrows the list itself (e.g. an async/server search driven by `Combobox.Search`'s `onValueChange`) is not double-filtered. The typed query is still exposed to `Combobox.Create` and the Search clear button.
