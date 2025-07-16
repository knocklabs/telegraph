import type { tokens } from "@telegraph/style-engine";
import type { CssVarProp } from "@telegraph/style-engine";

// Styles for controlling the "border" on the outline variant
// of the button. We use a shadow so we don't need apply a border
// to all other buttons to make them the same height.
export type BaseStyleProps = {
  default_buttonShadowColor: keyof typeof tokens.color;
  hover_buttonShadowColor: keyof typeof tokens.color;
  focus_buttonShadowColor: keyof typeof tokens.color;
  active_buttonShadowColor: keyof typeof tokens.color;
};

export const cssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  default_buttonShadowColor: {
    cssVar: "--box-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
  hover_buttonShadowColor: {
    cssVar: "--tgph-button-hover-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
  focus_buttonShadowColor: {
    cssVar: "--tgph-button-focus-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
  active_buttonShadowColor: {
    cssVar: "--tgph-button-active-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
} as const;

export const BUTTON_COLOR_MAP = {
  solid: {
    default: {
      backgroundColor: "gray-12",
      hover_backgroundColor: "gray-11",
      focus_backgroundColor: "gray-10",
      active_backgroundColor: "gray-10",
    },
    accent: {
      backgroundColor: "accent-9",
      hover_backgroundColor: "accent-10",
      focus_backgroundColor: "accent-11",
      active_backgroundColor: "accent-11",
    },
    red: {
      backgroundColor: "red-9",
      hover_backgroundColor: "red-10",
      focus_backgroundColor: "red-11",
      active_backgroundColor: "red-11",
    },
    gray: {
      backgroundColor: "gray-9",
      hover_backgroundColor: "gray-10",
      focus_backgroundColor: "gray-11",
      active_backgroundColor: "gray-11",
    },
    green: {
      backgroundColor: "green-9",
      hover_backgroundColor: "green-10",
      focus_backgroundColor: "green-11",
      active_backgroundColor: "green-11",
    },
    blue: {
      backgroundColor: "blue-9",
      hover_backgroundColor: "blue-10",
      focus_backgroundColor: "blue-11",
      active_backgroundColor: "blue-11",
    },
    yellow: {
      backgroundColor: "yellow-9",
      hover_backgroundColor: "yellow-10",
      focus_backgroundColor: "yellow-11",
      active_backgroundColor: "yellow-11",
    },
    purple: {
      backgroundColor: "purple-9",
      hover_backgroundColor: "purple-10",
      focus_backgroundColor: "purple-11",
      active_backgroundColor: "purple-11",
    },
  },
  soft: {
    default: {
      backgroundColor: "gray-3",
      hover_backgroundColor: "gray-4",
      focus_backgroundColor: "gray-5",
      active_backgroundColor: "gray-5",
    },
    gray: {
      backgroundColor: "gray-3",
      hover_backgroundColor: "gray-4",
      focus_backgroundColor: "gray-5",
      active_backgroundColor: "gray-5",
    },
    red: {
      backgroundColor: "red-3",
      hover_backgroundColor: "red-4",
      focus_backgroundColor: "red-5",
      active_backgroundColor: "red-5",
    },
    accent: {
      backgroundColor: "accent-3",
      hover_backgroundColor: "accent-4",
      focus_backgroundColor: "accent-5",
      active_backgroundColor: "accent-5",
    },
    green: {
      backgroundColor: "green-3",
      hover_backgroundColor: "green-4",
      focus_backgroundColor: "green-5",
      active_backgroundColor: "green-5",
    },
    blue: {
      backgroundColor: "blue-3",
      hover_backgroundColor: "blue-4",
      focus_backgroundColor: "blue-5",
      active_backgroundColor: "blue-5",
    },
    yellow: {
      backgroundColor: "yellow-3",
      hover_backgroundColor: "yellow-4",
      focus_backgroundColor: "yellow-5",
      active_backgroundColor: "yellow-5",
    },
    purple: {
      backgroundColor: "purple-3",
      hover_backgroundColor: "purple-4",
      focus_backgroundColor: "purple-5",
      active_backgroundColor: "purple-5",
    },
  },
  outline: {
    default: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "gray-2",      
      default_buttonShadowColor: "gray-6",
      hover_buttonShadowColor: "gray-7",
      focus_buttonShadowColor: "gray-8",
      active_buttonShadowColor: "gray-8",
    },
    gray: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "gray-2",

      default_buttonShadowColor: "gray-6",
      hover_buttonShadowColor: "gray-7",
      focus_buttonShadowColor: "gray-8",
      active_buttonShadowColor: "gray-8",
    },
    red: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "red-2",
      default_buttonShadowColor: "red-6",
      hover_buttonShadowColor: "red-7",
      focus_buttonShadowColor: "red-8",
      active_buttonShadowColor: "red-8",
    },
    accent: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "accent-2",
      default_buttonShadowColor: "accent-6",
      hover_buttonShadowColor: "accent-7",
      focus_buttonShadowColor: "accent-8",
      active_buttonShadowColor: "accent-8",
    },
    green: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "green-2",
      default_buttonShadowColor: "green-6",
      hover_buttonShadowColor: "green-7",
      focus_buttonShadowColor: "green-8",
      active_buttonShadowColor: "green-8",
    },
    blue: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "blue-2",
      default_buttonShadowColor: "blue-6",
      hover_buttonShadowColor: "blue-7",
      focus_buttonShadowColor: "blue-8",
      active_buttonShadowColor: "blue-8",
    },
    yellow: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "yellow-2",
      default_buttonShadowColor: "yellow-6",
      hover_buttonShadowColor: "yellow-7",
      focus_buttonShadowColor: "yellow-8",
      active_buttonShadowColor: "yellow-8",
    },
    purple: {
      backgroundColor: "surface-1",
      hover_backgroundColor: "purple-2",
      default_buttonShadowColor: "purple-6",
      hover_buttonShadowColor: "purple-7",
      focus_buttonShadowColor: "purple-8",
      active_buttonShadowColor: "purple-8",
    },
  },
  ghost: {
    default: {
      backgroundColor: "transparent",
      hover_backgroundColor: "gray-3",
      focus_backgroundColor: "gray-4",
      active_backgroundColor: "gray-4",
    },
    gray: {
      backgroundColor: "transparent",
      hover_backgroundColor: "gray-3",
      focus_backgroundColor: "gray-4",
      active_backgroundColor: "gray-4",
    },
    red: {
      backgroundColor: "transparent",
      hover_backgroundColor: "red-3",
      focus_backgroundColor: "red-4",
      active_backgroundColor: "red-4",
    },
    accent: {
      backgroundColor: "transparent",
      hover_backgroundColor: "accent-3",
      focus_backgroundColor: "accent-4",
      active_backgroundColor: "accent-4",
    },
    green: {
      backgroundColor: "transparent",
      hover_backgroundColor: "green-3",
      focus_backgroundColor: "green-4",
      active_backgroundColor: "green-4",
    },
    blue: {
      backgroundColor: "transparent",
      hover_backgroundColor: "blue-3",
      focus_backgroundColor: "blue-4",
      active_backgroundColor: "blue-4",
    },
    yellow: {
      backgroundColor: "transparent",
      hover_backgroundColor: "yellow-3",
      focus_backgroundColor: "yellow-4",
      active_backgroundColor: "yellow-4",
    },
    purple: {
      backgroundColor: "transparent",
      hover_backgroundColor: "purple-3",
      focus_backgroundColor: "purple-4",
      active_backgroundColor: "purple-4",
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
