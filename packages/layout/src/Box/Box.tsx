import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
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
  ...props
}: BoxProps<T>) => {
  const Component = (as || "div") as TgphElement;

  const { styleProp, otherProps, interactive } = useStyleEngine({
    props,
    cssVars,
  });

  return (
    <Component
      className={clsx(
        "tgph-box",
        interactive && "tgph-box--interactive",
        className,
      )}
      style={styleProp}
      {...otherProps}
      ref={tgphRef}
    >
      {children}
    </Component>
  );
};

export { Box };
