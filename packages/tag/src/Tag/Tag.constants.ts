export const SIZE = {
  Root: {
    "0": {
      h: "5",
    },
    "1": {
      h: "6",
    },
    "2": {
      h: "8",
    },
  },
} as const;

export const SPACING = {
  Root: {
    "0": "1",
    "1": "2",
    "2": "2",
  },
  Text: {
    "0": "1",
    "1": "2",
    "2": "2",
  },
} as const;

export const COLOR = {
  Root: {
    solid: {
      default: "gray-12",
      accent: "accent-9",
      gray: "gray-9",
      red: "red-9",
      blue: "blue-9",
      green: "green-9",
      yellow: "yellow-9",
      purple: "purple-9",
    },
    soft: {
      default: "gray-3",
      accent: "accent-3",
      gray: "gray-3",
      red: "red-3",
      blue: "blue-3",
      green: "green-3",
      yellow: "yellow-3",
      purple: "purple-3",
    },
  },
  Icon: {
    solid: {
      default: "white",
      gray: "white",
      red: "white",
      accent: "white",
      blue: "white",
      green: "white",
      yellow: "white",
      purple: "white",
    },
    soft: {
      default: "default",
      gray: "gray",
      accent: "accent",
      red: "red",
      blue: "blue",
      green: "green",
      yellow: "yellow",
      purple: "purple",
    },
  },
  Text: {
    solid: {
      default: "white",
      gray: "white",
      accent: "white",
      red: "white",
      blue: "white",
      green: "white",
      yellow: "white",
      purple: "white",
    },
    soft: {
      default: "default",
      gray: "gray",
      accent: "accent",
      red: "red",
      blue: "blue",
      green: "green",
      yellow: "yellow",
      purple: "purple",
    },
  },
  Button: {
    solid: {
      default: "default",
      gray: "gray",
      accent: "accent",
      red: "red",
      blue: "blue",
      green: "green",
      yellow: "yellow",
      purple: "purple",
    },
    soft: {
      default: "gray",
      gray: "gray",
      accent: "accent",
      red: "red",
      blue: "blue",
      green: "green",
      yellow: "yellow",
      purple: "purple",
    },
  },
} as const;
