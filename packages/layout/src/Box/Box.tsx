import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import { useCssVars } from "@telegraph/style-engine";
import clsx from "clsx";

import { StyleProps, cssVars } from "./Box.constants";

type BoxProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLElement
> &
  StyleProps;

const Box = <T extends TgphElement>({
  as,
  className,
  tgphRef,
  children,
  style,
  ...props
}: BoxProps<T>) => {
  const Component = (as || "div") as TgphElement;

  const { styleProps, otherProps } = useCssVars({ props, cssVars });
  console.log("HERE BOX", styleProps, otherProps);

  return (
    <Component
      className={clsx("tgph-box", className)}
      style={{
        ...styleProps,
        ...style,
      }}
      {...otherProps}
      ref={tgphRef}
    >
      {children}
    </Component>
  );
};

export { Box };
