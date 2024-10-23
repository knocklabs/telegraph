import type { TgphComponentProps } from "@telegraph/helpers";
import type { Box } from "@telegraph/layout";

export type Size = "1" | "2" | "3";
export type Variant = "outline" | "ghost";
export type State = "default" | "disabled" | "error";

type SizeMap = {
  [key in Size]: TgphComponentProps<typeof Box>;
};

type VariantMap = {
  [key in Variant]: TgphComponentProps<typeof Box>;
};

type StateMap = {
  [key in State]: TgphComponentProps<typeof Box>;
};

export const sizeMap: SizeMap = {
  "1": {
    p: "1",
  },
  "2": {
    px: "2",
    py: "1",
  },
  "3": {
    px: "3",
    py: "2",
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
