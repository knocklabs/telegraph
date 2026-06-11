---
"@telegraph/appearance": patch
"@telegraph/helpers": minor
"@telegraph/input": patch
---

Replace Radix Slot usage in Appearance and Input with Telegraph helpers, and add shared `TgphSlot`, `VisuallyHidden`, and `useControllableState` exports for migrated components. Explicit appearance overrides now remain pinned instead of being overwritten by document-level appearance observer updates.
