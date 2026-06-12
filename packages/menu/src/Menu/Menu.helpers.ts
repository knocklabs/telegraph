import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
  type SyntheticEvent,
} from "react";

type BaseUIChangeDetails = {
  event: Event;
  reason?: string;
};

type MenuPositionerRenderState = {
  anchorHidden: boolean;
};

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

export type PreventableSyntheticEvent = SyntheticEvent & {
  preventBaseUIHandler?: () => void;
};

export type MenuContentKeyDownEvent = ReactKeyboardEvent<HTMLElement> & {
  preventBaseUIHandler?: () => void;
};

export type MenuTriggerKeyDownEvent = ReactKeyboardEvent<HTMLElement> & {
  preventBaseUIHandler?: () => void;
};

export type MenuButtonKeyDownEvent = ReactKeyboardEvent<HTMLElement> & {
  preventBaseUIHandler?: () => void;
};

export type MenuContentCallbacksEntry = {
  callbacks: LegacyContentCallbacks;
  id: symbol;
};

export type MenuContentCallbacksRef = {
  current: MenuContentCallbacksEntry[];
};

const BASE_UI_DISMISS_REASONS = {
  escapeKey: "escape-key",
  focusOut: "focus-out",
  outsidePress: "outside-press",
} as const;

export const NO_COLLISION_AVOIDANCE = {
  align: "none",
  fallbackAxisSide: "none",
  side: "none",
} as const;

export const RADIX_POPPER_COMPATIBILITY_VARS = {
  "--radix-popper-transform-origin": "var(--transform-origin)",
  "--radix-popper-available-width": "var(--available-width)",
  "--radix-popper-available-height": "var(--available-height)",
  "--radix-popper-anchor-width": "var(--anchor-width)",
  "--radix-popper-anchor-height": "var(--anchor-height)",
} as const;

export const MENU_SELECTION_KEYS = ["Enter", " "];

const FIRST_ITEM_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_ITEM_KEYS = ["ArrowUp", "PageDown", "End"];
const MENU_ITEM_SELECTOR = "[data-tgph-menu-button]";

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

export const getRootContentCallbacks = (
  contentCallbacksRef: MenuContentCallbacksRef,
) => {
  return contentCallbacksRef.current[0]?.callbacks ?? {};
};

export const upsertContentCallbacks = (
  contentCallbacksRef: MenuContentCallbacksRef,
  id: symbol,
  callbacks: LegacyContentCallbacks,
) => {
  const existingIndex = contentCallbacksRef.current.findIndex(
    (entry) => entry.id === id,
  );

  if (existingIndex === -1) {
    contentCallbacksRef.current.push({ callbacks, id });
    return;
  }

  contentCallbacksRef.current[existingIndex] = { callbacks, id };
};

export const removeContentCallbacks = (
  contentCallbacksRef: MenuContentCallbacksRef,
  id: symbol,
) => {
  const existingIndex = contentCallbacksRef.current.findIndex(
    (entry) => entry.id === id,
  );

  if (existingIndex !== -1) {
    contentCallbacksRef.current.splice(existingIndex, 1);
  }
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

export const preventBaseUIHandlerWhenDefaultPrevented = (
  event: PreventableSyntheticEvent,
) => {
  if (event.defaultPrevented || event.nativeEvent.defaultPrevented) {
    event.preventBaseUIHandler?.();
  }
};

export const getPositionerStyle = ({
  anchorHidden,
  hideWhenDetached,
}: MenuPositionerRenderState & {
  hideWhenDetached?: boolean;
}): CSSProperties => {
  return {
    visibility: hideWhenDetached && anchorHidden ? "hidden" : undefined,
    zIndex: "var(--tgph-zIndex-popover)",
  };
};

export const labelBaseUIFocusGuards = (ownerDocument: Document) => {
  ownerDocument
    .querySelectorAll<HTMLElement>('[data-base-ui-focus-guard][role="button"]')
    .forEach((focusGuard) => {
      if (!focusGuard.getAttribute("aria-label")) {
        focusGuard.setAttribute("aria-label", "Focus boundary");
      }
    });
};

const getFocusableMenuItems = (content: HTMLElement) => {
  return Array.from(
    content.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR),
  ).filter((item) => {
    return (
      item.getAttribute("aria-disabled") !== "true" &&
      item.getAttribute("data-disabled") === null &&
      !item.hasAttribute("disabled")
    );
  });
};

