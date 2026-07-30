import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const sharedConfig = defineConfig({
  // @ts-expect-error -- Not sure, this is valid
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      enabled: true,
      all: false,
      provider: "v8",
    },
    projects: ["packages/*"],
    globals: true,
    setupFiles: ["../../vitest/setup"],
    environment: "jsdom",
    // Real-browser tests (*.browser.test.tsx) run via the separate
    // vitest.browser.config.mts (real Chromium); never in jsdom.
    exclude: [...configDefaults.exclude, "**/*.browser.test.{ts,tsx}"],
    typecheck: {
      // *.test-d.tsx files assert the public prop types — that unknown props
      // are rejected and declared props keep their exact types. Without this
      // vitest strips types via esbuild, so `@ts-expect-error` and
      // `expectTypeOf` in a test file assert nothing at all.
      enabled: true,
      include: ["**/*.test-d.{ts,tsx}"],
      // Report only errors raised inside the type tests. Implementation-level
      // type errors are tracked separately in KNO-14474; letting them fail
      // this suite would couple the public API contract to unrelated internals.
      ignoreSourceErrors: true,
    },
  },
});

export { sharedConfig };
export default sharedConfig;
