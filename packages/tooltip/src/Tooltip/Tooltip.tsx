import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { OverrideAppearance } from "@telegraph/appearance";
import {
  type TgphComponentProps,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";
import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useState,
} from "react";

import { type Appearance, TooltipContentProps } from "./Tooltip.constants";
import {
  NO_COLLISION_AVOIDANCE,
  callLegacyDismissHandler,
  getMotionOffsetBySide,
  getPositionerStyle,
} from "./Tooltip.helpers";
import { useTooltipGroup } from "./Tooltip.hooks";

type BaseTooltipRootProps = ComponentPropsWithoutRef<typeof BaseTooltip.Root>;
type BaseTooltipProviderProps = ComponentPropsWithoutRef<
  typeof BaseTooltip.Provider
>;
type BaseTooltipTriggerProps = ComponentPropsWithoutRef<
  typeof BaseTooltip.Trigger
>;
type BaseTooltipPortalProps = ComponentPropsWithoutRef<
  typeof BaseTooltip.Portal
>;
type BaseTooltipPositionerProps = ComponentPropsWithoutRef<
  typeof BaseTooltip.Positioner
>;
type BaseTooltipPopupProps = ComponentPropsWithoutRef<typeof BaseTooltip.Popup>;

type BaseTooltipTriggerFocusEvent = Parameters<
  NonNullable<BaseTooltipTriggerProps["onFocus"]>
>[0];

type TooltipPopupRenderState = {
  open: boolean;
};

type LegacyTooltipProviderProps = Omit<
  BaseTooltipProviderProps,
  "children" | "delay" | "timeout"
> & {
  delayDuration?: BaseTooltipProviderProps["delay"];
  skipDelayDuration?: BaseTooltipProviderProps["timeout"];
};

type LegacyTooltipRootProps = Omit<
  BaseTooltipRootProps,
  | "children"
  | "defaultOpen"
  | "disableHoverablePopup"
  | "disabled"
  | "onOpenChange"
  | "open"
> & {
  defaultOpen?: BaseTooltipRootProps["defaultOpen"];
  disableHoverableContent?: BaseTooltipRootProps["disableHoverablePopup"];
  onOpenChange?: (open: boolean) => void;
  open?: BaseTooltipRootProps["open"];
};

type LegacyTooltipPositionerProps = Omit<
  BaseTooltipPositionerProps,
  "children" | "className" | "render" | "style"
> & {
  avoidCollisions?: boolean;
  hideWhenDetached?: boolean;
};

type LegacyTooltipPopupProps = Omit<
  BaseTooltipPopupProps,
  "children" | "className" | "render" | "style"
> & {
  "aria-label"?: BaseTooltipPopupProps["aria-label"];
  forceMount?: BaseTooltipPortalProps["keepMounted"];
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (
    event: MouseEvent | PointerEvent | TouchEvent,
  ) => void;
};

export type TooltipBaseProps<T extends TgphElement = "div"> = {
  appearance?: Appearance;
  children?: ReactNode;
  label: ReactNode;
  labelProps?: TgphComponentProps<typeof Stack<T>>;
  enabled?: boolean;
  /**
   * When `true`, prevents focus events from instantly opening the tooltip.
   * Useful when a parent component (e.g. Select/Combobox) moves DOM focus on
   * hover, which would otherwise bypass `delayDuration` via focus handling.
   * @default false
   */
  disableFocusOpen?: boolean;
  skipAnimation?: boolean;
  triggerRef?: RefObject<HTMLButtonElement>;
};

export type TooltipProps<T extends TgphElement = "div"> =
  LegacyTooltipProviderProps &
    LegacyTooltipRootProps &
    LegacyTooltipPositionerProps &
    LegacyTooltipPopupProps &
    TooltipBaseProps<T>;

