const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const reactHooks = require("eslint-plugin-react-hooks");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: [
      "**/.turbo/**",
      "**/.yarn/**",
      "**/coverage/**",
      "**/dist/**",
      "**/storybook-static/**",
    ],
  },
  ...compat.config({
    extends: ["@knocklabs/eslint-config/library.js"],
    parser: "@typescript-eslint/parser",
  }),
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

