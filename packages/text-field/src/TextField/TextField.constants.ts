export const SIZE = {
  Field: {
    "1": "h-6",
    "2": "h-8",
    "3": "h-10",
  },
} as const;

export const COLOR = {
  Field: {
    default: {
      outline: "bg-surface-1 border-1 border-gray-6 rounded-2",
      ghost: "bg-transparent border border-transparent",
    },
    disabled: {
      outline: "bg-surface-1 border border-gray-6 rounded-2",
      ghost: "bg-transparent border border-transparent",
    },
    error: {
      outline: "bg-surface-1 border-1 border-red-6 rounded-2",
      ghost: "bg-transparent border border-transparent",
    },
  },
  Label: {
    default: "default",
    error: "red",
    disabled: "disabled",
  },
  Message: {
    default: "gray",
    error: "red",
    disabled: "disabled",
  },
} as const;
