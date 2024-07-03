import t from "@telegraph/tokens";

export const RESPONSIVE_STYLE_PROPS = {
  conditions: {
    sm: { "@media": `screen and (min-width: ${t.tokens.breakpoint.sm})` },
    md: { "@media": `screen and (min-width: ${t.tokens.breakpoint.md})` },
    lg: { "@media": `screen and (min-width: ${t.tokens.breakpoint.lg})` },
    xl: { "@media": `screen and (min-width: ${t.tokens.breakpoint.xl})` },
    "2xl": {
      "@media": `screen and (min-width: ${t.tokens.breakpoint["2xl"]})`,
    },
  },
  defaultCondition: "sm",
  responsiveArray: ["sm", "md", "lg", "xl", "2xl"],
};
