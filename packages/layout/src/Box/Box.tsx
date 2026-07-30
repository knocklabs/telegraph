import type {
  AsAndTgphRefProps,
  PolymorphicPropsWithTgphRef,
  RemappedOmit,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { StyleProps, cssVars } from "./Box.constants";

// `color` is dropped from the passthrough. React accepts it on every element,
// so it type-checked here and rendered an attribute that paints nothing.
export type BoxProps<T extends TgphElement = "div"> = RemappedOmit<
  PolymorphicPropsWithTgphRef<T, HTMLElement>,
  "as" | "tgphRef" | "color"
> &
  AsAndTgphRefProps<T, HTMLElement> &
  StyleProps;

const Box = <T extends TgphElement = "div">({
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
