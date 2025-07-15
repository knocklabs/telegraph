export const SIZE = {
  Container: {
    "1": {
      h: "6",
      pl: "0",
      rounded: "2",
    },
    "2": {
      h: "8",
      pl: "0",
      rounded: "2",
    },
    "3": {
      h: "10",
      pl: "0",
      rounded: "2",
    },
  },
  Text: {
    "1": {
      size: "1",
      px: "1",
    },
    "2": {
      size: "2",
      px: "2",
    },
    "3": {
      size: "3",
      px: "3",
    },
  },
  SlotLeading: {
    "1": {
      pl: 1_5,
    },
    "2": {
      pl: "2",
    },
    "3": {
      pl: "3",
    },
  },
  SlotTrailing: {
    "1": {
      pr: "1",
    },
    "2": {
      pr: "2",
    },
    "3": {
      pr: "3",
    },
  },
} as const;

export const COLOR = {
  Container: {
    default: {
      outline: {
        bg: "surface-1",
        border: "px",
        borderColor: "gray-6",
        hover_borderColor: "gray-7",
        focus_within_borderColor: "blue-8",
      },
      ghost: {
        bg: "transparent",
        border: "px",
        borderColor: "transparent",
        hover_backgroundColor: "gray-3",
        hover_borderColor: "transparent",
        focus_within_backgroundColor: "gray-4",
        focus_within_borderColor: "blue-8",
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
        bg: "surface-1",
        border: "px",
        borderColor: "red-6",
      },
      ghost: {
        bg: "transparent",
        border: "px",
        borderColor: "red-6",
      },
    },
  },
  Text: {
    default: {
      color: "default",
    },
    disabled: {
      color: "disabled",
    },
    error: {
      color: "default",
    },
  },
} as const;
