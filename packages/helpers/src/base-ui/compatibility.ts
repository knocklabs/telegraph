import type { CSSProperties } from "react";

const ANIMATION_OFFSET = 5;
const BASE_UI_DISMISS_REASONS = {
  escapeKey: "escape-key",
  focusOut: "focus-out",
  outsidePress: "outside-press",
} as const;

type BaseUIChangeDetails = {
  event: Event;
  reason?: string;
};

type BaseUIFloatingSide =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "inline-start"
  | "inline-end";

type LegacyDismissEventHandler<TEvent extends Event = Event> = (
  event: TEvent,
) => void;

type LegacyDismissHandlers = {
  onEscapeKeyDown?: LegacyDismissEventHandler<KeyboardEvent>;
  onFocusOutside?: LegacyDismissEventHandler<FocusEvent | KeyboardEvent>;
  onInteractOutside?: LegacyDismissEventHandler;
  onPointerDownOutside?: LegacyDismissEventHandler<
    MouseEvent | PointerEvent | TouchEvent
  >;
};

type BaseUIPositionerVisibilityStyleParams = {
  anchorHidden: boolean;
  hideWhenDetached?: boolean;
  zIndex?: CSSProperties["zIndex"];
};

const callLegacyEventHandler = <TEvent extends Event>(
  handler: LegacyDismissEventHandler<TEvent> | undefined,
  event: TEvent,
) => {
  handler?.(event);
  return event.defaultPrevented;
};

const callLegacyDismissHandlers = (
  eventDetails: BaseUIChangeDetails,
  callbacks: LegacyDismissHandlers,
) => {
  const { event, reason } = eventDetails;

  if (reason === BASE_UI_DISMISS_REASONS.escapeKey) {
    // Radix exposed escape as a typed keyboard callback, so preserve that event
    // shape even though Base UI sends all dismiss reasons through one details object.
    return callLegacyEventHandler(
      callbacks.onEscapeKeyDown,
      event as KeyboardEvent,
    );
  }

  if (reason === BASE_UI_DISMISS_REASONS.outsidePress) {
    // Radix fired both pointer-specific and generic outside-interaction hooks;
    // cancellation from either one should block Base UI's dismiss.
    const pointerDismissPrevented = callLegacyEventHandler(
      callbacks.onPointerDownOutside,
      event as MouseEvent | PointerEvent | TouchEvent,
    );
    const interactDismissPrevented = callLegacyEventHandler(
      callbacks.onInteractOutside,
      event,
    );

    return pointerDismissPrevented || interactDismissPrevented;
  }

  if (reason === BASE_UI_DISMISS_REASONS.focusOut) {
    // Focus-out maps to Radix's focus-specific hook and the broader
    // interaction hook, matching the previous callback cascade.
    const focusDismissPrevented = callLegacyEventHandler(
      callbacks.onFocusOutside,
      event as FocusEvent | KeyboardEvent,
    );
    const interactDismissPrevented = callLegacyEventHandler(
      callbacks.onInteractOutside,
      event,
    );

    return focusDismissPrevented || interactDismissPrevented;
  }

  return false;
};

const getBaseUIMotionOffset = (
  side: BaseUIFloatingSide | undefined,
  offset = ANIMATION_OFFSET,
) => {
  // Base UI includes logical sides, but Telegraph's existing animation only
  // offsets physical sides; logical sides intentionally fall through to no offset.
  if (side === "top") {
    return {
      y: -offset,
    };
  }

  if (side === "bottom") {
    return {
      y: offset,
    };
  }

  if (side === "left") {
    return {
      x: -offset,
    };
  }

  if (side === "right") {
    return {
      x: offset,
    };
  }

  return {};
};

const getBaseUIPositionerVisibilityStyle = ({
  anchorHidden,
  hideWhenDetached,
  zIndex,
}: BaseUIPositionerVisibilityStyleParams): CSSProperties => {
  return {
    // Radix's `hideWhenDetached` hid content without unmounting it; Base UI
    // reports anchor visibility through render state instead.
    visibility: hideWhenDetached && anchorHidden ? "hidden" : undefined,
    zIndex,
  };
};

export {
  callLegacyDismissHandlers,
  getBaseUIMotionOffset,
  getBaseUIPositionerVisibilityStyle,
};
export type {
  BaseUIChangeDetails,
  BaseUIFloatingSide,
  BaseUIPositionerVisibilityStyleParams,
  LegacyDismissEventHandler,
  LegacyDismissHandlers,
};
