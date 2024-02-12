export const withTelegraph = () => () => {
  //
  // Used to determine if we are in development mode
  // so that we can bundle use client loader on
  // our local packages
  //
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const DEV_MODE = process?.env?.NEXT_PUBLIC_IN_TELEGRAPH_REPO === "1";

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webpack: function (config: any) {
      config.module.rules.push({
        test: [
          /node_modules\/(?:[^/]+\/)*?@telegraph\/[^/]+(?:\/[^/]*)*\.js$/,
          DEV_MODE && /(?:.*\/)?packages\/(?:[^/]+\/)*[^/]+(?:\/[^/]*)*\.js$/,
        ],
        use: {
          loader: "@telegraph/nextjs/loader",
        },
      });
      return config;
    },
  };
};
