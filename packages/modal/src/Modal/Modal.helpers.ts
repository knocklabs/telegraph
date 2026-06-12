import { type SyntheticEvent } from "react";

type BaseUIChangeDetails = {
  event: Event;
  reason?: string;
};

export type LegacyContentCallbacks = {
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onFocusOutside?: (event: FocusEvent | KeyboardEvent) => void;
  onInteractOutside?: (event: Event) => void;
  onOpenAutoFocus?: (event: Event) => void;
  onPointerDownOutside?: (
    event: MouseEvent | PointerEvent | TouchEvent,
  ) => void;
};

export type BaseUIPreventableEvent = (Event | SyntheticEvent) & {
  nativeEvent?: Event;
  preventBaseUIHandler?: () => void;
  stopPropagation?: () => void;
};

export const BASE_UI_DISMISS_REASONS = {
  escapeKey: "escape-key",
  focusOut: "focus-out",
  outsidePress: "outside-press",
} as const;

export const callLegacyEventHandler = <TEvent extends Event>(
  handler: ((event: TEvent) => void) | undefined,
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

export const callAutoFocusHandler = (
  handler: ((event: Event) => void) | undefined,
  eventName: string,
) => {
  const event = new Event(eventName, { cancelable: true });
  handler?.(event);
  return event.defaultPrevented;
};
