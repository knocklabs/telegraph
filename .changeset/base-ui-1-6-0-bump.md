---
"@telegraph/helpers": patch
"@telegraph/menu": patch
"@telegraph/modal": patch
"@telegraph/popover": patch
"@telegraph/radio": patch
"@telegraph/segmented-control": patch
"@telegraph/tabs": patch
"@telegraph/tooltip": patch
---

chore(deps): bump @base-ui/react from ^1.5.0 to ^1.6.0

On 1.6.0 an open menu's trigger typeahead consumes printable keys, so a typeable input composed inside `Menu.Trigger` must `stopPropagation` on printable keydowns to keep receiving them; the Menu typeable-trigger browser test is updated accordingly. No runtime change to any component.
