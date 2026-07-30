import type { PolymorphicProps, TgphElement } from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { Box, type BoxProps } from "../Box";

import { StyleProps, cssVars } from "./Stack.constants";

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
