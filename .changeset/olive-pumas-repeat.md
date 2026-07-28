---
"@telegraph/helpers": minor
"@telegraph/style-engine": minor
"@telegraph/layout": minor
"@telegraph/typography": minor
"@telegraph/icon": minor
"@telegraph/button": minor
"@telegraph/input": minor
"@telegraph/textarea": minor
"@telegraph/select": minor
"@telegraph/combobox": minor
"@telegraph/menu": minor
"@telegraph/toggle": minor
"@telegraph/modal": minor
"@telegraph/popover": minor
"@telegraph/tooltip": minor
"@telegraph/truncate": minor
"@telegraph/tag": minor
"@telegraph/link": minor
"@telegraph/kbd": minor
"@telegraph/tabs": minor
"@telegraph/data-list": minor
"@telegraph/radio": minor
"@telegraph/segmented-control": minor
"@telegraph/filter": minor
---

Restore prop validation across all components. Extracting props from a generic component (`TgphComponentProps<typeof Stack>`) instantiated the element type parameter at its constraint, making `React.ComponentProps<React.ElementType>` resolve to `any` and leaving a `{ [x: string]: any }` index signature on every inheriting component. That disabled excess-property checking _and_ widened declared props to `any`, so `<Button fontSize={16}>` and `<Button variant="nonsense">` both compiled.

`PolymorphicProps` now drops the element passthrough when the element type is unresolved, and every inherited prop type threads the element parameter through (`StackProps<T>` rather than the bare form). **Breaking for type consumers** that were passing props which never belonged to a component — those are now errors. Props that genuinely exist are unaffected.

Three consequences worth knowing about:

- **`as={motion.div}` on a polymorphic component can exceed TypeScript's complexity limit.** Now that prop types resolve for real, `Omit<ComponentProps<typeof motion.div>, "as">` is a very large type, and enough props on top of it produces `TS2590: Expression produces a union type that is too complex to represent`. Wrap the component in the motion element instead of passing it as `as` — that compiles, and keeps the animation concern out of the component's own element. Deduplicating the passthrough does not help; the underlying `framer-motion` prop surface is what is large.

- **`data-*` in a nested prop bag is now an error.** TSX exempts hyphenated _attributes_ from excess-property checks, so `<Text data-testid="x" />` is unaffected — but an object literal gets no such exemption, so `textProps={{ "data-testid": "x" }}` no longer compiles. Spread it instead (`textProps={{ ...{ "data-testid": "x" } }}`), or set it on the component directly. A `data-${string}` index signature on `PolymorphicProps` does fix this, but it was measured to cost several `TS2590` "union type is too complex to represent" errors at ordinary call sites like `leadingIcon={{ icon, "aria-hidden": true, ...rest }}` — a worse failure than the one it prevents.

- `tgphRef` is no longer `any`. A ref whose element type does not match the component's is now an error — e.g. a `RefObject<HTMLDivElement>` on `Combobox.Trigger`, which renders a `button`.
- `Input`'s `stackProps` and `Modal.Content`'s inherited `StackProps` are the non-generic form, which is `div`-shaped. Both wrappers do render a `div`, so element-specific props pushed through them are now correctly rejected.

Also: `style` accepts CSS custom properties (`--*`) again, `Button.Root` declares `disabled` so it survives `as="a"`, and `Toggle` declares `disabled`/`required`/`name`.
