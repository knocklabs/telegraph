---
"@telegraph/truncate": minor
---

Add front, middle, and fade truncation to `TruncatedText`, plus supporting fixes:

- **`TruncatedText`** gains `mode="truncate" | "fruncate" | "middle"`, a `fade` `variant`, a custom `marker`, and (for `middle`) `split` / `priority`. `TruncatedText` remains the single public truncation component — the extra modes are folded in. End (`truncate`) and front (`fruncate`, via `direction: rtl`) use native `text-overflow: ellipsis` — glyph-boundary clip, no stylesheet. `mode="middle"` measures the rendered text and slices it to exactly the `head…tail` characters that fit — a crisp "…", **no gap**, and **never a cut glyph**, at every width (pure CSS can't do all three at once). Its measurement is scoped to `middle`, runs only on real resizes via a guarded `ResizeObserver` (so it can't reproduce the #185 loop), needs no stylesheet, and honors `maxWidth`. For `middle`, `split="center"` (the default) balances both ends — a prefix and a suffix with the "…" in the visual middle — while the anchored splits (`leaf-path`/`extension`) keep one end whole, chosen by `priority`. `variant="fade"` instead dissolves the edge via a CSS-only engine (a container size-query, ported from Pierre).
- **`TooltipIfTruncated`** now measures truncation lazily on hover/focus (controlled `open`) instead of in a render effect, and accepts an `isTruncated` predicate. This removes the "Maximum update depth exceeded" (React #185) loop.
- **`useTruncate`** is hardened with a value-guarded state update so redundant measurements are genuine no-ops even in re-render-heavy trees.

`TruncatedText`'s `fade` variant (and a custom `marker` on end/front truncation) requires importing `@telegraph/truncate/default.css` and modern browsers (CSS container queries, the `1lh` unit, and `color-mix`). The `truncate` / `fruncate` / `middle` modes, `TooltipIfTruncated`, and `useTruncate` have no such requirement.
