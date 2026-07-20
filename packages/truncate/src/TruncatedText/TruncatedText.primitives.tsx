import { useRef, useState } from "react";

import { sliceToFit, useIsomorphicLayoutEffect } from "./TruncatedText.helpers";
import type { Split, TruncatePriority } from "./TruncatedText.types";

type MiddleTruncateProps = {
  text: string;
  split?: Split;
  priority?: TruncatePriority;
  /** The elision marker. Concatenated into the string, so it must be a string. */
  marker?: string;
};

/**
 * Middle truncation by measurement: render exactly the `head…tail` characters
 * that fit — crisp ellipsis, no gap, and never a cut glyph, at every width.
 *
 * The measurement is deliberately minimal and only runs where it's needed: this
 * component is mounted solely for `TruncatedText mode="middle"`, and it recomputes
 * only on real size changes (a `ResizeObserver`), guarding `setState` so redundant
 * ticks are no-ops. There is no measure-in-render or unconditional `setState`, so
 * it cannot reproduce the "Maximum update depth exceeded" loop (React #185).
 */
const MiddleTruncate = ({
  text,
  split = "center",
  priority = "end",
  marker = "…",
}: MiddleTruncateProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // A hidden probe measures candidate strings at their real rendered width — no
    // canvas/font guessing. It is 0×0 + `overflow:hidden` (so it never adds page
    // scroll) and measured via `scrollWidth` (the natural, unclipped text width).
    // It lives in `el`'s parent, not `el`: `el`'s text child is React-managed — a
    // re-render wipes an appended probe (and would leave `measure` reading 0) —
    // and `el`'s `textContent` is read as the rendered slice, which a probe child
    // would pollute. The parent shares the inherited font, so measurements match.
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:absolute;top:0;left:0;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;white-space:nowrap;";
    const host = el.parentElement ?? el;
    host.appendChild(probe);
    const measure = (s: string) => {
      if (!probe.isConnected) host.appendChild(probe); // survive a host re-render
      probe.textContent = s;
      return probe.scrollWidth;
    };

    const compute = () => {
      const available = el.clientWidth;
      // Until the box has a width and the font has loaded (an unloaded webfont
      // measures 0-width), the text can't be sliced. Fall back to the full text
      // — correct content, with the CSS ellipsis as a crude cue — rather than
      // leaving a stale slice of a previous `text`; a later resize or
      // `fonts.ready` re-slices. (Never a bare `return`, so `display` always
      // tracks the current `text`.)
      const next =
        !available || measure(text) === 0
          ? text
          : sliceToFit(text, split, priority, marker, available, measure);
      setDisplay((prev) => (prev === next ? prev : next));
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    // A webfont's metrics change the fit, but loading one doesn't resize the box
    // (so the observer won't fire) — re-measure once fonts settle.
    let active = true;
    void document.fonts?.ready?.then(() => active && compute());

    return () => {
      active = false;
      observer.disconnect();
      probe.remove();
    };
  }, [text, split, priority, marker]);

  return (
    <span
      ref={ref}
      // Flags "this was sliced" → gates the tooltip. Full text shows unflagged
      // only when we couldn't measure (no width / unloaded font) — i.e. while the
      // element isn't visibly rendered — so there is never a visibly clipped
      // label without a tooltip; the next measure slices and flags it.
      data-tgph-middle-truncated={display === text ? undefined : ""}
      style={{
        display: "block",
        minWidth: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        // Fallback for the pre-measurement paint (SSR / first frame): end-clip
        // crisply rather than hard-cut. Once sliced, the text fits and this is a
        // no-op.
        textOverflow: "ellipsis",
      }}
    >
      {display}
    </span>
  );
};

export { MiddleTruncate };
