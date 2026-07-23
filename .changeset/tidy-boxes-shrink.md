---
"@telegraph/layout": patch
"@telegraph/style-engine": patch
---

Remove raw size value passthrough from Box sizing props. `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight` and their shorthands (`w`, `h`, `minW`, `minH`, `maxW`, `maxH`) accept `@telegraph/tokens` spacing values only again — raw CSS values such as `maxH="400px"` or `w="100%"` are no longer accepted or passed through. This reverses the compatibility behavior added in #837; pass a spacing token, or use `style`/`className` for genuine raw CSS.
