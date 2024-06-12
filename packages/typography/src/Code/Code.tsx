import {
  OptionalAsPropConfig,
  PolymorphicPropsWithTgphRef,
  TgphElement,
} from "@telegraph/helpers";
import clsx from "clsx";

import { CODE_PROPS } from "./Code.constants";

type BaseCodeProps = {
  as: "span" | "div" | "pre" | "code";
  size?: keyof typeof CODE_PROPS.size;
  weight?: keyof typeof CODE_PROPS.weight;
  variant?: keyof typeof CODE_PROPS.variant;
  color?: keyof typeof CODE_PROPS.variant.soft;
};

type CodeProps<T extends TgphElement> = Omit<
  PolymorphicPropsWithTgphRef<T, HTMLElement>,
  keyof BaseCodeProps
> &
  BaseCodeProps &
  OptionalAsPropConfig<T>;

const Code = <T extends TgphElement>({
  as,
  size = "2",
  weight = "regular",
  variant = "soft",
  color = "default",
  className,
  tgphRef,
  // Remove this from props to avoid passing to DOM element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: CodeProps<T>) => {
  if (!as) throw new Error("as prop is required");
  const Component: TgphElement = as;
  return (
    <Component
      className={clsx(
        "m-0 box-border font-mono px-1 rounded-1",
        color && CODE_PROPS.variant[variant][color],
        size && CODE_PROPS.size[size],
        weight && CODE_PROPS.weight[weight],
        className,
      )}
      ref={tgphRef}
      {...props}
    />
  );
};

export { Code };
