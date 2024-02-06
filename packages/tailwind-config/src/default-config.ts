import semantic from "@telegraph/tokens/mappings/semantic";
import tokens from "@telegraph/tokens/mappings/tokens";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      ...tokens.color,
      ...semantic.color,
    },
    borderRadius: {
      ...tokens.rounded,
      ...semantic.rounded,
    },
    spacing: {
      ...tokens.spacing,
      ...semantic.spacing,
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
