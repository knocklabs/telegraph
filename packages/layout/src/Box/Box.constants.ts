export const BOX_PROPS = {
  h: {
    rule: "height",
    type: "spacing",
  },
  w: {
    rule: "height",
    type: "spacing",
  },
  p: {
    rule: "padding",
    type: "spacing",
    direction: "all",
  },
  m: {
    rule: "margin",
    type: "spacing",
    direction: "all",
  },
  pt: {
    rule: "padding",
    type: "spacing",
    direction: "top",
  },
  pl: {
    rule: "padding",
    type: "spacing",
    direction: "left",
  },
  pb: {
    rule: "padding",
    type: "spacing",
    direction: "bottom",
  },
  pr: {
    rule: "padding",
    type: "spacing",
    direction: "right",
  },
  px: {
    rule: "padding",
    type: "spacing",
    direction: "x",
  },
  py: {
    rule: "padding",
    type: "spacing",
    direction: "y",
  },
  mt: {
    rule: "margin",
    type: "spacing",
    direction: "top",
  },
  ml: {
    rule: "margin",
    type: "spacing",
    direction: "left",
  },
  mb: {
    rule: "margin",
    type: "spacing",
    direction: "bottom",
  },
  mr: {
    rule: "margin",
    type: "spacing",
    direction: "right",
  },
  mx: {
    rule: "margin-inline",
    type: "spacing",
    direction: "x",
  },
  my: {
    rule: "margin-block",
    type: "spacing",
    direction: "y",
  },
  bg: {
    rule: "background-color",
    type: "color",
  },
  r: {
    rule: "border-radius",
    type: "rounded",
    direction: "all",
  },
  rt: {
    rule: "border-radius",
    type: "rounded",
    direction: "top",
  },
  rl: {
    rule: "border-radius",
    type: "rounded",
    direction: "left",
  },
  rb: {
    rule: "border-radius",
    type: "rounded",
    direction: "bottom",
  },
  rr: {
    rule: "border-radius",
    type: "rounded",
    direction: "right",
  },
  rx: {
    rule: "border-radius",
    type: "rounded",
    direction: "x",
  },
  ry: {
    rule: "border-radius",
    type: "rounded",
    direction: "y",
  },
  bd: {
    rule: "border-width",
    type: "spacing",
    direction: "all",
    default: "px",
  },
  bdt: {
    rule: "border-width",
    type: "spacing",
    direction: "top",
    default: "px",
  },
  bdl: {
    rule: "border-width",
    type: "spacing",
    direction: "left",
    default: "px",
  },
  bdb: {
    rule: "border-width",
    type: "spacing",
    direction: "bottom",
    default: "px",
  },
  bdr: {
    rule: "border-width",
    type: "spacing",
    direction: "right",
    default: "px",
  },
  bdx: {
    rule: "border-width",
    type: "spacing",
    direction: "x",
    default: "px",
  },
  bdy: {
    rule: "border-width",
    type: "border",
    direction: "y",
    default: "px",
  },
  bdc: {
    rule: "border-color",
    type: "color",
    default: "gray-5",
  },
} as const;
