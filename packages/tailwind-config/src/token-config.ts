import tokens from "@telegraph/tokens/mappings/tokens";

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
    fontSize: {
      ...tokens.text,
    },
    extend: {},
  },
};
