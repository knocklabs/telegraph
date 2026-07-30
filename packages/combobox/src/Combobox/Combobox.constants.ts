// `as const` so the values keep their literal types and stay assignable to the
// `minH` spacing token union — without it they widen to `string`.
export const TRIGGER_MIN_HEIGHT = {
  "0": "5",
  "1": "6",
  "2": "8",
  "3": "10",
} as const;
