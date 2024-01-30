import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    setupFiles: ["@telegraph/test/setup"],
    environment: "jsdom",
  },
});
