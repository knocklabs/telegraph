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

Consequences worth knowing about:

- **A `data-*` key alone in a nested prop bag is an error.** Two separate checks apply, and which one fires depends on the shape. A fresh object literal gets excess-property checking, so `textProps={{ "data-testid": "x" }}` fails. A variable does not, but it hits weak-type detection when it shares no property with an all-optional target, so a bag holding only `data-*` keys fails as well. Anything carrying one real prop passes either check:

  ```tsx
  <Text data-testid="x" />                      // fine, JSX exempts hyphenated attributes
  textProps={{ size: "2", "data-testid": "x" }} // fails, fresh literal
  textProps={{ size: "2", ...dataAttrs }}       // fine, spread properties are exempt
  textProps={bagWithARealProp}                  // fine, not fresh
  textProps={{ ...dataAttrs }}                  // fails, no property in common
  ```

  A `data-${string}` index signature on `PolymorphicProps` removes the limitation. It was measured against `control/dashboard` twice, before and after the passthrough deduplication: it fixes 0 errors there and adds 5 `TS2590` "union type is too complex to represent" at ordinary call sites such as `{...buttonProps}` and `kbdProps={{ ...kbdProps, name }}`. A compiler limit with no call-site workaround is a worse failure than an excess-property error with three, so it stays out.

- `tgphRef` is no longer `any`. A ref whose element type does not match the component's is now an error — e.g. a `RefObject<HTMLDivElement>` on `Combobox.Trigger`, which renders a `button`.
- `Input`'s `stackProps` and `Modal.Content`'s inherited `StackProps` are the non-generic form, which is `div`-shaped. Both wrappers do render a `div`, so element-specific props pushed through them are now correctly rejected.
- `Input.Slot` is validated too. It took its props from `TgphSlotProps`, which intersects `Record<string, unknown>` so the slot primitive can merge arbitrary props onto its child. `Omit` over an index signature keeps the index signature, so every key was swallowed and `<Input.Slot position="middle" />` compiled. It now declares its own props. `TgphSlot` itself is unchanged.

Also: `style` accepts CSS custom properties (`--*`) again, `Button.Root` declares `disabled` so it survives `as="a"`, and `Toggle` declares `disabled`/`required`/`name`.

`CSSPropertiesWithVars` is a union rather than an intersection. `React.CSSProperties` is an interface, so it gains no implicit index signature, and an intersection with the `--*` half rejected every value declared as plain `CSSProperties` — including the common `({ style }: { style?: CSSProperties }) => <Stack style={style} />` wrapper.
