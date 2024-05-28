import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { resolve } from "path";
import { type PreRenderedAsset } from "rollup";
import dts from "vite-plugin-dts";

const require = createRequire(import.meta.url);
const pkg = require(resolve(process.cwd(), "package.json"));

// Get package name so we can use it as the library name
const packageName = pkg.name;

// Get all dependencies so we can tell vite not to bundle them with our packages
const dependencies = Object.keys(pkg.dependencies || {});
const devDependencies = Object.keys(pkg.devDependencies || {});
const peerDependencies = Object.keys(pkg.peerDependencies || {});

const allDependencies = [
  ...dependencies,
  ...devDependencies,
  ...peerDependencies,
  // Need to declare these as external as well since they're
  // not explicitly listed in the package.json
  "react/jsx-runtime",
];

const buildTimeInfo = {
  format: "es",
};

export default {
  build: {
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name: `@telegraph/${packageName}`,
      formats: ["es", "cjs"],
      fileName: (format: string) => {
        buildTimeInfo.format = format;

        if (format === "es") {
          return "esm/[name].mjs";
        }
        return "cjs/[name].js";
      },
    },
    rollupOptions: {
      external: [...allDependencies],
      output: {
        assetFileNames: (assetInfo: PreRenderedAsset) => {
          if (assetInfo?.name?.endsWith(".css")) {
            return "css/[name].css";
          }
          return "assets/[name].[ext]";
        },
        chunkFileNames: () => {
          if (buildTimeInfo.format === "es") {
            return "esm/[name]-[hash].mjs";
          }

          return "cjs/[name]-[hash].js";
        },
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
      outDir: "dist/types",
    }),
    react(),
  ],
};
