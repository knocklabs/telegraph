import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { TruncatedText } from "./TruncatedText";
import { sliceToFit } from "./TruncatedText.helpers";

// `MiddleTruncate` uses a ResizeObserver, which jsdom lacks. Real measurement is
// covered in the browser suite; here it's a no-op so middle renders.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeAll(() => vi.stubGlobal("ResizeObserver", MockResizeObserver));
afterAll(() => vi.unstubAllGlobals());

const engineRoot = (c: HTMLElement) => c.querySelector("[data-tgph-truncate]");
const engineGroup = (c: HTMLElement) =>
  c.querySelector('[data-tgph-truncate-group="middle"]');
const rtlEl = (c: HTMLElement) =>
  Array.from(c.querySelectorAll<HTMLElement>("*")).find(
    (e) => e.style?.direction === "rtl",
  );

// Routing only — which path each mode takes. End and front are native
// `text-overflow: ellipsis`. `middle` is JS measure-and-slice (no engine markup).
// `variant="fade"` (and a custom `marker` on end/front) opts into the CSS engine.
// Real measurement/overflow behavior needs a browser.
describe("TruncatedText modes", () => {
  it("uses native ellipsis (no engine) for the default mode", () => {
    const { container } = render(
      <TruncatedText as="span">A long label</TruncatedText>,
    );
    expect(engineRoot(container)).toBeNull();
    expect(container.textContent).toContain("A long label");
  });

  it("uses native RTL ellipsis (no engine) for fruncate", () => {
    const { container } = render(
      <TruncatedText as="span" mode="fruncate">
        a/b/c.tsx
      </TruncatedText>,
    );
    expect(engineRoot(container)).toBeNull();
    // `direction: rtl` is what flips the native ellipsis to the start.
    expect(rtlEl(container)).toBeTruthy();
    expect(rtlEl(container)).toHaveTextContent("a/b/c.tsx");
  });

  it("measures and slices (no engine) for middle string content by default", () => {
    const { container } = render(
      <TruncatedText as="span" mode="middle">
        a/b/c.tsx
      </TruncatedText>,
    );
    // The default middle path is JS measure-and-slice — no CSS engine markup.
    // (jsdom reports 0-width, so nothing is sliced here; slicing is unit-tested
    // via sliceToFit and exercised for real in the browser suite.)
    expect(engineRoot(container)).toBeNull();
    expect(engineGroup(container)).toBeNull();
    expect(container.textContent).toContain("a/b/c.tsx");
  });

  it("follows the string when middle content changes (no stale slice)", () => {
    const { container, rerender } = render(
      <TruncatedText as="span" mode="middle">
        apps/old/OldCard.tsx
      </TruncatedText>,
    );
    expect(container.textContent).toContain("apps/old/OldCard.tsx");
    // Same instance, new text, while unmeasurable (jsdom reports 0 width, so
    // `compute` can't slice): the shown text must follow `children`, not stay
    // on the previous value.
    rerender(
      <TruncatedText as="span" mode="middle">
        lib/new/NewThing.tsx
      </TruncatedText>,
    );
    expect(container.textContent).toContain("lib/new/NewThing.tsx");
    expect(container.textContent).not.toContain("apps/old/OldCard.tsx");
  });

  it("uses the fade engine for middle when variant='fade'", () => {
    const { container } = render(
      <TruncatedText as="span" mode="middle" variant="fade">
        a/b/c.tsx
      </TruncatedText>,
    );
    expect(engineGroup(container)).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-tgph-truncate-variant="fade"]'),
    ).toHaveLength(2);
  });

  it("upgrades to the engine when a fade is requested", () => {
    const { container } = render(
      <TruncatedText as="span" variant="fade">
        A long label
      </TruncatedText>,
    );
    expect(
      container.querySelector('[data-tgph-truncate="truncate"]'),
    ).toBeInTheDocument();
  });

  it("upgrades to the engine when a custom marker is given", () => {
    const { container } = render(
      <TruncatedText as="span" marker="→">
        A long label
      </TruncatedText>,
    );
    expect(
      container.querySelector('[data-tgph-truncate="truncate"]'),
    ).toBeInTheDocument();
  });

  it("treats an empty marker as no marker (stays native, no engine)", () => {
    const { container } = render(
      <TruncatedText as="span" marker="">
        A long label
      </TruncatedText>,
    );
    expect(engineRoot(container)).toBeNull();
    expect(container.textContent).toContain("A long label");
  });

  it("routes a ReactNode marker in middle mode through the engine", () => {
    const { container } = render(
      <TruncatedText as="span" mode="middle" marker={<b>x</b>}>
        apps/web/BaseStepCard.tsx
      </TruncatedText>,
    );
    // Measure-and-slice can only splice a string; a node marker must use the engine.
    expect(engineGroup(container)).toBeInTheDocument();
  });

  it("routes fruncate + fade through the engine", () => {
    const { container } = render(
      <TruncatedText as="span" mode="fruncate" variant="fade">
        a/b/c.tsx
      </TruncatedText>,
    );
    expect(
      container.querySelector('[data-tgph-truncate="fruncate"]'),
    ).toBeInTheDocument();
  });

  it("falls back to native end ellipsis for middle mode with non-string children", () => {
    const { container } = render(
      <TruncatedText as="span" mode="middle">
        <span>node</span>
      </TruncatedText>,
    );
    expect(engineRoot(container)).toBeNull();
    expect(engineGroup(container)).toBeNull();
  });
});

