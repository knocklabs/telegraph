import { Menu as BaseMenu } from "@base-ui/react/menu";
import {
  type TgphComponentProps,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
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
  type LegacyContentCallbacks,
  type LegacyDismissEventHandler,
  MENU_SELECTION_KEYS,
  type MenuButtonKeyDownEvent,
  type MenuContentCallbacksEntry,
  type MenuContentCallbacksRef,
  type MenuContentKeyDownEvent,
  NO_COLLISION_AVOIDANCE,
  type PreventableSyntheticEvent,
  RADIX_POPPER_COMPATIBILITY_VARS,
  callLegacyDismissHandlers,
  composeRefs,
  focusMenuItemFromContentKeyDown,
  focusMenuItemFromNestedControlKeyDown,
  focusMenuItemFromOpenTriggerKeyDown,
  getPositionerStyle,
  getRootContentCallbacks,
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

const Root = ({ children, onOpenChange, ...props }: RootProps) => {
  const contentCallbacksRef = useRef<MenuContentCallbacksEntry[]>([]);
  const handleOpenChange = useCallback<
    NonNullable<BaseMenuRootProps["onOpenChange"]>
  >(
    (open, eventDetails) => {
      if (
        !open &&
        callLegacyDismissHandlers(
          eventDetails,
          getRootContentCallbacks(contentCallbacksRef),
        )
      ) {
        eventDetails.cancel();
        return;
      }

      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  return (
    <MenuCompatibilityContext.Provider value={{ contentCallbacksRef }}>
      <BaseMenu.Root onOpenChange={handleOpenChange} {...props}>
        {children}
      </BaseMenu.Root>
    </MenuCompatibilityContext.Provider>
  );
};

type BaseMenuTriggerCompatibilityProps = Pick<
  BaseMenuTriggerProps,
  | "closeDelay"
  | "delay"
  | "disabled"
  | "handle"
  | "nativeButton"
  | "openOnHover"
  | "payload"
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
      tgphRef,
      ...props
    },
    forwardedRef,
  ) => {
    const triggerRef = composeRefs(
      forwardedRef,
      tgphRef as Ref<HTMLElement> | undefined,
    );
    const shouldSuppressBaseMouseDown = Boolean(onClick);
    const handleClick = useCallback<
      NonNullable<BaseMenuTriggerProps["onClick"]>
    >(
      (event) => {
        onClick?.(event);

        if (event.defaultPrevented) {
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
          focusMenuItemFromOpenTriggerKeyDown(event);
          event.preventBaseUIHandler?.();
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
        ref={triggerRef}
        render={createTgphBaseUIRender(renderTriggerElement)}
      />
    );
  },
);

const Trigger = TriggerWithRef as (props: TriggerProps) => ReactElement | null;

export type ContentProps<T extends TgphElement = "div"> = Omit<
  BaseMenuPositionerProps,
  "children" | "className" | "render" | "style"
> &
  Omit<BaseMenuPopupProps, "children" | "className" | "render" | "style"> &
  Omit<TgphComponentProps<typeof Stack<T>>, "align"> & {
    avoidCollisions?: boolean;
    contentStackRef?: Ref<HTMLDivElement>;
    forceMount?: BaseMenuPortalProps["keepMounted"];
    hideWhenDetached?: boolean;
    onCloseAutoFocus?: LegacyDismissEventHandler;
    onEscapeKeyDown?: LegacyContentCallbacks["onEscapeKeyDown"];
    onFocusOutside?: LegacyContentCallbacks["onFocusOutside"];
    onInteractOutside?: LegacyDismissEventHandler;
    onOpenAutoFocus?: LegacyDismissEventHandler;
    onPointerDownOutside?: LegacyContentCallbacks["onPointerDownOutside"];
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
  sticky,
  style,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  const compatibilityContext = useContext(MenuCompatibilityContext);
  const contentCallbacksIdRef = useRef(Symbol("menu-content-callbacks"));
  const internalContentRef = useRef<HTMLDivElement>(null);
  const contentRef = composeRefs(tgphRef, contentStackRef, internalContentRef);
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

      return event.defaultPrevented ? false : true;
    });

  useLayoutEffect(() => {
    if (!compatibilityContext) {
      return;
    }

    const contentCallbacksRef = compatibilityContext.contentCallbacksRef;
    const contentCallbacksId = contentCallbacksIdRef.current;

    upsertContentCallbacks(contentCallbacksRef, contentCallbacksId, {});

    return () => {
      removeContentCallbacks(contentCallbacksRef, contentCallbacksId);
    };
  }, [compatibilityContext]);

  useLayoutEffect(() => {
    if (!compatibilityContext) {
      return;
    }

    upsertContentCallbacks(
      compatibilityContext.contentCallbacksRef,
      contentCallbacksIdRef.current,
      {
        onCloseAutoFocus,
        onEscapeKeyDown,
        onFocusOutside,
        onInteractOutside,
        onOpenAutoFocus,
        onPointerDownOutside,
      },
    );
  }, [
    compatibilityContext,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onFocusOutside,
    onInteractOutside,
    onOpenAutoFocus,
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
          getPositionerStyle({
            anchorHidden: state.anchorHidden,
            hideWhenDetached,
          })
        }
      >
        <BaseMenu.Popup
          finalFocus={resolvedFinalFocus}
          render={createTgphBaseUIRender((state: MenuPopupRenderState) => (
            <Stack
              bg={bg}
              className={["tgph", className].filter(Boolean).join(" ")}
              data-state={state.open ? "open" : "closed"}
              data-tgph-menu-content
              direction={direction}
              gap={gap}
              onKeyDown={(event) => {
                (onKeyDown as MenuContentKeyDownHandler | undefined)?.(event);

                if (!event.defaultPrevented) {
                  focusMenuItemFromContentKeyDown(event);
                }
              }}
              onKeyDownCapture={(event) => {
                (
                  onKeyDownCapture as
                    | MenuContentKeyDownCaptureHandler
                    | undefined
                )?.(event);

                if (!event.defaultPrevented) {
                  focusMenuItemFromNestedControlKeyDown(event);
                }
              }}
              rounded={rounded}
              py={py}
              shadow={shadow}
              style={{
                overflowY: "auto",
                transformOrigin: "var(--transform-origin)",
                ...RADIX_POPPER_COMPATIBILITY_VARS,
                ...style,
              }}
              tgphRef={contentRef}
              zIndex="popover"
              {...props}
            >
              <LazyMotion features={domAnimation}>{children}</LazyMotion>
            </Stack>
          ))}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
};

type MenuButtonItemProps = Omit<
  MenuItemProps,
  "onClick" | "onKeyDown" | "tgphRef"
>;

export type ButtonProps<T extends TgphElement = "button"> = Omit<
  BaseMenuItemProps,
  | "children"
  | "className"
  | "onClick"
  | "onKeyDown"
  | "onSelect"
  | "render"
  | "style"
> &
  MenuButtonItemProps & {
    as?: T;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: MenuButtonKeyDownEvent) => void;
    onSelect?: (event: Event) => void;
    tgphRef?: Ref<HTMLElement>;
  };

