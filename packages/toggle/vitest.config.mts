import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "toggle",
    globals: true,
    setupFiles: ["../../vitest/setup"],
    environment: "jsdom",
  },
});
