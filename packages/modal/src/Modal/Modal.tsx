import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Button } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type LegacyDismissEventHandler,
  type LegacyDismissHandlers,
  type PolymorphicProps,
  RefToTgphRef,
  RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
  VisuallyHidden,
  callLegacyDismissHandlers,
  createTgphBaseUIRender,
  useControllableState,
} from "@telegraph/helpers";
import { Box, Stack } from "@telegraph/layout";
import { Heading as TelegraphHeading } from "@telegraph/typography";
import { X } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type Ref,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";

import {
  type BaseUIPreventableEvent,
  callAutoFocusHandler,
  getStackedModalScale,
} from "./Modal.helpers";
import { useModalStacking } from "./ModalStacking";

const BASE_UI_OUTSIDE_PRESS_DISMISS_REASON = "outside-press";
const ROOT_OUTSIDE_DISMISS_SUPPRESSION_DELAY_MS = 100;
// The modal slides in from this many pixels above its resting position. Driven
// via translateY — a GPU-composited transform — rather than the `top` layout
// property, so the enter animation stays smooth even when the main thread is
// busy (e.g. a large list rendering as the modal opens). `top` would force a
// layout + paint every frame and snap under load. Matches the previous slide
// distance of one spacing-4 step (1rem).
const MODAL_ENTER_TRANSLATE_Y = -16;

type BaseDialogRootProps = ComponentProps<typeof BaseDialog.Root>;
type BaseDialogPopupProps = ComponentPropsWithoutRef<typeof BaseDialog.Popup>;
type BaseDialogCloseProps = ComponentPropsWithoutRef<typeof BaseDialog.Close>;

type LegacyFocusScopeProps = {
  loop?: boolean;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
  trapped?: boolean;
};

type ModalCompatibilityContextProps = {
  contentCallbacksRef: {
    current: LegacyDismissHandlers;
  };
  requestPointerDismiss: (event: BaseUIPreventableEvent) => void;
  rootFocusCallbacksRef: {
    current: Pick<
      LegacyFocusScopeProps,
      "onMountAutoFocus" | "onUnmountAutoFocus"
    >;
  };
};

type RootDialogProps = {
  children?: BaseDialogRootProps["children"];
  defaultOpen?: BaseDialogRootProps["defaultOpen"];
  open?: BaseDialogRootProps["open"];
  onOpenChange?: (open: boolean) => void;
};

const ModalCompatibilityContext =
  createContext<ModalCompatibilityContextProps | null>(null);

const bodyScrollLockLayers = new Set<string>();
let bodyScrollLockPreviousOverflow: string | undefined;

const lockBodyScroll = (layerId: string) => {
  if (typeof document === "undefined") {
    return;
  }

  if (bodyScrollLockLayers.size === 0) {
    bodyScrollLockPreviousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  bodyScrollLockLayers.add(layerId);
};

const unlockBodyScroll = (layerId: string) => {
  if (typeof document === "undefined") {
    return;
  }

  bodyScrollLockLayers.delete(layerId);

  if (bodyScrollLockLayers.size === 0) {
    document.body.style.overflow = bodyScrollLockPreviousOverflow ?? "";
    bodyScrollLockPreviousOverflow = undefined;
  }
};

const useBodyScrollLock = (layerId: string, enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Multiple non-trapped stacked dialogs can need the fallback lock at once.
    // Keep the body locked until the last owning layer releases it.
    lockBodyScroll(layerId);

    return () => {
      unlockBodyScroll(layerId);
    };
  }, [enabled, layerId]);
};

export type RootProps = RootDialogProps &
  LegacyFocusScopeProps &
  TgphComponentProps<typeof Stack> & {
    a11yTitle: string;
    a11yDescription?: string;
    layer?: number;
  };

const Root = ({
  defaultOpen: defaultOpenProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ...props
}: RootProps) => {
  const [open, onOpenChange] = useControllableState({
    prop: openProp,
    onChange: onOpenChangeProp,
    defaultProp: defaultOpenProp ?? false,
  });

  const stacking = useModalStacking();
  const stackId = useId();

  useEffect(() => {
    if (!open && stacking.layers.includes(stackId)) {
      stacking.removeLayer(stackId);
    }
  }, [stackId, stacking, open]);

  // Prevent rendering anything within the modal if it is not open
  if (!open) return;

  return (
    <RootComponent
      open={open}
      onOpenChange={onOpenChange}
      stackId={stackId}
      {...props}
    />
  );
};

