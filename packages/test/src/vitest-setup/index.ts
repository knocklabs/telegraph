import * as matchers from "vitest-axe/matchers";
import { expect } from "vitest";
expect.extend(matchers);

/*
 fixes: Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
 source: https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
*/
// @ts-expect-error
HTMLCanvasElement.prototype.getContext = () => {};
