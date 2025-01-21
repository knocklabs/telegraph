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
};

const baseCssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  color: {
    cssVar: "--color",
    tgphVar: "var(--tgph-VARIABLE)",
  },
  fontSize: {
    cssVar: "--font-size",
    tgphVar: "var(--tgph-text-VARIABLE)",
  },
  weight: {
    cssVar: "--weight",
    tgphVar: "var(--tgph-weight-VARIABLE)",
  },
  leading: {
    cssVar: "--leading",
    tgphVar: "var(--tgph-leading-VARIABLE)",
  },
  tracking: {
    cssVar: "--tracking",
    tgphVar: "var(--tgph-tracking-VARIABLE)",
  },
  align: {
    cssVar: "--text-align",
    tgphVar: "VARIABLE",
  },
  family: {
    cssVar: "--font-family",
    tgphVar: "var(--tgph-family-VARIABLE)",
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
} as const;
