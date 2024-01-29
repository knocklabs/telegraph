import { tailwindConfig } from "@telegraph/tailwind-config";

export default {
  plugins: [
    require("tailwindcss")({
      config: tailwindConfig,
    }),
    require("autoprefixer"),
  ],
};
