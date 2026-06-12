import {
  type BaseUIChangeDetails,
  type LegacyDismissHandlers,
  callLegacyDismissHandlers,
} from "@telegraph/helpers";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type SyntheticEvent,
} from "react";

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

export type MenuContentCallbacksScope = "root" | "submenu";

export type MenuContentCallbacksEntry = {
  callbacks: LegacyDismissHandlers;
  id: symbol;
  scope: MenuContentCallbacksScope;
};

export type MenuContentCallbacksRef = {
  current: MenuContentCallbacksEntry[];
};

type OpenAutoFocusRestoreTargetParams = {
  focusedElementAfterHandler: Element | null;
  previouslyFocusedElement: Element | null;
};

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

// Base UI handles ordinary roving focus; these helpers preserve Telegraph's
// Radix-era edge cases around nested focusable children and prevented handlers.
const FIRST_ITEM_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_ITEM_KEYS = ["ArrowUp", "PageDown", "End"];
const MENU_ITEM_SELECTOR = "[data-tgph-menu-button]";

export const callContentDismissHandlers = (
  eventDetails: BaseUIChangeDetails,
  contentCallbacksRef: MenuContentCallbacksRef,
) => {
  // Nested content registers after root content, so newest-first gives the
  // deepest open menu first chance to cancel dismissal.
  return contentCallbacksRef.current
    .slice()
    .reverse()
    .some((entry) => callLegacyDismissHandlers(eventDetails, entry.callbacks));
};

export const callLatestContentDismissHandler = (
  eventDetails: BaseUIChangeDetails,
  contentCallbacksRef: MenuContentCallbacksRef,
  scope: MenuContentCallbacksScope,
) => {
  const entry = contentCallbacksRef.current
    .slice()
    .reverse()
    .find((contentCallbacksEntry) => {
      // Submenus should only consult submenu callbacks; otherwise root content
      // could accidentally cancel a submenu close that Radix kept scoped.
      return contentCallbacksEntry.scope === scope;
    });

  return entry
    ? callLegacyDismissHandlers(eventDetails, entry.callbacks)
    : false;
};

export const upsertContentCallbacks = (
  contentCallbacksRef: MenuContentCallbacksRef,
  id: symbol,
  scope: MenuContentCallbacksScope,
  callbacks: LegacyDismissHandlers,
) => {
  const existingIndex = contentCallbacksRef.current.findIndex(
    (entry) => entry.id === id,
  );

  if (existingIndex === -1) {
    contentCallbacksRef.current.push({ callbacks, id, scope });
    return;
  }

  contentCallbacksRef.current[existingIndex] = { callbacks, id, scope };
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

export const preventBaseUIHandlerWhenDefaultPrevented = (
  event: PreventableSyntheticEvent,
) => {
  if (event.defaultPrevented || event.nativeEvent.defaultPrevented) {
    // Base UI has its own internal handler pipeline, so mirror React prevention
    // into Base UI's explicit opt-out hook.
    event.preventBaseUIHandler?.();
  }
};

export const labelBaseUIFocusGuards = (ownerDocument: Document) => {
  ownerDocument
    .querySelectorAll<HTMLElement>('[data-base-ui-focus-guard][role="button"]')
    .forEach((focusGuard) => {
      if (!focusGuard.getAttribute("aria-label")) {
        // Base UI focus guards are implementation-detail buttons; label them so
        // accessibility tooling does not report anonymous controls.
        focusGuard.setAttribute("aria-label", "Focus boundary");
      }
    });
};

export const getOpenAutoFocusRestoreTarget = ({
  focusedElementAfterHandler,
  previouslyFocusedElement,
}: OpenAutoFocusRestoreTargetParams) => {
  if (
    focusedElementAfterHandler instanceof HTMLElement &&
    focusedElementAfterHandler !== previouslyFocusedElement
  ) {
    // If the legacy autofocus handler moved focus itself, restore to that
    // explicit target after Base UI's autofocus work settles.
    return focusedElementAfterHandler;
  }

  if (previouslyFocusedElement instanceof HTMLElement) {
    // Otherwise match Radix's prevented-open-autofocus behavior by restoring the
    // element that had focus before the menu opened.
    return previouslyFocusedElement;
  }

  return null;
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
    // Nested focusable children handle their own keys; only the content surface
    // should translate edge keys into first/last menu item focus.
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
    // Let the nested control finish its keydown first, then bail if user code
    // prevented during that same turn.
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
    // ArrowDown from embedded controls should re-enter menu navigation without
    // asking Base UI to treat that nested control as the active menu item.
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
    // The popup may not exist until Base UI processes the trigger key, so defer
    // first/last item focus until the controlled content is in the document.
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
