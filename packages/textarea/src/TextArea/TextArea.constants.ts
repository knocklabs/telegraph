export const SIZE = {
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
} as const;

export const COLOR = {
  default: {
    outline: {
      bg: "surface-3",
      border: "px",
      borderColor: "gray-6",
      hover_borderColor: "gray-7",
      hover_backgroundColor: "surface-2",
      active_borderColor: "blue-8",
      active_backgroundColor: "surface-3",
      focus_borderColor: "blue-8",
      focus_backgroundColor: "surface-3",
    },
    ghost: {
      bg: "transparent",
      border: "px",
      borderColor: "transparent",
      hover_borderColor: "gray-7",
      hover_backgroundColor: "surface-2",
      active_borderColor: "blue-8",
      active_backgroundColor: "surface-3",
      focus_borderColor: "blue-8",
      focus_backgroundColor: "surface-3",
    },
  },
  disabled: {
    outline: {
      bg: "gray-2",
      border: "px",
      borderColor: "gray-2",
    },
    ghost: {
      bg: "transparent",
      border: "px",
      borderColor: "transparent",
    },
  },
  error: {
    outline: {
      bg: "surface-3",
      border: "px",
      borderColor: "red-6",
      hover_borderColor: "red-7",
      hover_backgroundColor: "surface-2",
      active_borderColor: "blue-8",
      active_backgroundColor: "surface-3",
      focus_borderColor: "blue-8",
      focus_backgroundColor: "surface-3",
    },
    ghost: {
      bg: "surface-3",
      border: "px",
      borderColor: "red-6",
      hover_borderColor: "red-7",
      hover_backgroundColor: "surface-2",
      active_borderColor: "blue-8",
      active_backgroundColor: "surface-3",
      focus_borderColor: "blue-8",
      focus_backgroundColor: "surface-3",
    },
  },
} as const;
