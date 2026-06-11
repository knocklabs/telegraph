import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  type TgphComponentProps,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  type Ref,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  type LegacyContentCallbacks,
  type LegacyDismissEventHandler,
  callLegacyDismissHandlers,
  composeRefs,
  getMotionOffsetBySide,
} from "./Popover.helpers";

type BasePopoverRootProps = ComponentProps<typeof BasePopover.Root>;
type BasePopoverTriggerProps = ComponentPropsWithoutRef<
  typeof BasePopover.Trigger
>;
type BasePopoverPositionerProps = ComponentPropsWithoutRef<
  typeof BasePopover.Positioner
>;
type BasePopoverPopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;

export type RootProps = Omit<BasePopoverRootProps, "onOpenChange"> & {
  onOpenChange?: (open: boolean) => void;
};

type PopoverCompatibilityContextProps = {
  contentCallbacksRef: {
    current: LegacyContentCallbacks;
  };
};

type PopoverPopupRenderState = {
  open: boolean;
};

const PopoverCompatibilityContext =
  createContext<PopoverCompatibilityContextProps | null>(null);

const Root = ({ children, onOpenChange, ...props }: RootProps) => {
  const contentCallbacksRef = useRef<LegacyContentCallbacks>({});
  const handleOpenChange = useCallback<
    NonNullable<BasePopoverRootProps["onOpenChange"]>
  >(
    (open, eventDetails) => {
      if (
        !open &&
        callLegacyDismissHandlers(eventDetails, contentCallbacksRef.current)
      ) {
        eventDetails.cancel();
        return;
      }

      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  return (
    <LazyMotion features={domAnimation}>
      <PopoverCompatibilityContext.Provider value={{ contentCallbacksRef }}>
        <BasePopover.Root onOpenChange={handleOpenChange} {...props}>
          {children}
        </BasePopover.Root>
      </PopoverCompatibilityContext.Provider>
    </LazyMotion>
  );
};

export type TriggerProps = Omit<BasePopoverTriggerProps, "render"> & {
  asChild?: boolean;
  children?: ReactNode;
  tgphRef?: Ref<HTMLButtonElement>;
};

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ asChild = true, tgphRef, children, ...props }, forwardedRef) => {
    const triggerRef = composeRefs(forwardedRef, tgphRef);

    if (!asChild || !isValidElement(children)) {
      return (
        <BasePopover.Trigger {...props} ref={triggerRef}>
          {children}
        </BasePopover.Trigger>
      );
    }

    return (
      <BasePopover.Trigger
        {...props}
        ref={triggerRef}
        render={createTgphBaseUIRender(children as ReactElement)}
      />
    );
  },
);

export type ContentProps<T extends TgphElement = "div"> = Omit<
  BasePopoverPositionerProps,
  "children" | "className" | "render"
> &
  Omit<BasePopoverPopupProps, "children" | "className" | "render" | "style"> &
  Omit<TgphComponentProps<typeof Stack<T>>, "align"> & {
    contentStackRef?: Ref<HTMLDivElement>;
    forceMount?: boolean;
    onCloseAutoFocus?: LegacyDismissEventHandler;
    onEscapeKeyDown?: LegacyContentCallbacks["onEscapeKeyDown"];
    onFocusOutside?: LegacyContentCallbacks["onFocusOutside"];
    onInteractOutside?: LegacyDismissEventHandler;
    onOpenAutoFocus?: LegacyDismissEventHandler;
    onPointerDownOutside?: LegacyContentCallbacks["onPointerDownOutside"];
    skipAnimation?: boolean;
  };

const Content = <T extends TgphElement = "div">({
  align = "center",
  alignOffset,
  anchor,
  arrowPadding,
  children,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  contentStackRef,
  direction = "column",
  disableAnchorTracking,
  finalFocus,
  forceMount,
  gap = "1",
  initialFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onFocusOutside,
  onInteractOutside,
  onOpenAutoFocus,
  onPointerDownOutside,
  positionMethod,
  rounded = "4",
  py = "1",
  shadow = "2",
  side = "bottom",
  sideOffset = 4,
  skipAnimation,
  sticky,
  bg = "surface-1",
  tgphRef,
  style,
  ...props
}: ContentProps<T>) => {
  const compatibilityContext = useContext(PopoverCompatibilityContext);
  const contentRef = composeRefs(tgphRef, contentStackRef);
  const resolvedInitialFocus =
    initialFocus ??
    (() => {
      if (!onOpenAutoFocus) {
        return true;
      }

      const event = new Event("openAutoFocus", { cancelable: true });
      onOpenAutoFocus(event);

      return event.defaultPrevented ? false : true;
    });
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
    <BasePopover.Portal keepMounted={forceMount}>
      <BasePopover.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        arrowPadding={arrowPadding}
        collisionAvoidance={collisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        disableAnchorTracking={disableAnchorTracking}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        sticky={sticky}
      >
        <BasePopover.Popup
          initialFocus={resolvedInitialFocus}
          finalFocus={resolvedFinalFocus}
          render={createTgphBaseUIRender((state: PopoverPopupRenderState) => (
            <Stack
              as={motion.div}
              className="tgph"
              initial={
                skipAnimation
                  ? undefined
                  : {
                      opacity: 0.5,
                      scale: 0.6,
                      ...getMotionOffsetBySide(side),
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              exit={
                skipAnimation
                  ? undefined
                  : {
                      opacity: 0.5,
                      scale: 0.6,
                      ...getMotionOffsetBySide(side),
                    }
              }
              transition={{
                duration: 0.1,
                type: "spring",
                bounce: 0,
              }}
              bg={bg}
              data-state={state.open ? "open" : "closed"}
              direction={direction}
              gap={gap}
              rounded={rounded}
              py={py}
              shadow={shadow}
              style={{
                overflowY: "auto",
                transformOrigin: "var(--transform-origin)",
                ...style,
              }}
              tgphRef={contentRef}
              zIndex="popover"
              key="tgph-popover-content"
              {...props}
            >
              {children}
            </Stack>
          ))}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
};

const Popover = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
};

Object.assign(Popover, {
  Root,
  Trigger,
  Content,
});

export { Popover };
