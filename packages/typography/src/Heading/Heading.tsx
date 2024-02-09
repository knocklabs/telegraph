import clsx from "clsx";
import React from "react";

import { alignMap, colorMap, sizeMap } from "../helpers/prop-mappings";

type HeadingProps = React.HTMLAttributes<HeadingRef> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: keyof typeof alignMap;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
};

type HeadingRef = HTMLHeadingElement;

const Heading = React.forwardRef<HeadingRef, HeadingProps>(
  (
    {
      as: Component,
      color = "default",
      size = "2",
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
          align && alignMap[align],
          color && colorMap[color],
          size && sizeMap[size],
          "font-semi-bold",
          className,
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export { Heading };
