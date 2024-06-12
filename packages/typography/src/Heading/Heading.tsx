import {
  OptionalAsPropConfig,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import clsx from "clsx";

import { alignMap, colorMap, sizeMap } from "../helpers/prop-mappings";

type BaseHeadingProps = {
  align?: keyof typeof alignMap;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
};

type HeadingProps<T extends TgphElement> = BaseHeadingProps &
  Omit<TgphComponentProps<typeof Box<T>>, keyof BaseHeadingProps> &
  OptionalAsPropConfig<T>;

const Heading = <T extends TgphElement>({
  as,
  color = "default",
  size = "2",
  align,
  className,
  // Remove this from props to avoid passing to DOM element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: HeadingProps<T>) => {
  if (!as) throw new Error("as prop is required");
  return (
    <Box
      as={as as TgphElement}
      className={clsx(
        "box-border font-semi-bold",
        align && alignMap[align],
        color && colorMap[color],
        size && sizeMap[size],
        className,
      )}
      display="inline"
      m="0"
      {...props}
    />
  );
};

export { Heading };
