// Deliberately kept in sync with `CHECKBOX_SIZE_MAP` in `@telegraph/checkbox`.
// A radio and a checkbox at the same size sit next to each other in forms, so
// the control and label sizes have to match. The two packages are independent
// and a shared constants dependency is not worth two package entries, so this
// is a copy on purpose: change one, change the other.
// `dotSize` is radio-only, and deliberately half the control at both sizes.
// A smaller dot reads as a thick ring rather than a radio.
export const RADIO_SIZE_MAP = {
  "1": {
    size: "4",
    dotSize: "2",
    labelSize: "1",
  },
  "2": {
    size: "5",
    dotSize: "2_5",
    labelSize: "2",
  },
} as const;

// Mirrors `CHECKBOX_COLOR_MAP`. Keep the key set aligned with `ButtonColor`.
// `dotColor` is the checkbox's `indicatorColor` as a background token, because
// the dot is a `Box` rather than an `Icon`.
export const RADIO_COLOR_MAP = {
  default: { backgroundColor: "gray-12", dotColor: "surface-1" },
  accent: { backgroundColor: "accent-9", dotColor: "white" },
  blue: { backgroundColor: "blue-9", dotColor: "white" },
  gray: { backgroundColor: "gray-9", dotColor: "white" },
  green: { backgroundColor: "green-9", dotColor: "white" },
  purple: { backgroundColor: "purple-9", dotColor: "white" },
  red: { backgroundColor: "red-9", dotColor: "white" },
  yellow: { backgroundColor: "yellow-9", dotColor: "black" },
} as const;

// Applied when the radio is not selected.
export const RADIO_UNSELECTED = {
  borderColor: "gray-6",
  backgroundColor: "surface-1",
} as const;

export type RadioSize = keyof typeof RADIO_SIZE_MAP;
export type RadioColor = keyof typeof RADIO_COLOR_MAP;
