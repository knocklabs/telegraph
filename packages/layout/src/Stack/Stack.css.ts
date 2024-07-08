import {
  RESPONSIVE_STYLE_PROPS,
  createStyleProps,
  defineStyleProps,
  tokens,
} from "@telegraph/style-engine";

export const stackProperties = defineStyleProps({
  properties: {
    alignItems: ["flex-start", "center", "flex-end", "stretch"],
    flexDirection: ["row", "row-reverse", "column", "column-reverse"],
    gap: tokens.spacing,
    wrap: ["nowrap", "wrap", "wrap-reverse"],
    justifyContent: [
      "flex-start",
      "center",
      "flex-end",
      "space-between",
      "space-around",
    ],
  },
  shorthands: {
    align: ["alignItems"],
    justify: ["justifyContent"],
    direction: ["flexDirection"],
  },
  ...RESPONSIVE_STYLE_PROPS,
});
export const stylePropsFn = createStyleProps(stackProperties);
export type StyleProps = Parameters<typeof stylePropsFn>[0];
