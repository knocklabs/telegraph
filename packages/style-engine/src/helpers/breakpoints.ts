import { BREAKPOINTS } from "../constants";

export type ResponsiveObject<T> = { sm?: T; md?: T; lg?: T; xl?: T; "2xl"?: T };
export type Responsive<T> = T | ResponsiveObject<T>;

export const getValueForEachBreakpoint = (
  breakpoints: ResponsiveObject<string>,
) => {
  const result = [];
  let lastSpecifiedValue = null;

  for (let i = 0; i < BREAKPOINTS.length; i++) {
    const bp = BREAKPOINTS[i];

    if (breakpoints[bp as keyof typeof breakpoints]) {
      // If current breakpoint is defined, use its value and update lastSpecifiedValue
      lastSpecifiedValue = breakpoints[bp as keyof typeof breakpoints];
      result.push(lastSpecifiedValue);
    } else if (lastSpecifiedValue !== null) {
      // If not defined but we have a last specified value, use it
      result.push(lastSpecifiedValue);
    } else {
      // If no value is defined yet, look ahead for the next defined value to determine what to use
      let nextValue = null;
      for (let j = i + 1; j < BREAKPOINTS.length; j++) {
        if (breakpoints[BREAKPOINTS[j] as keyof typeof breakpoints]) {
          nextValue = breakpoints[BREAKPOINTS[j] as keyof typeof breakpoints];
          break;
        }
      }

      // If a next value is found, use it for all previous undefined breakpoints up to this point
      if (nextValue !== null) {
        for (let k = 0; k <= i; k++) {
          result.push(nextValue);
        }
        lastSpecifiedValue = nextValue; // Update last specified value for consistency moving forward
      }
    }
  }

  return result;
};

export const isResponsiveObject = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
): value is ResponsiveObject<string> => {
  return (
    typeof value === "object" &&
    (value.sm || value.md || value.lg || value.xl || value["2xl"])
  );
};
