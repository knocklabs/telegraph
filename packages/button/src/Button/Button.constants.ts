export const BUTTON_STYLE_PROPS = {
  background: {
    rule: "background-color",
    type: "color",
  },
  "background:hover": {
    rule: "background-color--hover",
    type: "color",
  },
  "background:focus": {
    rule: "background-color--focus",
    type: "color",
  },
  "background:active": {
    rule: "background-color--active",
    type: "color",
  },
  "background:disabled": {
    rule: "background-color--disabled",
    type: "color",
  },
  "shadow-color": {
    rule: "box-shadow-color",
    type: "color",
  },
  "shadow-color:hover": {
    rule: "box-shadow-color--hover",
    type: "color",
  },
  "shadow-color:focus": {
    rule: "box-shadow-color--focus",
    type: "color",
  },
  "shadow-color:active": {
    rule: "box-shadow-color--active",
    type: "color",
  },
  "shadow-color:disabled": {
    rule: "box-shadow-color--disabled",
    type: "color",
  },
};

export const buttonSizeMap = {
  default: {
    "0": {
      w: "auto",
      h: "5",
      gap: "1",
      px: "1",
    },
    "1": {
      w: "auto",
      h: "6",
      gap: "1",
      px: "2",
    },
    "2": {
      w: "auto",
      h: "8",
      gap: "2",
      px: "3",
    },
    "3": {
      w: "auto",
      h: "10",
      gap: "3",
      px: "4",
    },
  },
  "icon-only": {
    "0": {
      w: "5",
      h: "5",
      gap: "0",
      px: "0",
    },
    "1": {
      w: "6",
      h: "6",
      gap: "0",
      px: "0",
    },
    "2": {
      w: "8",
      h: "8",
      gap: "0",
      px: "0",
    },
    "3": {
      w: "10",
      h: "10",
      gap: "0",
      px: "0",
    },
  },
} as const;

export const textSizeMap = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const textColorMap = {
  solid: {
    gray: "white",
    red: "white",
    accent: "white",
    green: "white",
    blue: "white",
    yellow: "white",
    purple: "white",
    disabled: "disabled",
  },
  soft: {
    gray: "default",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  outline: {
    gray: "default",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  ghost: {
    gray: "default",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
} as const;

export const iconSizeMap = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const iconColorMap = {
  solid: {
    gray: "white",
    red: "white",
    accent: "white",
    green: "white",
    blue: "white",
    yellow: "white",
    purple: "white",
    disabled: "disabled",
  },
  soft: {
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  outline: {
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  ghost: {
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
} as const;

export const iconVariantMap = {
  default: "secondary",
  "icon-only": "primary",
} as const;