export const focusMenuItemFromContentKeyDown = (
  event: MenuContentKeyDownEvent,
) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  const items = getFocusableMenuItems(event.currentTarget);

  if (FIRST_ITEM_KEYS.includes(event.key)) {
    event.preventDefault();
    event.preventBaseUIHandler?.();
    items[0]?.focus();
    return;
  }

  if (LAST_ITEM_KEYS.includes(event.key)) {
    event.preventDefault();
    event.preventBaseUIHandler?.();
    items.at(-1)?.focus();
  }
};

const isTriggerOpen = (trigger: HTMLElement) => {
  return (
    trigger.getAttribute("aria-expanded") === "true" ||
    trigger.getAttribute("data-state") === "open" ||
    trigger.hasAttribute("data-popup-open")
  );
};

const isControlledContentOpen = (content: HTMLElement) => {
  return (
    content.getAttribute("data-state") === "open" ||
    Boolean(content.closest('[data-state="open"]'))
  );
};

const focusMenuItem = (content: HTMLElement, focusFirstItem: boolean) => {
  const items = getFocusableMenuItems(content);
  const item = focusFirstItem ? items[0] : items.at(-1);

  item?.focus();

  return Boolean(item);
};

const scheduleContentMenuItemFocus = (
  content: HTMLElement,
  event: MenuContentKeyDownEvent,
  focusFirstItem: boolean,
) => {
  content.ownerDocument.defaultView?.setTimeout(() => {
    if (event.defaultPrevented || event.nativeEvent.defaultPrevented) {
      return;
    }

    focusMenuItem(content, focusFirstItem);
  }, 0);
};

export const focusMenuItemFromNestedControlKeyDown = (
  event: MenuContentKeyDownEvent,
) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  if (event.target === event.currentTarget) {
    return;
  }

  if (event.target.closest(MENU_ITEM_SELECTOR)) {
    return;
  }

  if (FIRST_ITEM_KEYS.includes(event.key)) {
    scheduleContentMenuItemFocus(event.currentTarget, event, true);
  }
};

const scheduleMenuItemFocus = (
  ownerDocument: Document,
  contentId: string,
  focusFirstItem: boolean,
) => {
  const focus = () => {
    const content = ownerDocument.getElementById(contentId);

    if (content) {
      focusMenuItem(content, focusFirstItem);
    }
  };

  const ownerWindow = ownerDocument.defaultView;

  ownerWindow?.setTimeout(focus, 0);
};

export const focusMenuItemFromOpenTriggerKeyDown = (
  event: MenuTriggerKeyDownEvent,
) => {
  const isFirstItemKey = FIRST_ITEM_KEYS.includes(event.key);
  const isLastItemKey = LAST_ITEM_KEYS.includes(event.key);

  if (!isFirstItemKey && !isLastItemKey) {
    return false;
  }

  const contentId = event.currentTarget.getAttribute("aria-controls");
  const content = contentId
    ? event.currentTarget.ownerDocument.getElementById(contentId)
    : null;
  const focusFirstItem = isFirstItemKey;

  if (
    !content &&
    contentId &&
    (event.defaultPrevented || event.nativeEvent.defaultPrevented)
  ) {
    event.preventDefault();
    event.preventBaseUIHandler?.();
    scheduleMenuItemFocus(
      event.currentTarget.ownerDocument,
      contentId,
      focusFirstItem,
    );

    return true;
  }

  if (
    !content ||
    (!isTriggerOpen(event.currentTarget) && !isControlledContentOpen(content))
  ) {
    return false;
  }

  if (!focusMenuItem(content, focusFirstItem)) {
    return false;
  }

  event.preventDefault();
  event.preventBaseUIHandler?.();

  return true;
};
