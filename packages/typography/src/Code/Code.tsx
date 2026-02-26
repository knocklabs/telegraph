import {
  OptionalAsPropConfig,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { useStyleEngine } from "@telegraph/style-engine";
import clsx from "clsx";

import { COLOR_MAP, type StyleProps, cssVars } from "../constants";

import { SOFT_VARIANT_BG_COLOR_MAP } from "./Code.constants";

type BaseCodeProps = Omit<StyleProps, "color"> & {
  variant?: "soft" | "ghost";
  color?: keyof typeof COLOR_MAP;
  size?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
};

export type CodeProps<T extends TgphElement = "code"> = BaseCodeProps &
  Omit<TgphComponentProps<typeof Box<T>>, keyof BaseCodeProps> &
  OptionalAsPropConfig<T>;

const Code = <T extends TgphElement = "code">({
  as,
  size = "2",
  weight = "regular",
  variant = "soft",
  align = "left",
  family = "mono",
  color,
  className,
  // Remove this from props to avoid passing to DOM element
  internal_optionalAs: _internal_optionalAs,
  ...props
}: CodeProps<T>) => {
  if (!as) throw new Error("as prop is required");

  const { styleProp, otherProps } = useStyleEngine({
    props: {
      color: COLOR_MAP[color as keyof typeof COLOR_MAP],
      fontSize: `code-${size}`,
      leading: `code-${size}`,
      weight,
      align,
      family,
      ...props,
    },
    cssVars,
  });

  return (
    <Box
      as={as as TgphElement}
      className={clsx("tgph-code", className)}
      bg={
        variant === "soft"
          ? SOFT_VARIANT_BG_COLOR_MAP[
              color as keyof typeof SOFT_VARIANT_BG_COLOR_MAP
            ]
          : "transparent"
      }
      display="inline"
      m="0"
      px="1"
      rounded="1"
      style={styleProp}
      {...otherProps}
    />
  );
};

export { Code };
