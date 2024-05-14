export const STACK_PROPS = {
  display: {
    rule: "display",
    type: "flex-display",
    valueType: "static",
  },
  direction: {
    rule: "flex-direction",
    type: "flex-direction",
    valueType: "static",
  },
  align: {
    rule: "align-items",
    type: "align-items",
    valueType: "static",
  },
  justify: {
    rule: "justify-content",
    type: "justify-content",
    valueType: "static",
  },
  wrap: {
    rule: "flex-wrap",
    type: "flex-wrap",
    valueType: "static",
  },
  gap: {
    rule: "gap",
    type: "spacing",
    valueType: "variable",
  },
} as const;
