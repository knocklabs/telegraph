import { type CSSProperties } from "react";

const ANIMATION_OFFSET = 5;
const BASE_UI_DISMISS_REASONS = {
  escapeKey: "escape-key",
  outsidePress: "outside-press",
} as const;

type BaseUIChangeDetails = {
  event: Event;
  reason?: string;
};

type TooltipDismissCallbacks = {
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (
    event: MouseEvent | PointerEvent | TouchEvent,
  ) => void;
};

type TooltipPositionerRenderState = {
  anchorHidden: boolean;
};

type TooltipSide =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "inline-start"
  | "inline-end";

export const NO_COLLISION_AVOIDANCE = {
  align: "none",
  fallbackAxisSide: "none",
  side: "none",
} as const;

const callLegacyEventHandler = <TEvent extends Event>(
  handler: ((event: TEvent) => void) | undefined,
  event: TEvent,
) => {
  handler?.(event);
  return event.defaultPrevented;
};

export const callLegacyDismissHandler = (
  eventDetails: BaseUIChangeDetails,
  callbacks: TooltipDismissCallbacks,
) => {
  const { event, reason } = eventDetails;

  if (reason === BASE_UI_DISMISS_REASONS.escapeKey) {
    return callLegacyEventHandler(
      callbacks.onEscapeKeyDown,
      event as KeyboardEvent,
    );
  }

  if (reason === BASE_UI_DISMISS_REASONS.outsidePress) {
    return callLegacyEventHandler(
      callbacks.onPointerDownOutside,
      event as MouseEvent | PointerEvent | TouchEvent,
    );
  }

  return false;
};

export const getMotionOffsetBySide = (side: TooltipSide | undefined) => {
  if (side === "top") {
    return {
      y: -ANIMATION_OFFSET,
    };
  }

  if (side === "bottom") {
    return {
      y: ANIMATION_OFFSET,
    };
  }

  if (side === "left") {
    return {
      x: -ANIMATION_OFFSET,
    };
  }

  if (side === "right") {
    return {
      x: ANIMATION_OFFSET,
    };
  }

  return {};
};

export const getPositionerStyle = ({
  anchorHidden,
  hideWhenDetached,
}: TooltipPositionerRenderState & {
  hideWhenDetached?: boolean;
}): CSSProperties => {
  return {
    visibility: hideWhenDetached && anchorHidden ? "hidden" : undefined,
    zIndex: "var(--tgph-zIndex-tooltip)",
  };
};
