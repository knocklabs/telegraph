import { configDefaults, defineProject, mergeConfig } from "vitest/config";

import { sharedConfig } from "../../vitest/config.mts";

export default mergeConfig(
  { ...sharedConfig },
  defineProject({
    test: {
      name: "menu",
      environment: "jsdom",
      // Browser-mode tests (real Chromium) run via vitest.browser.config.mts.
      exclude: [...configDefaults.exclude, "**/*.browser.test.{ts,tsx}"],
    },
  }),
);
