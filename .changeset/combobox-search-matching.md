---
"@telegraph/combobox": minor
---

Fix client-side search matching in `Combobox`

- Add a `searchValue` prop to `Combobox.Option`, for options whose visible text is rendered by a child component and so can't be read off the element tree. When set, it replaces the text derived from `label`/`children`/`value`.
- Match queries that span sibling text nodes — searching `"Kyle McDonald"` now matches `<Text>Kyle</Text><Text>McDonald</Text>`.
- Match numeric children, which were previously skipped entirely.
- Trim the search query, so a pasted value with surrounding whitespace still matches.
- Stop treating a controlled `<Combobox.Search value={...} />` as an option. Its `value` prop was collected as a phantom option that could shadow the real one and mislabel the trigger.
