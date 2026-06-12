import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Button } from "@telegraph/button";
import {
  type PolymorphicProps,
  RefToTgphRef,
  RemappedOmit,
  type TgphComponentProps,
  type TgphElement,
  VisuallyHidden,
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
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  BASE_UI_DISMISS_REASONS,
  type BaseUIPreventableEvent,
  type LegacyContentCallbacks,
  callAutoFocusHandler,
  callLegacyDismissHandlers,
  callLegacyEventHandler,
} from "./Modal.helpers";
import { useModalStacking } from "./ModalStacking";

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
    current: LegacyContentCallbacks;
  };
  requestClose: () => void;
  requestPointerDismiss: (event: BaseUIPreventableEvent) => void;
  rootFocusCallbacksRef: {
    current: Pick<
      LegacyFocusScopeProps,
      "onMountAutoFocus" | "onUnmountAutoFocus"
    >;
  };
};

type RootDialogProps = Pick<
  BaseDialogRootProps,
  "children" | "defaultOpen" | "open"
> & {
  onOpenChange?: (open: boolean) => void;
};

const ModalCompatibilityContext =
  createContext<ModalCompatibilityContextProps | null>(null);

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
  const id = props.a11yTitle;

  useEffect(() => {
    if (!open && stacking.layers.includes(id)) {
      stacking.removeLayer(id);
    }
  }, [id, stacking, open]);

  // Prevent rendering anything within the modal if it is not open
  if (!open) return;

  return <RootComponent open={open} onOpenChange={onOpenChange} {...props} />;
};

