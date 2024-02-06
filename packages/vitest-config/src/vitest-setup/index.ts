import * as rtlMatchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);
expect.extend(rtlMatchers);

/*
 fixes: Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
 source: https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
*/
// @ts-expect-error -- see above
HTMLCanvasElement.prototype.getContext = () => {};
