import type {
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { BOX_PROPS } from "./Box.constants";
import { BoxPropsTokens } from "./Box.types";

type BoxProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLElement
> &
  BoxPropsTokens;

const Box = <T extends TgphElement>({
  as,
  className,
  tgphRef,
  ...props
}: BoxProps<T>) => {
  const Component: TgphElement = as || "div";

  const { style, componentProps } = useStyleEngine({
    props,
    propsMap: BOX_PROPS,
  });

  return (
    <Component
      className={clsx("tgph-box", className)}
      ref={tgphRef}
      style={style}
      children={props.children}
      {...componentProps}
    />
  );
};

export { Box };
