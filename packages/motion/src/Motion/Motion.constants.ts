export const CSS_TIMING_FUNCTIONS = {
  "ease-in-out": "ease-in-out",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  linear: "linear",
  spring: "linear(0, 0.25, 1)",
};

export type TransitionType = keyof typeof CSS_TIMING_FUNCTIONS;
