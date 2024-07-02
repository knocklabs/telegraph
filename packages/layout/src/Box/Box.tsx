import { useComposedRefs } from "@telegraph/compose-refs";
import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleProps } from "@telegraph/style-engine";
import clsx from "clsx";
import React from "react";

import { StyleProps, styleProps } from "./Box.css";

type BoxProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLElement
> &
  StyleProps;

const Box = <T extends TgphElement>({
  as,
  className,
  tgphRef,
  borderColor = "gray-4",
  ...props
}: BoxProps<T>) => {
  const Component: TgphElement = as || "div";
  const boxRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(tgphRef, boxRef);
  const { styleClassName, props: componentProps } = useStyleProps({
    props: { borderColor, ...props },
    styleProps,
  });

  return (
    <Component
      className={clsx("tgph-box", className, styleClassName)}
      ref={composedRef}
      {...componentProps}
    />
  );
};

export { Box };
