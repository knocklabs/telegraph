export default {
  plugins: [
    require("tailwindcss"),
    require("postcss-combine-duplicated-selectors"),
    require("postcss-discard-empty"),
    require("autoprefixer"),
  ],
};
