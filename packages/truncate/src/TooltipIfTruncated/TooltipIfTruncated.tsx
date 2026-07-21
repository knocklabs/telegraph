import {
  type Optional,
  RefToTgphRef,
  type TgphComponentProps,
} from "@telegraph/helpers";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import { type ReactNode, isValidElement, useRef, useState } from "react";

export type TooltipIfTruncatedProps = Optional<
  TgphComponentProps<typeof Tooltip>,
  "label"
> & {
  /**
   * How to decide whether the trigger is truncated. Defaults to
   * `scrollWidth > clientWidth`, which is correct for a single clipped element.
   * Pass a custom test for cases the default can't see — e.g. a middle-truncated
   * group whose container never overflows but whose segments do.
   */
  isTruncated?: (trigger: HTMLElement) => boolean;
};

const overflows = (el: HTMLElement) => el.scrollWidth > el.clientWidth;

/**
 * Shows a tooltip only when the child is actually truncated.
 *
 * Truncation is measured lazily, at the moment the tooltip tries to open
 * (hover/focus) — a discrete user event — rather than in a render effect. This
 * removes the every-render `setState` + `ResizeObserver` machinery that could
 * cascade into "Maximum update depth exceeded" (React #185, KNO-14285) in a
 * re-render-heavy tree. Each open re-measures fresh, so a newly opened tooltip is
 * never stale. An already-open tooltip is not force-closed if a later resize makes
 * the trigger fit again — gating runs on open attempts, not continuously — so it
 * closes on the next pointer-leave; that is the deliberate trade-off for dropping
 * the continuous `ResizeObserver`.
 */
const TooltipIfTruncated = ({
  label,
  children,
  isTruncated = overflows,
  onOpenChange,
  ...props
}: TooltipIfTruncatedProps) => {
  const triggerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const textToDisplayInTooltip = (() => {
    if (label !== undefined) return label;
    if (typeof children === "string") return children;
    if (isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      return childProps.children;
    }
  })();

  return (
    <Tooltip
      label={
        <Text as="span" size="1">
          {textToDisplayInTooltip as ReactNode}
        </Text>
      }
      triggerRef={triggerRef}
      // Spread caller props first so the controlled `open` / `onOpenChange`
      // gating below always wins — otherwise a pass-through `onOpenChange` (or
      // `open`) would replace the truncation gate and leave `open` stuck at
      // `false`, so the tooltip could never appear. A caller's `onOpenChange`
      // is still honored — it's forwarded from inside our handler.
      {...props}
      open={open}
      onOpenChange={(next) => {
        // Measure once, here — never during render. If the content isn't
        // clipped, refuse to open. `setOpen` only ever fires from this user
        // event, so there is no render→effect→setState cycle to run away.
        const trigger = triggerRef.current;
        if (next && !(trigger && isTruncated(trigger))) return;
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </Tooltip>
  );
};

export { TooltipIfTruncated };
