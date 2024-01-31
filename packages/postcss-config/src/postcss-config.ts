import { tailwindConfig } from "@telegraph/tailwind-config";

export default {
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("tailwindcss")({
      config: tailwindConfig,
    }),
    require("postcss-combine-duplicated-selectors"),
    require("postcss-discard-empty"),
    require("autoprefixer"),
  ],
};
