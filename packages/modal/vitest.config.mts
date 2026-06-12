import { defineProject, mergeConfig } from "vitest/config";

import { sharedConfig } from "../../vitest/config.mts";

export default mergeConfig(
  { ...sharedConfig },
  defineProject({
    test: {
      name: "modal",
      environment: "jsdom",
    },
  }),
);
