export const sizeMap = {
  "1": {
    stack: {
      w: "5",
      h: "5",
    },
    text: {
      size: "0",
    },
  },
  "2": {
    stack: {
      w: "6",
      h: "6",
    },
    text: { size: "1" },
  },
  "3": {
    stack: {
      w: "8",
      h: "8",
    },
    text: {
      size: "2",
    },
  },
} as const;

export const colorMap = {
  light: {
    default: {
      default: {
        stack: {
          borderColor: "gray-3",
          bg: "surface-1",
        },
        text: {
          color: "default",
        },
      },
      pressed: {
        stack: {
          borderColor: "gray-3",
          bg: "gray-4",
        },
        text: {
          color: "default",
        },
      },
      contrast: {
        default: {
          stack: {
            borderColor: "gray-3",
            bg: "transparent",
          },
          text: {
            color: "white",
          },
        },
        pressed: {
          stack: {
            borderColor: "gray-3",
            bg: "alpha-black-2",
          },
          text: {
            color: "default",
          },
        },
      },
    },
  },
  dark: {
    default: {
      default: {
        stack: {
          borderColor: "gray-3",
          bg: "surface-1",
        },
        text: {
          color: "default",
        },
      },
      pressed: {
        stack: {
          borderColor: "gray-3",
          bg: "gray-4",
        },
        text: {
          color: "default",
        },
      },
    },
    contrast: {
      default: {
        stack: {
          borderColor: "black",
          bg: "transparent",
        },
        text: {
          color: "black",
        },
      },
      pressed: {
        stack: {
          borderColor: "gray-3",
          bg: "alpha-black-2",
        },
        text: {
          color: "default",
        },
      },
    },
  },
} as const;
