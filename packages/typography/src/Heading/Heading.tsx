import {
  OptionalAsPropConfig,
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import clsx from "clsx";

import { alignMap, colorMap, sizeMap } from "../helpers/prop-mappings";

type BaseHeadingProps = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: keyof typeof alignMap;
  size?: keyof typeof sizeMap;
  color?: keyof typeof colorMap;
};
type HeadingProps<T extends TgphElement> = Omit<
  PolymorphicPropsWithTgphRef<T, HTMLElement>,
  keyof BaseHeadingProps
> &
  BaseHeadingProps &
  OptionalAsPropConfig<T>;

const Heading = <T extends TgphElement>({
  as,
  color = "default",
  size = "2",
  align,
  className,
  tgphRef,
  // Remove this from props to avoid passing to DOM element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: HeadingProps<T>) => {
  if (!as) throw new Error("as prop is required");
  const Component: TgphElement = as;
  return (
    <Component
      className={clsx(
        "m-0 box-border font-semi-bold",
        align && alignMap[align],
        color && colorMap[color],
        size && sizeMap[size],
        className,
      )}
      ref={tgphRef}
      {...props}
    />
  );
};

export { Heading };
