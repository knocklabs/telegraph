import { defineProject, mergeConfig } from "vitest/config";

import { sharedConfig } from "../../vitest/config.mts";

export default mergeConfig(
  {
    ...sharedConfig,
    test: {
      ...sharedConfig.test,
      setupFiles: ["../../vitest/setup.ts"],
    },
  },
  defineProject({
    test: {
      name: "link",
      environment: "jsdom",
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  }),
);
