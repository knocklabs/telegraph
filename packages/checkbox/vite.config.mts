import { defaultViteConfig, scopedCssViteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(defaultViteConfig, scopedCssViteConfig);
