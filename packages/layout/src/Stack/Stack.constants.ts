export const STACK_PROPS = {
  display: {
    rule: "display",
    type: "flex-display",
  },
  direction: {
    rule: "flex-direction",
    type: "flex-direction",
  },
  align: {
    rule: "align-items",
    type: "align-items",
  },
  justify: {
    rule: "justify-content",
    type: "justify-content",
  },
  wrap: {
    rule: "flex-wrap",
    type: "flex-wrap",
  },
  gap: {
    rule: "gap",
    type: "spacing-gap",
  },
} as const;
