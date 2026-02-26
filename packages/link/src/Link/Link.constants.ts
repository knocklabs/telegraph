import type { TextProps as TypographyTextProps } from "@telegraph/typography";

export const LINK_SIZE_MAP = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const LINK_WEIGHT_MAP = {
  regular: "regular",
  medium: "medium",
} as const;

export const LINK_ICON_SIZE_MAP = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

const LINK_SPECIAL_BORDER_COLOR_MAP = {
  default: "gray-12",
  black: "black",
  white: "white",
  disabled: "gray-9",
} as const;

export const getLinkBorderColor = (
  color: NonNullable<TypographyTextProps["color"]>,
) => {
  if (color in LINK_SPECIAL_BORDER_COLOR_MAP) {
    return LINK_SPECIAL_BORDER_COLOR_MAP[
      color as keyof typeof LINK_SPECIAL_BORDER_COLOR_MAP
    ];
  }

  return `${color}-11`;
};
