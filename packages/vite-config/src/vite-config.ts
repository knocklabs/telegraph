import react from "@vitejs/plugin-react";
import { builtinModules, createRequire } from "node:module";
import { resolve } from "path";
import { type Rollup } from "vite";
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

// Externalize Node built-ins (both bare and `node:`-prefixed). Rolldown does not
// auto-externalize these, so without this a runtime `require("node:path")` /
// `require("node:fs")` gets inlined as an empty-object stub. See KNO-13579.
const nodeBuiltins = [
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
];

const isPackageImport = (id: string, packageName: string) => {
  return id === packageName || id.startsWith(`${packageName}/`);
};

const isExternalDependency = (id: string) => {
  return allDependencies.some((dependency) => isPackageImport(id, dependency));
};

const isNodeBuiltin = (id: string) => {
  return nodeBuiltins.some((builtin) => isPackageImport(id, builtin));
};

const buildTimeInfo = {
  format: "es",
};

export default {
  build: {
    // Ensure LightningCSS emits -webkit-appearance and -webkit-user-select vendor
    // prefixes to match autoprefixer's output from the PostCSS config. Vite 8 uses
    // LightningCSS for CSS minification and derives its browser targets from
    // build.cssTarget (not css.lightningcss.targets). Setting ios13 here ensures
    // prefixes are preserved for iOS < 15.4 where they are still required.
    cssTarget: ["ios13", "safari13", "chrome80", "firefox80", "edge80"],
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
    rolldownOptions: {
      external: (id: string) => {
        return isExternalDependency(id) || isNodeBuiltin(id);
      },
      output: {
        assetFileNames: (assetInfo: Rollup.PreRenderedAsset) => {
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
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.test.tsx",
        "src/**/*.test.ts",
      ],
      // Pin the declaration root to src so every package emits to
      // dist/types/index.d.ts. The emitted layout follows the TypeScript
      // compiler's rootDir; packages whose tsconfig omits `rootDir` otherwise
      // emit to dist/types/src/..., breaking the `types` entrypoint declared in
      // package.json. Forcing it here keeps all packages consistent.
      compilerOptions: { rootDir: resolve(process.cwd(), "src") },
      outDirs: "dist/types",
    }),
    react(),
  ],
};
