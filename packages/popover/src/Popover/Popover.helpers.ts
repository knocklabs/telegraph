import { type Ref } from "react";

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

type PopoverSide =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "inline-start"
  | "inline-end";

export type LegacyDismissEventHandler<TEvent extends Event = Event> = (
  event: TEvent,
) => void;

export type LegacyContentCallbacks = {
  onCloseAutoFocus?: LegacyDismissEventHandler;
  onEscapeKeyDown?: LegacyDismissEventHandler<KeyboardEvent>;
  onFocusOutside?: LegacyDismissEventHandler<FocusEvent | KeyboardEvent>;
  onInteractOutside?: LegacyDismissEventHandler;
  onOpenAutoFocus?: LegacyDismissEventHandler;
  onPointerDownOutside?: LegacyDismissEventHandler<
    MouseEvent | PointerEvent | TouchEvent
  >;
};

const setRef = <T>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

export const composeRefs = <T>(...refs: Array<Ref<T> | undefined>) => {
  if (!refs.some(Boolean)) {
    return undefined;
  }

  return (node: T | null) => {
    refs.forEach((ref) => setRef(ref, node));
  };
};

const callLegacyEventHandler = <TEvent extends Event>(
  handler: LegacyDismissEventHandler<TEvent> | undefined,
  event: TEvent,
) => {
  handler?.(event);
  return event.defaultPrevented;
};

export const callLegacyDismissHandlers = (
  eventDetails: BaseUIChangeDetails,
  callbacks: LegacyContentCallbacks,
) => {
  const { event, reason } = eventDetails;

  if (reason === BASE_UI_DISMISS_REASONS.escapeKey) {
    return callLegacyEventHandler(
      callbacks.onEscapeKeyDown,
      event as KeyboardEvent,
    );
  }

  if (reason === BASE_UI_DISMISS_REASONS.outsidePress) {
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

export const getMotionOffsetBySide = (side: PopoverSide | undefined) => {
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
