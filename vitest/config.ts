import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const sharedConfig = defineConfig({
  // @ts-expect-error -- Not sure, this is valid
  plugins: [tsconfigPaths(), vanillaExtractPlugin()],
  test: {
    coverage: {
      enabled: true,
      all: false,
      provider: "v8",
    },
    globals: true,
    setupFiles: ["../../vitest/setup"],
    environment: "jsdom",
  },
});

export { sharedConfig };
