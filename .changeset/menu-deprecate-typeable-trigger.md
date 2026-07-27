---
"@telegraph/menu": patch
---

Deprecate the typeable-trigger recipe — composing a typeable input inside `Menu.Trigger` — in favor of the `@telegraph/combobox` input-as-trigger arrangement (`Combobox.Input`). This is a documentation-only change: the focus-bounce that keeps focus in place when a consumer prevents `onOpenAutoFocus` is **retained unchanged** as permanent Radix-compat behavior.

A typeable menu trigger does not follow the WAI-ARIA menu-button pattern, and Base UI declined an `initialFocus` opt-out for menus, so new UI that needs a typeable trigger should use the combobox arrangement. The `Menu.Trigger` typeable composition (and its `TypeableTrigger` story) remain only as a reference for the retained focus-bounce.
