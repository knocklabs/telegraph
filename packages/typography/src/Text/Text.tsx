import {
  OptionalAsPropConfig,
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
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

type TextProps<T extends TgphElement> = Omit<
  PolymorphicPropsWithTgphRef<T, HTMLElement>,
  keyof BaseTextProps
> &
  BaseTextProps &
  OptionalAsPropConfig<T>;

const Text = <T extends TgphElement>({
  as,
  color = "default",
  size = "2",
  weight = "regular",
  align,
  className,
  tgphRef,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: TextProps<T>) => {
  if (!as) throw new Error("as prop is required");
  const Component: TgphElement = as
  return (
    <Component
      className={clsx(
        "m-0 box-border",
        align && alignMap[align],
        color && colorMap[color],
        size && sizeMap[size],
        weight && weightMap[weight],
        className,
      )}
      ref={tgphRef}
      {...props}
    />
  );
};

export { Text };
