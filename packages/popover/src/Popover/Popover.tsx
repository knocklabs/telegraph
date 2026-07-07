import { Popover as BasePopover } from "@base-ui/react/popover";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type LegacyDismissEventHandler,
  type LegacyDismissHandlers,
  type TgphComponentProps,
  type TgphElement,
  callLegacyDismissHandlers,
  createTgphBaseUIRender,
  getBaseUIMotionOffset,
  getBaseUIPositionerVisibilityStyle,
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
  type RefObject,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { NO_COLLISION_AVOIDANCE } from "./Popover.helpers";

type BasePopoverRootProps = ComponentProps<typeof BasePopover.Root>;
type BasePopoverTriggerProps = ComponentPropsWithoutRef<
  typeof BasePopover.Trigger
>;
type BasePopoverPositionerProps = ComponentPropsWithoutRef<
  typeof BasePopover.Positioner
>;
type BasePopoverPopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;
type PopoverRootActions = BasePopover.Root.Actions;
type MotionAnimationCompleteHandler = NonNullable<
  ComponentProps<typeof motion.div>["onAnimationComplete"]
>;

export type RootProps = Omit<BasePopoverRootProps, "onOpenChange"> & {
  onOpenChange?: (open: boolean) => void;
};

type PopoverCompatibilityContextProps = {
  closeAnimationRef: {
    current: {
      pendingCloseUnmount: boolean;
      preventUnmountOnClose: boolean;
    };
  };
  contentCallbacksRef: {
    current: LegacyDismissHandlers;
  };
  rootActionsRef: RefObject<PopoverRootActions | null>;
};

type PopoverPopupRenderState = {
  open: boolean;
};

const PopoverCompatibilityContext =
  createContext<PopoverCompatibilityContextProps | null>(null);

