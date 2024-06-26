import {
  OptionalAsPropConfig,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import clsx from "clsx";

import {
  alignMap,
  colorMap,
  sizeMap,
  weightMap,
} from "../helpers/prop-mappings";

type BaseTextProps = {
  align?: keyof typeof alignMap;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
  weight?: keyof typeof weightMap;
};

type TextProps<T extends TgphElement> = BaseTextProps &
  Omit<TgphComponentProps<typeof Box<T>>, keyof BaseTextProps> &
  OptionalAsPropConfig<T>;

const Text = <T extends TgphElement>({
  as,
  color = "default",
  size = "2",
  weight = "regular",
  align,
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: TextProps<T>) => {
  if (!as) throw new Error("as prop is required");
  return (
    <Box
      as={as as TgphElement}
      className={clsx(
        "box-border",
        align && alignMap[align],
        color && colorMap[color],
        size && sizeMap[size],
        weight && weightMap[weight],
        className,
      )}
      display="inline"
      m="0"
      {...props}
    />
  );
};

export { Text };
