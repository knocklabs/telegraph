---
"@telegraph/menu": minor
"@telegraph/combobox": patch
"@telegraph/select": patch
"@telegraph/filter": patch
"@telegraph/tabs": patch
---

Add hover-to-open submenus to Menu via `Menu.Sub`, `Menu.SubTrigger`, and `Menu.SubContent`. These wrap Radix's submenu primitives, so a submenu now opens on hover (and `→` / `Enter`), coordinates open/close with its parent, supports keyboard navigation and "safe triangle" pointer tracking, and positions itself to the side automatically. `Menu.SubTrigger` defaults to a trailing chevron. This replaces the previous nested-`Menu.Root` workaround, which only opened on click.

Combobox, Select, Filter, and Tabs receive a patch release so they ship against the new Menu.
