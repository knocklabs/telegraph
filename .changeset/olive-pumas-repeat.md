---
"@telegraph/helpers": patch
"@telegraph/style-engine": patch
"@telegraph/layout": patch
"@telegraph/typography": patch
"@telegraph/icon": patch
"@telegraph/button": patch
"@telegraph/input": patch
"@telegraph/textarea": patch
"@telegraph/select": patch
"@telegraph/combobox": patch
"@telegraph/menu": patch
"@telegraph/toggle": patch
"@telegraph/modal": patch
"@telegraph/popover": patch
"@telegraph/tooltip": patch
"@telegraph/truncate": patch
"@telegraph/tag": patch
"@telegraph/link": patch
"@telegraph/kbd": patch
"@telegraph/tabs": patch
"@telegraph/data-list": patch
"@telegraph/radio": patch
"@telegraph/segmented-control": patch
"@telegraph/filter": patch
---

Restore prop validation across all components. Extracting props from a generic component (`TgphComponentProps<typeof Stack>`) instantiated the element type parameter at its constraint, making `React.ComponentProps<React.ElementType>` resolve to `any` and leaving a `{ [x: string]: any }` index signature on every inheriting component. That disabled excess-property checking *and* widened declared props to `any`, so `<Button fontSize={16}>` and `<Button variant="nonsense">` both compiled.

`PolymorphicProps` now drops the element passthrough when the element type is unresolved, and every inherited prop type threads the element parameter through (`StackProps<T>` rather than the bare form). **Breaking for type consumers** that were passing props which never belonged to a component — those are now errors. Props that genuinely exist are unaffected.

Also: `style` accepts CSS custom properties (`--*`) again, `Button.Root` declares `disabled` so it survives `as="a"`, and `Toggle` declares `disabled`/`required`/`name`.
