import {
  type Optional,
  RefToTgphRef,
  type TgphComponentProps,
} from "@telegraph/helpers";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import React from "react";

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
  const truncateRef = React.useRef<HTMLButtonElement>(null);
  const { truncated } = useTruncate(
    { tgphRef: truncateRef as React.RefObject<HTMLElement> },
    [children],
  );

  // We extract the text so that we can properly wrap it in the Text component
  const textToDisplayInTooltip = React.useMemo(() => {
    if (typeof children === "string") return children;
    if (React.isValidElement(children)) {
      const childProps = children.props as Record<string, unknown>;
      return childProps.children;
    }
    return label;
  }, [children, label]);

  return (
    <Tooltip
      label={
        <Text as="span" size="1">
          {textToDisplayInTooltip as React.ReactNode}
        </Text>
      }
      enabled={truncated}
      triggerRef={truncateRef as React.RefObject<HTMLButtonElement>}
      {...props}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </Tooltip>
  );
};

export { TooltipIfTruncated };
