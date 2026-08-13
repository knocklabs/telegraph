---
"@telegraph/modal": minor
"@telegraph/button": patch
"@telegraph/combobox": patch
"@telegraph/data-list": patch
"@telegraph/icon": patch
"@telegraph/layout": patch
"@telegraph/link": patch
"@telegraph/menu": patch
"@telegraph/popover": patch
"@telegraph/segmented-control": patch
"@telegraph/tag": patch
"@telegraph/toggle": patch
"@telegraph/tooltip": patch
"@telegraph/typography": patch
---

feat: fix polymorphic prop types dropping `className`, `children` and `style`

Adds a standalone TypeScript 7 type-check (`yarn type:check`, `typescript@7.0.2`
aliased as `typescript-7` so it can coexist with the TypeScript the build needs)
plus a CI job, and fixes the prop-type defect it surfaced.

`PolymorphicProps` declares `children`, `className` and `style` explicitly so
they survive when the element passthrough is dropped for an unresolved element
type. The standard-library `Omit` is `Pick<T, Exclude<keyof T, K>>`, and that
`keyof`/`Pick` round-trip discards those declarations when the type it wraps is
still generic. Every props type built with it therefore lost them: a component
generic over its element could not read its own `className`. `RemappedOmit`
removes keys in place and keeps them, so the affected props types now use it.

No runtime change, and no component body needed editing: the affected components
already read these props, the types just never admitted it because nothing
type-checked them. The props each component accepts are otherwise unchanged.

One exception, in `@telegraph/modal`: `Modal.Body`, `Modal.Header` and
`Modal.Footer` no longer accept `color`. They render a `Stack`, which drops
`color` on purpose because React accepts it on any element and it renders an
attribute that paints nothing. Pass a color through `<Text>` instead.
