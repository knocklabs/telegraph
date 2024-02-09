export const buttonColorMap = {
  solid: {
    gray: "bg-gray-9 hover:bg-gray-10 focus:bg-gray-11",
    red: "bg-red-9 hover:bg-red-10 focus:bg-red-11",
    accent: "bg-accent-9 hover:bg-accent-10 focus:bg-accent-11",
  },
  soft: {
    gray: "bg-gray-3  hover:bg-gray-4 focus:bg-gray-5",
    red: "bg-red-3 hover:bg-red-4 focus:bg-red-5",
    accent: "bg-accent-3 hover:bg-accent-4 focus:bg-accent-6",
  },
  outline: {
    gray: "bg-transparent",
    red: "bg-transparent",
    accent: "bg-transparent",
  },
  ghost: {
    gray: "bg-transparent hover:bg-gray-3 focus:bg-gray-4",
    red: "bg-transparent hover:bg-red-3 focus:bg-red-4",
    accent: "bg-transparent hover:bg-accent-3 focus:bg-accent-4",
  },
} as const;

export const textSizeMap = {
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const textColorMap = {
  solid: {
    gray: "white",
    red: "white",
    accent: "white",
  },
  soft: {
    gray: "default",
    red: "red",
    accent: "accent",
  },
  outline: {
    gray: "gray",
    red: "red",
    accent: "accent",
  },
  ghost: {
    gray: "default",
    red: "red",
    accent: "accent",
  },
} as const;
