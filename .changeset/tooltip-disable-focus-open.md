---
"@telegraph/tooltip": minor
---

feat(tooltip): add `disableFocusOpen` prop and fix `labelProps` spread bug

- Added `disableFocusOpen` prop to suppress focus-triggered instant opens (useful when parent components like Select/Combobox move DOM focus on hover, bypassing `delayDuration`).
- Fixed `labelProps` spread: replaced `{...(labelProps ? { labelProps } : {})}` with `{...(labelProps ?? {})}` so props correctly merge onto the inner Stack.
