export const VARIANT = {
  ghost: "bg-transparent",
};

export const BOX_PROPS = {
  p: {
    rule: "padding",
    type: "spacing",
  },
  m: {
    rule: "margin",
    type: "spacing",
  },
  pt: {
    rule: "padding",
    type: "spacing-top",
  },
  pl: {
    rule: "padding",
    type: "spacing-left",
  },
  pb: {
    rule: "padding",
    type: "spacing-bottom",
  },
  pr: {
    rule: "padding",
    type: "spacing-right",
  },
  px: {
    rule: "padding",
    type: "spacing-x",
  },
  py: {
    rule: "padding",
    type: "spacing-y",
  },
  mt: {
    rule: "margin",
    type: "spacing-top",
  },
  ml: {
    rule: "margin",
    type: "spacing-left",
  },
  mb: {
    rule: "margin",
    type: "spacing-bottom",
  },
  mr: {
    rule: "margin",
    type: "spacing-right",
  },
  mx: {
    rule: "margin-inline",
    type: "spacing-x",
  },
  my: {
    rule: "margin-block",
    type: "spacing-y",
  },
} as const;
