import "vitest";
import { afterEach, expect } from "vitest";

import "@testing-library/jest-dom";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

declare module "vitest" {
  export interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  export interface AsymmetricMatchersContaining<T = any>
    extends TestingLibraryMatchers<T, void> {}
}

/*
 fixes: Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
 source: https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
*/
// @ts-expect-error -- see above
HTMLCanvasElement.prototype.getContext = () => {};
