---
"@telegraph/vite-config": patch
---

fix(vite-config): stop type tests emitting declarations into dist

`*.test-d.tsx` does not match the existing `*.test.tsx` exclude globs, so type
tests were emitted into `dist/types` and would ship to npm.

Duplicates the same fix in #922 — either side can be taken on merge.
