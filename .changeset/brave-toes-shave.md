---
"@telegraph/tabs": minor
---

`TabList` no longer renders a stray `spacing="2"` attribute on its DOM element. `spacing` is not a Stack or Box style prop and never has been — it only type-checked while the polymorphic catch-all disabled prop checking, and the style engine routed it through to the DOM unrecognized. It applied no styling, so rendered layout is unchanged; the invalid attribute and its React unknown-prop warning are gone.
