import {
  OptionalAsPropConfig,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import { useCssVars } from "@telegraph/style-engine";
import clsx from "clsx";

import { COLOR_MAP, type StyleProps, cssVars } from "../constants";

type BaseTextProps = Omit<StyleProps, "color"> & {
  color?: keyof typeof COLOR_MAP;
  size?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
};

type TextProps<T extends TgphElement> = BaseTextProps &
  Omit<TgphComponentProps<typeof Box<T>>, keyof BaseTextProps> &
  OptionalAsPropConfig<T>;

const Text = <T extends TgphElement>({
  as,
  color = "default",
  size = "2",
  weight = "regular",
  align = "left",
  className,
  style,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: TextProps<T>) => {
  if (!as) throw new Error("as prop is required");

  const { styleProps, otherProps } = useCssVars({
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
      className={clsx("tgph-text", className)}
      style={{
        ...styleProps,
        ...style,
      }}
      display="inline"
      {...otherProps}
    />
  );
};

export { Text };
