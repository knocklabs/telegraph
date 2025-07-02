import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { OverrideAppearance } from "@telegraph/appearance";
import {
  RefToTgphRef,
  type TgphComponentProps,
  type TgphElement,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";
import React from "react";

import { TooltipContentProps } from "./Tooltip.constants";
import { useTooltipGroup } from "./Tooltip.hooks";

type TooltipBaseProps<T extends TgphElement> = {
  label: string | React.ReactNode;
  labelProps?: TgphComponentProps<typeof Stack<T>>;
  enabled?: boolean;
  appearance?: TgphComponentProps<typeof OverrideAppearance>["appearance"];
  skipAnimation?: boolean;
  triggerRef?: React.RefObject<HTMLButtonElement>;
};

type TooltipProps<T extends TgphElement> = React.ComponentPropsWithoutRef<
  typeof RadixTooltip.Root
> &
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Provider> &
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content> &
  TooltipBaseProps<T>;

const Tooltip = <T extends TgphElement>({
  // Radix Tooltip Provider Props
  delayDuration = 400,
  skipDelayDuration,
  disableHoverableContent,
  // Radix Tooltip Root Props
  defaultOpen: defaultOpenProp,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  // Radix Tooltip Content Props
  "aria-label": ariaLabel,
  onEscapeKeyDown,
  onPointerDownOutside,
  forceMount,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset,
  avoidCollisions,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  skipAnimation,
  // Label Props
  label,
  labelProps,
  // Telegraph Props
  enabled = true,
  appearance = "dark",
  triggerRef,
  children,
}: TooltipProps<T>) => {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    onChange: onOpenChangeProp,
    defaultProp: defaultOpenProp ?? false,
  });
  const { groupOpen } = useTooltipGroup({ open: !!open, delay: delayDuration });

  const areAnyChildrenElementsDisabled = React.Children.toArray(children).some(
    (child) => (child as React.ReactElement).props.disabled,
  );

  const derivedDelayDuration =
    groupOpen || areAnyChildrenElementsDisabled ? 0 : delayDuration;

  const shouldAnimate = !groupOpen;

  const deriveAnimationBasedOnSide = (side: TooltipProps<T>["side"]) => {
    const ANIMATION_OFFSET = 5;
    if (side === "top") {
      return {
        y: -ANIMATION_OFFSET,
      };
    }

    if (side === "bottom") {
      return {
        y: ANIMATION_OFFSET,
      };
    }

    if (side === "left") {
      return {
        x: -ANIMATION_OFFSET,
      };
    }

    if (side === "right") {
      return {
        x: ANIMATION_OFFSET,
      };
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <RadixTooltip.Provider
        delayDuration={derivedDelayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <RadixTooltip.Root
          open={enabled === false ? false : open}
          onOpenChange={setOpen}
        >
          <RadixTooltip.Trigger asChild={true} ref={triggerRef}>
            <RefToTgphRef>{children}</RefToTgphRef>
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              aria-label={ariaLabel}
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={onPointerDownOutside}
              forceMount={forceMount}
              side={side}
              sideOffset={sideOffset}
              align={align}
              alignOffset={alignOffset}
              avoidCollisions={avoidCollisions}
              collisionBoundary={collisionBoundary}
              collisionPadding={collisionPadding}
              arrowPadding={arrowPadding}
              sticky={sticky}
              hideWhenDetached={hideWhenDetached}
              style={{
                zIndex: `var(--tgph-zIndex-tooltip)`,
              }}
            >
              <OverrideAppearance appearance={appearance} asChild>
                <Stack
                  as={motion.div}
                  // Add tgph class so that this always works in portals
                  className="tgph"
                  initial={
                    shouldAnimate && !skipAnimation
                      ? {
                          opacity: 0,
                          scale: 0.5,
                          ...deriveAnimationBasedOnSide(side),
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
                  bg="gray-1"
                  rounded="3"
                  py="2"
                  px="3"
                  align="center"
                  justify="center"
                  style={{
                    transformOrigin:
                      "var(--radix-tooltip-content-transform-origin)",
                  }}
                  {...(labelProps ? { labelProps } : {})}
                  {...TooltipContentProps[appearance]}
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
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </LazyMotion>
  );
};

export { Tooltip };
