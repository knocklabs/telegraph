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
    value: "VARIABLE",
  },
  flexWrap: {
    cssVar: "--wrap",
    value: "VARIABLE",
  },
  justifyContent: {
    cssVar: "--justify",
    value: "VARIABLE",
  },
  alignItems: {
    cssVar: "--align",
    value: "VARIABLE",
  },
  gap: {
    cssVar: "--gap",
    value: "var(--tgph-spacing-VARIABLE)",
  },
} as const;

const shorthandCssVars: Record<keyof ShorthandStyleProps, CssVarProp> = {
  direction: {
    cssVar: "--direction",
    value: "VARIABLE",
  },
  align: {
    cssVar: "--align",
    value: "VARIABLE",
  },
  justify: {
    cssVar: "--justify",
    value: "VARIABLE",
  },
  wrap: {
    cssVar: "--wrap",
    value: "VARIABLE",
  },
} as const;

export const cssVars = {
  ...baseCssVars,
  ...shorthandCssVars,
} as const;

export type StyleProps = Partial<BaseStyleProps & ShorthandStyleProps>;