// The middle-truncation algorithm: find the longest `head…tail` that fits, only
// dropping whole characters (never cuts a glyph) and fitting exactly (no gap).
// Measured here with 1 unit per character (so `available` is a character budget);
// real pixel measurement is exercised in the browser suite. Note the 2px
// sub-pixel safety margin baked into sliceToFit — budgets below account for it.
describe("sliceToFit", () => {
  const measure = (s: string) => s.length;

  it("returns the full text when it fits", () => {
    expect(
      sliceToFit("apps/Card.tsx", "center", "end", "…", 100, measure),
    ).toBe("apps/Card.tsx");
  });

  it("slices when the text only fits within the sub-pixel margin", () => {
    // measure(text) === available exactly: the 2px margin treats it as not
    // fitting, so it slices (and flags truncation) rather than returning the
    // full string, which the CSS `text-overflow` could still clip with no
    // tooltip to reveal it.
    const out = sliceToFit("aaaa/bbbb", "center", "end", "…", 9, measure);
    expect(out).not.toBe("aaaa/bbbb");
    expect(out).toContain("…");
  });

  it("keeps the tail whole and trims the head (priority=end)", () => {
    // leaf-path → head "aaaaaaaa/" (the "/" ends the head), tail "bbbbbbbb".
    // Budget 15 (−2 margin = 13): "…bbbbbbbb" (9) fits, then 4 head chars fit.
    expect(
      sliceToFit("aaaaaaaa/bbbbbbbb", "leaf-path", "end", "…", 15, measure),
    ).toBe("aaaa…bbbbbbbb");
  });

  it("keeps the head whole and trims the tail (priority=start)", () => {
    expect(
      sliceToFit("aaaaaaaa/bbbbbbbb", "leaf-path", "start", "…", 15, measure),
    ).toBe("aaaaaaaa/…bbb");
  });

  it("drops the head and front-trims the tail when the tail alone won't fit", () => {
    // Budget 8 (−2 = 6): even "…/bbbbbbbb" doesn't fit, so head goes and the tail
    // is trimmed from its start → "…bbbbb".
    expect(
      sliceToFit("aaaaaaaa/bbbbbbbb", "leaf-path", "end", "…", 8, measure),
    ).toBe("…bbbbb");
  });

  it("only ever drops whole characters (never a partial glyph)", () => {
    const text = "apps/web/src/components/BaseStepCard.tsx";
    const out = sliceToFit(text, "center", "end", "…", 20, measure);
    // Everything except the single "…" comes verbatim from the original string.
    const parts = out.split("…");
    expect(parts).toHaveLength(2);
    expect(text.includes(parts[0])).toBe(true);
    expect(text.includes(parts[1])).toBe(true);
  });

  it("keeps both ends and centers the marker for split='center'", () => {
    // 8 "a" + 8 "b"; center splits into equal halves. Budget 11 (−2 = 9) fits
    // 4 + "…" + 4 — both ends stay visible with the marker in the middle, not
    // the leading "…" the anchored (keep-one-side-whole) path would produce.
    expect(
      sliceToFit("aaaaaaaabbbbbbbb", "center", "end", "…", 11, measure),
    ).toBe("aaaa…bbbb");
  });

  it("biases the odd character by priority for split='center'", () => {
    // Budget 10 (−2 = 8) fits 7 chars around the marker; priority takes the
    // extra one — the tail for `end`, the head for `start`.
    expect(
      sliceToFit("aaaaaaaabbbbbbbb", "center", "end", "…", 10, measure),
    ).toBe("aaa…bbbb");
    expect(
      sliceToFit("aaaaaaaabbbbbbbb", "center", "start", "…", 10, measure),
    ).toBe("aaaa…bbb");
  });
});
