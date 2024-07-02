import type { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { useStyleProps } from "@telegraph/style-engine";
import clsx from "clsx";
import React from "react";

import { Box } from "../Box";

import { type StyleProps, styleProps } from "./Stack.css";

type StackProps<T extends TgphElement> = TgphComponentProps<typeof Box<T>> &
  StyleProps;

const Stack = <T extends TgphElement>({
  className,
  ...props
}: StackProps<T>) => {
  const { styleClassName, props: componentProps } = useStyleProps({
    props,
    styleProps,
  });

  return (
    <Box
      {...componentProps}
      className={clsx("tgph-stack", styleClassName, className)}
    />
  );
};

export { Stack };
