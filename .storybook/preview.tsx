import React from "react";
import { definePreview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import * as addonThemes from "@storybook/addon-themes/preview";
import addonPerformancePanel from "@github-ui/storybook-addon-performance-panel";
import "./global.css";

export default definePreview({
  addons: [addonPerformancePanel(), addonThemes],
  decorators: [
    (Story) => (
      <div className="tgph">
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
      attributeName: "data-tgph-appearance",
    }),
  ],
});
