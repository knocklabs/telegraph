import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleProps } from "@telegraph/style-engine";
import clsx from "clsx";

import { StyleProps, stylePropsFn } from "./Box.css";

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
  borderStyle = "solid",
  borderWidth = "0",
  ...props
}: BoxProps<T>) => {
  const Component = (as || "div") as TgphElement;
  const { styleClassName, componentProps } = useStyleProps({
    props: { ...props, borderColor, borderStyle, borderWidth },
    stylePropsFn,
  });
  return (
    <Component
      className={clsx("tgph-box", className, styleClassName)}
      ref={tgphRef}
      {...componentProps}
    />
  );
};

export { Box };
