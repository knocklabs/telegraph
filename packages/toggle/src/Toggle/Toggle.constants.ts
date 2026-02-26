// Size mappings for the toggle component
export const TOGGLE_SIZE_MAP = {
  "1": {
    w: "7",
    h: "4",
    iconSize: "1",
  },
  "2": {
    w: "8",
    h: "5",
    iconSize: "2",
  },
} as const;

export const LABEL_SIZE_MAP = {
  "1": "1",
  "2": "2",
} as const;

export const INDICATOR_SIZE_MAP = {
  "1": "0",
  "2": "1",
} as const;

export type ToggleSize = keyof typeof TOGGLE_SIZE_MAP;
