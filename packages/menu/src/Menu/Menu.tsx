import { Menu as BaseMenu } from "@base-ui/react/menu";
import { resolveButtonNativeButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type LegacyDismissEventHandler,
  type LegacyDismissHandlers,
  type PolymorphicProps,
  type RemappedOmit,
  type TgphElement,
  createTgphBaseUIRender,
  getBaseUIPositionerVisibilityStyle,
  inferTriggerNativeButton,
} from "@telegraph/helpers";
import { Box, type BoxProps, Stack, type StackProps } from "@telegraph/layout";
import { ChevronRight } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { MenuItem, type MenuItemProps } from "../MenuItem";

import {
  MENU_SELECTION_KEYS,
  type MenuButtonKeyDownEvent,
  type MenuContentCallbacksEntry,
  type MenuContentCallbacksRef,
  type MenuContentCallbacksScope,
  type MenuContentKeyDownEvent,
  NO_COLLISION_AVOIDANCE,
  type PreventableSyntheticEvent,
  RADIX_POPPER_COMPATIBILITY_VARS,
  callContentDismissHandlers,
  callLatestContentDismissHandler,
  focusMenuItemFromContentKeyDown,
  focusMenuItemFromNestedControlKeyDown,
  focusMenuItemFromOpenTriggerKeyDown,
  getOpenAutoFocusRestoreTarget,
  labelBaseUIFocusGuards,
  preventBaseUIHandlerWhenDefaultPrevented,
  removeContentCallbacks,
  upsertContentCallbacks,
} from "./Menu.helpers";

type BaseMenuRootProps = ComponentProps<typeof BaseMenu.Root>;
type BaseMenuTriggerProps = ComponentPropsWithoutRef<typeof BaseMenu.Trigger>;
type BaseMenuPortalProps = ComponentPropsWithoutRef<typeof BaseMenu.Portal>;
type BaseMenuPositionerProps = ComponentPropsWithoutRef<
  typeof BaseMenu.Positioner
>;
type BaseMenuPopupProps = ComponentPropsWithoutRef<typeof BaseMenu.Popup>;
type BaseMenuItemProps = ComponentPropsWithoutRef<typeof BaseMenu.Item>;
type BaseMenuSubProps = ComponentProps<typeof BaseMenu.SubmenuRoot>;
type BaseMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof BaseMenu.SubmenuTrigger
>;

type MenuPopupRenderState = {
  open: boolean;
};

type MenuTriggerRenderState = {
  open: boolean;
};

type MenuSubTriggerRenderState = {
  open: boolean;
};

type MenuPopupContentProps = Omit<StackProps, "children" | "tgphRef"> & {
  children?: ReactNode;
  contentRef: Ref<HTMLElement>;
  onOpenAutoFocus?: LegacyDismissEventHandler;
  popupState: MenuPopupRenderState;
  tgphRef?: Ref<HTMLElement>;
};

type MenuContentKeyDownHandler = (event: MenuContentKeyDownEvent) => void;
type MenuContentKeyDownCaptureHandler = (
  event: MenuContentKeyDownEvent,
) => void;

type MenuCompatibilityContextProps = {
  contentCallbacksRef: MenuContentCallbacksRef;
};

export type RootProps = Omit<BaseMenuRootProps, "onOpenChange"> & {
  onOpenChange?: (open: boolean) => void;
};

const MenuCompatibilityContext =
  createContext<MenuCompatibilityContextProps | null>(null);
const MenuContentScopeContext =
  createContext<MenuContentCallbacksScope>("root");

