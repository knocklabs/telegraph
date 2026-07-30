---
"@telegraph/vite-config": minor
---

Exclude `*.test-d.ts`/`*.test-d.tsx` type-test files from declaration emit. They do not match the existing `*.test.tsx` exclude globs, so without this they emit `.d.ts` files into `dist/types` and ship to npm.
