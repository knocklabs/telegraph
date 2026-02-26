import type { ViteFinal } from "@storybook/builder-vite";
import { mergeConfig } from "vite";
import postcssImportExtGlob from "postcss-import-ext-glob";
import postcssImport from "postcss-import";

const viteFinal: ViteFinal = (config) => {
  return mergeConfig(config, {
    css: {
      postcss: {
        // Define postcss config inline so we don't need to create a postcss.config.js file
        // and collide with the package consumer's postcss config
        plugins: [postcssImportExtGlob, postcssImport],
      },
    },
  });
};

export default {
  framework: "@storybook/react-vite",
  stories: ["../packages/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-onboarding",
    "@storybook/addon-themes",
  ],
  core: {
    builder: "@storybook/builder-vite", // 👈 The builder enabled here.
  },
  viteFinal,
};