const Root = ({
  children,
  modal = true,
  onOpenChange,
  ...props
}: RootProps) => {
  const contentCallbacksRef = useRef<MenuContentCallbacksEntry[]>([]);
  const handleOpenChange = useCallback<
    NonNullable<BaseMenuRootProps["onOpenChange"]>
  >(
    (open, eventDetails) => {
      if (
        !open &&
        callContentDismissHandlers(eventDetails, contentCallbacksRef)
      ) {
        // Legacy Radix content callbacks could cancel close, so translate that
        // prevention into Base UI's cancel API at the root.
        eventDetails.cancel();
        return;
      }

      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  return (
    <MenuCompatibilityContext.Provider value={{ contentCallbacksRef }}>
      <BaseMenu.Root modal={modal} onOpenChange={handleOpenChange} {...props}>
        {children}
      </BaseMenu.Root>
    </MenuCompatibilityContext.Provider>
  );
};

type BaseMenuTriggerCompatibilityProps = Partial<
  Pick<
    BaseMenuTriggerProps,
    | "closeDelay"
    | "delay"
    | "disabled"
    | "handle"
    | "nativeButton"
    | "openOnHover"
    | "payload"
  >
>;

export type TriggerProps = Omit<
  ComponentPropsWithoutRef<"button">,
  keyof BaseMenuTriggerCompatibilityProps | "children"
> &
  BaseMenuTriggerCompatibilityProps & {
    asChild?: boolean;
    children?: ReactNode;
    tgphRef?: Ref<HTMLButtonElement>;
  };

const TriggerWithRef = forwardRef<HTMLElement, TriggerProps>(
  (
    {
      asChild = true,
      children,
      onClick,
      onKeyDown,
      onKeyDownCapture,
      onMouseDown,
      nativeButton: nativeButtonProp,
      tgphRef,
      ...props
    },
    forwardedRef,
  ) => {
    const triggerRef = useComposedRefs<HTMLButtonElement>(
      forwardedRef as Ref<HTMLButtonElement>,
      tgphRef,
    ) as Ref<HTMLButtonElement>;
    const nativeButton = inferTriggerNativeButton({
      asChild,
      children,
      nativeButton: nativeButtonProp,
    });
    // A custom onClick means callers likely own the trigger activation path, so
    // avoid also letting Base UI process mousedown as a separate open signal.
    const shouldSuppressBaseMouseDown = Boolean(onClick);
    const handleClick = useCallback<
      NonNullable<BaseMenuTriggerProps["onClick"]>
    >(
      (event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
          // Radix kept focus on prevented trigger clicks; preserve that for
          // consumers that prevent open but still expect keyboard continuity.
          event.currentTarget.focus();
        }

        preventBaseUIHandlerWhenDefaultPrevented(event);
      },
      [onClick],
    );
    const handleKeyDownCapture = useCallback<
      NonNullable<BaseMenuTriggerProps["onKeyDownCapture"]>
    >(
      (event) => {
        onKeyDownCapture?.(event);

        if (event.defaultPrevented) {
          return;
        }

        if (focusMenuItemFromOpenTriggerKeyDown(event)) {
          event.stopPropagation();
        }
      },
      [onKeyDownCapture],
    );
    const handleKeyDown = useCallback<
      NonNullable<BaseMenuTriggerProps["onKeyDown"]>
    >(
      (event) => {
        onKeyDown?.(event);

        if (event.target !== event.currentTarget) {
          const target = event.target;
          const isEditableTarget =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            (target instanceof HTMLElement && target.isContentEditable);

          if (isEditableTarget && event.key.length === 1) {
            // Base UI 1.6 added open-trigger typeahead that prevents printable
            // keydowns. Nested editable controls own those keys, so keep the
            // menu handler from consuming them or bubbling them past the trigger.
            event.stopPropagation();
            event.preventBaseUIHandler?.();
            return;
          }

          // Custom trigger children can receive keydown first; still allow the
          // open-trigger focus shim to run from the actual trigger wrapper.
          focusMenuItemFromOpenTriggerKeyDown(event);
          return;
        }

        if (focusMenuItemFromOpenTriggerKeyDown(event)) {
          return;
        }

        preventBaseUIHandlerWhenDefaultPrevented(event);
      },
      [onKeyDown],
    );
    const handleMouseDown = useCallback<
      NonNullable<BaseMenuTriggerProps["onMouseDown"]>
    >(
      (event) => {
        onMouseDown?.(event);

        if (shouldSuppressBaseMouseDown) {
          event.preventBaseUIHandler?.();
          return;
        }

        preventBaseUIHandlerWhenDefaultPrevented(event);
      },
      [onMouseDown, shouldSuppressBaseMouseDown],
    );
    const renderTriggerElement = (state: MenuTriggerRenderState) => {
      if (asChild && isValidElement(children)) {
        const child = children as ReactElement<Record<string, unknown>>;

        return cloneElement(child, {
          "aria-expanded": child.props["aria-expanded"] ?? state.open,
          "data-state":
            child.props["data-state"] ?? (state.open ? "open" : "closed"),
        });
      }

      return (
        <button
          aria-expanded={state.open}
          data-state={state.open ? "open" : "closed"}
        >
          {children}
        </button>
      );
    };

    return (
      <BaseMenu.Trigger
        {...props}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyDownCapture={handleKeyDownCapture}
        onMouseDown={handleMouseDown}
        nativeButton={nativeButton}
        ref={triggerRef}
        render={createTgphBaseUIRender(renderTriggerElement)}
      />
    );
  },
);
TriggerWithRef.displayName = "TriggerWithRef";

const Trigger = TriggerWithRef as (props: TriggerProps) => ReactElement | null;

const MenuPopupContent = ({
  children,
  contentRef,
  onOpenAutoFocus,
  popupState,
  tgphRef,
  ...props
}: MenuPopupContentProps) => {
  const localContentRef = useRef<HTMLElement>(null);
  const openAutoFocusHandledRef = useRef(false);
  const openAutoFocusAbortRef = useRef<AbortController | undefined>(undefined);
  const composedContentRef = useComposedRefs<HTMLElement>(
    tgphRef,
    contentRef,
    localContentRef,
  ) as Ref<HTMLElement>;

  useLayoutEffect(() => {
    const content = localContentRef.current;

    if (!popupState.open) {
      // Close is the teardown point for the bounce: abort here rather than from
      // an effect cleanup. A cleanup that aborted on every re-run would fight
      // the `openAutoFocusHandledRef` guard (which intentionally dispatches the
      // synthetic event only once per open, including under StrictMode's
      // setup→teardown→setup), leaving the bounce disarmed. On unmount the popup
      // node detaches and is collected with its listeners, so there is nothing
      // to leak.
      openAutoFocusHandledRef.current = false;
      openAutoFocusAbortRef.current?.abort();
      openAutoFocusAbortRef.current = undefined;

      return;
    }

    if (!content || !onOpenAutoFocus || openAutoFocusHandledRef.current) {
      return;
    }

    openAutoFocusHandledRef.current = true;

    const ownerDocument = content.ownerDocument;
    const previouslyFocusedElement = ownerDocument.activeElement;
    const event = new Event("openAutoFocus", { cancelable: true });
    onOpenAutoFocus(event);

    if (!event.defaultPrevented) {
      return;
    }

    const restoreTarget = getOpenAutoFocusRestoreTarget({
      focusedElementAfterHandler: ownerDocument.activeElement,
      previouslyFocusedElement,
    });

    if (!restoreTarget) {
      return;
    }

    // Permanent Radix-compat behavior. This implements the prevented-
    // `onOpenAutoFocus` contract consumers carried over from Radix: when the
    // handler calls `preventDefault()`, focus stays where it was instead of
    // moving into the popup. Base UI's MenuPopup hardcodes initial focus into the
    // popup and does not expose an `initialFocus` opt-out for menus — upstream
    // declined to add one because a typeable menu trigger is not the endorsed
    // pattern (the Autocomplete/Combobox engine is). New UI wanting a typeable
    // trigger should use `@telegraph/combobox`'s input-as-trigger arrangement;
    // this bounce is not a temporary shim, it stays as the Radix-compat contract.
    // Base UI's focus manager queues its move to the next animation frame, which
    // a `setTimeout(0)` restore loses the race to. Instead, bounce focus back the
    // instant Base UI's initial focus lands: focusing an element inside the popup
    // dispatches `focusin` here synchronously during Base UI's own `.focus()`
    // call, so re-asserting the intended target from that event wins with no
    // dependence on timer ordering.
    const abortController = new AbortController();
    openAutoFocusAbortRef.current = abortController;
    const { signal } = abortController;

    content.addEventListener(
      "focusin",
      () => {
        // Disarm before restoring: the focus manager attempts initial focus only
        // once, and any later move into the menu (navigation, selection) must be
        // allowed through. Restoring focus into the trigger's input does not trip
        // the focus manager's focus-out close logic because the trigger is a
        // related node.
        abortController.abort();

        if (ownerDocument.contains(restoreTarget)) {
          restoreTarget.focus();
        }
      },
      { signal },
    );

    const disarmOnIntentionalFocus = () => {
      // A pointer or key interaction inside the popup is a deliberate move into
      // the menu (clicking an item, ArrowDown navigation); stop guarding so the
      // focus it produces is allowed to stay.
      abortController.abort();
    };

    content.addEventListener("keydown", disarmOnIntentionalFocus, {
      capture: true,
      signal,
    });
    content.addEventListener("pointerdown", disarmOnIntentionalFocus, {
      capture: true,
      signal,
    });
  }, [onOpenAutoFocus, popupState.open]);

  return (
    <Stack
      {...props}
      data-state={popupState.open ? "open" : "closed"}
      tgphRef={composedContentRef as StackProps["tgphRef"]}
    >
      {children}
    </Stack>
  );
};

export type ContentProps<T extends TgphElement = "div"> = Partial<
  Omit<BaseMenuPositionerProps, "children" | "className" | "render" | "style">
> &
  Partial<
    Omit<BaseMenuPopupProps, "children" | "className" | "render" | "style">
  > &
  // Source the polymorphic element props from `PolymorphicProps<T>` and the
  // Stack style props from the *non-generic* Stack. Wrapping the generic
  // `typeof Stack<T>` in `Omit<…, "align">` produces a deferred mapped type,
  // and TypeScript then fails to compute a contextual type for the sibling
  // dismiss-handler callbacks below — their `event` param silently widens to
  // `any` at the JSX call site. That is exactly what let a stale Radix-shaped
  // handler reading `event.detail.originalEvent` compile and crash at runtime
  // (KNO-14309). Keeping the `Omit` off the generic makes each handler's
  // `event` resolve to its concrete `Event` type, so `.detail`/`.originalEvent`
  // access fails to compile.
  PolymorphicProps<T> &
  Omit<StackProps, "align" | "as"> & {
    avoidCollisions?: boolean;
    contentStackRef?: Ref<HTMLDivElement>;
    forceMount?: BaseMenuPortalProps["keepMounted"];
    hideWhenDetached?: boolean;
    onCloseAutoFocus?: LegacyDismissEventHandler;
    onEscapeKeyDown?: LegacyDismissHandlers["onEscapeKeyDown"];
    onFocusOutside?: LegacyDismissHandlers["onFocusOutside"];
    onInteractOutside?: LegacyDismissEventHandler;
    onOpenAutoFocus?: LegacyDismissEventHandler;
    onPointerDownOutside?: LegacyDismissHandlers["onPointerDownOutside"];
    skipAnimation?: boolean;
  };

const Content = <T extends TgphElement = "div">({
  align = "center",
  alignOffset,
  anchor,
  arrowPadding,
  avoidCollisions,
  bg = "surface-1",
  children,
  className,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  contentStackRef,
  direction = "column",
  disableAnchorTracking,
  finalFocus,
  forceMount,
  gap = "1",
  hideWhenDetached,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onFocusOutside,
  onInteractOutside,
  onKeyDown,
  onKeyDownCapture,
  onOpenAutoFocus,
  onPointerDownOutside,
  positionMethod,
  py = "1",
  rounded = "4",
  shadow = "2",
  side = "bottom",
  sideOffset = 4,
  // Accepted for API parity with Popover.Content. Menu's popup is not
  // motion-animated, so there is no open/close animation to skip; consume the
  // prop here so it does not leak onto the DOM node and trigger React's
  // "unknown prop" warning.
  skipAnimation: _skipAnimation,
  sticky,
  style,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  const compatibilityContext = useContext(MenuCompatibilityContext);
  const contentCallbacksScope = useContext(MenuContentScopeContext);
  const contentCallbacksIdRef = useRef(Symbol("menu-content-callbacks"));
  const internalContentRef = useRef<HTMLDivElement>(null);
  const contentRef = useComposedRefs<HTMLElement>(
    tgphRef as Ref<HTMLElement>,
    contentStackRef as Ref<HTMLElement>,
    internalContentRef as Ref<HTMLElement>,
  ) as Ref<HTMLElement>;
  const resolvedCollisionAvoidance =
    collisionAvoidance ??
    (avoidCollisions === false ? NO_COLLISION_AVOIDANCE : undefined);
  const resolvedFinalFocus =
    finalFocus ??
    (() => {
      if (!onCloseAutoFocus) {
        return true;
      }

      const event = new Event("closeAutoFocus", { cancelable: true });
      onCloseAutoFocus(event);

      // Radix used preventDefault on closeAutoFocus; Base UI wants a boolean
      // finalFocus result, so invert the same cancellation signal.
      return event.defaultPrevented ? false : true;
    });
  const stackProps = props as StackProps;

  useLayoutEffect(() => {
    if (!compatibilityContext) {
      return;
    }

    const contentCallbacksRef = compatibilityContext.contentCallbacksRef;
    const contentCallbacksId = contentCallbacksIdRef.current;

    // Register a stable slot immediately so root/submenu close events can find
    // this content even before the first callback-prop effect runs.
    upsertContentCallbacks(
      contentCallbacksRef,
      contentCallbacksId,
      contentCallbacksScope,
      {},
    );

    return () => {
      removeContentCallbacks(contentCallbacksRef, contentCallbacksId);
    };
  }, [compatibilityContext, contentCallbacksScope]);

  useLayoutEffect(() => {
    if (!compatibilityContext) {
      return;
    }

    // Keep the latest Radix-style dismiss callbacks in shared root state because
    // Base UI reports dismissal through Root/Submenu onOpenChange details.
    upsertContentCallbacks(
      compatibilityContext.contentCallbacksRef,
      contentCallbacksIdRef.current,
      contentCallbacksScope,
      {
        onEscapeKeyDown,
        onFocusOutside,
        onInteractOutside,
        onPointerDownOutside,
      },
    );
  }, [
    compatibilityContext,
    contentCallbacksScope,
    onEscapeKeyDown,
    onFocusOutside,
    onInteractOutside,
    onPointerDownOutside,
  ]);

  useEffect(() => {
    const ownerDocument = internalContentRef.current?.ownerDocument;

    if (!ownerDocument) {
      return;
    }

    // Base UI can insert focus guards after the popup surface commits, so label
    // them after each render and on the next tick before axe or screen readers see them.
    labelBaseUIFocusGuards(ownerDocument);

    const timeout = ownerDocument.defaultView?.setTimeout(() => {
      labelBaseUIFocusGuards(ownerDocument);
    }, 0);

    return () => {
      if (timeout !== undefined) {
        ownerDocument.defaultView?.clearTimeout(timeout);
      }
    };
  });

  return (
    <BaseMenu.Portal keepMounted={forceMount}>
      <BaseMenu.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        arrowPadding={arrowPadding}
        collisionAvoidance={resolvedCollisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        disableAnchorTracking={disableAnchorTracking}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
        style={(state) =>
          getBaseUIPositionerVisibilityStyle({
            anchorHidden: state.anchorHidden,
            hideWhenDetached,
            zIndex: "var(--tgph-zIndex-popover)",
          })
        }
      >
        <BaseMenu.Popup
          finalFocus={resolvedFinalFocus}
          render={createTgphBaseUIRender((state: MenuPopupRenderState) => (
            <MenuPopupContent
              bg={bg}
              className={["tgph", className].filter(Boolean).join(" ")}
              contentRef={contentRef}
              data-tgph-menu-content
              direction={direction}
              gap={gap}
              onOpenAutoFocus={onOpenAutoFocus}
              onKeyDown={(event: MenuContentKeyDownEvent) => {
                (onKeyDown as MenuContentKeyDownHandler | undefined)?.(event);

                if (!event.defaultPrevented) {
                  focusMenuItemFromContentKeyDown(event);
                }
              }}
              onKeyDownCapture={(event: MenuContentKeyDownEvent) => {
                (
                  onKeyDownCapture as
                    | MenuContentKeyDownCaptureHandler
                    | undefined
                )?.(event);

                if (!event.defaultPrevented) {
                  focusMenuItemFromNestedControlKeyDown(event);
                }
              }}
              popupState={state}
              rounded={rounded}
              py={py}
              shadow={shadow}
              style={{
                outline: "none",
                overflowY: "auto",
                transformOrigin: "var(--transform-origin)",
                ...RADIX_POPPER_COMPATIBILITY_VARS,
                ...style,
              }}
              zIndex="popover"
              {...stackProps}
            >
              <LazyMotion features={domAnimation}>{children}</LazyMotion>
            </MenuPopupContent>
          ))}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
};

// `MenuItemProps<T>`, not the bare form: bare `MenuItemProps` is
// `MenuItemProps<"button">`, whose `as?: "button"` intersects the `as?: T`
// below and collapses `T` to `"button"`, so `as={NextLink}` could never resolve.
type MenuButtonItemProps<T extends TgphElement = "button"> = RemappedOmit<
  MenuItemProps<T>,
  "onClick" | "onKeyDown" | "tgphRef" | "as"
>;

export type ButtonProps<T extends TgphElement = "button"> = Partial<
  Omit<
    BaseMenuItemProps,
    | "children"
    | "className"
    | "onClick"
    | "onKeyDown"
    | "onSelect"
    | "render"
    | "style"
  >
> &
  MenuButtonItemProps<T> & {
    as?: T;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: MenuButtonKeyDownEvent) => void;
    onSelect?: (event: Event) => void;
    tgphRef?: Ref<HTMLElement>;
  };

/**
 * Renders a Base UI menu item when nested in `Menu.Root`.
 *
 * Rendering `Menu.Button` without `Menu.Root` is supported for backwards
 * compatibility, but deprecated and scheduled for removal in a future major
 * release. In that arrangement it is only a styled action, so menu arrow-key
 * navigation (including from a combobox popup) will not reach it. Migrate popup
 * action rows to `Combobox.Option` with `onSelect` or to plain buttons.
 */
const Button = <T extends TgphElement = "button">({
  as,
  closeOnClick,
  disabled,
  mx = "1",
  icon,
  leadingIcon,
  label,
  trailingIcon,
  leadingComponent,
  trailingComponent,
  selected,
  tgphRef,
  onClick,
  onKeyDown,
  onSelect,
  nativeButton,
  ...props
}: ButtonProps<T>) => {
  const compatibilityContext = useContext(MenuCompatibilityContext);
  const combinedLeadingIcon = leadingIcon || icon;
  const itemRef = useRef<HTMLElement>(null);
  const menuItemProps = props as MenuItemProps<T>;
  // A caller rendering a component that resolves to a button can say so.
  const isNativeButton = resolveButtonNativeButton({
    as,
    disabled,
    nativeButton,
  });
  // Keyboard selection can arrive through React keydown, native keyup/click, or
  // Base UI internals; these refs dedupe those paths while preserving cancel.
  const ignoreNextKeyboardClickRef = useRef(false);
  const nativeKeyboardClickHandledRef = useRef(false);
  const nativeKeyboardSelectionPendingRef = useRef(false);
  const preventNextKeyboardCloseRef = useRef(false);
  const reactKeyboardSelectionHandledRef = useRef(false);
  // The timer is scheduled on the item's own `defaultView`, so its handle is a
  // DOM timeout id; the ambient `setTimeout` here resolves to Node's overload.
  const fallbackTimeoutRef = useRef<
    ReturnType<Window["setTimeout"]> | undefined
  >(undefined);
  const composedTgphRef = useComposedRefs<HTMLElement>(
    tgphRef,
    itemRef,
  ) as Ref<HTMLElement>;

  useEffect(() => {
    const item = itemRef.current;

    if (!item || disabled) {
      return;
    }

    const resetNativeKeyboardState = () => {
      nativeKeyboardClickHandledRef.current = false;
      nativeKeyboardSelectionPendingRef.current = false;
      reactKeyboardSelectionHandledRef.current = false;
    };
    const clearFallbackTimeout = () => {
      if (fallbackTimeoutRef.current !== undefined) {
        item.ownerDocument.defaultView?.clearTimeout(
          fallbackTimeoutRef.current,
        );
        fallbackTimeoutRef.current = undefined;
      }
    };
    const handleNativeKeyDown = (event: KeyboardEvent) => {
      if (MENU_SELECTION_KEYS.includes(event.key)) {
        // Mark the native keyboard path as pending until keyup tells us whether
        // React/Base UI handled the same selection first.
        nativeKeyboardClickHandledRef.current = false;
        nativeKeyboardSelectionPendingRef.current = true;
        reactKeyboardSelectionHandledRef.current = false;
      }
    };
    const handleNativeKeyUp = (event: KeyboardEvent) => {
      if (
        !MENU_SELECTION_KEYS.includes(event.key) ||
        !nativeKeyboardSelectionPendingRef.current
      ) {
        return;
      }

      clearFallbackTimeout();
      fallbackTimeoutRef.current = item.ownerDocument.defaultView?.setTimeout(
        () => {
          // Defer one tick so React keydown and Base UI selection can mark their
          // refs before the native fallback fires a duplicate selection.
          if (
            reactKeyboardSelectionHandledRef.current ||
            nativeKeyboardClickHandledRef.current
          ) {
            resetNativeKeyboardState();
            return;
          }

          if (onSelect) {
            onSelect(event);
            ignoreNextKeyboardClickRef.current = true;
            preventNextKeyboardCloseRef.current = event.defaultPrevented;
          }

          // Trigger the normal click path for parity with native button keyboard
          // activation after the legacy onSelect callback has had a chance to cancel.
          item.click();
          resetNativeKeyboardState();
        },
        0,
      );
    };

    item.addEventListener("keydown", handleNativeKeyDown);
    item.addEventListener("keyup", handleNativeKeyUp);

    return () => {
      clearFallbackTimeout();
      item.removeEventListener("keydown", handleNativeKeyDown);
      item.removeEventListener("keyup", handleNativeKeyUp);
    };
  }, [disabled, onSelect]);

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (event.detail === 0) {
      // Browsers synthesize detail=0 clicks for keyboard activation.
      nativeKeyboardClickHandledRef.current = true;
    }

    if (ignoreNextKeyboardClickRef.current && event.detail === 0) {
      ignoreNextKeyboardClickRef.current = false;
      if (preventNextKeyboardCloseRef.current) {
        (event as PreventableSyntheticEvent).preventBaseUIHandler?.();
      }
      preventNextKeyboardCloseRef.current = false;
      return;
    }

    ignoreNextKeyboardClickRef.current = false;
    preventNextKeyboardCloseRef.current = false;
    onClick?.(event);
    onSelect?.(event.nativeEvent);
    preventBaseUIHandlerWhenDefaultPrevented(event);
  };
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    const isSelectionKey = MENU_SELECTION_KEYS.includes(event.key);

    (onKeyDown as ((event: MenuButtonKeyDownEvent) => void) | undefined)?.(
      event as MenuButtonKeyDownEvent,
    );

    if (isSelectionKey) {
      reactKeyboardSelectionHandledRef.current = true;

      const keyDownPrevented =
        event.defaultPrevented || event.nativeEvent.defaultPrevented;

      if (!keyDownPrevented && onSelect !== (onKeyDown as unknown)) {
        // Preserve the old API where Enter/Space could invoke onSelect during
        // keydown, while avoiding double-calling when onKeyDown is the handler.
        onSelect?.(event.nativeEvent);
      }

      ignoreNextKeyboardClickRef.current = true;
      preventNextKeyboardCloseRef.current =
        keyDownPrevented ||
        event.defaultPrevented ||
        event.nativeEvent.defaultPrevented;
    }

    preventBaseUIHandlerWhenDefaultPrevented(event);
  };

  const renderedItem = (
    <MenuItem
      as={as}
      {...menuItemProps}
      onClick={handleClick as MenuItemProps<T>["onClick"]}
      // `MenuItemProps<"button">`: `onKeyDown` reaches MenuItem only through
      // the element passthrough, which is a deferred conditional while `T`
      // is unresolved and therefore not indexable.
      onKeyDown={handleKeyDown as MenuItemProps<"button">["onKeyDown"]}
      selected={selected}
      leadingIcon={combinedLeadingIcon}
      trailingIcon={trailingIcon}
      leadingComponent={leadingComponent}
      trailingComponent={trailingComponent}
      data-tgph-menu-button
      disabled={disabled}
      mx={mx}
      style={{
        outline: "none",
        flexShrink: 0,
        ...menuItemProps.style,
      }}
      tgphRef={composedTgphRef as MenuItemProps<T>["tgphRef"]}
    />
  );

  if (!compatibilityContext) {
    return renderedItem;
  }

  return (
    <BaseMenu.Item
      closeOnClick={closeOnClick}
      disabled={disabled}
      label={label}
      nativeButton={isNativeButton}
      render={createTgphBaseUIRender(renderedItem)}
    />
  );
};

export type SubProps = Partial<Omit<BaseMenuSubProps, "onOpenChange">> & {
  onOpenChange?: (open: boolean) => void;
};

const Sub = ({ children, onOpenChange, ...props }: SubProps) => {
  const compatibilityContext = useContext(MenuCompatibilityContext);
  const handleOpenChange = useCallback<
    NonNullable<BaseMenuSubProps["onOpenChange"]>
  >(
    (open, eventDetails) => {
      if (
        !open &&
        compatibilityContext &&
        callLatestContentDismissHandler(
          eventDetails,
          compatibilityContext.contentCallbacksRef,
          "submenu",
        )
      ) {
        // Submenu close should only honor submenu content callbacks, not root
        // callbacks, which matches Radix's scoped dismissal behavior.
        eventDetails.cancel();
        return;
      }

      onOpenChange?.(open);
    },
    [compatibilityContext, onOpenChange],
  );

  return (
    <BaseMenu.SubmenuRoot onOpenChange={handleOpenChange} {...props}>
      {children}
    </BaseMenu.SubmenuRoot>
  );
};

// `MenuItemProps<T>` and omitting `as`, for the reason given on
// `MenuButtonItemProps` above.
type MenuSubTriggerItemProps<T extends TgphElement = "button"> = RemappedOmit<
  MenuItemProps<T>,
  "onClick" | "tgphRef" | "as"
>;

export type SubTriggerProps<T extends TgphElement = "button"> = Partial<
  Omit<
    BaseMenuSubTriggerProps,
    "children" | "className" | "onClick" | "render" | "style"
  >
> &
  MenuSubTriggerItemProps<T> & {
    as?: T;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    tgphRef?: Ref<HTMLElement>;
  };

const SubTrigger = <T extends TgphElement = "button">({
  as,
  closeDelay,
  delay,
  disabled,
  mx = "1",
  icon,
  leadingIcon,
  label,
  trailingIcon,
  leadingComponent,
  trailingComponent,
  openOnHover,
  tgphRef,
  onClick,
  nativeButton,
  ...props
}: SubTriggerProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  const menuItemProps = props as MenuItemProps<T>;
  const isNativeButton = resolveButtonNativeButton({
    as,
    disabled,
    nativeButton,
  });
  const combinedTrailingIcon: typeof trailingIcon =
    trailingIcon === undefined && trailingComponent === undefined
      ? { icon: ChevronRight, "aria-hidden": true }
      : trailingIcon;
  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    onClick?.(event);
    preventBaseUIHandlerWhenDefaultPrevented(event);
  };

  return (
    <BaseMenu.SubmenuTrigger
      closeDelay={closeDelay}
      delay={delay}
      disabled={disabled}
      label={label}
      nativeButton={isNativeButton}
      openOnHover={openOnHover}
      render={createTgphBaseUIRender((state: MenuSubTriggerRenderState) => (
        <MenuItem
          as={as}
          {...menuItemProps}
          onClick={handleClick as MenuItemProps<T>["onClick"]}
          leadingIcon={combinedLeadingIcon}
          trailingIcon={combinedTrailingIcon}
          leadingComponent={leadingComponent}
          trailingComponent={trailingComponent}
          data-state={state.open ? "open" : "closed"}
          data-tgph-menu-button
          disabled={disabled}
          mx={mx}
          style={{
            outline: "none",
            flexShrink: 0,
            ...menuItemProps.style,
          }}
          tgphRef={tgphRef as MenuItemProps<T>["tgphRef"]}
        />
      ))}
    />
  );
};

export type SubContentProps<T extends TgphElement = "div"> = Omit<
  ContentProps<T>,
  "align" | "side"
>;

const SubContent = <T extends TgphElement = "div">({
  sideOffset = 0,
  ...props
}: SubContentProps<T>) => {
  return (
    <MenuContentScopeContext.Provider value="submenu">
      <Content align="start" side="right" sideOffset={sideOffset} {...props} />
    </MenuContentScopeContext.Provider>
  );
};

export type DividerProps<T extends TgphElement = "hr"> = BoxProps<T>;

const Divider = <T extends TgphElement = "hr">(
  dividerProps: DividerProps<T>,
) => {
  const {
    w = "full",
    borderBottom = "px",
    ...props
  } = dividerProps as DividerProps<"hr">;

  return <Box as="hr" w={w} borderBottom={borderBottom} {...props} />;
};

const Menu = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
  Button: typeof Button;
  Sub: typeof Sub;
  SubTrigger: typeof SubTrigger;
  SubContent: typeof SubContent;
  Divider: typeof Divider;
};

Object.assign(Menu, {
  Root,
  Trigger,
  Content,
  Button,
  Sub,
  SubTrigger,
  SubContent,
  Divider,
});

export { Menu };
