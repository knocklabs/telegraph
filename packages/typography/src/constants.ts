import type { tokens } from "@telegraph/style-engine";
import type { CssVarProp } from "@telegraph/style-engine";

export type BaseStyleProps = {
  color: keyof typeof tokens.color;
  fontSize: keyof (typeof tokens)["text"];
  weight: keyof (typeof tokens)["weight"];
  leading: keyof (typeof tokens)["leading"];
  tracking: keyof (typeof tokens)["tracking"];
  align: "left" | "center" | "right";
  family: keyof (typeof tokens)["family"];
  textOverflow: "clip" | "ellipsis" | "string";
};

const baseCssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  color: {
    cssVar: "--color",
    value: "var(--tgph-VARIABLE)",
  },
  fontSize: {
    cssVar: "--font-size",
    value: "var(--tgph-text-VARIABLE)",
  },
  weight: {
    cssVar: "--weight",
    value: "var(--tgph-weight-VARIABLE)",
  },
  leading: {
    cssVar: "--leading",
    value: "var(--tgph-leading-VARIABLE)",
  },
  tracking: {
    cssVar: "--tracking",
    value: "var(--tgph-tracking-VARIABLE)",
  },
  align: {
    cssVar: "--text-align",
    value: "VARIABLE",
  },
  family: {
    cssVar: "--font-family",
    value: "var(--tgph-family-VARIABLE)",
  },
  textOverflow: {
    cssVar: "--text-overflow",
    value: "VARIABLE",
  },
};

export const cssVars = baseCssVars;

export type StyleProps = Partial<BaseStyleProps>;

export const COLOR_MAP = {
  default: "gray-12",
  gray: "gray-11",
  red: "red-11",
  beige: "beige-11",
  blue: "blue-11",
  green: "green-11",
  yellow: "yellow-11",
  purple: "purple-11",
  accent: "accent-11",
  white: "white",
  black: "black",
  disabled: "gray-9",
} as const;
