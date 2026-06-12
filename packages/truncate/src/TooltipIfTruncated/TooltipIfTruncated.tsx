import {
  type Optional,
  RefToTgphRef,
  type TgphComponentProps,
} from "@telegraph/helpers";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import { type ReactNode, type RefObject, isValidElement, useRef } from "react";

import { useTruncate } from "../useTruncate";

export type TooltipIfTruncatedProps = Optional<
  TgphComponentProps<typeof Tooltip>,
  "label"
>;

const TooltipIfTruncated = ({
  label,
  children,
  ...props
}: TooltipIfTruncatedProps) => {
  const truncateRef = useRef<HTMLButtonElement>(null);
  const { truncated } = useTruncate(
    { tgphRef: truncateRef as RefObject<HTMLElement> },
    [children],
  );

  const textToDisplayInTooltip = (() => {
    if (typeof children === "string") return children;
    if (isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      return childProps.children;
    }
    return label;
  })();

  return (
    <Tooltip
      label={
        <Text as="span" size="1">
          {textToDisplayInTooltip as ReactNode}
        </Text>
      }
      enabled={truncated}
      triggerRef={truncateRef as RefObject<HTMLButtonElement>}
      {...props}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </Tooltip>
  );
};

export { TooltipIfTruncated };
