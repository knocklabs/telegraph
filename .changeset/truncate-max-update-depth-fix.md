---
"@telegraph/truncate": patch
---

fix(truncate): prevent "Maximum update depth exceeded" crash in re-render-heavy environments

`TooltipIfTruncated` keyed `useTruncate`'s measurement effect on the freshly-created `children` element, so the effect re-mounted and called `setState` on every render. In continuously re-rendering trees (e.g. a ReactFlow graph editor) React's same-value bailout could be defeated, cascading into a runaway synchronous update loop (React error #185). The effect now depends on the stable rendered text instead of the element identity, and `useTruncate` only writes state when the truncation value actually changes.
