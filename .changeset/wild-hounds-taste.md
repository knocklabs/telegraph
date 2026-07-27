---
"@telegraph/toggle": patch
---

fix(toggle): keep the track color, dimmed, when a Toggle is disabled

A disabled Toggle inherited Button's blanket disabled background, so on and off
rendered the identical `--tgph-gray-3` and thumb position was the only cue. A
disabled track now keeps its own color — the `color` token when on, `--tgph-gray-7`
when off — at 50% opacity, so a locked toggle still reads as on or off. This
changes the appearance of the disabled off state as well, from a flat
`--tgph-gray-3` to the dimmed unchecked gray.
