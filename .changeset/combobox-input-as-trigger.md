---
"@telegraph/combobox": minor
---

Add the input-as-trigger arrangement to `@telegraph/combobox`. This is additive — the existing button-`Trigger` API is unchanged.

A new `Combobox.Input` part renders a `@telegraph/input`-styled anchor in place of `Combobox.Trigger`. Base UI makes that input own `role="combobox"` and virtual focus, and anchors the popup beneath it; typing filters the options in place (no separate `Combobox.Search`).

`Combobox.Root` gains a free-text mode via `selectionMode="none"`, which renders Base UI's Autocomplete root: the input text is the state and there is no selected value, so any typed text is valid and pressing a suggestion fills the input. New additive `Root` props support both arrangements: `selectionMode`, `inputValue` / `defaultInputValue` / `onInputValueChange`, `mode` (Base UI's `Autocomplete` filtering mode), `autoHighlight`, `openOnInputClick`, `loopFocus`, `onItemHighlighted`, and `actionsRef`. `onOpenChange` now also receives an optional Base UI change-details argument (existing single-argument handlers are unaffected).
