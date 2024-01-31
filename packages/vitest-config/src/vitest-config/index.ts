import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    setupFiles: ["@telegraph/vitest-config/setup"],
    environment: "jsdom",
    coverage: {
      include: ["src/**/!(*index).@(ts|tsx)"]
    },
  },
});