type RootComponentProps = RootProps & {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const RootComponent = ({
  open,
  onOpenChange,
  a11yTitle,
  a11yDescription,
  children,
  loop: _loop,
  trapped,
  onMountAutoFocus,
  onUnmountAutoFocus,
  ...props
}: RootComponentProps) => {
  // We use the a11yTitle as the id for the modal as it is unique
  // and can be used to identify the modal in the stacking context.
  // Without the need to generate a random id and manage between
  // different modal rendering patterns.
  const id = a11yTitle;
  const stacking = useModalStacking();
  const contentCallbacksRef = useRef<LegacyContentCallbacks>({});
  const suppressNextRootDismissRef = useRef(false);
  const rootFocusCallbacksRef = useRef<
    ModalCompatibilityContextProps["rootFocusCallbacksRef"]["current"]
  >({});

  rootFocusCallbacksRef.current = {
    onMountAutoFocus,
    onUnmountAutoFocus,
  };

  useEffect(() => {
    if (!stacking || !open || stacking.layers.includes(id)) return;
    stacking.addLayer(id);
  }, [id, stacking, open]);

  const layer = stacking.layers?.indexOf(id) || 0;
  const layersLength = stacking.layers?.length || 0;
  const isStacked = layer !== 0;
  const isTopLayer =
    layersLength === 0 || id === stacking.layers[stacking.layers.length - 1];
  const trappedFocus = typeof trapped === "boolean" ? trapped : isTopLayer;
  const requestClose = useCallback(() => {
    const hasLayers = stacking?.layers?.length > 0;

    if (hasLayers) {
      if (id !== stacking.layers[stacking.layers.length - 1]) {
        return;
      }

      stacking.removeLayer(id);
      onOpenChange(false);
      return;
    }

    onOpenChange(false);
  }, [id, onOpenChange, stacking]);
  const closeFromPointerDismiss = useCallback(
    (event: BaseUIPreventableEvent) => {
      const nativeEvent = (event.nativeEvent ?? event) as Event;
      const callbacks = contentCallbacksRef.current;
      const pointerDismissPrevented = callLegacyEventHandler(
        callbacks.onPointerDownOutside,
        nativeEvent as MouseEvent | PointerEvent | TouchEvent,
      );
      const interactDismissPrevented = callLegacyEventHandler(
        callbacks.onInteractOutside,
        nativeEvent,
      );

      if (
        pointerDismissPrevented ||
        interactDismissPrevented ||
        event.defaultPrevented
      ) {
        event.preventDefault();
        event.stopPropagation?.();
        event.preventBaseUIHandler?.();
        return;
      }

      event.preventDefault();
      event.stopPropagation?.();
      event.preventBaseUIHandler?.();
      requestClose();
    },
    [requestClose],
  );
  const requestPointerDismiss = useCallback(
    (event: BaseUIPreventableEvent) => {
      const nativeEvent = (event.nativeEvent ?? event) as Event;

      suppressNextRootDismissRef.current = true;

      const hasLayers = stacking?.layers?.length > 0;

      if (hasLayers && id !== stacking.layers[stacking.layers.length - 1]) {
        stacking.layers
          .filter(
            (layerId) =>
              layerId !== stacking.layers[stacking.layers.length - 1],
          )
          .forEach((layerId) => {
            stacking.suppressNextDismissForLayer(layerId);
          });
        stacking.ignorePointerDismissEvent(nativeEvent);
        stacking.dismissTopLayerWithPointer(nativeEvent);
        event.preventDefault();
        event.stopPropagation?.();
        event.preventBaseUIHandler?.();
        return;
      }

      closeFromPointerDismiss(event);
    },
    [closeFromPointerDismiss, id, stacking],
  );

  const handleOpenChange = useCallback<
    NonNullable<BaseDialogRootProps["onOpenChange"]>
  >(
    (value, eventDetails) => {
      if (!value && suppressNextRootDismissRef.current) {
        suppressNextRootDismissRef.current = false;
        eventDetails.cancel();
        return;
      }

      if (
        !value &&
        eventDetails.reason === BASE_UI_DISMISS_REASONS.outsidePress &&
        stacking.consumeSuppressedDismiss(id)
      ) {
        eventDetails.cancel();
        return;
      }

      if (
        !value &&
        eventDetails.reason === BASE_UI_DISMISS_REASONS.outsidePress &&
        stacking.shouldIgnorePointerDismissEvent(eventDetails.event)
      ) {
        eventDetails.cancel();
        return;
      }

      if (
        !value &&
        callLegacyDismissHandlers(eventDetails, contentCallbacksRef.current)
      ) {
        eventDetails.cancel();
        return;
      }

      const hasLayers = stacking?.layers?.length > 0;

      if (hasLayers) {
        if (
          value === false &&
          id === stacking.layers[stacking.layers.length - 1]
        ) {
          stacking.removeLayer(id);
          onOpenChange(false);
          return;
        }

        if (value === false) {
          eventDetails.cancel();
        }

        return;
      }

      onOpenChange(value);
    },
    [id, onOpenChange, stacking],
  );

  useEffect(() => {
    return stacking.registerPointerDismissHandler(id, closeFromPointerDismiss);
  }, [closeFromPointerDismiss, id, stacking]);

  return (
    <LazyMotion features={domAnimation}>
      <ModalCompatibilityContext.Provider
        value={{
          contentCallbacksRef,
          requestClose,
          requestPointerDismiss,
          rootFocusCallbacksRef,
        }}
      >
        <BaseDialog.Root
          open={open}
          onOpenChange={handleOpenChange}
          modal={trappedFocus}
          disablePointerDismissal={!isTopLayer}
          key={id}
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
                    initial={{
                      top: `calc(var(--tgph-spacing-16) + var(--tgph-spacing-4) * ${layersLength - 1})`,
                    }}
                    animate={{
                      top: isStacked
                        ? `calc(var(--tgph-spacing-16) + var(--tgph-spacing-4) * ${layer} )`
                        : "var(--tgph-spacing-16)",
                    }}
                    exit={{ top: 0 }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    w="full"
                    justify="center"
                    style={{
                      position: "fixed",
                      left: 0,
                      maxHeight: "calc(100vh - var(--tgph-spacing-32))",
                      maxWidth: "calc(100vw - var(--tgph-spacing-8))",
                      zIndex: `calc(var(--tgph-zIndex-modal) + ${layer})`,
                    }}
                    key={`container-${id}`}
                  >
                    <Stack
                      as={motion.div}
                      direction="column"
                      animate={{
                        scale: 1.02 - Math.abs(layersLength - layer) * 0.02,
                        transformOrigin: "50% 50%",
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
                      key={`content-${id}`}
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

export type ContentProps = Omit<
  BaseDialogPopupProps,
  "children" | "className" | "finalFocus" | "initialFocus" | "render" | "style"
> &
  LegacyContentCallbacks &
  TgphComponentProps<typeof Stack>;
type ContentRef = HTMLDivElement;

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

      compatibilityContext.contentCallbacksRef.current = {
        onCloseAutoFocus,
        onEscapeKeyDown,
        onFocusOutside,
        onInteractOutside,
        onOpenAutoFocus,
        onPointerDownOutside,
      };

      return () => {
        compatibilityContext.contentCallbacksRef.current = {};
      };
    }, [
      compatibilityContext,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onFocusOutside,
      onInteractOutside,
      onOpenAutoFocus,
      onPointerDownOutside,
    ]);

    return (
      <BaseDialog.Popup
        ref={forwardedRef}
        initialFocus={resolvedInitialFocus}
        finalFocus={resolvedFinalFocus}
        render={createTgphBaseUIRender(
          <Stack direction="column" h="full" {...props}>
            {children}
          </Stack>,
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
  const compatibilityContext = useContext(ModalCompatibilityContext);
  const handleClick = useCallback(
    (event: BaseUIPreventableEvent) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        event.preventBaseUIHandler?.();
        return;
      }

      event.preventBaseUIHandler?.();
      compatibilityContext?.requestClose();
    },
    [compatibilityContext, onClick],
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
