import { defaultViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, {
  build: {
    lib: {
      entry: ["src/default-config.ts", "src/token-config.ts", "src/index.ts"],
    },
  },
});
