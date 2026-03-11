import type { tokens } from "@telegraph/style-engine";
import type { CssVarProp } from "@telegraph/style-engine";

// Styles for controlling the "border" on the outline variant
// of the button. We use a shadow so we don't need apply a border
// to all other buttons to make them the same height.
export type BaseStyleProps = {
  buttonShadowColor: keyof typeof tokens.color;
  buttonTextColor: keyof typeof tokens.color;
};

export const cssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  buttonShadowColor: {
    cssVar: "--box-shadow",
    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
  },
  buttonTextColor: {
    cssVar: "--tgph-button-text-color",
    value: "var(--tgph-VARIABLE)",
  },
} as const;

// Color map returns props that are spread across two layers:
// - Top-level props (backgroundColor, buttonShadowColor) go directly to style engine
// - `_hover`, `_focus`, `_active` objects use the new pseudo-class pattern
//
// Props like `backgroundColor` inside pseudo objects are Box-level props
// and flow through otherProps to <Stack> -> <Box>.
// Props like `buttonShadowColor` inside pseudo objects are Button-level
// props and are processed by the Button's own useStyleEngine.
export const BUTTON_COLOR_MAP = {
  solid: {
    default: {
      backgroundColor: "gray-12",
      _hover: {
        backgroundColor: "gray-11",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "gray-10",
      },
      _active: {
        backgroundColor: "gray-10",
      },
    },
    accent: {
      backgroundColor: "accent-9",
      _hover: {
        backgroundColor: "accent-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "accent-11",
      },
      _active: {
        backgroundColor: "accent-11",
      },
    },
    red: {
      backgroundColor: "red-9",
      _hover: {
        backgroundColor: "red-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "red-11",
      },
      _active: {
        backgroundColor: "red-11",
      },
    },
    gray: {
      backgroundColor: "gray-9",
      _hover: {
        backgroundColor: "gray-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "gray-11",
      },
      _active: {
        backgroundColor: "gray-11",
      },
    },
    green: {
      backgroundColor: "green-9",
      _hover: {
        backgroundColor: "green-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "green-11",
      },
      _active: {
        backgroundColor: "green-11",
      },
    },
    blue: {
      backgroundColor: "blue-9",
      _hover: {
        backgroundColor: "blue-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "blue-11",
      },
      _active: {
        backgroundColor: "blue-11",
      },
    },
    yellow: {
      backgroundColor: "yellow-9",
      _hover: {
        backgroundColor: "yellow-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "yellow-11",
      },
      _active: {
        backgroundColor: "yellow-11",
      },
    },
    purple: {
      backgroundColor: "purple-9",
      _hover: {
        backgroundColor: "purple-10",
        buttonTextColor: "white",
      },
      _focus: {
        backgroundColor: "purple-11",
      },
      _active: {
        backgroundColor: "purple-11",
      },
    },
  },
  soft: {
    default: {
      backgroundColor: "gray-3",
      _hover: {
        backgroundColor: "gray-4",
        buttonTextColor: "gray-12",
      },
      _focus: {
        backgroundColor: "gray-5",
      },
      _active: {
        backgroundColor: "gray-5",
      },
    },
    gray: {
      backgroundColor: "gray-3",
      _hover: {
        backgroundColor: "gray-4",
        buttonTextColor: "gray-12",
      },
      _focus: {
        backgroundColor: "gray-5",
      },
      _active: {
        backgroundColor: "gray-5",
      },
    },
    red: {
      backgroundColor: "red-3",
      _hover: {
        backgroundColor: "red-4",
        buttonTextColor: "red-11",
      },
      _focus: {
        backgroundColor: "red-5",
      },
      _active: {
        backgroundColor: "red-5",
      },
    },
    accent: {
      backgroundColor: "accent-3",
      _hover: {
        backgroundColor: "accent-4",
        buttonTextColor: "accent-11",
      },
      _focus: {
        backgroundColor: "accent-5",
      },
      _active: {
        backgroundColor: "accent-5",
      },
    },
    green: {
      backgroundColor: "green-3",
      _hover: {
        backgroundColor: "green-4",
        buttonTextColor: "green-11",
      },
      _focus: {
        backgroundColor: "green-5",
      },
      _active: {
        backgroundColor: "green-5",
      },
    },
    blue: {
      backgroundColor: "blue-3",
      _hover: {
        backgroundColor: "blue-4",
        buttonTextColor: "blue-11",
      },
      _focus: {
        backgroundColor: "blue-5",
      },
      _active: {
        backgroundColor: "blue-5",
      },
    },
    yellow: {
      backgroundColor: "yellow-3",
      _hover: {
        backgroundColor: "yellow-4",
        buttonTextColor: "yellow-11",
      },
      _focus: {
        backgroundColor: "yellow-5",
      },
      _active: {
        backgroundColor: "yellow-5",
      },
    },
    purple: {
      backgroundColor: "purple-3",
      _hover: {
        backgroundColor: "purple-4",
        buttonTextColor: "purple-11",
      },
      _focus: {
        backgroundColor: "purple-5",
      },
      _active: {
        backgroundColor: "purple-5",
      },
    },
  },
  outline: {
    default: {
      backgroundColor: "surface-3",
      buttonShadowColor: "gray-6",
      _hover: {
        backgroundColor: "gray-2",
        buttonShadowColor: "gray-7",
        buttonTextColor: "gray-12",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "gray-8",
      },
      _active: {
        backgroundColor: "gray-3",
        buttonShadowColor: "gray-8",
      },
    },
    gray: {
      backgroundColor: "surface-3",
      buttonShadowColor: "gray-6",
      _hover: {
        backgroundColor: "gray-2",
        buttonShadowColor: "gray-7",
        buttonTextColor: "gray-12",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "gray-8",
      },
      _active: {
        backgroundColor: "gray-3",
        buttonShadowColor: "gray-8",
      },
    },
    red: {
      backgroundColor: "surface-3",
      buttonShadowColor: "red-6",
      _hover: {
        backgroundColor: "red-2",
        buttonShadowColor: "red-7",
        buttonTextColor: "red-11",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "red-8",
      },
      _active: {
        backgroundColor: "red-3",
        buttonShadowColor: "red-8",
      },
    },
    accent: {
      backgroundColor: "surface-3",
      buttonShadowColor: "accent-6",
      _hover: {
        backgroundColor: "accent-2",
        buttonShadowColor: "accent-7",
        buttonTextColor: "accent-11",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "accent-8",
      },
      _active: {
        backgroundColor: "accent-3",
        buttonShadowColor: "accent-8",
      },
    },
    green: {
      backgroundColor: "surface-3",
      buttonShadowColor: "green-6",
      _hover: {
        backgroundColor: "green-2",
        buttonShadowColor: "green-7",
        buttonTextColor: "green-11",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "green-8",
      },
      _active: {
        backgroundColor: "green-3",
        buttonShadowColor: "green-8",
      },
    },
    blue: {
      backgroundColor: "surface-3",
      buttonShadowColor: "blue-6",
      _hover: {
        backgroundColor: "blue-2",
        buttonShadowColor: "blue-7",
        buttonTextColor: "blue-11",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "blue-8",
      },
      _active: {
        backgroundColor: "blue-3",
        buttonShadowColor: "blue-8",
      },
    },
    yellow: {
      backgroundColor: "surface-3",
      buttonShadowColor: "yellow-6",
      _hover: {
        backgroundColor: "yellow-2",
        buttonShadowColor: "yellow-7",
        buttonTextColor: "yellow-11",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "yellow-8",
      },
      _active: {
        backgroundColor: "yellow-3",
        buttonShadowColor: "yellow-8",
      },
    },
    purple: {
      backgroundColor: "surface-3",
      buttonShadowColor: "purple-6",
      _hover: {
        backgroundColor: "purple-2",
        buttonShadowColor: "purple-7",
        buttonTextColor: "purple-11",
      },
      _focus: {
        backgroundColor: "surface-3",
        buttonShadowColor: "purple-8",
      },
      _active: {
        backgroundColor: "purple-3",
        buttonShadowColor: "purple-8",
      },
    },
  },
  ghost: {
    default: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "gray-3",
        buttonTextColor: "gray-12",
      },
      _focus: {
        backgroundColor: "gray-4",
      },
      _active: {
        backgroundColor: "gray-4",
      },
    },
    gray: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "gray-3",
        buttonTextColor: "gray-12",
      },
      _focus: {
        backgroundColor: "gray-4",
      },
      _active: {
        backgroundColor: "gray-4",
      },
    },
    red: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "red-3",
        buttonTextColor: "red-11",
      },
      _focus: {
        backgroundColor: "red-4",
      },
      _active: {
        backgroundColor: "red-4",
      },
    },
    accent: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "accent-3",
        buttonTextColor: "accent-11",
      },
      _focus: {
        backgroundColor: "accent-4",
      },
      _active: {
        backgroundColor: "accent-4",
      },
    },
    green: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "green-3",
        buttonTextColor: "green-11",
      },
      _focus: {
        backgroundColor: "green-4",
      },
      _active: {
        backgroundColor: "green-4",
      },
    },
    blue: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "blue-3",
        buttonTextColor: "blue-11",
      },
      _focus: {
        backgroundColor: "blue-4",
      },
      _active: {
        backgroundColor: "blue-4",
      },
    },
    yellow: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "yellow-3",
        buttonTextColor: "yellow-11",
      },
      _focus: {
        backgroundColor: "yellow-4",
      },
      _active: {
        backgroundColor: "yellow-4",
      },
    },
    purple: {
      backgroundColor: "transparent",
      _hover: {
        backgroundColor: "purple-3",
        buttonTextColor: "purple-11",
      },
      _focus: {
        backgroundColor: "purple-4",
      },
      _active: {
        backgroundColor: "purple-4",
      },
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
