import type {
  ComponentPropsWithRequiredAs,
  PropsWithRequiredAs,
  RefWithAs,

} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import clsx from "clsx";
import React from "react";

import {
  alignMap,
  colorMap,
  sizeMap,
  weightMap,
} from "../helpers/prop-mappings";

type TextProps = ComponentPropsWithRequiredAs<
  typeof Box,
  {
    align?: keyof typeof alignMap;
    size?: keyof typeof sizeMap;
    color?: keyof typeof colorMap;
    weight?: keyof typeof weightMap;
  }
>;

type TextRef = RefWithAs<typeof Box>;

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
      <Box
        as={Component}
        m="0"
        className={clsx(
          "box-border",
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
) as <T extends React.ElementType>(
  props: PropsWithRequiredAs<T, TextProps>,
) => React.ReactElement;

export { Text };