type RootComponentProps = RootProps & {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  stackId: string;
};

const RootComponent = ({
  open,
  onOpenChange,
  stackId,
  a11yTitle,
  a11yDescription,
  children,
  // The previous Radix implementation accepted `loop` through FocusScope
  // types but did not wire it through. Keep consuming it as a no-op
  // compatibility prop so existing callers do not leak it to the DOM.
  loop: _loop,
  trapped,
  onMountAutoFocus,
  onUnmountAutoFocus,
  ...props
}: RootComponentProps) => {
  const layerId = stackId;
  const stacking = useModalStacking();
  const contentCallbacksRef = useRef<LegacyDismissHandlers>({});
  // Shared backdrop clicks can be translated into a manual stack close. Keep
  // this scoped to Base UI outside-press reports so it cannot cancel the next
  // unrelated Escape or close-button request.
  const suppressNextRootOutsideDismissRef = useRef(false);
  const rootFocusCallbacksRef = useRef<
    ModalCompatibilityContextProps["rootFocusCallbacksRef"]["current"]
  >({});

  // Keep the latest Root-level autofocus callbacks available to Content, where
  // Base UI actually asks for initial/final focus decisions.
  rootFocusCallbacksRef.current = {
    onMountAutoFocus,
    onUnmountAutoFocus,
  };

  useLayoutEffect(() => {
    if (!stacking || !open || stacking.layers.includes(layerId)) return;
    stacking.addLayer(layerId);
  }, [layerId, stacking, open]);

  const layerIndex = stacking.layers.indexOf(layerId);
  const layer = layerIndex === -1 ? 0 : layerIndex;
  const layersLength = stacking.layers?.length || 0;
  const isTopLayer =
    layersLength === 0 ||
    layerId === stacking.layers[stacking.layers.length - 1];
  const trappedFocus = typeof trapped === "boolean" ? trapped : isTopLayer;
  const shouldLockScroll = open && trapped === false;

  useBodyScrollLock(layerId, shouldLockScroll);

  const requestClose = useCallback(() => {
    const hasLayers = stacking?.layers?.length > 0;

    if (hasLayers) {
      if (layerId !== stacking.layers[stacking.layers.length - 1]) {
        // Non-top layers stay open when a shared backdrop event reaches them.
        return false;
      }

      // The modal stack owns layer bookkeeping; only then do we mirror the
      // close through Telegraph's public open state.
      stacking.removeLayer(layerId);
      onOpenChange(false);
      return true;
    }

    onOpenChange(false);
    return true;
  }, [layerId, onOpenChange, stacking]);
  const suppressNextRootOutsideDismiss = useCallback(() => {
    suppressNextRootOutsideDismissRef.current = true;

    globalThis.setTimeout(() => {
      suppressNextRootOutsideDismissRef.current = false;
    }, ROOT_OUTSIDE_DISMISS_SUPPRESSION_DELAY_MS);
  }, []);
  const closeFromPointerDismiss = useCallback(
    (event: BaseUIPreventableEvent) => {
      const nativeEvent = (event.nativeEvent ?? event) as Event;
      const legacyDismissPrevented = callLegacyDismissHandlers(
        {
          event: nativeEvent,
          reason: BASE_UI_OUTSIDE_PRESS_DISMISS_REASON,
        },
        contentCallbacksRef.current,
      );

      if (legacyDismissPrevented || event.defaultPrevented) {
        // Preserve Radix's cancelable outside-interaction callbacks and stop
        // Base UI from closing after legacy code has prevented dismissal.
        suppressNextRootOutsideDismiss();
        event.preventDefault();
        event.stopPropagation?.();
        event.preventBaseUIHandler?.();
        return false;
      }

      // We handle pointer dismissal through Telegraph's stack so only the top
      // modal closes and lower layers do not each process the same event.
      event.preventDefault();
      event.stopPropagation?.();
      event.preventBaseUIHandler?.();
      const didRequestClose = requestClose();

      if (didRequestClose) {
        suppressNextRootOutsideDismiss();
      }

      return didRequestClose;
    },
    [requestClose, suppressNextRootOutsideDismiss],
  );
  const requestPointerDismiss = useCallback(
    (event: BaseUIPreventableEvent) => {
      const nativeEvent = (event.nativeEvent ?? event) as Event;

      const hasLayers = stacking?.layers?.length > 0;

      // Base UI sees each dialog independently. Telegraph's stacked modal
      // backdrop is shared, so backdrop clicks need to close only the top layer.
      if (
        hasLayers &&
        layerId !== stacking.layers[stacking.layers.length - 1]
      ) {
        // A backdrop click can originate over a lower layer. Suppress every
        // non-top layer, then ask the stack to dismiss only the top layer.
        stacking.layers
          .filter(
            (currentLayerId) =>
              currentLayerId !== stacking.layers[stacking.layers.length - 1],
          )
          .forEach((currentLayerId) => {
            stacking.suppressNextDismissForLayer(currentLayerId);
          });
        stacking.ignorePointerDismissEvent(nativeEvent);
        stacking.dismissTopLayerWithPointer(nativeEvent);
        suppressNextRootOutsideDismiss();
        event.preventDefault();
        event.stopPropagation?.();
        event.preventBaseUIHandler?.();
        return;
      }

      closeFromPointerDismiss(event);
    },
    [
      closeFromPointerDismiss,
      layerId,
      stacking,
      suppressNextRootOutsideDismiss,
    ],
  );

  const handleOpenChange = useCallback<
    NonNullable<BaseDialogRootProps["onOpenChange"]>
  >(
    (value, eventDetails) => {
      if (
        !value &&
        eventDetails.reason === BASE_UI_OUTSIDE_PRESS_DISMISS_REASON &&
        suppressNextRootOutsideDismissRef.current
      ) {
        // requestPointerDismiss already handled this outside press.
        suppressNextRootOutsideDismissRef.current = false;
        eventDetails.cancel();
        return;
      }

      if (
        !value &&
        eventDetails.reason === BASE_UI_OUTSIDE_PRESS_DISMISS_REASON &&
        stacking.consumeSuppressedDismiss(layerId)
      ) {
        // Lower layers marked by the shared backdrop path should not react to
        // the same outside-press details from Base UI.
        eventDetails.cancel();
        return;
      }

      if (
        !value &&
        eventDetails.reason === BASE_UI_OUTSIDE_PRESS_DISMISS_REASON &&
        stacking.shouldIgnorePointerDismissEvent(eventDetails.event)
      ) {
        // The stack has already consumed this pointer event while dismissing the
        // top layer, so ignore duplicate root notifications.
        eventDetails.cancel();
        return;
      }

      const hasLayers = stacking?.layers?.length > 0;

      if (
        !value &&
        hasLayers &&
        layerId !== stacking.layers[stacking.layers.length - 1]
      ) {
        // Lower stacked layers are inert; cancel before running consumer
        // dismissal callbacks so only the active top layer sees Escape.
        eventDetails.cancel();
        return;
      }

      if (
        !value &&
        callLegacyDismissHandlers(eventDetails, contentCallbacksRef.current)
      ) {
        // Content-level legacy dismissal handlers still get final say on close.
        eventDetails.cancel();
        return;
      }

      if (hasLayers) {
        if (
          value === false &&
          layerId === stacking.layers[stacking.layers.length - 1]
        ) {
          stacking.removeLayer(layerId);
          onOpenChange(false);
          return;
        }

        if (value === false) {
          // A lower stacked layer should remain open if Base UI asks it to close
          // while a higher layer is still present.
          eventDetails.cancel();
        }

        return;
      }

      onOpenChange(value);
    },
    [layerId, onOpenChange, stacking],
  );

  useEffect(() => {
    return stacking.registerPointerDismissHandler(
      layerId,
      closeFromPointerDismiss,
    );
  }, [closeFromPointerDismiss, layerId, stacking]);

  return (
    <LazyMotion features={domAnimation}>
      <ModalCompatibilityContext.Provider
        value={{
          contentCallbacksRef,
          requestPointerDismiss,
          rootFocusCallbacksRef,
        }}
      >
        <BaseDialog.Root
          open={open}
          onOpenChange={handleOpenChange}
          modal={trappedFocus}
          disablePointerDismissal={!isTopLayer}
          key={layerId}
        >
          <VisuallyHidden>
            <BaseDialog.Title>{a11yTitle}</BaseDialog.Title>
            {a11yDescription && (
              <BaseDialog.Description>{a11yDescription}</BaseDialog.Description>
            )}
          </VisuallyHidden>
          {open && (
            // We add the className "tgph" here so that styles within
            // the portal get scoped properly to telegraph
            <BaseDialog.Portal className="tgph">
              <Overlay layer={layer}>
                <RefToTgphRef>
                  <Stack
                    as={motion.div}
                    initial={{ y: MODAL_ENTER_TRANSLATE_Y }}
                    animate={{ y: 0 }}
                    exit={{ y: MODAL_ENTER_TRANSLATE_Y }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    w="full"
                    justify="center"
                    style={{
                      position: "fixed",
                      // Resting position is static: each stacked layer sits one
                      // spacing-4 step lower. The slide-in is handled by the
                      // translateY animation above, so `top` never animates.
                      top: `calc(var(--tgph-spacing-16) + var(--tgph-spacing-4) * ${layer})`,
                      left: 0,
                      maxHeight: "calc(100vh - var(--tgph-spacing-32))",
                      maxWidth: "calc(100vw - var(--tgph-spacing-8))",
                      zIndex: `calc(var(--tgph-zIndex-modal) + ${layer})`,
                    }}
                    key={`container-${layerId}`}
                  >
                    <Stack
                      as={motion.div}
                      direction="column"
                      animate={{
                        scale: getStackedModalScale(layersLength, layer),
                      }}
                      transition={{
                        duration: 0.2,
                        bounce: 0,
                        type: "spring",
                      }}
                      maxW={props.maxW ?? "160"}
                      w={props.w ?? "full"}
                      bg="surface-1"
                      rounded="4"
                      shadow="3"
                      key={`content-${layerId}`}
                      {...props}
                    >
                      {children}
                    </Stack>
                  </Stack>
                </RefToTgphRef>
              </Overlay>
            </BaseDialog.Portal>
          )}
        </BaseDialog.Root>
      </ModalCompatibilityContext.Provider>
    </LazyMotion>
  );
};

export type OverlayProps = TgphComponentProps<typeof Box> & {
  layer: number;
};

const Overlay = ({ layer, children }: OverlayProps) => {
  const compatibilityContext = useContext(ModalCompatibilityContext);

  // If the layer is greater than 0, we don't want to show this
  // overlay as to not stack the overlays on top of each other.
  if (layer > 0) return children;

  return (
    <>
      <BaseDialog.Backdrop
        render={createTgphBaseUIRender(
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, bounce: 0, type: "spring" }}
            bg="alpha-black-6"
            w="full"
            h="full"
            zIndex="overlay"
            data-tgph-modal-overlay
            onPointerDownCapture={(event) => {
              compatibilityContext?.requestPointerDismiss(event);
            }}
            style={{
              position: "fixed",
              cursor: "pointer",
              inset: "0px",
            }}
          />,
        )}
      />
      {children}
    </>
  );
};

