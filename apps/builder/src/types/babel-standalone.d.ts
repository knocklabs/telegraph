/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal module declaration for @babel/standalone so TypeScript doesn't complain
// about missing types. We type the export as unknown since Babel exposes a complex
// JS object that we interact with via its documented runtime API.
declare module "@babel/standalone" {
  const babel: unknown;
  export = babel;
}
