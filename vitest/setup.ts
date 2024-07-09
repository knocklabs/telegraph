import "vitest";
import { afterEach, expect } from "vitest";

import "@testing-library/jest-dom";
// import type { AxeMatchers } from "vitest-axe/matchers";

// import "vitest-axe/extend-expect";
// import * as axeMatchers from "vitest-axe/matchers";

// import type { AxeMatchers } from "vitest-axe/matchers";
// import { toHaveNoViolations } from "vitest-axe/matchers";

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// import "@testing-library/jest-dom";
// import "vitest-axe/extend-expect";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);
// expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});

// type Matchers<T = unknown> =  typeof toThrowErrorSafe & typeof toHaveNoViolations;

// // Make sure to augment the global types for vitest so that
// // the matchers are available in the test files
declare module "vitest" {
  export interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  export interface AsymmetricMatchersContaining<T = any>
    extends TestingLibraryMatchers<T, void> {}
}

// declare module "vitest-axe" {
//   export function axe(
//     html: string | Element,
//     additionalOptions?: AxeCore.RunOptions,
//     test?: string
//   ): Promise<AxeCore.AxeResults>;
// }
/*
 fixes: Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
 source: https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
*/
// @ts-expect-error -- see above
HTMLCanvasElement.prototype.getContext = () => {};