export type ContentProps = Partial<
  Omit<
    BaseDialogPopupProps,
    | "children"
    | "className"
    | "finalFocus"
    | "initialFocus"
    | "render"
    | "style"
  >
> &
  LegacyDismissHandlers & {
    onCloseAutoFocus?: LegacyDismissEventHandler;
    onOpenAutoFocus?: LegacyDismissEventHandler;
  } & TgphComponentProps<typeof Stack>;
type ContentRef = HTMLDivElement;

type ModalContentStackProps = TgphComponentProps<typeof Stack> & {
  tgphRef?: Ref<ContentRef>;
};

const ModalContentStack = forwardRef<ContentRef, ModalContentStackProps>(
  ({ tgphRef, ...props }, forwardedRef) => {
    const composedRef = useComposedRefs(forwardedRef, tgphRef);

    return <Stack tgphRef={composedRef} {...props} />;
  },
);

ModalContentStack.displayName = "ModalContentStack";

const Content = forwardRef<ContentRef, ContentProps>(
  (
    {
      children,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onFocusOutside,
      onInteractOutside,
      onOpenAutoFocus,
      onPointerDownOutside,
      ...props
    },
    forwardedRef,
  ) => {
    const compatibilityContext = useContext(ModalCompatibilityContext);
    const resolvedInitialFocus = useCallback(() => {
      // Combine Root and Content autofocus callbacks before converting their
      // Radix-style preventDefault result into Base UI's boolean focus API.
      const rootFocusPrevented = callAutoFocusHandler(
        compatibilityContext?.rootFocusCallbacksRef.current.onMountAutoFocus,
        "mountAutoFocus",
      );
      const contentFocusPrevented = callAutoFocusHandler(
        onOpenAutoFocus,
        "openAutoFocus",
      );

      return rootFocusPrevented || contentFocusPrevented ? false : true;
    }, [compatibilityContext, onOpenAutoFocus]);
    const resolvedFinalFocus = useCallback(() => {
      // Close autofocus follows the same Radix preventDefault contract as open
      // autofocus, but maps to Base UI's finalFocus callback.
      const rootFocusPrevented = callAutoFocusHandler(
        compatibilityContext?.rootFocusCallbacksRef.current.onUnmountAutoFocus,
        "unmountAutoFocus",
      );
      const contentFocusPrevented = callAutoFocusHandler(
        onCloseAutoFocus,
        "closeAutoFocus",
      );

      return rootFocusPrevented || contentFocusPrevented ? false : true;
    }, [compatibilityContext, onCloseAutoFocus]);

    useEffect(() => {
      if (!compatibilityContext) {
        return;
      }

      // Store the latest content dismiss callbacks where Root can consult them
      // from Base UI's single onOpenChange details callback.
      compatibilityContext.contentCallbacksRef.current = {
        onEscapeKeyDown,
        onFocusOutside,
        onInteractOutside,
        onPointerDownOutside,
      };

      return () => {
        compatibilityContext.contentCallbacksRef.current = {};
      };
    }, [
      compatibilityContext,
      onEscapeKeyDown,
      onFocusOutside,
      onInteractOutside,
      onPointerDownOutside,
    ]);

    return (
      <BaseDialog.Popup
        ref={forwardedRef}
        initialFocus={resolvedInitialFocus}
        finalFocus={resolvedFinalFocus}
        render={createTgphBaseUIRender(
          <ModalContentStack direction="column" h="full" {...props}>
            {children}
          </ModalContentStack>,
        )}
      />
    );
  },
);

