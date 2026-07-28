---
"@telegraph/layout": minor
"@telegraph/button": minor
---

`StackProps` and `Button`'s `RootProps` no longer include the element passthrough more than once. `BoxProps<T>` already carries it, so `StackProps<T>` intersecting `PolymorphicProps<T>` with `Omit<BoxProps<T>, "as">` included it twice, and `Button.RootProps<T>` added a third copy. `as` and the button-shaped `tgphRef` were the only members those extra copies contributed, and both are now declared directly.

The public prop surface is unchanged. The types are smaller: measured with `tsc --extendedDiagnostics`, `@telegraph/layout` drops 25% of its type instantiations and `@telegraph/button` 13%. Downstream, `@telegraph/combobox` drops 14% of its types and `@telegraph/modal` 20%.
