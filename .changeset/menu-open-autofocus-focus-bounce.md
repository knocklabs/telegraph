---
"@telegraph/menu": patch
---

Fix a focus race from the Base UI migration where an input composed inside `Menu.Trigger` could not be typed into: the menu popup stole focus on open, so keystrokes fed the menu typeahead instead of the input (breaking PropertySelectorField everywhere it appears, plus the block editor slash-command and variable suggestion menus).

`MenuContent`'s `onOpenAutoFocus` shim emulated Radix's prevented-autofocus contract by re-asserting the intended focus in a `setTimeout(0)`. Base UI's `MenuPopup` hardcodes its initial focus and queues it on the next animation frame, so the `setTimeout(0)` restore fired first and then lost the race — the popup won every time. The shim now bounces focus back synchronously from a one-shot `focusin` listener on the popup: when Base UI's queued initial focus lands, the listener re-focuses the intended target during that same `.focus()` call, with no dependence on timer ordering. The bounce disarms after the first restore, on the first `pointerdown`/`keydown` inside the popup, and on close, so ArrowDown navigation and item clicks still move focus into the menu.
