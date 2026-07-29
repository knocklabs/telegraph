---
"@telegraph/popover": patch
"@telegraph/modal": patch
"@telegraph/tabs": patch
"@telegraph/menu": patch
"@telegraph/segmented-control": patch
"@telegraph/select": patch
"@telegraph/tooltip": patch
"@telegraph/input": patch
"@telegraph/style-engine": patch
"@telegraph/helpers": patch
---

Update the READMEs for the prop-validation change.

The `Popover.Content` and `Modal.Content` custom-animation examples passed `as={motion.div}`. Both components always render the animated element now, so the examples animate a child instead. Copying either one used to give a type error.

`Modal.Body` no longer documents `flex`, and the Tabs root no longer documents `disabled`. Neither prop existed. The catch-all index signature hid that.

`Menu.Button` documents `as` and `nativeButton`. `SegmentedControl.Option` and `Select.Option` document `as`. `Select.Option` documents `label`.

`@telegraph/helpers` gains a "Type checking" section covering the two cases that surprise people: a `data-*` key alone in a nested prop bag, and a `tgphRef` whose element type does not match. The README is the only prose that reaches an installed package, because no package publishes its changelog.
