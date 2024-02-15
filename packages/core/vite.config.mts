import { scopedCssViteConfig, viteConfig } from "@telegraph/vite-config";
import { mergeConfig } from "vite";

export default mergeConfig(viteConfig, scopedCssViteConfig);
