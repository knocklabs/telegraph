---
"@telegraph/layout": patch
---

Fix `Box` and `Stack` using different CSS custom properties for `flex-direction`, which silently dropped the `direction`/`flexDirection` prop when composing Box-based components with `as={Stack}`.

`Box` mapped `direction`/`flexDirection` to `--flex-direction` while the `.tgph-stack` CSS reads `--direction`. On an element with both classes (e.g. `<Box as={Stack} direction="column">` or `<Tabs.Panel as={Stack} direction="column">`), the `.tgph-stack` rule won the cascade and resolved `flex-direction` from the never-set `--direction`, so the layout fell back to `row`. `Box` now writes `--direction` — the same custom property `Stack` uses — and the `.tgph-box` rule defaults and reads it, so both class rules resolve `flex-direction` identically and the interactive pseudo-state fallbacks regenerate as `--hover--direction` etc. The old `--flex-direction` custom property was already dead on any element with the stack class and is no longer emitted.
