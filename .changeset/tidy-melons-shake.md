---
"@telegraph/segmented-control": minor
"@telegraph/combobox": patch
"@telegraph/tag": patch
---

`SegmentedControl.Option` accepts a component for `as`, so an option can navigate:

```tsx
<SegmentedControl.Option value="docs" as={NextLink} href="/docs">
  Docs
</SegmentedControl.Option>
```

`OptionProps` read bare `ButtonProps`, which is `ButtonProps<"button">` and carries `as?: "button"`. Intersecting that with the `as?: T` beside it pinned the element.

Only the public props type is generic. The internals stay at the default element, because carrying an unresolved element parameter through Base UI's `render` callback stacks mapped types over Button's icon union and takes package type-checking from seconds to minutes.

`nativeButton` follows the element that renders, as it now does for `Menu.Button`.

Several components took their element parameter without a default, so an absent `as` left it at the constraint rather than the documented default. The element passthrough then dropped native attributes, and `<Combobox.Option type="button" />` or `<Combobox.Empty id="x" />` did not compile. Fixed on `Combobox.Option`, `Combobox.Empty`, `Tag.Button` and the Combobox trigger primitives.
