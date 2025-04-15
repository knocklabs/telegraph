import {
  type Optional,
  RefToTgphRef,
  type TgphComponentProps,
} from "@telegraph/helpers";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import React from "react";

import { useTruncate } from "../useTruncate";

type TooltipIfTruncatedProps = Optional<
  TgphComponentProps<typeof Tooltip>,
  "label"
>;

const TooltipIfTruncated = ({
  label,
  children,
  ...props
}: TooltipIfTruncatedProps) => {
  const truncateRef = React.useRef<HTMLButtonElement>(null);
  const { truncated } = useTruncate({ tgphRef: truncateRef }, [children]);

  // We extract the text so that we can properly wrap it in the Text component
  const textToDisplayInTooltip = React.useMemo(() => {
    if (typeof children === "string") return children;
    if (React.isValidElement(children)) return children.props.children;
    return label;
  }, [children, label]);

  return (
    <Tooltip
      label={
        <Text as="span" size="1">
          {textToDisplayInTooltip}
        </Text>
      }
      enabled={truncated}
      triggerRef={truncateRef}
      {...props}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </Tooltip>
  );
};

export { TooltipIfTruncated };
