---
"@telegraph/segmented-control": minor
"@telegraph/combobox": minor
"@telegraph/tag": patch
"@telegraph/select": minor
"@telegraph/icon": minor
"@telegraph/toggle": minor
---

`SegmentedControl.Option` accepts a component for `as`, so an option can navigate:

```tsx
<SegmentedControl.Option value="docs" as={NextLink} href="/docs">
  Docs
</SegmentedControl.Option>
```

`OptionProps` read bare `ButtonProps`, which is `ButtonProps<"button">` and carries `as?: "button"`. Intersecting that with the `as?: T` beside it pinned the element.

Only the public props type is generic. The internals stay at the default element, because carrying an unresolved element parameter through Base UI's `render` callback stacks mapped types over Button's icon union and takes package type-checking from seconds to minutes.

`nativeButton` follows the element that renders, as it now does for `Menu.Button`. It counts the root's `disabled` as well as the option's own, because `Root` passes `disabled` down through context and `Button` renders a native button whenever it is set. Reading only the option's own left a disabled option without its native `disabled` attribute, which Base UI replaced with `aria-disabled`.

Several components took their element parameter without a default, so an absent `as` left it at the constraint rather than the documented default. The element passthrough then dropped native attributes, and `<Combobox.Option type="button" />` or `<Combobox.Empty id="x" />` did not compile. Fixed on `Combobox.Option`, `Combobox.Empty`, `Combobox.Create`, `Tag.Button` and the Combobox trigger primitives.

Three more components could not take a component for `as` at all:

- `Select.Option` was not generic, and its props type read bare `ComboboxOptionProps`.
- `Spinner` declared `Partial<IconBaseProps<T>>`, and a mapped type in front of `as?: T` stops the element resolving. Only `icon` is optional now, so the rendered element's own required props are enforced again.
- `Toggle.Indicator` declared `"span"` but renders `Tag as={as || "label"}`, so it rejected props the rendered element accepts, such as `htmlFor`.
