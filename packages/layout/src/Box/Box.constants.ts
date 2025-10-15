import type { tokens } from "@telegraph/style-engine";
import type { CssVarProp } from "@telegraph/style-engine";
import type { CSSProperties } from "react";

export type BaseStyleProps = {
  display: "block" | "inline-block" | "inline" | "flex" | "inline-flex";
  backgroundColor: keyof typeof tokens.color;
  hover_backgroundColor: keyof typeof tokens.color;
  focus_backgroundColor: keyof typeof tokens.color;
  active_backgroundColor: keyof typeof tokens.color;
  focus_within_backgroundColor: keyof typeof tokens.color;
  borderColor: keyof typeof tokens.color;
  hover_borderColor: keyof typeof tokens.color;
  focus_borderColor: keyof typeof tokens.color;
  active_borderColor: keyof typeof tokens.color;
  focus_within_borderColor: keyof typeof tokens.color;
  borderWidth: keyof typeof tokens.spacing;
  borderTopWidth: keyof typeof tokens.spacing;
  borderBottomWidth: keyof typeof tokens.spacing;
  borderLeftWidth: keyof typeof tokens.spacing;
  borderRightWidth: keyof typeof tokens.spacing;
  borderStyle: keyof (typeof tokens)["border-style"];
  padding: keyof typeof tokens.spacing;
  margin: keyof typeof tokens.spacing;
  paddingX: keyof typeof tokens.spacing;
  paddingY: keyof typeof tokens.spacing;
  paddingTop: keyof typeof tokens.spacing;
  paddingBottom: keyof typeof tokens.spacing;
  paddingLeft: keyof typeof tokens.spacing;
  paddingRight: keyof typeof tokens.spacing;
  marginX: keyof typeof tokens.spacing;
  marginY: keyof typeof tokens.spacing;
  marginTop: keyof typeof tokens.spacing;
  marginBottom: keyof typeof tokens.spacing;
  marginLeft: keyof typeof tokens.spacing;
  marginRight: keyof typeof tokens.spacing;
  borderRadius: keyof typeof tokens.rounded;
  borderTopLeftRadius: keyof typeof tokens.rounded;
  borderTopRightRadius: keyof typeof tokens.rounded;
  borderBottomLeftRadius: keyof typeof tokens.rounded;
  borderBottomRightRadius: keyof typeof tokens.rounded;
  borderTopRadius: keyof typeof tokens.rounded;
  borderBottomRadius: keyof typeof tokens.rounded;
  borderLeftRadius: keyof typeof tokens.rounded;
  borderRightRadius: keyof typeof tokens.rounded;
  boxShadow: keyof typeof tokens.shadow;
  width: keyof typeof tokens.spacing;
  height: keyof typeof tokens.spacing;
  minWidth: keyof typeof tokens.spacing;
  minHeight: keyof typeof tokens.spacing;
  maxWidth: keyof typeof tokens.spacing;
  maxHeight: keyof typeof tokens.spacing;
  zIndex: keyof (typeof tokens)["zIndex"];
  position: "relative" | "absolute" | "fixed" | "sticky";
  top: keyof typeof tokens.spacing;
  left: keyof typeof tokens.spacing;
  right: keyof typeof tokens.spacing;
  bottom: keyof typeof tokens.spacing;
  overflow: "hidden" | "visible" | "scroll" | "auto";
  alignSelf: CSSProperties["alignSelf"];
};

