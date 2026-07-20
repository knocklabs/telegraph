import {
  defaultViteConfig,
  scopedCssViteConfig,
} from "@telegraph/vite-config";
import { mergeConfig } from "vite";

// truncate now ships real CSS (OverflowText). Build `src/default.css` the same
// way as other CSS-shipping packages (e.g. link) rather than the vanilla-extract
// style-engine config, which emitted nothing here.
export default mergeConfig(defaultViteConfig, scopedCssViteConfig);
