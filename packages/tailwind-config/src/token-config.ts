import tokens from "@telegraph/tokens/css-variables-map";

export default {
  theme: {
    colors: {
      ...tokens.color,
    },
    borderRadius: {
      ...tokens.rounded,
    },
    spacing: {
      ...tokens.spacing,
    },
    boxShadow: {
      ...tokens.shadow,
    },
    fontFamily: {
      ...tokens.family,
    },
    lineHeight: {
      ...tokens.leading,
    },
    letterSpacing: {
      ...tokens.tracking,
    },
    fontWeight: {
      ...tokens.weight,
    },
    fontSize: {
      ...tokens.text,
    },
    extend: {},
  },
};
