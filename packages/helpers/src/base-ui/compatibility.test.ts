import { describe, expect, it, vi } from "vitest";

import {
  callLegacyDismissHandlers,
  getBaseUIMotionOffset,
  getBaseUIPositionerVisibilityStyle,
} from "./compatibility";

describe("callLegacyDismissHandlers", () => {
  it("calls escape handlers and returns whether they prevented dismissal", () => {
    const event = new KeyboardEvent("keydown", { cancelable: true });
    const onEscapeKeyDown = vi.fn((dismissEvent: KeyboardEvent) => {
      dismissEvent.preventDefault();
    });

    const prevented = callLegacyDismissHandlers(
      { event, reason: "escape-key" },
      { onEscapeKeyDown },
    );

    expect(onEscapeKeyDown).toHaveBeenCalledWith(event);
    expect(prevented).toBe(true);
  });

  it("calls pointer and interact handlers for outside press dismissal", () => {
    const event = new MouseEvent("mousedown", { cancelable: true });
    const onPointerDownOutside = vi.fn();
    const onInteractOutside = vi.fn((dismissEvent: Event) => {
      dismissEvent.preventDefault();
    });

    const prevented = callLegacyDismissHandlers(
      { event, reason: "outside-press" },
      { onInteractOutside, onPointerDownOutside },
    );

    expect(onPointerDownOutside).toHaveBeenCalledWith(event);
    expect(onInteractOutside).toHaveBeenCalledWith(event);
    expect(prevented).toBe(true);
  });

  it("calls focus and interact handlers for focus-out dismissal", () => {
    const event = new FocusEvent("focusout", { cancelable: true });
    const onFocusOutside = vi.fn();
    const onInteractOutside = vi.fn();

    const prevented = callLegacyDismissHandlers(
      { event, reason: "focus-out" },
      { onFocusOutside, onInteractOutside },
    );

    expect(onFocusOutside).toHaveBeenCalledWith(event);
    expect(onInteractOutside).toHaveBeenCalledWith(event);
    expect(prevented).toBe(false);
  });
});

describe("getBaseUIMotionOffset", () => {
  it("returns directional motion offsets", () => {
    expect(getBaseUIMotionOffset("top")).toEqual({ y: -5 });
    expect(getBaseUIMotionOffset("bottom", 8)).toEqual({ y: 8 });
    expect(getBaseUIMotionOffset("left")).toEqual({ x: -5 });
    expect(getBaseUIMotionOffset("right", 8)).toEqual({ x: 8 });
    expect(getBaseUIMotionOffset("inline-start")).toEqual({});
  });
});

describe("getBaseUIPositionerVisibilityStyle", () => {
  it("only hides detached positioners when requested", () => {
    expect(
      getBaseUIPositionerVisibilityStyle({
        anchorHidden: true,
        hideWhenDetached: true,
        zIndex: "var(--tgph-zIndex-tooltip)",
      }),
    ).toEqual({
      visibility: "hidden",
      zIndex: "var(--tgph-zIndex-tooltip)",
    });

    expect(
      getBaseUIPositionerVisibilityStyle({
        anchorHidden: true,
        hideWhenDetached: false,
      }),
    ).toEqual({
      visibility: undefined,
      zIndex: undefined,
    });
  });
});
