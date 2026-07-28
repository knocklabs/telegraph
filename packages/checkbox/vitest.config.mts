import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "checkbox",
    globals: true,
    setupFiles: ["../../vitest/setup"],
    environment: "jsdom",
    // Type-level assertions live in `*.test-d.ts`. Without this they would be
    // collected but never checked, since the package build reports type errors
    // without failing on them.
    //
    // `ignoreSourceErrors` keeps this package from failing on pre-existing
    // errors in the repo-shared `vitest/` helpers, which the test files import
    // transitively. Assertions inside `*.test-d.ts` still fail the run.
    typecheck: {
      enabled: true,
      include: ["**/*.test-d.ts"],
      tsconfig: "./tsconfig.typecheck.json",
      ignoreSourceErrors: true,
    },
  },
});
