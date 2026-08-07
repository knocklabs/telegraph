import type { AsProp, RemappedOmit, TgphElement } from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { Box, type BoxProps } from "../Box";

import { StyleProps, cssVars } from "./Stack.constants";

// `BoxProps<T>` already carries the element passthrough. Do not intersect
// `PolymorphicProps<T>` back in, because that repeats it.
export type StackProps<T extends TgphElement = "div"> = RemappedOmit<
  BoxProps<T>,
  "as"
> &
  AsProp<T> &
  StyleProps;

const Stack = <T extends TgphElement = "div">({
  className,
  ...props
}: StackProps<T>) => {
  const { styleProp, otherProps } = useStyleEngine({
    props,
    cssVars,
  });

  return (
    <Box
      className={clsx("tgph-stack", className)}
      style={styleProp}
      {...otherProps}
    />
  );
};

export { Stack };
