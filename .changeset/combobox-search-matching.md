---
"@telegraph/combobox": patch
---

Fix client-side search matching in `Combobox`

- Match options by their rendered DOM text, so text produced inside a child component (a custom option row, for example) is searchable. Previously the filter only read text off the React element tree, where a child component's render output doesn't exist.
- Match queries that span sibling text nodes — searching `"Kyle McDonald"` now matches `<Text>Kyle</Text><Text>McDonald</Text>`.
- Match numeric children, which were previously skipped entirely.
- Trim the search query, so a pasted value with surrounding whitespace still matches.
- Stop treating a controlled `<Combobox.Search value={...} />` — or any controlled input inside `Combobox.Content`, including a search wrapped in a consumer component — as an option. Its `value` prop was collected as a phantom option that could shadow the real one and mislabel the trigger.
