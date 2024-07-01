import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import type t from "@telegraph/tokens";
import clsx from "clsx";
import React from "react";

import { Box } from "../Box";
import { type Responsive } from "../helpers/breakpoints";

import { STACK_PROPS } from "./Stack.constants";

type StackProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  typeof Box
> &
  React.ComponentProps<typeof Box> & {
    gap?: Responsive<`${keyof typeof t.tokens.spacing}`>;
    display?: Responsive<"flex" | "inline-flex">;
    align?: Responsive<React.CSSProperties["alignItems"]>;
    direction?: Responsive<React.CSSProperties["flexDirection"]>;
    justify?: Responsive<React.CSSProperties["justifyContent"]>;
    wrap?: Responsive<React.CSSProperties["flexWrap"]>;
  };

const Stack = <T extends TgphElement>({
  className,
  ...props
}: StackProps<T>) => {
  const { style, componentProps } = useStyleEngine({
    props,
    propsMap: STACK_PROPS,
  });

  return (
    <Box
      className={clsx("tgph-stack", className)}
      style={style}
      {...componentProps}
    />
  );
};

export { Stack };
