import type {
  AsAndTgphRefProps,
  PolymorphicPropsWithTgphRef,
  RemappedOmit,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { StyleProps, cssVars } from "./Box.constants";

// `color` is dropped from the passthrough. It is a deprecated HTML attribute
// that React accepts on every element, so it type-checked here and rendered a
// `color` attribute that paints nothing. `Text`, `Button` and `Icon` all have a
// real `color` prop, so the name worked on those and did nothing on this one.
// `as` and `tgphRef` come back at the top level, because a mapped type in front
// of `as?: T` stops `<Box as="a" />` resolving `T`.
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
