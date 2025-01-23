import { CSS_TIMING_FUNCTIONS, TransitionType } from "./Motion.constants";

const DEFAULT_TIMING_FUNCTION = CSS_TIMING_FUNCTIONS["ease-in-out"];

export const getAnimationTimingFunction = (
  type: TransitionType | undefined,
) => {
  if (!type) return DEFAULT_TIMING_FUNCTION;

  const timingFunction = CSS_TIMING_FUNCTIONS?.[type];

  if (!timingFunction) return DEFAULT_TIMING_FUNCTION;

  return timingFunction;
};
