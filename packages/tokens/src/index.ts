import { semanticColor } from "./semantic/color";
import { semanticRounded } from "./semantic/rounded";
import { semanticSpacing } from "./semantic/spacing";
import { color } from "./tokens/color";
import { font } from "./tokens/font";
import { rounded } from "./tokens/rounded";
import { shadow } from "./tokens/shadow";
import { spacing } from "./tokens/spacing";

export const tgph = {
  tokens: {
    color,
    font,
    rounded,
    shadow,
    spacing,
  },
  semantic: {
    color: semanticColor,
    spacing: semanticSpacing,
    rounded: semanticRounded,
  },
};
