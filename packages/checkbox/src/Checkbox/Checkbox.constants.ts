// Size mappings for the checkbox component.
//
// `@telegraph/radio` ships only `RadioCards` today, so there is no radio
// control to match. KNO-14479 adds one, and it should adopt these values —
// a checkbox and a radio have to read as the same size in one form.
export const CHECKBOX_SIZE_MAP = {
  "1": {
    size: "4",
    iconSize: "0",
  },
  "2": {
    size: "5",
    iconSize: "1",
  },
} as const;

export const LABEL_SIZE_MAP = {
  "1": "1",
  "2": "2",
} as const;

// Mirrors `BUTTON_COLOR_MAP.solid` and `TEXT_COLOR_MAP.solid` in
// `@telegraph/button` so a checked checkbox matches a solid button of the same
// color. Keep the key set aligned with `ButtonColor`.
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

export type CheckboxSize = keyof typeof CHECKBOX_SIZE_MAP;
export type CheckboxColor = keyof typeof CHECKBOX_COLOR_MAP;
