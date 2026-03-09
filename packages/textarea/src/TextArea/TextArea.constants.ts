import type { TgphComponentProps } from "@telegraph/helpers";
import type { Text } from "@telegraph/typography";

export type Size = "1" | "2" | "3";
export type Variant = "outline" | "ghost";
export type State = "default" | "disabled" | "error";

type SizeMap = {
  [key in Size]: Partial<
    Pick<
      TgphComponentProps<typeof Text>,
      "p" | "size" | "px" | "py" | "rounded"
    >
  >;
};

type VariantMap = {
  [key in Variant]: Partial<
    Pick<
      TgphComponentProps<typeof Text>,
      "border" | "borderColor" | "hover" | "active" | "focus"
    >
  >;
};

type StateMap = {
  [key in State]: {
    [key in Variant]: Partial<
      Pick<
        TgphComponentProps<typeof Text>,
        "bg" | "borderColor" | "hover" | "active" | "focus"
      >
    >;
  };
};

export const sizeMap: SizeMap = {
  "1": {
    px: "1_5",
    py: "1",
    size: "1",
    rounded: "2",
  },
  "2": {
    px: "2",
    py: "1_5",
    size: "2",
    rounded: "2",
  },
  "3": {
    px: "3",
    py: "2",
    size: "3",
    rounded: "2",
  },
};

export const variantMap: VariantMap = {
  outline: {
    border: "px",
    borderColor: "gray-6",
    hover: {
      borderColor: "gray-7",
      backgroundColor: "surface-2",
    },
    active: {
      borderColor: "blue-8",
      backgroundColor: "surface-3",
    },
    focus: {
      borderColor: "blue-8",
      backgroundColor: "surface-3",
    },
  },
  ghost: {
    border: "px",
    borderColor: "transparent",
    hover: {
      borderColor: "gray-7",
      backgroundColor: "surface-2",
    },
    active: {
      borderColor: "blue-8",
      backgroundColor: "surface-3",
    },
    focus: {
      borderColor: "blue-8",
      backgroundColor: "surface-3",
    },
  },
};

export const stateMap: StateMap = {
  default: {
    outline: {
      bg: "surface-3",
    },
    ghost: {
      bg: "transparent",
    },
  },
  disabled: {
    outline: {
      bg: "gray-2",
      borderColor: "transparent",
      hover: undefined,
      active: undefined,
      focus: undefined,
    },
    ghost: {
      bg: "transparent",
      borderColor: "transparent",
      hover: undefined,
      active: undefined,
      focus: undefined,
    },
  },
  error: {
    outline: {
      bg: "surface-3",
      borderColor: "red-6",
      hover: {
        borderColor: "red-7",
      },
    },
    ghost: {
      bg: "surface-3",
      borderColor: "red-6",
      hover: {
        borderColor: "red-7",
      },
    },
  },
};
