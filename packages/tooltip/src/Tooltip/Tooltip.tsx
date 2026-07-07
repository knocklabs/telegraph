import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import {
  type TgphComponentProps,
  type TgphElement,
  callLegacyDismissHandlers,
  createTgphBaseUIRender,
  getBaseUIMotionOffset,
  getBaseUIPositionerVisibilityStyle,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";
import {
  Children,
  type ComponentPropsWithRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useState,
} from "react";

import { NO_COLLISION_AVOIDANCE } from "./Tooltip.helpers";
import { useTooltipGroup } from "./Tooltip.hooks";

type BaseTooltipRootProps = ComponentPropsWithoutRef<typeof BaseTooltip.Root>;
type BaseTooltipProviderProps = ComponentPropsWithoutRef<
  typeof BaseTooltip.Provider
>;
type BaseTooltipTriggerProps = ComponentPropsWithoutRef<
  typeof BaseTooltip.Trigger
>;
type BaseTooltipTriggerPropsWithRef = ComponentPropsWithRef<
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

type LegacyTooltipPositionerProps = Partial<
  Omit<
    BaseTooltipPositionerProps,
    "align" | "children" | "className" | "render" | "side" | "style"
  >
> & {
  align?: BaseTooltipPositionerProps["align"];
  avoidCollisions?: boolean;
  hideWhenDetached?: boolean;
  side?: BaseTooltipPositionerProps["side"];
};

type LegacyTooltipPopupProps = Partial<
  Omit<
    BaseTooltipPopupProps,
    "align" | "children" | "className" | "render" | "side" | "style"
  >
> & {
  "aria-label"?: BaseTooltipPopupProps["aria-label"];
  forceMount?: BaseTooltipPortalProps["keepMounted"];
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (
    event: MouseEvent | PointerEvent | TouchEvent,
  ) => void;
};

export type TooltipBaseProps<T extends TgphElement = "div"> = {
  children?: ReactNode;
  label?: ReactNode;
  labelProps?: TgphComponentProps<typeof Stack<T>>;
  enabled?: boolean;
  asChild?: boolean;
  // When true, prevents focus events from instantly opening the tooltip. This
  // preserves delayed hover behavior when Select/Combobox move DOM focus on hover.
  disableFocusOpen?: boolean;
  skipAnimation?: boolean;
  style?: TgphComponentProps<typeof Stack<T>>["style"];
  triggerRef?: RefObject<HTMLElement | null>;
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
  enabled = true,
  disableFocusOpen = false,
  skipAnimation,
  style,
  triggerRef,
  id,
  children,
}: TooltipProps<T>) => {
  const generatedTooltipId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpenProp ?? false,
  );
  // Base UI does not ship the Radix controllable-state helper, so keep the old
  // controlled/uncontrolled behavior local to Tooltip.
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;
  // `enabled={false}` has historically forced the tooltip closed even when a
  // controlled caller still passes `open`.
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

  // Disabled trigger children do not reliably emit hover/focus timing events,
  // so match the previous Radix behavior by removing the delay in that case.
  const derivedDelayDuration =
    groupOpen || areAnyChildrenElementsDisabled ? 0 : delayDuration;
  const resolvedCollisionAvoidance =
    collisionAvoidance ??
    (avoidCollisions === false ? NO_COLLISION_AVOIDANCE : undefined);
  const popupLabelProps = labelProps as
    | TgphComponentProps<typeof Stack>
    | undefined;
  const { style: labelStyle, ...popupLabelRestProps } = popupLabelProps ?? {};
  const popupStyle = {
    transformOrigin: "var(--transform-origin)",
    ...style,
    ...labelStyle,
  };
  const shouldAnimate = !groupOpen;
  const tooltipId = id ?? generatedTooltipId;
  const triggerDataState = resolvedOpen ? "open" : "closed";
  const existingAriaDescribedBy = isValidElement(children)
    ? ((children.props as Record<string, unknown>)["aria-describedby"] as
        | string
        | undefined)
    : undefined;
  // Preserve any caller-provided description id while appending the tooltip id
  // only while the tooltip is actually exposed.
  const triggerAriaDescribedBy =
    [existingAriaDescribedBy, resolvedOpen ? tooltipId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const resolvedTriggerRef =
    triggerRef as BaseTooltipTriggerPropsWithRef["ref"];

  const handleOpenChange = useCallback<
    NonNullable<BaseTooltipRootProps["onOpenChange"]>
  >(
    (nextOpen, eventDetails) => {
      if (
        !nextOpen &&
        callLegacyDismissHandlers(eventDetails, {
          onEscapeKeyDown,
          onPointerDownOutside,
        })
      ) {
        // Legacy Radix dismissal handlers could cancel close; translate that
        // prevention back to Base UI's eventDetails cancel API.
        eventDetails.cancel();
        return;
      }

      if (!controlled) {
        // Controlled callers receive the callback below but keep ownership of
        // the actual open value.
        setUncontrolledOpen(nextOpen);
      }

      onOpenChangeProp?.(nextOpen);
    },
    [controlled, onEscapeKeyDown, onOpenChangeProp, onPointerDownOutside],
  );

  const handleFocus = useCallback(
    (event: BaseTooltipTriggerFocusEvent) => {
      if (disableFocusOpen) {
        // Base UI composes focus open internally, so prevent both the DOM event
        // and Base UI's handler to preserve the old opt-out prop.
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
              ref={resolvedTriggerRef}
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
              ref={resolvedTriggerRef}
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
                getBaseUIPositionerVisibilityStyle({
                  anchorHidden: state.anchorHidden,
                  hideWhenDetached,
                  zIndex: "var(--tgph-zIndex-tooltip)",
                })
              }
            >
              <BaseTooltip.Popup
                aria-label={ariaLabel}
                id={tooltipId}
                render={createTgphBaseUIRender(
                  (state: TooltipPopupRenderState) => (
                    <Stack
                      as={motion.div}
                      className="tgph"
                      initial={
                        shouldAnimate && !skipAnimation
                          ? {
                              opacity: 0,
                              scale: 0.8,
                              ...getBaseUIMotionOffset(side),
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
                      data-tgph-appearance="dark"
                      shadow="2"
                      rounded="3"
                      py="1_5"
                      px="2"
                      align="center"
                      justify="center"
                      style={popupStyle}
                      {...popupLabelRestProps}
                      id={tooltipId}
                      role="tooltip"
                    >
                      {typeof label === "string" ? (
                        <Text as="span" size="1">
                          {label}
                        </Text>
                      ) : (
                        label
                      )}
                    </Stack>
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
