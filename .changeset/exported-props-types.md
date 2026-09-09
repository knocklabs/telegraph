---
"@telegraph/button": patch
"@telegraph/combobox": patch
"@telegraph/link": patch
"@telegraph/menu": patch
"@telegraph/modal": patch
"@telegraph/radio": patch
"@telegraph/tabs": patch
"@telegraph/tag": patch
"@telegraph/toggle": patch
"@telegraph/tooltip": patch
"@telegraph/truncate": patch
"@telegraph/typography": patch
---

Type sub-components with the upstream's exported props type instead of `TgphComponentProps<typeof X<T>>`.

`TgphComponentProps<typeof X<T>>` resolves through `React.ComponentProps` on a generic component, which defers the mapped type at an unresolved `T`. Every one of these sites now names the props type the upstream package already exports (`BoxProps`, `StackProps`, `IconProps`, `TextProps`, `ButtonRootProps`, `TagRootProps`, `MenuItemProps`, and so on).

The resolved types are unchanged — only the expression that names them — so this is emitted-declaration churn, not an API change. `*.test-d.tsx` now pins each of those exported types to the component's own `ComponentProps`, so the two cannot drift apart again.
