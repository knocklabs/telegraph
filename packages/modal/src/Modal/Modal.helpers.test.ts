import { describe, expect, it } from "vitest";

import {
  getStackedModalScale,
  getStackingOverlayZIndex,
} from "./Modal.helpers";

describe("getStackedModalScale", () => {
  it("rests at scale 1 for an unregistered layer (no stacking provider)", () => {
    // Before a layer registers — or with no ModalStackingProvider — the stack
    // reports zero layers and a fallback layer index of 0. The active modal
    // must still settle at exactly 1 rather than overshooting to 1.02.
    expect(getStackedModalScale(0, 0)).toBe(1);
  });

  it("rests at scale 1 for a single registered modal", () => {
    expect(getStackedModalScale(1, 0)).toBe(1);
  });

  it("keeps the top layer at scale 1 while stacked layers shrink by depth", () => {
    // Two layers: top (index 1) stays full size, the one beneath shrinks.
    expect(getStackedModalScale(2, 1)).toBe(1);
    expect(getStackedModalScale(2, 0)).toBeCloseTo(0.98);

    // Three layers: shrink accumulates the further a layer sits from the top.
    expect(getStackedModalScale(3, 2)).toBe(1);
    expect(getStackedModalScale(3, 1)).toBeCloseTo(0.98);
    expect(getStackedModalScale(3, 0)).toBeCloseTo(0.96);
  });
});

describe("getStackingOverlayZIndex", () => {
  it("matches the first modal's z-index for the first stacked layer", () => {
    expect(getStackingOverlayZIndex(1)).toBe("var(--tgph-zIndex-modal)");
  });

  it("steps up with the modal beneath deeper stacked layers", () => {
    expect(getStackingOverlayZIndex(2)).toBe(
      "calc(var(--tgph-zIndex-modal) + 1)",
    );
    expect(getStackingOverlayZIndex(3)).toBe(
      "calc(var(--tgph-zIndex-modal) + 2)",
    );
  });
});
