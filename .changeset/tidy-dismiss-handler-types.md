---
"@telegraph/popover": patch
"@telegraph/menu": patch
"@telegraph/modal": minor
---

Tighten base-ui dismiss-handler types so stale Radix `event.detail` usage fails to compile.

`Popover.Content`, `Menu.Content`, and `Modal.Content` hand their dismiss callbacks (`onInteractOutside`, `onPointerDownOutside`, `onFocusOutside`, `onEscapeKeyDown`) the native DOM event, but the compat shim kept Radix's prop names. The callback's `event` param was resolving to `any` at the JSX call site instead of its concrete DOM `Event`, so in a consumer whose tsconfig doesn't flag implicit `any` a stale Radix-shaped handler reading `event.detail.originalEvent` compiled and then crashed at runtime (`Cannot read properties of undefined`). Each param now resolves to its concrete `Event` type, so `.detail`/`.originalEvent` access is a compile error.

**Breaking (`@telegraph/modal`):** `Modal.Content` is now a plain function component instead of `forwardRef` (whose `PropsWithoutRef` wrapper caused the same widening), matching `Popover`/`Menu`. A `ref` on `Modal.Content` no longer forwards — pass `tgphRef` instead. (On React 19 a stray `ref` still reaches the node as a prop; on React 18 it does not.)
