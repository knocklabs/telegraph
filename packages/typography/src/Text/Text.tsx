import clsx from "clsx";
import React from "react";

import {
  alignMap,
  colorMap,
  sizeMap,
  weightMap,
} from "../helpers/prop-mappings";

type TextProps = React.HTMLAttributes<TextRef> & {
  as:
    | "p"
    | "span"
    | "div"
    | "label"
    | "em"
    | "strong"
    | "b"
    | "i"
    | "pre"
    | "code";
  align?: keyof typeof alignMap;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
  weight?: keyof typeof weightMap;
};

type TextRef = HTMLParagraphElement &
  HTMLSpanElement &
  HTMLDivElement &
  HTMLLabelElement &
  HTMLPreElement;

const Text = React.forwardRef<TextRef, TextProps>(
  (
    {
      as: Component,
      color = "default",
      size = "2",
      weight = "regular",
      align,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    if (!Component) throw new Error("as prop is required");
    return (
      <Component
        className={clsx(
          "m-0 box-border",
          align && alignMap[align],
          color && colorMap[color],
          size && sizeMap[size],
          weight && weightMap[weight],
          className,
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export { Text };
