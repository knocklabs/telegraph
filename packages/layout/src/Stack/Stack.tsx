import type {
  PolymorphicProps,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { useCssVars } from "@telegraph/style-engine";
import clsx from "clsx";

import { Box } from "../Box";

import { StyleProps, cssVars } from "./Stack.constants";

type StackProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Box> &
  StyleProps;

const Stack = <T extends TgphElement>({
  className,
  style,
  ...props
}: StackProps<T>) => {
  const { styleProps, otherProps } = useCssVars({
    props,
    cssVars,
  });

  return (
    <Box
      className={clsx("tgph-stack", className)}
      style={{
        ...styleProps,
        ...style,
      }}
      {...otherProps}
    />
  );
};

export { Stack };
