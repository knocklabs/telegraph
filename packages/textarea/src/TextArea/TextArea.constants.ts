import type { TgphComponentProps } from "@telegraph/helpers";
import type { Text } from "@telegraph/typography";

export type Size = "1" | "2" | "3";
export type Variant = "outline" | "ghost";
export type State = "default" | "disabled" | "error";

type SizeMap = {
  [key in Size]: Partial<
    Pick<TgphComponentProps<typeof Text>, "p" | "size" | "px" | "py">
  >;
};

type VariantMap = {
  [key in Variant]: Partial<
    Pick<TgphComponentProps<typeof Text>, "border" | "borderColor">
  >;
};

type StateMap = {
  [key in State]: Partial<
    Pick<TgphComponentProps<typeof Text>, "bg" | "borderColor">
  >;
};

export const sizeMap: SizeMap = {
  "1": {
    px: "1_5",
    py: "1",
    size: "1",
  },
  "2": {
    px: "2",
    py: "1_5",
    size: "2",
  },
  "3": {
    px: "3",
    py: "2",
    size: "3",
  },
};

export const variantMap: VariantMap = {
  outline: {
    border: "px",
  },
  ghost: {
    border: "px",
    borderColor: "transparent",
  },
};

export const stateMap: StateMap = {
  default: {},
  disabled: {
    bg: "gray-2",
    borderColor: "gray-2",
  },
  error: {
    borderColor: "red-6",
  },
};
