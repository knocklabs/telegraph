---
"@telegraph/helpers": patch
"@telegraph/style-engine": patch
---

Close polymorphic prop inheritance so invalid props are type errors again. Extracting props from a generic component (`TgphComponentProps<typeof Stack>`) instantiated the element type parameter at its constraint, making `React.ComponentProps<React.ElementType>` resolve to `any` and leaving a `{ [x: string]: any }` index signature on every inheriting component. That disabled excess-property checking *and* widened declared props to `any`, so `<Button fontSize={16}>` and `<Button variant="nonsense">` both compiled. `PolymorphicProps` now drops the element passthrough when the element type is unresolved, and declares `as`/`children`/`className`/`style` explicitly. **Breaking for type consumers** that were passing props which never belonged to a component.
