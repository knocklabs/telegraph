import { defineConfig } from "vitest/config";
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
  },
});

export { sharedConfig };
export default sharedConfig;
