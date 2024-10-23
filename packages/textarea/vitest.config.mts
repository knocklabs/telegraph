import { defineProject, mergeConfig } from "vitest/config";

import { sharedConfig } from "../../vitest/config";

export default mergeConfig(
  { ...sharedConfig },
  defineProject({
    test: {
      name: "textarea",
      environment: "jsdom",
    },
  }),
);