const Root = ({ actionsRef, children, onOpenChange, ...props }: RootProps) => {
  const internalRootActionsRef = useRef<PopoverRootActions | null>(null);
  const rootActionsRef = actionsRef ?? internalRootActionsRef;
  const closeAnimationRef = useRef({
    pendingCloseUnmount: false,
    preventUnmountOnClose: false,
  });
  const contentCallbacksRef = useRef<LegacyDismissHandlers>({});
  const compatibilityContext = useMemo<PopoverCompatibilityContextProps>(
    () => ({
      closeAnimationRef,
      contentCallbacksRef,
      rootActionsRef,
    }),
    [rootActionsRef],
  );
  const handleOpenChange = useCallback<
    NonNullable<BasePopoverRootProps["onOpenChange"]>
  >(
    (open, eventDetails) => {
      if (
        !open &&
        callLegacyDismissHandlers(eventDetails, contentCallbacksRef.current)
      ) {
        // Legacy Radix outside/escape handlers could prevent dismissal, so
        // translate that prevention back into Base UI's cancel API.
        eventDetails.cancel();
        return;
      }

      if (open) {
        closeAnimationRef.current.pendingCloseUnmount = false;
      }

      if (!open && closeAnimationRef.current.preventUnmountOnClose) {
        // Keep the popup mounted through its exit animation; the content calls
        // Base UI's action ref to unmount once motion reports completion.
        closeAnimationRef.current.pendingCloseUnmount = true;
        eventDetails.preventUnmountOnClose();
      }

      onOpenChange?.(open);
    },
    [onOpenChange],
  );

  return (
    <LazyMotion features={domAnimation}>
      <PopoverCompatibilityContext.Provider value={compatibilityContext}>
        <BasePopover.Root
          actionsRef={rootActionsRef}
          onOpenChange={handleOpenChange}
          {...props}
        >
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
    const triggerRef = useComposedRefs<HTMLButtonElement>(
      forwardedRef,
      tgphRef,
    );

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
    avoidCollisions?: boolean;
    contentStackRef?: Ref<HTMLDivElement>;
    forceMount?: boolean;
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
  children,
  avoidCollisions,
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
  const contentRef = useComposedRefs<HTMLElement>(
    tgphRef as Ref<HTMLElement>,
    contentStackRef as Ref<HTMLElement>,
  );
  const shouldAnimate = !skipAnimation;
  const resolvedCollisionAvoidance =
    collisionAvoidance ??
    (avoidCollisions === false ? NO_COLLISION_AVOIDANCE : undefined);
  // Base UI unmounts immediately on close unless we explicitly hold the popup
  // mounted, which is only needed for animated, non-force-mounted content.
  const shouldManageCloseAnimation = shouldAnimate && !forceMount;
  const resolvedInitialFocus =
    initialFocus ??
    (onOpenAutoFocus
      ? () => {
          const event = new Event("openAutoFocus", { cancelable: true });
          onOpenAutoFocus(event);

          // Base UI uses `false` to cancel autofocus; Radix used
          // preventDefault on the synthetic lifecycle event.
          return event.defaultPrevented ? false : true;
        }
      : undefined);
  const resolvedFinalFocus =
    finalFocus ??
    (onCloseAutoFocus
      ? () => {
          const event = new Event("closeAutoFocus", { cancelable: true });
          onCloseAutoFocus(event);

          // Preserve Radix's close autofocus contract while using Base UI's
          // boolean finalFocus callback shape.
          return event.defaultPrevented ? false : true;
        }
      : undefined);
  const { onAnimationComplete, ...stackProps } = props as typeof props & {
    onAnimationComplete?: MotionAnimationCompleteHandler;
  };

  useEffect(() => {
    if (!compatibilityContext) {
      return;
    }

    // Tell the root whether this content needs Base UI's unmount prevented
    // until the exit animation has had a chance to complete.
    compatibilityContext.closeAnimationRef.current = {
      ...compatibilityContext.closeAnimationRef.current,
      preventUnmountOnClose: shouldManageCloseAnimation,
    };

    return () => {
      if (compatibilityContext.closeAnimationRef.current.pendingCloseUnmount) {
        // A controlled parent can stop rendering Content as soon as it sees
        // onOpenChange(false); in that case the motion callback below will not
        // fire, so finish Base UI's deferred unmount from cleanup.
        compatibilityContext.rootActionsRef.current?.unmount();
      }

      compatibilityContext.closeAnimationRef.current = {
        ...compatibilityContext.closeAnimationRef.current,
        pendingCloseUnmount: false,
        preventUnmountOnClose: false,
      };
    };
  }, [compatibilityContext, shouldManageCloseAnimation]);

  useEffect(() => {
    if (!compatibilityContext) {
      return;
    }

    // Store the latest legacy dismiss callbacks where Root can reach them from
    // Base UI's single `onOpenChange` dismissal details callback.
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
  const closedAnimation = shouldAnimate
    ? {
        opacity: 0.5,
        scale: 0.6,
        ...getBaseUIMotionOffset(side),
      }
    : undefined;

  return (
    <BasePopover.Portal keepMounted={forceMount}>
      <BasePopover.Positioner
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
            // Base UI's transformed positioner is the stacking-context root, so
            // the z-index must live here; a z-index on the popup child alone is
            // trapped at the positioner's `auto` level and paints under app
            // content that has its own positive z-index.
            zIndex: "var(--tgph-zIndex-popover)",
          })
        }
      >
        <BasePopover.Popup
          initialFocus={resolvedInitialFocus}
          finalFocus={resolvedFinalFocus}
          render={createTgphBaseUIRender((state: PopoverPopupRenderState) => (
            <Stack
              as={motion.div}
              className="tgph"
              initial={closedAnimation}
              animate={
                shouldAnimate
                  ? state.open
                    ? {
                        opacity: 1,
                        scale: 1,
                        x: 0,
                        y: 0,
                      }
                    : closedAnimation
                  : undefined
              }
              exit={closedAnimation}
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
              {...stackProps}
              onAnimationComplete={(definition) => {
                onAnimationComplete?.(definition);

                if (!state.open && shouldManageCloseAnimation) {
                  // The root held the popup mounted for the exit animation; now
                  // that motion is done, ask Base UI to finish the unmount.
                  if (compatibilityContext) {
                    compatibilityContext.closeAnimationRef.current.pendingCloseUnmount = false;
                  }
                  compatibilityContext?.rootActionsRef.current?.unmount();
                }
              }}
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
