import type { TextDirection } from "@base-ui/react/direction-provider";
import type { KeyboardEvent, ReactNode } from "react";

type NavigationOrientation = "horizontal" | "vertical";

type RadioCardKeyboardEvent = KeyboardEvent<HTMLDivElement> & {
  baseUIHandlerPrevented?: boolean;
  preventBaseUIHandler: () => void;
};

const getHorizontalForwardKey = (dir: TextDirection | undefined) => {
  return dir === "rtl" ? "ArrowLeft" : "ArrowRight";
};

const getHorizontalBackwardKey = (dir: TextDirection | undefined) => {
  return dir === "rtl" ? "ArrowRight" : "ArrowLeft";
};

const isOrientationBlockedKey = (
  key: string,
  orientation: NavigationOrientation | undefined,
) => {
  // Radix ignored cross-axis arrows for fixed-orientation groups, while Base UI
  // would otherwise continue moving focus through the radio group.
  if (orientation === "horizontal") {
    return key === "ArrowUp" || key === "ArrowDown";
  }

  if (orientation === "vertical") {
    return key === "ArrowLeft" || key === "ArrowRight";
  }

  return false;
};

const isForwardNavigationKey = (
  key: string,
  orientation: NavigationOrientation | undefined,
  dir: TextDirection | undefined,
) => {
  if (orientation === "vertical") {
    return key === "ArrowDown";
  }

  return key === getHorizontalForwardKey(dir) || key === "ArrowDown";
};

const isBackwardNavigationKey = (
  key: string,
  orientation: NavigationOrientation | undefined,
  dir: TextDirection | undefined,
) => {
  if (orientation === "vertical") {
    return key === "ArrowUp";
  }

  return key === getHorizontalBackwardKey(dir) || key === "ArrowUp";
};

const getNavigationDirection = (
  key: string,
  orientation: NavigationOrientation | undefined,
  dir: TextDirection | undefined,
) => {
  const resolvedOrientation = orientation ?? "horizontal";

  // Collapse vertical groups and RTL horizontal groups into one signed movement
  // value so the wrapping logic below does not need separate branches.
  if (isForwardNavigationKey(key, resolvedOrientation, dir)) {
    return 1;
  }

  if (isBackwardNavigationKey(key, resolvedOrientation, dir)) {
    return -1;
  }

  return 0;
};

const getEnabledRadios = (root: HTMLElement) => {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[role="radio"]'),
  ).filter(
    (radio) =>
      !radio.matches(":disabled, [data-disabled], [aria-disabled='true']"),
  );
};

const getCurrentRadio = (root: HTMLElement, enabledRadios: HTMLElement[]) => {
  const activeElement = root.ownerDocument.activeElement;

  if (
    activeElement instanceof HTMLElement &&
    root.contains(activeElement) &&
    activeElement.getAttribute("role") === "radio"
  ) {
    // Prefer the focused radio because keyboard navigation should continue from
    // the user's current roving focus position, not only from the checked value.
    return activeElement;
  }

  return (
    enabledRadios.find(
      (radio) => radio.getAttribute("aria-checked") === "true",
    ) ?? null
  );
};

const getNextRadio = (
  event: RadioCardKeyboardEvent,
  orientation: NavigationOrientation | undefined,
  loop: boolean | undefined,
  dir: TextDirection | undefined,
) => {
  const navigationDirection = getNavigationDirection(
    event.key,
    orientation,
    dir,
  );

  if (navigationDirection === 0) {
    return null;
  }

  const enabledRadios = getEnabledRadios(event.currentTarget);
  const currentRadio = getCurrentRadio(event.currentTarget, enabledRadios);
  const currentIndex = currentRadio ? enabledRadios.indexOf(currentRadio) : -1;

  if (currentIndex === -1) {
    // If the selected/focused item is disabled, keep keyboard handling inside the
    // compatibility shim and restart navigation from the appropriate enabled edge.
    return navigationDirection === 1
      ? (enabledRadios[0] ?? null)
      : (enabledRadios[enabledRadios.length - 1] ?? null);
  }

  const nextIndex = currentIndex + navigationDirection;

  if (nextIndex >= 0 && nextIndex < enabledRadios.length) {
    return enabledRadios[nextIndex] ?? null;
  }

  if (loop === false) {
    // Preserve Radix's `loop={false}` behavior by keeping focus on the edge
    // option while still blocking Base UI from wrapping internally.
    return currentRadio;
  }

  return navigationDirection === 1
    ? enabledRadios[0]
    : enabledRadios[enabledRadios.length - 1];
};

const preventBaseUIKeyboardNavigation = (event: RadioCardKeyboardEvent) => {
  event.preventBaseUIHandler();
};

const syncRadioTabStops = (root: HTMLElement, activeRadio: HTMLElement) => {
  // The selected radio is moved with click semantics for parity, then the
  // roving tab stops are corrected so tabbing resumes from the focused item.
  getEnabledRadios(root).forEach((radio) => {
    radio.tabIndex = radio === activeRadio ? 0 : -1;
  });

  activeRadio.focus();
};

const handleCompatibilityKeyboardNavigation = (
  event: RadioCardKeyboardEvent,
  orientation: NavigationOrientation | undefined,
  loop: boolean | undefined,
  dir: TextDirection | undefined,
) => {
  const resolvedOrientation = orientation ?? "horizontal";

  if (isOrientationBlockedKey(event.key, resolvedOrientation)) {
    // Stop Base UI before it treats a blocked cross-axis arrow as navigation.
    preventBaseUIKeyboardNavigation(event);
    event.preventDefault();
    return;
  }

  const nextRadio = getNextRadio(event, resolvedOrientation, loop, dir);

  if (!nextRadio) {
    return;
  }

  preventBaseUIKeyboardNavigation(event);
  event.preventDefault();

  if (nextRadio === event.target) {
    syncRadioTabStops(event.currentTarget, nextRadio);
    return;
  }

  const root = event.currentTarget;

  nextRadio.click();
  queueMicrotask(() => {
    // Let Base UI process the click selection first, then repair focus and
    // tabIndex after its internal radio state has settled.
    syncRadioTabStops(root, nextRadio);
  });
};

const shouldRenderRadioCardContent = (content: ReactNode) => {
  return (
    content !== null &&
    content !== undefined &&
    typeof content !== "boolean" &&
    content !== ""
  );
};

export { handleCompatibilityKeyboardNavigation, shouldRenderRadioCardContent };
export type { RadioCardKeyboardEvent };
