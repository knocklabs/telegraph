import {
  RESPONSIVE_STYLE_PROPS,
  createStyleProps,
  defineStyleProps,
  tokens,
} from "@telegraph/style-engine";

const boxProperties = defineStyleProps({
  properties: {
    backgroundColor: tokens.color,
    borderWidth: tokens.spacing,
    borderBottomWidth: tokens.spacing,
    borderLeftWidth: tokens.spacing,
    borderRightWidth: tokens.spacing,
    borderTopWidth: tokens.spacing,
    borderColor: tokens.color,
    borderStyle: tokens["border-style"],
    borderRadius: tokens.rounded,
    borderBottomLeftRadius: tokens.rounded,
    borderBottomRightRadius: tokens.rounded,
    borderTopLeftRadius: tokens.rounded,
    borderTopRightRadius: tokens.rounded,
    boxShadow: tokens.shadow,
    display: [
      "block",
      "inline-block",
      "inline",
      "flex",
      "inline-flex",
      "grid",
      "none",
    ],
    minHeight: tokens.spacing,
    minWidth: tokens.spacing,
    height: tokens.spacing,
    margin: tokens.spacing,
    marginBottom: tokens.spacing,
    marginLeft: tokens.spacing,
    marginRight: tokens.spacing,
    marginTop: tokens.spacing,
    maxHeight: tokens.spacing,
    maxWidth: tokens.spacing,
    padding: tokens.spacing,
    paddingBottom: tokens.spacing,
    paddingLeft: tokens.spacing,
    paddingRight: tokens.spacing,
    paddingTop: tokens.spacing,
    width: tokens.spacing,
    zIndex: tokens.zIndex,
  },
  shorthands: {
    bg: ["backgroundColor"],
    border: ["borderWidth"],
    borderBottom: ["borderBottomWidth"],
    borderLeft: ["borderLeftWidth"],
    borderRight: ["borderRightWidth"],
    borderTop: ["borderTopWidth"],
    borderX: ["borderLeftWidth", "borderRightWidth"],
    borderY: ["borderTopWidth", "borderBottomWidth"],
    h: ["height"],
    m: ["margin"],
    maxH: ["maxHeight"],
    maxW: ["maxWidth"],
    minH: ["minHeight"],
    minW: ["minWidth"],
    mb: ["marginBottom"],
    ml: ["marginLeft"],
    mr: ["marginRight"],
    mt: ["marginTop"],
    mx: ["marginLeft", "marginRight"],
    my: ["marginTop", "marginBottom"],
    p: ["padding"],
    pb: ["paddingBottom"],
    pl: ["paddingLeft"],
    pr: ["paddingRight"],
    pt: ["paddingTop"],
    px: ["paddingLeft", "paddingRight"],
    py: ["paddingTop", "paddingBottom"],
    rounded: ["borderRadius"],
    roundedBottom: ["borderBottomRightRadius", "borderBottomLeftRadius"],
    roundedBottomLeft: ["borderBottomLeftRadius"],
    roundedBottomRight: ["borderBottomRightRadius"],
    roundedLeft: ["borderTopLeftRadius", "borderBottomLeftRadius"],
    roundedRight: ["borderBottomLeftRadius", "borderBottomRightRadius"],
    roundedTop: ["borderTopLeftRadius", "borderTopRightRadius"],
    roundedTopLeft: ["borderTopLeftRadius"],
    roundedTopRight: ["borderTopRightRadius"],
    shadow: ["boxShadow"],
    w: ["width"],
  },
  ...RESPONSIVE_STYLE_PROPS,
});

export const stylePropsFn = createStyleProps(boxProperties);
export type StyleProps = Parameters<typeof stylePropsFn>[0];
