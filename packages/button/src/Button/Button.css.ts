import {
  StyleVariant,
  keyframes,
  style,
  tokens,
  variant,
} from "@telegraph/style-engine";

const rotate = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

export const loadingIconStyles = style({
  animationName: rotate,
  animationDuration: "1s",
  animationIterationCount: "infinite",
  animationTimingFunction: "linear",
});

export const baseStyles = style({
  appearance: "none",
  cursor: "pointer",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
  textDecoration: "none",
  ":disabled": {
    cursor: "not-allowed",
  },
  selectors: {
    "&[data-tgph-button-state=disabled]:hover": {
      // Revert background color on hover for disabled buttons.
      // This ensures the button doesn't change background
      // color when hovered over in a disabled state.
      backgroundColor: "revert",
    },
  },
});

export const solidVariant = variant({
  variants: {
    color: {
      default: {
        backgroundColor: tokens.color["gray-12"],
        ":hover": {
          backgroundColor: tokens.color["gray-11"],
        },
        ":focus": {
          backgroundColor: tokens.color["gray-10"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["gray-10"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      accent: {
        backgroundColor: tokens.color["accent-9"],
        ":hover": {
          backgroundColor: tokens.color["accent-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["accent-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["accent-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      red: {
        backgroundColor: tokens.color["red-9"],
        ":hover": {
          backgroundColor: tokens.color["red-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["red-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["red-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      gray: {
        backgroundColor: tokens.color["gray-9"],
        ":hover": {
          backgroundColor: tokens.color["gray-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["gray-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["gray-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      green: {
        backgroundColor: tokens.color["green-9"],
        ":hover": {
          backgroundColor: tokens.color["green-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["green-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["green-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      blue: {
        backgroundColor: tokens.color["blue-9"],
        ":hover": {
          backgroundColor: tokens.color["blue-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["blue-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["blue-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      yellow: {
        backgroundColor: tokens.color["yellow-9"],
        ":hover": {
          backgroundColor: tokens.color["yellow-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["yellow-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["yellow-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      purple: {
        backgroundColor: tokens.color["purple-9"],
        ":hover": {
          backgroundColor: tokens.color["purple-10"],
        },
        ":focus": {
          backgroundColor: tokens.color["purple-11"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["purple-11"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
    },
  },
});

export const softVariant = variant({
  variants: {
    color: {
      default: {
        backgroundColor: tokens.color["gray-3"],
        ":hover": {
          backgroundColor: tokens.color["gray-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["gray-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["gray-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      gray: {
        backgroundColor: tokens.color["gray-3"],
        ":hover": {
          backgroundColor: tokens.color["gray-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["gray-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["gray-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      red: {
        backgroundColor: tokens.color["red-3"],
        ":hover": {
          backgroundColor: tokens.color["red-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["red-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["red-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      accent: {
        backgroundColor: tokens.color["accent-3"],
        ":hover": {
          backgroundColor: tokens.color["accent-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["accent-6"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["accent-6"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      green: {
        backgroundColor: tokens.color["green-3"],
        ":hover": {
          backgroundColor: tokens.color["green-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["green-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["green-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      blue: {
        backgroundColor: tokens.color["blue-3"],
        ":hover": {
          backgroundColor: tokens.color["blue-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["blue-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["blue-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      yellow: {
        backgroundColor: tokens.color["yellow-3"],
        ":hover": {
          backgroundColor: tokens.color["yellow-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["yellow-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["yellow-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
      purple: {
        backgroundColor: tokens.color["purple-3"],
        ":hover": {
          backgroundColor: tokens.color["purple-4"],
        },
        ":focus": {
          backgroundColor: tokens.color["purple-5"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["purple-5"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
        },
      },
    },
  },
});

export const outlineVariant = variant({
  base: {
    backgroundColor: tokens.color["surface-1"],
    transition:
      "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    vars: {
      "--tgph-button-shadow": "inset 0 0 0 1px",
    },
  },
  variants: {
    color: {
      default: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      gray: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["gray-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      red: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["red-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["red-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["red-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["red-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      accent: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["accent-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["accent-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["accent-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["accent-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      green: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["green-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["green-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["green-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["green-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      blue: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["blue-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["blue-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["blue-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["blue-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      yellow: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["yellow-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["yellow-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["yellow-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["yellow-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
      purple: {
        boxShadow: `var(--tgph-button-shadow) ${tokens.color["purple-6"]}`,
        ":hover": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["purple-7"]}`,
        },
        ":focus": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["purple-8"]}`,
        },
        "&[data-tgph-button-state=active]": {
          boxShadow: `var(--tgph-button-shadow) ${tokens.color["purple-8"]}`,
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: tokens.color["gray-2"],
          boxShadow: "none",
        },
      },
    },
  },
});

export const ghostVariant = variant({
  base: {
    backgroundColor: "transparent",
  },
  variants: {
    color: {
      default: {
        ":hover": {
          backgroundColor: tokens.color["gray-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["gray-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["gray-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      gray: {
        ":hover": {
          backgroundColor: tokens.color["gray-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["gray-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["gray-4"],
        },
        "[data-tgph-button-state=active] > span": {
          color: tokens.color["gray-12"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      red: {
        ":hover": {
          backgroundColor: tokens.color["red-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["red-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["red-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      accent: {
        ":hover": {
          backgroundColor: tokens.color["accent-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["accent-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["accent-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      green: {
        ":hover": {
          backgroundColor: tokens.color["green-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["green-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["green-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      blue: {
        ":hover": {
          backgroundColor: tokens.color["blue-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["blue-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["blue-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      yellow: {
        ":hover": {
          backgroundColor: tokens.color["yellow-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["yellow-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["yellow-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
      purple: {
        ":hover": {
          backgroundColor: tokens.color["purple-3"],
        },
        ":focus": {
          backgroundColor: tokens.color["purple-4"],
        },
        "&[data-tgph-button-state=active]": {
          backgroundColor: tokens.color["purple-4"],
        },
        "&[data-tgph-button-state=disabled]": {
          backgroundColor: "transparent",
        },
      },
    },
  },
});

export type SolidVariant = StyleVariant<typeof solidVariant>;
export type SoftVariant = StyleVariant<typeof softVariant>;
export type OutlineVariant = StyleVariant<typeof outlineVariant>;
export type GhostVariant = StyleVariant<typeof ghostVariant>;
