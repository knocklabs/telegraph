---
"@telegraph/link": patch
---

fix(link): mark decorative Link icons as `aria-hidden`

The Link icon rendered without `alt` or `aria-hidden`, which logged a runtime
`@telegraph/icon: alt prop is required` error and left decorative icons exposed
to assistive tech. Link icons are now `aria-hidden` by default; pass
`aria-hidden={false}` (with `alt`) to opt out. Surfaced by the new TS7
type-check.
