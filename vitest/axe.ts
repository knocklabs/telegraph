// @ts-expect-error -- Something is wrong with the package, so this works for now
import { axe, type AxeCore } from "vitest-axe";
// @ts-expect-error -- Something is wrong with the package, so this works for now
import { toHaveNoViolations as fn } from "vitest-axe/matchers";
import { expect } from "vitest";

// Helper to check for a11y violations while keeping type safety
export const expectToHaveNoViolations = (element: AxeCore.AxeResults) => {
  expect(fn(element).pass).toBe(true);
};

export { axe };