const Button = <T extends TgphElement = "button">({
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
  nativeButton = true,
  ...props
}: ButtonProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  const itemRef = useRef<HTMLElement>(null);
  const menuItemProps = props as MenuItemProps<T>;
  const ignoreNextKeyboardClickRef = useRef(false);
  const nativeKeyboardClickHandledRef = useRef(false);
  const nativeKeyboardSelectionPendingRef = useRef(false);
  const preventNextKeyboardCloseRef = useRef(false);
  const reactKeyboardSelectionHandledRef = useRef(false);
  const composedTgphRef = composeRefs(
    tgphRef as Ref<HTMLElement> | undefined,
    itemRef,
  );

  useEffect(() => {
    const item = itemRef.current;

    if (!item || disabled) {
      return;
    }

    let fallbackTimeout: ReturnType<typeof setTimeout> | undefined;
    const resetNativeKeyboardState = () => {
      nativeKeyboardClickHandledRef.current = false;
      nativeKeyboardSelectionPendingRef.current = false;
      reactKeyboardSelectionHandledRef.current = false;
    };
    const clearFallbackTimeout = () => {
      if (fallbackTimeout !== undefined) {
        item.ownerDocument.defaultView?.clearTimeout(fallbackTimeout);
        fallbackTimeout = undefined;
      }
    };
    const handleNativeKeyDown = (event: KeyboardEvent) => {
      if (MENU_SELECTION_KEYS.includes(event.key)) {
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
      fallbackTimeout = item.ownerDocument.defaultView?.setTimeout(() => {
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

        item.click();
        resetNativeKeyboardState();
      }, 0);
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

      if (!keyDownPrevented) {
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

  return (
    <BaseMenu.Item
      closeOnClick={closeOnClick}
      disabled={disabled}
      label={label}
      nativeButton={nativeButton}
      render={createTgphBaseUIRender(
        <MenuItem<T>
          {...menuItemProps}
          onClick={handleClick as MenuItemProps<T>["onClick"]}
          onKeyDown={handleKeyDown as MenuItemProps<T>["onKeyDown"]}
          selected={selected}
          leadingIcon={combinedLeadingIcon}
          trailingIcon={trailingIcon}
          leadingComponent={leadingComponent}
          trailingComponent={trailingComponent}
          data-tgph-menu-button
          disabled={disabled}
          mx={mx}
          style={{
            flexShrink: 0,
            ...menuItemProps.style,
          }}
          tgphRef={composedTgphRef as MenuItemProps<T>["tgphRef"]}
        />,
      )}
    />
  );
};

export type SubProps = Omit<BaseMenuSubProps, "onOpenChange"> & {
  onOpenChange?: (open: boolean) => void;
};

const Sub = ({ children, onOpenChange, ...props }: SubProps) => {
  const handleOpenChange = useCallback<
    NonNullable<BaseMenuSubProps["onOpenChange"]>
  >(
    (open) => {
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  return (
    <BaseMenu.SubmenuRoot onOpenChange={handleOpenChange} {...props}>
      {children}
    </BaseMenu.SubmenuRoot>
  );
};

type MenuSubTriggerItemProps = Omit<MenuItemProps, "onClick" | "tgphRef">;

export type SubTriggerProps<T extends TgphElement = "button"> = Omit<
  BaseMenuSubTriggerProps,
  "children" | "className" | "onClick" | "render" | "style"
> &
  MenuSubTriggerItemProps & {
    as?: T;
    onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
    tgphRef?: Ref<HTMLElement>;
  };

const SubTrigger = <T extends TgphElement = "button">({
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
  nativeButton = true,
  ...props
}: SubTriggerProps<T>) => {
  const combinedLeadingIcon = leadingIcon || icon;
  const menuItemProps = props as MenuItemProps<T>;
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
      nativeButton={nativeButton}
      openOnHover={openOnHover}
      render={createTgphBaseUIRender((state: MenuSubTriggerRenderState) => (
        <MenuItem<T>
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
    <Content align="start" side="right" sideOffset={sideOffset} {...props} />
  );
};

export type DividerProps = TgphComponentProps<typeof Box>;

const Divider = ({
  w = "full",
  borderBottom = "px",
  ...props
}: DividerProps) => {
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
