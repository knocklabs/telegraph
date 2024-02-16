import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { resolve } from "path";
import dts from "vite-plugin-dts";

const require = createRequire(import.meta.url);
const pkg = require(resolve(process.cwd(), "package.json"));

// Get package name so we can use it as the library name
const packageName = pkg.name;

// Get all dependencies so we can tell vite not to bundle them with our packages
const dependencies = Object.keys(pkg.dependencies || {});
const peerDependencies = Object.keys(pkg.peerDependencies || {});

const allDependencies = [
  ...dependencies,
  ...peerDependencies,
  // Need to declare these as external as well since they're
  // not explicitly listed in the package.json
  "react/jsx-runtime",
  "ionicons/icons",
];

export default {
  build: {
    lib: {
      entry: "src/index.ts",
      name: `@telegraph/${packageName}`,
      fileName: (format: string) => `index.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [...allDependencies],
      output: {
        entryFileNames: "[name].[format].js",
        globals: {
          ...allDependencies.reduce(
            (acc, dep) => {
              acc[dep] = dep;
              return acc;
            },
            {} as Record<string, string>,
          ),
        },
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
    }),
    react(),
  ],
};
