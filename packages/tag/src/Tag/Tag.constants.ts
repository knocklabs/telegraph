import type { CssVarProp } from "@telegraph/style-engine";

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
    "0": { pl: "1_5" },
    "1": { pl: "2" },
    "2": { pl: "2_5" },
  },
  Text: {
    "0": {
      mr: "1_5",
    },
    "1": {
      mr: "2",
    },
    "2": {
      mr: "2_5",
    },
  },
  Button: {
    "0": {
      ml: "0_5",
    },
    "1": {
      ml: "1",
    },
    "2": {
      ml: "1",
    },
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
      default: "gray-2",
      accent: "accent-2",
      gray: "gray-2",
      red: "red-2",
      blue: "blue-2",
      green: "green-2",
      yellow: "yellow-2",
      purple: "purple-2",
    },
  },
  Border: {
    soft: {
      default: "gray-4",
      accent: "accent-4",
      gray: "gray-4",
      red: "red-4",
      blue: "blue-4",
      green: "green-4",
      yellow: "yellow-4",
      purple: "purple-4",
    },
  },
  Icon: {
    solid: {
      default: "contrast",
      gray: "white",
      red: "white",
      accent: "white",
      blue: "white",
      green: "white",
      yellow: "black",
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
      default: "contrast",
      gray: "white",
      accent: "white",
      red: "white",
      blue: "white",
      green: "white",
      yellow: "black",
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

export const VARIANT = {
  Button: {
    solid: "solid",
    soft: "ghost",
  },
} as const;

export type BaseStyleProps = {
  tagBorderColor: string;
};

export const cssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  tagBorderColor: {
    cssVar: "--box-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
} as const;
