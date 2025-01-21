import type { tokens } from "@telegraph/style-engine";
import type { CssVarProp } from "@telegraph/style-engine";

type BaseStyleProps = {
  flexDirection: "row" | "column" | "row-reverse" | "column-reverse";
  flexWrap: "wrap" | "nowrap" | "wrap-reverse";
  justifyContent:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  gap: keyof typeof tokens.spacing;
};

type ShorthandStyleProps = {
  direction: BaseStyleProps["flexDirection"];
  align: BaseStyleProps["alignItems"];
  justify: BaseStyleProps["justifyContent"];
  wrap: BaseStyleProps["flexWrap"];
};

const baseCssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  flexDirection: {
    cssVar: "--direction",
    tgphVar: "VARIABLE",
  },
  flexWrap: {
    cssVar: "--wrap",
    tgphVar: "VARIABLE",
  },
  justifyContent: {
    cssVar: "--justify",
    tgphVar: "VARIABLE",
  },
  alignItems: {
    cssVar: "--align",
    tgphVar: "VARIABLE",
  },
  gap: {
    cssVar: "--gap",
    tgphVar: "var(--tgph-spacing-VARIABLE)",
  },
};

const shorthandCssVars: Record<keyof ShorthandStyleProps, CssVarProp> = {
  direction: {
    cssVar: "--direction",
    tgphVar: "VARIABLE",
  },
  align: {
    cssVar: "--align",
    tgphVar: "VARIABLE",
  },
  justify: {
    cssVar: "--justify",
    tgphVar: "VARIABLE",
  },
  wrap: {
    cssVar: "--wrap",
    tgphVar: "VARIABLE",
  },
};

export const cssVars = {
  ...baseCssVars,
  ...shorthandCssVars,
} as const;

export type StyleProps = Partial<BaseStyleProps & ShorthandStyleProps>;