type ShorthandStyleProps = {
  border: keyof typeof tokens.spacing;
  borderX: keyof typeof tokens.spacing;
  borderY: keyof typeof tokens.spacing;
  bg: keyof typeof tokens.color;
  p: keyof typeof tokens.spacing;
  m: keyof typeof tokens.spacing;
  px: keyof typeof tokens.spacing;
  py: keyof typeof tokens.spacing;
  pt: keyof typeof tokens.spacing;
  pb: keyof typeof tokens.spacing;
  pl: keyof typeof tokens.spacing;
  pr: keyof typeof tokens.spacing;
  mx: keyof typeof tokens.spacing;
  my: keyof typeof tokens.spacing;
  mt: keyof typeof tokens.spacing;
  mb: keyof typeof tokens.spacing;
  ml: keyof typeof tokens.spacing;
  mr: keyof typeof tokens.spacing;
  shadow: keyof typeof tokens.shadow;
  w: keyof typeof tokens.spacing;
  h: keyof typeof tokens.spacing;
  minW: keyof typeof tokens.spacing;
  minH: keyof typeof tokens.spacing;
  maxW: keyof typeof tokens.spacing;
  maxH: keyof typeof tokens.spacing;
  rounded: keyof typeof tokens.rounded;
  roundedTopLeft: keyof typeof tokens.rounded;
  roundedTopRight: keyof typeof tokens.rounded;
  roundedBottomLeft: keyof typeof tokens.rounded;
  roundedBottomRight: keyof typeof tokens.rounded;
  roundedTop: keyof typeof tokens.rounded;
  roundedBottom: keyof typeof tokens.rounded;
  roundedLeft: keyof typeof tokens.rounded;
  roundedRight: keyof typeof tokens.rounded;
  borderTop: keyof typeof tokens.spacing;
  borderBottom: keyof typeof tokens.spacing;
  borderLeft: keyof typeof tokens.spacing;
  borderRight: keyof typeof tokens.spacing;
};

