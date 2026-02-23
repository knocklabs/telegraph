---
"@telegraph/combobox": minor
---

Add `Autocomplete` component — a free-form text input that renders a filtered suggestion list when options are available. When no options match the typed input (or no options are provided), the dropdown is hidden and the component behaves like a plain input.

Usage:
```tsx
<Autocomplete.Root value={value} onValueChange={setValue}>
  <Autocomplete.Input placeholder="Type to search..." />
  <Autocomplete.Content>
    <Autocomplete.Option value="Email">Email</Autocomplete.Option>
    <Autocomplete.Option value="SMS">SMS</Autocomplete.Option>
  </Autocomplete.Content>
</Autocomplete.Root>
```
