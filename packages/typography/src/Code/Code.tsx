import {
  OptionalAsPropConfig,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Box } from "@telegraph/layout";
import clsx from "clsx";

import { CODE_PROPS } from "./Code.constants";

type BaseCodeProps = {
  size?: keyof typeof CODE_PROPS.size;
  weight?: keyof typeof CODE_PROPS.weight;
  variant?: keyof typeof CODE_PROPS.variant;
  color?: keyof typeof CODE_PROPS.variant.soft;
};

type CodeProps<T extends TgphElement> = BaseCodeProps &
  Omit<TgphComponentProps<typeof Box<T>>, keyof BaseCodeProps> &
  OptionalAsPropConfig<T>;

const Code = <T extends TgphElement>({
  as,
  size = "2",
  weight = "regular",
  variant = "soft",
  color = "default",
  className,
  // Remove this from props to avoid passing to DOM element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  internal_optionalAs: _internal_optionalAs,
  ...props
}: CodeProps<T>) => {
  if (!as) throw new Error("as prop is required");
  return (
    <Box
      as={as as TgphElement}
      className={clsx(
        "box-border font-mono",
        color && CODE_PROPS.variant[variant][color],
        size && CODE_PROPS.size[size],
        weight && CODE_PROPS.weight[weight],
        className,
      )}
      display="inline"
      m="0"
      px="1"
      rounded="1"
      {...props}
    />
  );
};

export { Code };
