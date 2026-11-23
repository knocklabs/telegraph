---
"@telegraph/combobox": minor
---

feat(combobox): support externally virtualized options

`Combobox.Root` accepts an `options` collection for consumers that mount only a
window of `Combobox.Option` children (e.g. TanStack Virtual). Base UI then
derives each row's navigation index from that collection instead of the mounted
DOM order, so ArrowUp/ArrowDown advance exactly one option across a window
boundary without pinning the whole prefix of the list.

Passing `options` implies `manualFiltering`, keeps `onItemHighlighted` reporting
the correct string value with a collection-relative `details.index` to drive the
virtualizer, and resolves the trigger label for a selected option the window
never mounts. Comboboxes that do not pass `options` are unaffected.
