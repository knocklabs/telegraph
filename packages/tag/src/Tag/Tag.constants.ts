export const SIZE = {
  Root: {
    "1": "h-6",
    "2": "h-8",
  },
} as const;

export const COLOR = {
  Root: {
    solid: {
      accent: "bg-accent-9",
      gray: "bg-gray-9",
      red: "bg-red-9",
    },
    soft: {
      accent: "bg-accent-3",
      gray: "bg-gray-3",
      red: "bg-red-3",
    },
  },
  Icon: {
    solid: {
      gray: "white",
      red: "white",
      accent: "white",
    },
    soft: {
      gray: "gray",
      accent: "accent",
      red: "red",
    },
  },
  Text: {
    solid: {
      gray: "white",
      red: "white",
      accent: "white",
    },
    soft: {
      gray: "gray",
      accent: "accent",
      red: "red",
    },
  },
} as const;
