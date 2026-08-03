---
"@telegraph/layout": patch
---

`Box` and `Stack` reject `color`.

`color` is a deprecated HTML attribute that React accepts on every element, so it reached these components through the element passthrough rather than through their style props. It type-checked, rendered a `color` attribute, and painted nothing.

The trap was the collision. `Text`, `Button` and `Icon` all have a real `color` prop, so the same prop name worked on those and silently did nothing on the layout primitives.

```tsx
<Box color="red" />   // used to compile and paint nothing. Now an error.
<Text color="red" />  // unchanged. Still works.
```

Runtime behaviour does not change, because the attribute never did anything. To set a background, use `bg`. To set text colour, use `Text`.
