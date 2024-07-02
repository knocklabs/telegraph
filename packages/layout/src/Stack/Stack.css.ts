import {
  createStyleProps,
  defineStyleProps,
  tokens,
} from "@telegraph/style-engine";

const stackProperties = defineStyleProps({
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
});

export const styleProps = createStyleProps(stackProperties);

export type StyleProps = Parameters<typeof styleProps>[0];
