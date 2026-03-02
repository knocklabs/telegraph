export default {
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("postcss-discard-empty"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("autoprefixer"),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@csstools/postcss-global-data")({
      module: ["@telegraph/tokens/dist/css/breakpoints.css"],
    }),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("postcss-custom-media"),
  ],
};
