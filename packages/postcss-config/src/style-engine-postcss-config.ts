export default {
  plugins: [
    require("postcss-combine-duplicated-selectors"),
    require("postcss-discard-empty"),
    require("autoprefixer"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@csstools/postcss-global-data")({
      module: ["@telegraph/tokens/dist/css/breakpoints.css"],
    }),
    require("postcss-custom-media"),
  ],
};
