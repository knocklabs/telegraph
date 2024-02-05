import { color } from "../tokens/color";

export const semanticColor = {
  text: {
    primary: {
      black: color.black[12],
      white: color.white[12],
      gray: color.gray[12],
      beige: color.beige[12],
      accent: color.accent[12],
      green: color.green[12],
      yellow: color.yellow[12],
      blue: color.blue[12],
      red: color.red[12],
      disabled: color.gray[8],
    },
    secondary: {
      black: color.black[11],
      white: color.white[11],
      gray: color.gray[11],
      beige: color.beige[11],
      accent: color.accent[11],
      green: color.green[11],
      yellow: color.yellow[11],
      blue: color.blue[11],
      red: color.red[11],
      disabled: color.gray[8],
    },
  },
  // color.button.solid.background.accent.focus
  button: {
    solid: {
      background: {
        accent: {
          default: color.accent[9],
          hover: color.accent[10],
          focus: color.accent[11],
        },
        disabled: {
          default: color.gray[2],
        },
      },
      text: {
        accent: color.white,
        disabled: color.gray[8],
      },
      stroke: {
        accent: color.white,
        disabled: color.gray[8],
      },
    },
    ghost: {
      background: {
        accent: {
          default: color.transparent,
          hover: color.accent[3],
          focus: color.accent[4],
        },
        gray: {
          default: color.transparent,
          hover: color.gray[3],
          focus: color.gray[4],
        },
        red: {
          default: color.transparent,
          hover: color.red[3],
          focus: color.red[4],
        },

        disabled: {
          default: color.transparent,
        },
      },
      text: {
        accent: color.accent[11],
        gray: color.gray[11],
        red: color.red[11],
        disabled: color.gray[8],
      },
      icon: {
        accent: color.accent[11],
        gray: color.gray[11],
        red: color.red[11],
        disabled: color.gray[8],
      },
    },
    soft: {
      background: {
        red: {
          active: color.red[3],
          hover: color.red[4],
          focus: color.red[5],
        },
        disabled: color.gray[2],
      },
      text: {
        red: color.white,
        disabled: color.gray[8],
      },
      icon: {
        red: color.white,
        disabled: color.gray[8],
      },
    },
    outlined: {
      background: {
        gray: color.transparent,
        disabled: color.gray[2],
      },
      border: {
        gray: {
          active: color.gray[6],
          hover: color.gray[7],
          focus: color.gray[8],
        },
      },
      text: {
        gray: color.gray[12],
        disabled: color.gray[8],
      },
      icon: {
        gray: color.gray[12],
        disabled: color.gray[8],
      },
    },
  },
};
