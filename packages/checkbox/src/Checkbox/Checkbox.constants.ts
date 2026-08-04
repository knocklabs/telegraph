// Sizes a radio should match once `@telegraph/radio` has a standalone control.
export const CHECKBOX_SIZE_MAP = {
  "1": {
    size: "4",
    iconSize: "0",
    labelSize: "1",
  },
  "2": {
    size: "5",
    iconSize: "1",
    labelSize: "2",
  },
} as const;

// Keep the key set aligned with `ButtonColor`.
export const CHECKBOX_COLOR_MAP = {
  default: { backgroundColor: "gray-12", indicatorColor: "contrast" },
  accent: { backgroundColor: "accent-9", indicatorColor: "white" },
  blue: { backgroundColor: "blue-9", indicatorColor: "white" },
  gray: { backgroundColor: "gray-9", indicatorColor: "white" },
  green: { backgroundColor: "green-9", indicatorColor: "white" },
  purple: { backgroundColor: "purple-9", indicatorColor: "white" },
  red: { backgroundColor: "red-9", indicatorColor: "white" },
  yellow: { backgroundColor: "yellow-9", indicatorColor: "black" },
} as const;

// Applied when the checkbox is neither checked nor indeterminate.
export const CHECKBOX_UNCHECKED = {
  borderColor: "gray-6",
  backgroundColor: "surface-1",
} as const;

export type CheckboxSize = keyof typeof CHECKBOX_SIZE_MAP;
export type CheckboxColor = keyof typeof CHECKBOX_COLOR_MAP;
