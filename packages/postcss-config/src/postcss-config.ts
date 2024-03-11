export default {
  plugins: [
    require("tailwindcss"),
    require("postcss-combine-duplicated-selectors"),
    require("postcss-discard-empty"),
    require("autoprefixer"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@csstools/postcss-global-data")({
      files: ["../tokens/dist/css/breakpoint.css"],
    }),
    require("postcss-custom-media"),
  ],
};
