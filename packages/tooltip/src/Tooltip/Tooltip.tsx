import * as RadixTooltip from "@radix-ui/react-tooltip";
import { InvertedAppearance } from "@telegraph/appearance";
import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { motion } from "framer-motion";
import React from "react";

type TooltipBaseProps<T extends TgphElement> = {
  label: string | React.ReactNode;
  labelProps?: TgphComponentProps<typeof Box<T>>;
  triggerAsChild?: boolean;
};

type TooltipProps<T extends TgphElement> = React.ComponentPropsWithoutRef<
  typeof RadixTooltip.Root
> &
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Provider> &
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content> &
  TooltipBaseProps<T>;

const Tooltip = <T extends TgphElement>({
  // Radix Tooltip Provider Props
  delayDuration = 0,
  skipDelayDuration,
  disableHoverableContent,
  triggerAsChild,
  // Radix Tooltip Root Props
  defaultOpen,
  open,
  onOpenChange,
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
  // Box Props
  label,
  labelProps,
  children,
}: TooltipProps<T>) => {
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
    <RadixTooltip.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <RadixTooltip.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <RadixTooltip.Trigger asChild={triggerAsChild}>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <InvertedAppearance asChild>
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
            >
              <Box
                as={motion.div}
                // Add tgph class so that this always works in portals
                className="tgph"
                initial={{
                  opacity: 0.5,
                  scale: 0.6,
                  ...deriveAnimationBasedOnSide(side),
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                transition={{ duration: 0.2, type: "spring", bounce: 0 }}
                bg="gray-1"
                rounded="3"
                py="2"
                px="3"
                style={{
                  transformOrigin:
                    "var(--radix-tooltip-content-transform-origin)",
                }}
                {...(labelProps ? { labelProps } : {})}
              >
                <RadixTooltip.Arrow fill="var(--tgph-gray-1)" />
                {typeof label === "string" ? (
                  <Text as="span" size="1">
                    {label}
                  </Text>
                ) : (
                  label
                )}
              </Box>
            </RadixTooltip.Content>
          </InvertedAppearance>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export { Tooltip };
