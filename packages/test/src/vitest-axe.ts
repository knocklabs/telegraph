// Declaration file that can be used to augment the types of vitest for axe in packages files
import "vitest"
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
