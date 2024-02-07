import clsx from "clsx";
import React from "react";

import {
  alignMap,
  colorMap,
  sizeMap,
  weightMap,
} from "../helpers/prop-mappings";

type TextProps = React.HTMLAttributes<HTMLHeadingElement> & {
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

type TextRef = HTMLElement;

const Text = React.forwardRef<TextRef, TextProps>(
  (
    {
      color = "black",
      size = "2",
      weight = "regular",
      align,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <span
        className={clsx(
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
