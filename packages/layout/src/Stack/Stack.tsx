import type { PolymorphicProps, TgphElement } from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { Box, type BoxProps } from "../Box";

import { StyleProps, cssVars } from "./Stack.constants";

// `BoxProps<T>` rather than `TgphComponentProps<typeof Box>`: extracting props
// from a generic component instantiates its parameter at the constraint, which
// erases the passthrough. Threading `T` keeps Box's props intact.
export type StackProps<T extends TgphElement = "div"> = PolymorphicProps<T> &
  Omit<BoxProps<T>, "as"> &
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
