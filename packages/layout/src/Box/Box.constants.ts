export const BOX_PROPS = {
  h: {
    rule: "height",
    type: "spacing",
  },
  w: {
    rule: "width",
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
  rounded: {
    rule: "border-radius",
    type: "rounded",
    direction: "all",
  },
  roundedTopLeft: {
    rule: "border-radius",
    type: "rounded",
    direction: "topLeft",
    ordering: "clockwise",
  },
  roundedBottomLeft: {
    rule: "border-radius",
    type: "rounded",
    direction: "bottomLeft",
    ordering: "clockwise",
  },
  roundedBottomRight: {
    rule: "border-radius",
    type: "rounded",
    direction: "bottomRight",
    ordering: "clockwise",
  },
  roundedTopRight: {
    rule: "border-radius",
    type: "rounded",
    direction: "topRight",
    ordering: "clockwise",
  },
  roundedTop: {
    rule: "border-radius",
    type: "rounded",
    direction: "top",
    ordering: "clockwise",
  },
  roundedBottom: {
    rule: "border-radius",
    type: "rounded",
    direction: "bottom",
    ordering: "clockwise",
  },
  roundedLeft: {
    rule: "border-radius",
    type: "rounded",
    direction: "left",
    ordering: "clockwise",
  },
  roundedRight: {
    rule: "border-radius",
    type: "rounded",
    direction: "right",
    ordering: "clockwise",
  },
  border: {
    rule: "border-width",
    type: "spacing",
    direction: "all",
    default: "px",
  },
  borderTop: {
    rule: "border-width",
    type: "spacing",
    direction: "top",
    default: "px",
  },
  borderLeft: {
    rule: "border-width",
    type: "spacing",
    direction: "left",
    default: "px",
  },
  borderBottom: {
    rule: "border-width",
    type: "spacing",
    direction: "bottom",
    default: "px",
  },
  borderRight: {
    rule: "border-width",
    type: "spacing",
    direction: "right",
    default: "px",
  },
  borderX: {
    rule: "border-width",
    type: "spacing",
    direction: "x",
    default: "px",
  },
  borderY: {
    rule: "border-width",
    type: "spacing",
    direction: "y",
    default: "px",
  },
  borderColor: {
    rule: "border-color",
    type: "color",
    default: "gray-4",
  },
} as const;
