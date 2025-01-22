import type {
  PolymorphicProps,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { Box } from "../Box";

import { StyleProps, cssVars } from "./Stack.constants";

type StackProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Box> &
  StyleProps;

const Stack = <T extends TgphElement>({
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
