import { defaultViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, {
    build: {
        lib: {
            entry: ["src/index.ts", "src/use-client-loader.js"],
        }
    }
});
