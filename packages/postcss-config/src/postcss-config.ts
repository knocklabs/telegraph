import { tailwindConfig } from "@telegraph/tailwind-config";

export default {
  plugins: [
    require("tailwindcss")({
      config: tailwindConfig,
    }),
    require("postcss-combine-duplicated-selectors"),
    require("postcss-discard-empty"),
    require("autoprefixer"),
  ],
};
