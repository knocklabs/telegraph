import { defaultViteConfig, styleEngineViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, styleEngineViteConfig);
