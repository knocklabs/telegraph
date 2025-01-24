import {
  OptionalAsPropConfig,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { COLOR_MAP, type StyleProps, cssVars } from "../constants";

type BaseHeadingProps = Omit<StyleProps, "color"> & {
  color?: keyof typeof COLOR_MAP;
  size?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
};

type HeadingProps<T extends TgphElement> = BaseHeadingProps &
  Omit<TgphComponentProps<typeof Box<T>>, keyof BaseHeadingProps> &
  OptionalAsPropConfig<T>;

const Heading = <T extends TgphElement>({
  as,
  size = "2",
  weight = "semi-bold",
  color,
  align,
  className,
  // Remove this from props to avoid passing to DOM element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: HeadingProps<T>) => {
  if (!as) throw new Error("as prop is required");
  const { styleProp, otherProps } = useStyleEngine({
    props: {
      color: COLOR_MAP[color as keyof typeof COLOR_MAP],
      fontSize: size,
      tracking: size,
      leading: size,
      weight,
      align,
      ...props,
    },
    cssVars,
  });
  return (
    <Box
      as={as as TgphElement}
      className={clsx("tgph-heading", className)}
      display="inline"
      m="0"
      style={styleProp}
      {...otherProps}
    />
  );
};

export { Heading };