const Tooltip = <T extends TgphElement = "div">({
  delayDuration = 400,
  skipDelayDuration,
  closeDelay,
  disableHoverableContent,
  defaultOpen: defaultOpenProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  onOpenChangeComplete,
  actionsRef,
  handle,
  trackCursorAxis,
  triggerId,
  defaultTriggerId,
  "aria-label": ariaLabel,
  onEscapeKeyDown,
  onPointerDownOutside,
  forceMount,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset,
  anchor,
  positionMethod,
  avoidCollisions,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  disableAnchorTracking,
  hideWhenDetached,
  label,
  labelProps,
  appearance = "dark",
  enabled = true,
  disableFocusOpen = false,
  skipAnimation,
  triggerRef,
  id,
  children,
}: TooltipProps<T>) => {
  const generatedTooltipId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpenProp ?? false,
  );
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;
  const resolvedOpen = enabled === false ? false : open;
  const { groupOpen } = useTooltipGroup({
    open: Boolean(resolvedOpen),
    delay: delayDuration,
  });

  const areAnyChildrenElementsDisabled = Children.toArray(children).some(
    (child) => {
      if (isValidElement(child)) {
        const childProps = child.props as Record<string, unknown>;
        return childProps.disabled;
      }

      return false;
    },
  );

  const derivedDelayDuration =
    groupOpen || areAnyChildrenElementsDisabled ? 0 : delayDuration;
  const resolvedCollisionAvoidance =
    collisionAvoidance ??
    (avoidCollisions === false ? NO_COLLISION_AVOIDANCE : undefined);
  const shouldAnimate = !groupOpen;
  const tooltipId = id ?? generatedTooltipId;
  const triggerDataState = resolvedOpen ? "open" : "closed";
  const existingAriaDescribedBy = isValidElement(children)
    ? ((children.props as Record<string, unknown>)["aria-describedby"] as
        | string
        | undefined)
    : undefined;
  const triggerAriaDescribedBy =
    [existingAriaDescribedBy, resolvedOpen ? tooltipId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const handleOpenChange = useCallback<
    NonNullable<BaseTooltipRootProps["onOpenChange"]>
  >(
    (nextOpen, eventDetails) => {
      if (
        !nextOpen &&
        callLegacyDismissHandler(eventDetails, {
          onEscapeKeyDown,
          onPointerDownOutside,
        })
      ) {
        eventDetails.cancel();
        return;
      }

      if (!controlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChangeProp?.(nextOpen);
    },
    [controlled, onEscapeKeyDown, onOpenChangeProp, onPointerDownOutside],
  );

  const handleFocus = useCallback(
    (event: BaseTooltipTriggerFocusEvent) => {
      if (disableFocusOpen) {
        event.preventDefault();
        event.preventBaseUIHandler();
      }
    },
    [disableFocusOpen],
  );

  return (
    <LazyMotion features={domAnimation}>
      <BaseTooltip.Provider
        delay={derivedDelayDuration}
        closeDelay={closeDelay}
        timeout={skipDelayDuration}
      >
        <BaseTooltip.Root
          actionsRef={actionsRef}
          defaultTriggerId={defaultTriggerId}
          disabled={enabled === false}
          disableHoverablePopup={disableHoverableContent}
          handle={handle}
          onOpenChange={handleOpenChange}
          onOpenChangeComplete={onOpenChangeComplete}
          open={resolvedOpen}
          trackCursorAxis={trackCursorAxis}
          triggerId={triggerId}
        >
          {isValidElement(children) ? (
            <BaseTooltip.Trigger
              aria-describedby={triggerAriaDescribedBy}
              data-state={triggerDataState}
              delay={derivedDelayDuration}
              onFocus={handleFocus}
              ref={triggerRef}
              render={createTgphBaseUIRender(
                cloneElement(children, {
                  "aria-describedby": triggerAriaDescribedBy,
                  "data-state": triggerDataState,
                } as Record<string, unknown>),
              )}
            />
          ) : (
            <BaseTooltip.Trigger
              aria-describedby={triggerAriaDescribedBy}
              data-state={triggerDataState}
              delay={derivedDelayDuration}
              onFocus={handleFocus}
              ref={triggerRef}
            >
              {children}
            </BaseTooltip.Trigger>
          )}
          <BaseTooltip.Portal keepMounted={forceMount}>
            <BaseTooltip.Positioner
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
              <BaseTooltip.Popup
                aria-label={ariaLabel}
                id={tooltipId}
                render={createTgphBaseUIRender(
                  (state: TooltipPopupRenderState) => (
                    <OverrideAppearance asChild appearance={appearance}>
                      <Stack
                        as={motion.div}
                        className="tgph"
                        initial={
                          shouldAnimate && !skipAnimation
                            ? {
                                opacity: 0,
                                scale: 0.8,
                                ...getMotionOffsetBySide(side),
                              }
                            : {}
                        }
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: 0,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.1,
                          type: "spring",
                          bounce: 0,
                        }}
                        bg="surface-1"
                        data-state={state.open ? "open" : "closed"}
                        id={tooltipId}
                        shadow="2"
                        rounded="3"
                        role="tooltip"
                        py="1_5"
                        px="2"
                        align="center"
                        justify="center"
                        style={{
                          transformOrigin: "var(--transform-origin)",
                        }}
                        {...TooltipContentProps[appearance]}
                        {...(labelProps ?? {})}
                      >
                        {typeof label === "string" ? (
                          <Text as="span" size="1">
                            {label}
                          </Text>
                        ) : (
                          label
                        )}
                      </Stack>
                    </OverrideAppearance>
                  ),
                )}
              />
            </BaseTooltip.Positioner>
          </BaseTooltip.Portal>
        </BaseTooltip.Root>
      </BaseTooltip.Provider>
    </LazyMotion>
  );
};

export { Tooltip };