const baseCssVars: Record<keyof BaseStyleProps, CssVarProp> = {
  display: {
    cssVar: "--display",
    value: "VARIABLE",
  },
  backgroundColor: {
    cssVar: "--background-color",
    value: "var(--tgph-VARIABLE)",
  },
  hover_backgroundColor: {
    cssVar: "--hover_backgroundColor",
    value: "var(--tgph-VARIABLE)",
    interactive: true,
  },
  focus_backgroundColor: {
    cssVar: "--focus_backgroundColor",
    value: "var(--tgph-VARIABLE)",
    interactive: true,
  },
  active_backgroundColor: {
    cssVar: "--active_backgroundColor",
    interactive: true,
    value: "var(--tgph-VARIABLE)",
  },
  focus_within_backgroundColor: {
    cssVar: "--focus_within_backgroundColor",
    interactive: true,
    value: "var(--tgph-VARIABLE)",
  },
  borderStyle: {
    cssVar: "--border-style",
    value: "var(--tgph-border-style-VARIABLE)",
  },
  padding: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "all",
  },
  paddingX: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "x",
  },
  paddingY: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "y",
  },
  paddingTop: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "top",
  },
  paddingBottom: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "bottom",
  },
  paddingLeft: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "left",
  },
  paddingRight: {
    cssVar: "--padding",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "right",
  },
  margin: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "all",
  },
  marginX: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "x",
  },
  marginY: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "y",
  },
  marginTop: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "top",
  },
  marginBottom: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "bottom",
  },
  marginLeft: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "left",
  },
  marginRight: {
    cssVar: "--margin",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "right",
  },
  borderColor: {
    cssVar: "--border-color",
    value: "var(--tgph-VARIABLE)",
  },
  hover_borderColor: {
    cssVar: "--hover_borderColor",
    value: "var(--tgph-VARIABLE)",
    interactive: true,
  },
  focus_borderColor: {
    cssVar: "--focus_borderColor",
    value: "var(--tgph-VARIABLE)",
    interactive: true,
  },
  focus_within_borderColor: {
    cssVar: "--focus_within_borderColor",
    interactive: true,
    value: "var(--tgph-VARIABLE)",
  },
  active_borderColor: {
    cssVar: "--active_borderColor",
    interactive: true,
    value: "var(--tgph-VARIABLE)",
  },
  borderWidth: {
    cssVar: "--border-width",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  borderTopWidth: {
    cssVar: "--border-width",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "top",
  },
  borderBottomWidth: {
    cssVar: "--border-width",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "bottom",
  },
  borderLeftWidth: {
    cssVar: "--border-width",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "left",
  },
  borderRightWidth: {
    cssVar: "--border-width",
    value: "var(--tgph-spacing-VARIABLE)",
    direction: "right",
  },
  borderRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
  },
  borderTopLeftRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "top",
  },
  borderTopRightRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "right",
  },
  borderBottomLeftRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "left",
  },
  borderBottomRightRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "bottom",
  },
  borderTopRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "side-top",
  },
  borderBottomRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "side-bottom",
  },
  borderLeftRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "side-left",
  },
  borderRightRadius: {
    cssVar: "--border-radius",
    value: "var(--tgph-rounded-VARIABLE)",
    direction: "side-right",
  },
  boxShadow: {
    cssVar: "--box-shadow",
    value: "var(--tgph-shadow-VARIABLE)",
  },
  width: {
    cssVar: "--width",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  height: {
    cssVar: "--height",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  minWidth: {
    cssVar: "--min-width",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  minHeight: {
    cssVar: "--min-height",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  maxWidth: {
    cssVar: "--max-width",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  maxHeight: {
    cssVar: "--max-height",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  zIndex: {
    cssVar: "--z-index",
    value: "var(--tgph-zIndex-VARIABLE)",
  },
  position: {
    cssVar: "--position",
    value: "VARIABLE",
  },
  top: {
    cssVar: "--top",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  left: {
    cssVar: "--left",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  right: {
    cssVar: "--right",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  bottom: {
    cssVar: "--bottom",
    value: "var(--tgph-spacing-VARIABLE)",
  },
  overflow: {
    cssVar: "--overflow",
    value: "VARIABLE",
  },
  alignSelf: {
    cssVar: "--align-self",
    value: "VARIABLE",
  },
} as const;

const shorthandCssVars: Record<keyof ShorthandStyleProps, CssVarProp> = {
  border: baseCssVars.borderWidth,
  borderX: baseCssVars.borderLeftWidth,
  borderY: baseCssVars.borderTopWidth,
  bg: baseCssVars.backgroundColor,
  p: baseCssVars.padding,
  m: baseCssVars.margin,
  px: baseCssVars.paddingX,
  py: baseCssVars.paddingY,
  pt: baseCssVars.paddingTop,
  pb: baseCssVars.paddingBottom,
  pl: baseCssVars.paddingLeft,
  pr: baseCssVars.paddingRight,
  mx: baseCssVars.marginX,
  my: baseCssVars.marginY,
  mt: baseCssVars.marginTop,
  mb: baseCssVars.marginBottom,
  ml: baseCssVars.marginLeft,
  mr: baseCssVars.marginRight,
  shadow: baseCssVars.boxShadow,
  w: baseCssVars.width,
  h: baseCssVars.height,
  minW: baseCssVars.minWidth,
  minH: baseCssVars.minHeight,
  maxW: baseCssVars.maxWidth,
  maxH: baseCssVars.maxHeight,
  rounded: baseCssVars.borderRadius,
  roundedTopLeft: baseCssVars.borderTopLeftRadius,
  roundedTopRight: baseCssVars.borderTopRightRadius,
  roundedBottomLeft: baseCssVars.borderBottomLeftRadius,
  roundedBottomRight: baseCssVars.borderBottomRightRadius,
  roundedTop: baseCssVars.borderTopRadius,
  roundedBottom: baseCssVars.borderBottomRadius,
  roundedLeft: baseCssVars.borderLeftRadius,
  roundedRight: baseCssVars.borderRightRadius,
  borderTop: baseCssVars.borderTopWidth,
  borderBottom: baseCssVars.borderBottomWidth,
  borderLeft: baseCssVars.borderLeftWidth,
  borderRight: baseCssVars.borderRightWidth,
} as const;

export const cssVars = {
  ...baseCssVars,
  ...shorthandCssVars,
} as const;

export type StyleProps = Partial<BaseStyleProps & ShorthandStyleProps>;
