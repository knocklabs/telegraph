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
"@telegraph/textarea": patch
---

Update the READMEs for the prop-validation change.

The `Modal.Content` custom-animation example passed `as={motion.div}`. `Modal.Content` always renders the animated element now, so the example animates a child instead. Copying it used to give a type error.

`Popover.Content` drops its custom-animation example. The props table and the `skipAnimation` example already cover turning the built-in animation off.

`Modal.Body` no longer documents `flex`, and the Tabs root no longer documents `disabled`. Neither prop existed. The catch-all index signature hid that.

`Menu.Button` documents `as` and `nativeButton`. `SegmentedControl.Option` and `Select.Option` document `as`. `Select.Option` documents `label`.

The `@telegraph/textarea` README documented seven props that do not exist: `autoResize`, `minRows`, `maxRows`, `showCharacterCount`, `state`, `errorMessage` and `helperText`. Roughly half its examples were built around them. It also gave `size` two values outside the scale, and the wrong default for `size` and `resize`. The README now documents the real component, and every example in it compiles.

`@telegraph/helpers` gains a "Type checking" section covering the two cases that surprise people: a `data-*` key alone in a nested prop bag, and a `tgphRef` whose element type does not match. The README is the only prose that reaches an installed package, because no package publishes its changelog.
