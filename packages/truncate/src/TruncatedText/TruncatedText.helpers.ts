import { useEffect, useLayoutEffect } from "react";

import type { Split, SplitMode, TruncatePriority } from "./TruncatedText.types";

// ── Split strategies ────────────────────────────────────────────────────────
// Pure string logic (no DOM): given the full string, return a `[head, tail]`
// pair. The head is clipped from its end and the tail from its start, so the
// elision lands in the middle ("apps/…/BaseStepCard.tsx"). Ported from Pierre's
// `truncate`.

const isWhitespace = (char: string | undefined) =>
  char !== undefined && /\s/.test(char);

// Nudge a split index away from a whitespace seam so `white-space: nowrap`
// doesn't collapse the boundary space ("Hello world" → "Helloworld").
const avoidWhitespaceBoundary = (contents: string, centerIndex: number) => {
  const isOnBoundary = (index: number) =>
    isWhitespace(contents[index - 1]) || isWhitespace(contents[index]);
  if (!isOnBoundary(centerIndex)) return centerIndex;
  for (let offset = 1; offset < contents.length; offset++) {
    const before = centerIndex - offset;
    if (before > 0 && !isOnBoundary(before)) return before;
    const after = centerIndex + offset;
    if (after < contents.length && !isOnBoundary(after)) return after;
  }
  return centerIndex;
};

const centerSplitIndex = (s: string) =>
  avoidWhitespaceBoundary(s, Math.ceil(s.length / 2));

export const splitCenter = (s: string): [string, string] => {
  if (s.length < 2) return [s, ""];
  const i = centerSplitIndex(s);
  return [s.slice(0, i), s.slice(i)];
};

const splitAtLast = (
  s: string,
  char: string,
  maxTailLength: number,
): [string, string] => {
  if (s.length < 4) return [s, ""];
  const idx = s.lastIndexOf(char) + 1;
  const tailLength = s.length - idx;
  const i = idx >= 1 && tailLength <= maxTailLength ? idx : centerSplitIndex(s);
  return [s.slice(0, i), s.slice(i)];
};

export const splitExtension = (s: string): [string, string] =>
  splitAtLast(s, ".", 10);
export const splitLeafPath = (s: string): [string, string] =>
  splitAtLast(s, "/", 25);

export const splitByIndex = (s: string, index: number): [string, string] =>
  Number.isFinite(index) ? [s.slice(0, index), s.slice(index)] : splitCenter(s);

/** Keep the last `offset` characters in the tail (e.g. a file extension). */
export const splitLast = (s: string, offset: number): [string, string] =>
  offset > 0 && offset < s.length
    ? splitByIndex(s, s.length - offset)
    : splitCenter(s);

/** Keep the first `offset` characters in the head. */
export const splitFirst = (s: string, offset: number): [string, string] =>
  offset > 0 && offset < s.length ? splitByIndex(s, offset) : splitCenter(s);

const SPLITTERS: Record<SplitMode, (s: string) => [string, string]> = {
  center: splitCenter,
  extension: splitExtension,
  "leaf-path": splitLeafPath,
};

export const resolveSplit = (
  split: Split,
  contents: string,
): [string, string] => {
  if (typeof split === "function") return split(contents);
  if (typeof split === "number") return splitByIndex(contents, split);
  if (Array.isArray(split)) {
    const [type, offset] = split;
    return type === "last"
      ? splitLast(contents, offset)
      : splitFirst(contents, offset);
  }
  return SPLITTERS[split](contents);
};

// ── Measure-and-slice (middle truncation) ───────────────────────────────────

// `useLayoutEffect` on the client (measures before paint, so no flash), plain
// `useEffect` on the server (avoids React's SSR warning).
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The longest `head…tail` slice of `text` that fits `available` px, measured with
 * `measure`. Only whole characters are dropped, so it never cuts a glyph, and the
 * result fits exactly, so there is no trailing-slack gap at the seam.
 *
 * `split="center"` is balanced — it keeps a prefix of the head AND a suffix of the
 * tail so the marker sits in the visual middle and both ends stay visible at any
 * width. The anchored strategies (`leaf-path`, `extension`, offsets) instead keep
 * one whole side (chosen by `priority`) and truncate the other.
 */
export const sliceToFit = (
  text: string,
  split: Split,
  priority: TruncatePriority,
  marker: string,
  available: number,
  measure: (s: string) => number,
): string => {
  // Sub-pixel safety: `offsetWidth`/`clientWidth` are rounded, so a string that
  // measures at exactly `available` can still render a fraction wider and get a
  // "…" appended by the fallback `text-overflow`. Apply the 2px margin
  // everywhere — including this early "fits" check — otherwise a string in that
  // band is returned whole and left unflagged, yet the CSS ellipsis still clips
  // it, so the trigger looks truncated but shows no tooltip.
  const fits = (s: string) => measure(s) <= available - 2;
  if (fits(text)) return text; // fits with the margin — no truncation
  const [head, tail] = resolveSplit(split, text);
  // Largest n in [0, max] for which `pick(n)` fits (fit is monotonic in n).
  const largest = (max: number, pick: (n: number) => string) => {
    let lo = 0;
    let hi = max;
    let best = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (fits(pick(mid))) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return best;
  };

  // `center` is balanced: keep a head prefix AND a tail suffix so the marker
  // lands in the visual middle and both ends stay visible. `priority` gives the
  // odd character to one side. (The anchored strategies below keep one side
  // whole — right for a filename or extension, wrong for a centered elision.)
  if (split === "center") {
    const build = (k: number) => {
      let h = Math.min(
        priority === "start" ? Math.ceil(k / 2) : Math.floor(k / 2),
        head.length,
      );
      const t = Math.min(k - h, tail.length);
      h = Math.min(k - t, head.length);
      return head.slice(0, h) + marker + tail.slice(tail.length - t);
    };
    return build(largest(head.length + tail.length, build));
  }

  if (priority === "start") {
    // Keep the head whole, trim the tail from its start; if the head alone won't
    // fit, drop the tail and trim the head from its end.
    if (fits(head + marker)) {
      const n = largest(
        tail.length,
        (n) => head + marker + tail.slice(tail.length - n),
      );
      return head + marker + tail.slice(tail.length - n);
    }
    const n = largest(head.length, (n) => head.slice(0, n) + marker);
    return head.slice(0, n) + marker;
  }

  // priority "end" (default): keep the tail whole, trim the head from its end; if
  // the tail alone won't fit, drop the head and trim the tail from its start.
  if (fits(marker + tail)) {
    const n = largest(head.length, (n) => head.slice(0, n) + marker + tail);
    return head.slice(0, n) + marker + tail;
  }
  const n = largest(tail.length, (n) => marker + tail.slice(tail.length - n));
  return marker + tail.slice(tail.length - n);
};

// ── Truncation predicates (for `TooltipIfTruncated`'s `isTruncated`) ─────────

// The measure-and-slice output always fits, so the trigger never overflows; gate
// the tooltip on whether the string was actually sliced instead of on `scrollWidth`.
export const middleSliceIsTruncated = (el: HTMLElement) =>
  el.matches("[data-tgph-middle-truncated]") ||
  el.querySelector("[data-tgph-middle-truncated]") != null;

// A `variant="fade"` middle group never overflows its own box (its segments do),
// so the tooltip gates on whether either engine segment is clipped, not the trigger.
export const middleIsTruncated = (el: HTMLElement) =>
  Array.from(el.querySelectorAll("[data-tgph-truncate]")).some(
    (seg) => seg.scrollWidth > seg.clientWidth,
  );
