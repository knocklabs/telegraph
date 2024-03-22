import clsx from "clsx";
import React from "react";

import { CODE_PROPS } from "./Code.constants";

type CodeProps = React.HTMLAttributes<CodeRef> & {
  as: "span" | "div" | "pre" | "code";
  size?: keyof typeof CODE_PROPS.size;
  weight?: keyof typeof CODE_PROPS.weight;
  variant?: keyof typeof CODE_PROPS.variant;
  color?: keyof typeof CODE_PROPS.variant.soft;
};

type CodeRef = HTMLParagraphElement &
  HTMLSpanElement &
  HTMLDivElement &
  HTMLPreElement;

const Code = React.forwardRef<CodeRef, CodeProps>(
  (
    {
      as: Component,
      size = "2",
      weight = "regular",
      variant = "soft",
      color = "default",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    if (!Component) throw new Error("as prop is required");
    return (
      <Component
        className={clsx(
          "m-0 box-border font-mono px-1 rounded-1",
          color && CODE_PROPS.variant[variant][color],
          size && CODE_PROPS.size[size],
          weight && CODE_PROPS.weight[weight],
          className,
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export { Code };
