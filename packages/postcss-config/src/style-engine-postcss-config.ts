// eslint-disable-next-line @typescript-eslint/no-require-imports
const interactivePlugin = require("./interactive-plugin").default;

export default {
  plugins: [
    // Must run before other plugins so that the generated rules are available
    // for subsequent processing (e.g. autoprefixer, discard-empty).
    interactivePlugin(),
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
