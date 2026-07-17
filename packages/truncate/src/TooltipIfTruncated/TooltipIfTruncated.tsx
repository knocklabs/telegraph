import {
  type Optional,
  RefToTgphRef,
  type TgphComponentProps,
} from "@telegraph/helpers";
import { Tooltip } from "@telegraph/tooltip";
import { Text } from "@telegraph/typography";
import { type ReactNode, isValidElement, useRef } from "react";

import { useTruncate } from "../useTruncate";

export type TooltipIfTruncatedProps = Optional<
  TgphComponentProps<typeof Tooltip>,
  "label"
>;

/**
 * Recursively extract the rendered text from a node.
 *
 * `useTruncate` re-measures whenever its dependencies change, and the content
 * we render is what determines whether it overflows. But `children` is a
 * freshly-created element on every render, so depending on the element itself
 * (`[children]`) re-runs the effect — and its `setState` — on *every* render.
 * In a re-render-heavy tree (e.g. a ReactFlow graph) that can tip React into a
 * "Maximum update depth exceeded" loop (React #185). The visible text stays
 * referentially stable across renders when the content is unchanged, so it is
 * the correct thing to key on.
 */
const getTextContent = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }
  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    return getTextContent(children);
  }
  return "";
};

const TooltipIfTruncated = ({
  label,
  children,
  ...props
}: TooltipIfTruncatedProps) => {
  const truncateRef = useRef<HTMLElement>(null);
  const { truncated } = useTruncate({ tgphRef: truncateRef }, [
    getTextContent(children),
  ]);

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
      enabled={truncated}
      triggerRef={truncateRef}
      {...props}
    >
      <RefToTgphRef>{children}</RefToTgphRef>
    </Tooltip>
  );
};

export { TooltipIfTruncated };