export type CloseProps<T extends TgphElement = "button"> = TgphComponentProps<
  typeof Button<T>
> &
  Omit<BaseDialogCloseProps, "children" | "color" | "render">;
const Close = <T extends TgphElement = "button">({
  disabled,
  onClick,
  size = "1",
  variant = "ghost",
  ...props
}: CloseProps<T>) => {
  const handleClick = useCallback(
    (event: BaseUIPreventableEvent) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        // Prevented custom close clicks should also opt out of Base UI's close
        // handler, matching Radix Close asChild behavior.
        event.preventBaseUIHandler?.();
      }
    },
    [onClick],
  );

  return (
    <BaseDialog.Close
      disabled={disabled}
      render={createTgphBaseUIRender(
        <Button
          disabled={disabled}
          icon={{ icon: X, alt: "Close Modal" }}
          onClick={handleClick}
          variant={variant}
          size={size}
          {...props}
        />,
      )}
    />
  );
};

export type BodyProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<TgphComponentProps<typeof Stack>, "as">;

const Body = <T extends TgphElement = "div">({
  style,
  children,
  ...props
}: BodyProps<T>) => {
  return (
    <Stack
      direction="column"
      px="6"
      py="4"
      style={{
        overflowY: "auto",
        ...style,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

export type HeaderProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<TgphComponentProps<typeof Stack>, "as">;

const Header = <T extends TgphElement = "div">({
  children,
  ...props
}: HeaderProps<T>) => {
  return (
    <Stack
      direction="row"
      justify="space-between"
      align="center"
      px="6"
      py="4"
      borderBottom="px"
      {...props}
    >
      {children}
    </Stack>
  );
};

export type FooterProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<TgphComponentProps<typeof Stack>, "as">;

const Footer = <T extends TgphElement = "div">({
  children,
  ...props
}: FooterProps<T>) => {
  return (
    <Stack
      direction="row"
      align="center"
      justify="flex-end"
      gap="2"
      px="6"
      py="4"
      borderTop="px"
      {...props}
    >
      {children}
    </Stack>
  );
};

type HeadingProps<T extends TgphElement> = RemappedOmit<
  TgphComponentProps<typeof TelegraphHeading<T>>,
  "as"
> & {
  as?: T;
};

const Heading = <T extends TgphElement = "h2">({
  as,
  size = "3",
  weight = "medium",
  ...props
}: HeadingProps<T>) => {
  const headingProps = {
    as: (as || "h2") as T,
    size,
    weight,
    ...props,
  } as TgphComponentProps<typeof TelegraphHeading<T>>;

  return <TelegraphHeading {...headingProps} />;
};

const Modal = {} as {
  Root: typeof Root;
  Content: typeof Content;
  Close: typeof Close;
  Body: typeof Body;
  Header: typeof Header;
  Footer: typeof Footer;
  Heading: typeof Heading;
};

Object.assign(Modal, {
  Root,
  Content,
  Close,
  Body,
  Header,
  Footer,
  Heading,
});

export { Modal };
