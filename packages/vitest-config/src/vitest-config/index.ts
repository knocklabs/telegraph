import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // @ts-expect-error - this is valid, not sure why it's throwing an error
  plugins: [vanillaExtractPlugin()],
  test: {
    globals: true,
    setupFiles: ["@telegraph/vitest-config/setup"],
    environment: "jsdom",
    coverage: {
      include: ["src/**/!(*index).@(ts|tsx)"],
    },
  },
});
