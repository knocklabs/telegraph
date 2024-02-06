import clsx from "clsx";
import React from "react";

import { alignMap, colorMap, sizeMap } from "../helpers/prop-mappings";

type HeadingProps = React.ComponentProps<"h1"> & {
  align?: keyof typeof alignMap;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
};

type HeadingRef = HTMLHeadingElement;

const Heading = React.forwardRef<HeadingRef, HeadingProps>(
  (
    {
      align = "DEFAULT",
      color = "DEFAULT",
      size = "DEFAULT",
      ...props
    }: HeadingProps,
    forwardedRef,
  ) => {
    return (
      <h3
        className={clsx(
          alignMap[align],
          colorMap[color],
          sizeMap[size],
          "font-semi-bold",
        )}
        ref={forwardedRef}
        {...props}
      />
    );
  },
);

export { Heading };
