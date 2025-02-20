import "vitest";
import { afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

/*
 fixes: Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)
 source: https://stackoverflow.com/questions/48828759/unit-test-raises-error-because-of-getcontext-is-not-implemented
*/
// @ts-expect-error -- see above
HTMLCanvasElement.prototype.getContext = () => {};
