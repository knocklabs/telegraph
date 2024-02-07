import { semanticColor } from "./semantic/color";
import { semanticRounded } from "./semantic/rounded";
import { semanticSpacing } from "./semantic/spacing";
import { color } from "./tokens/color";
import { family } from "./tokens/family";
import { leading } from "./tokens/leading";
import { rounded } from "./tokens/rounded";
import { shadow } from "./tokens/shadow";
import { spacing } from "./tokens/spacing";
import { text } from "./tokens/text";
import { tracking } from "./tokens/tracking";

export default {
  tokens: {
    color,
    rounded,
    shadow,
    spacing,
    family,
    leading,
    tracking,
    text,
  },
  semantic: {
    color: semanticColor,
    spacing: semanticSpacing,
    rounded: semanticRounded,
  },
};
