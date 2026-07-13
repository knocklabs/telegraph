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
  },
});

export { sharedConfig };
export default sharedConfig;
