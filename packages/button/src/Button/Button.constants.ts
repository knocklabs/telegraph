import type { tokens } from "@telegraph/style-engine";
import type { CssVarProp } from "@telegraph/style-engine";

// Styles for controlling the "border" on the outline variant
// of the button. We use a shadow so we don't need apply a border
// to all other buttons to make them the same height.
export type BaseStyleProps = {
  default_buttonShadowColor: keyof typeof tokens.color;
};

export const cssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  default_buttonShadowColor: {
    cssVar: "--box-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
} as const;

export const BUTTON_COLOR_MAP = {
  solid: {
    default: {
      backgroundColor: "gray-12",
    },
    accent: {
      backgroundColor: "accent-9",
    },
    red: {
      backgroundColor: "red-9",
    },
    gray: {
      backgroundColor: "gray-9",
    },
    green: {
      backgroundColor: "green-9",
    },
    blue: {
      backgroundColor: "blue-9",
    },
    yellow: {
      backgroundColor: "yellow-9",
    },
    purple: {
      backgroundColor: "purple-9",
    },
  },
  soft: {
    default: {
      backgroundColor: "gray-3",
    },
    gray: {
      backgroundColor: "gray-3",
    },
    red: {
      backgroundColor: "red-3",
    },
    accent: {
      backgroundColor: "accent-3",
    },
    green: {
      backgroundColor: "green-3",
    },
    blue: {
      backgroundColor: "blue-3",
    },
    yellow: {
      backgroundColor: "yellow-3",
    },
    purple: {
      backgroundColor: "purple-3",
    },
  },
  outline: {
    default: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "gray-6",
    },
    gray: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "gray-6",
    },
    red: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "red-6",
    },
    accent: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "accent-6",
    },
    green: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "green-6",
    },
    blue: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "blue-6",
    },
    yellow: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "yellow-6",
    },
    purple: {
      backgroundColor: "surface-1",
      default_buttonShadowColor: "purple-6",
    },
  },
  ghost: {
    default: {
      backgroundColor: "transparent",
    },
    gray: {
      backgroundColor: "transparent",
    },
    red: {
      backgroundColor: "transparent",
    },
    accent: {
      backgroundColor: "transparent",
    },
    green: {
      backgroundColor: "transparent",
    },
    blue: {
      backgroundColor: "transparent",
    },
    yellow: {
      backgroundColor: "transparent",
    },
    purple: {
      backgroundColor: "transparent",
    },
  },
} as const;

export const BUTTON_SIZE_MAP = {
  default: {
    "0": {
      w: "auto",
      h: "5",
      gap: "0_5",
      px: "1",
      rounded: "2",
    },
    "1": {
      w: "auto",
      h: "6",
      gap: "1",
      px: "1_5",
      rounded: "2",
    },
    "2": {
      w: "auto",
      h: "8",
      gap: "1_5",
      px: "2",
      rounded: "2",
    },
    "3": {
      w: "auto",
      h: "10",
      gap: "2",
      px: "3",
      rounded: "3",
    },
  },
  "icon-only": {
    "0": {
      w: "5",
      h: "5",
      gap: "0",
      px: "0",
      rounded: "2",
    },
    "1": {
      w: "6",
      h: "6",
      gap: "0",
      px: "0",
      rounded: "2",
    },
    "2": {
      w: "8",
      h: "8",
      gap: "0",
      px: "0",
      rounded: "2",
    },
    "3": {
      w: "10",
      h: "10",
      gap: "0",
      px: "0",
      rounded: "3",
    },
  },
} as const;

export const TEXT_SIZE_MAP = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const TEXT_COLOR_MAP = {
  solid: {
    default: "white",
    gray: "white",
    red: "white",
    accent: "white",
    green: "white",
    blue: "white",
    yellow: "white",
    purple: "white",
    disabled: "disabled",
  },
  soft: {
    default: "default",
    gray: "gray",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  outline: {
    default: "default",
    gray: "gray",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  ghost: {
    default: "default",
    gray: "gray",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
} as const;

export const ICON_SIZE_MAP = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const ICON_COLOR_MAP = {
  solid: {
    default: "white",
    gray: "white",
    red: "white",
    accent: "white",
    green: "white",
    blue: "white",
    yellow: "white",
    purple: "white",
    disabled: "disabled",
  },
  soft: {
    default: "default",
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  outline: {
    default: "default",
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  ghost: {
    default: "gray",
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
} as const;

export const ICON_VARIANT_MAP = {
  default: "secondary",
  "icon-only": "primary",
} as const;

export type ButtonVariant = keyof typeof BUTTON_COLOR_MAP;
export type ButtonColor = keyof (typeof BUTTON_COLOR_MAP)[ButtonVariant];
export type ButtonSize = keyof (typeof BUTTON_SIZE_MAP)["default"];
