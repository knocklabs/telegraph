import { describe, expect, it } from "vitest";

import {
  splitByIndex,
  splitCenter,
  splitExtension,
  splitFirst,
  splitLast,
  splitLeafPath,
} from "./TruncatedText.helpers";

// The split functions are pure string logic (no DOM), so jsdom is the right
// home for them. Real overflow *detection* is CSS-only and can only be
// exercised in a real browser — see TruncatedText.browser.test.tsx.
describe("splitCenter", () => {
  it("splits an even string in the middle", () => {
    expect(splitCenter("abcdef")).toEqual(["abc", "def"]);
  });

  it("returns the whole string when it is too short to split", () => {
    expect(splitCenter("a")).toEqual(["a", ""]);
  });

  it("nudges the split off a whitespace seam so the space is not collapsed", () => {
    // A center split of "Hello world" lands on the space; `white-space: nowrap`
    // would then swallow it. The nudge keeps the space interior to a segment.
    const [head, tail] = splitCenter("Hello world");
    expect(head + tail).toBe("Hello world");
    expect(head.at(-1)).not.toBe(" ");
    expect(tail.at(0)).not.toBe(" ");
  });
});

describe("splitExtension", () => {
  it("splits before a short trailing extension", () => {
    expect(splitExtension("BaseStepCard.tsx")).toEqual([
      "BaseStepCard.",
      "tsx",
    ]);
  });

  it("uses the last dot", () => {
    expect(splitExtension("archive.tar.gz")).toEqual(["archive.tar.", "gz"]);
  });

  it("falls back to a center split when the extension is implausibly long", () => {
    const input = "no.thisisnotarealextension";
    const [head, tail] = splitExtension(input);
    expect(head + tail).toBe(input);
    // A center fallback is roughly balanced (not split right after the dot).
    expect(Math.abs(head.length - tail.length)).toBeLessThanOrEqual(1);
  });
});

describe("splitLeafPath", () => {
  it("splits before the last path segment", () => {
    expect(splitLeafPath("a/b/c.tsx")).toEqual(["a/b/", "c.tsx"]);
  });
});

describe("offset splitters", () => {
  it("splitByIndex splits at the given index", () => {
    expect(splitByIndex("abcdef", 2)).toEqual(["ab", "cdef"]);
  });

  it("splitByIndex falls back to center for a non-finite index", () => {
    expect(splitByIndex("abcd", Number.NaN)).toEqual(["ab", "cd"]);
  });

  it("splitLast keeps the last `offset` chars in the tail", () => {
    expect(splitLast("file.txt", 3)).toEqual(["file.", "txt"]);
  });

  it("splitFirst keeps the first `offset` chars in the head", () => {
    expect(splitFirst("file.txt", 4)).toEqual(["file", ".txt"]);
  });

  it("offset splitters fall back to center for an out-of-range offset", () => {
    expect(splitLast("file.txt", 0)).toEqual(splitCenter("file.txt"));
    expect(splitFirst("file.txt", 99)).toEqual(splitCenter("file.txt"));
  });
});
