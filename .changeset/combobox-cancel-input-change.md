---
"@telegraph/combobox": patch
---

Honor canceled `onInputValueChange` events before updating the internal search query, and preserve a multi-select search while the popup stays open. Consumers can intercept pasted text without retaining it as a query and select several filtered options in succession.
