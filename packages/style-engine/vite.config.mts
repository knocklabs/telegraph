import { defaultViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, {
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        // Add post css plugin as entry point to avoid
        // building the rest of style-engine with these
        // dependencies.
        postcss: "src/plugins/postcss.ts",
      },
    },
  },
});
