import { type AcceptedPlugin, type PluginCreator, type Root } from "postcss";

// Using require() instead of import to prevent ESM-related bugs in PostCSS.
// ESM = ECMAScript Modules (the import/export syntax)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodePath = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeFs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcss = require("postcss");

type PkgJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type DepObject = Record<
  string,
  {
    name: string;
    version: string;
    path: string;
  }
>;

/**
 * Traverses up the directory tree to find the root of the monorepo by looking for a package.json with workspaces.
 * This is needed to properly resolve workspace dependencies in a monorepo setup.
 */
function findMonorepoRoot(start = process.cwd()): string | undefined {
  let current = start;
  let run = true;

  while (run) {
    const pkgJsonPath = nodePath.join(current, "package.json");
    if (nodeFs.existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(nodeFs.readFileSync(pkgJsonPath, "utf8"));
        if (pkg.workspaces) {
          return current;
        }
      } catch {
        // malformed package.json, skip
      }
    }

    const parent = nodePath.dirname(current);
    if (parent === current) run = false;
    current = parent;
  }

  return undefined;
}

/**
 * Extracts all @telegraph/* dependencies from a package.json file and returns them with their paths.
 * This is used to find all Telegraph packages that might contain CSS we need to include.
 */
const getTelegraphDepsFromPackageJson = (
  pkg: PkgJson,
  pkgPath: string,
): DepObject | undefined => {
  if (!pkg.dependencies || Object.keys(pkg.dependencies)?.length === 0) return;

  return Object.entries(pkg.dependencies).reduce((acc, [dep, version]) => {
    if (dep.startsWith("@telegraph/")) {
      acc[dep] = {
        name: dep,
        version,
        path: nodePath.resolve(pkgPath, "node_modules", dep),
      };
    }
    return acc;
  }, {} as DepObject);
};

/**
 * Gets all Telegraph dependencies recursively, including dependencies of dependencies.
 * Handles both normal npm dependencies and workspace dependencies in a monorepo.
 */
function getTelegraphDeps(): DepObject {
  const pkgPath = nodePath.resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(nodeFs.readFileSync(pkgPath, "utf8"));
  const topLevelDeps = getTelegraphDepsFromPackageJson(pkg, process.cwd());
  const monorepoRoot = findMonorepoRoot();

  const recursivelyGetTelegraphDeps = (deps: DepObject): DepObject => {
    if (!deps || Object.keys(deps).length === 0) {
      return deps;
    }

    const allDeps = { ...deps };

    for (const dep of Object.values(deps)) {
      let pkgJsonPath: string;
      let searchPath: string;

      if (dep.version.includes("workspace:") && monorepoRoot) {
        pkgJsonPath = nodePath.resolve(
          monorepoRoot,
          "node_modules",
          dep.name,
          "package.json",
        );
        searchPath = monorepoRoot;
      } else {
        pkgJsonPath = nodePath.resolve(
          process.cwd(),
          "node_modules",
          dep.name,
          "package.json",
        );
        searchPath = process.cwd();
      }

      try {
        const pkgJson = JSON.parse(nodeFs.readFileSync(pkgJsonPath, "utf8"));
        const deps = getTelegraphDepsFromPackageJson(pkgJson, searchPath);

        // Merge new dependencies into allDeps
        Object.assign(allDeps, deps);

        if (deps) {
          // Recursively get dependencies of dependencies
          const nestedDeps = recursivelyGetTelegraphDeps(deps);
          Object.assign(allDeps, nestedDeps);
        }
      } catch (_err) {
        // Skip if package.json cannot be read
        continue;
      }
    }

    return allDeps;
  };

  if (topLevelDeps) {
    return recursivelyGetTelegraphDeps(topLevelDeps);
  }

  return {};
}

type GetCssStylesParams = {
  fileName?: string;
  path: string;
};

/**
 * Reads CSS file content from a Telegraph package's dist/css directory.
 * Returns null if the file doesn't exist or can't be read.
 */
function getCssStyles({
  fileName = "default.css",
  path,
}: GetCssStylesParams): string | null {
  try {
    const cssPath = `${path}/dist/css/${fileName}`;
    const pkgPath = nodePath.resolve(cssPath);

    if (nodeFs.existsSync(pkgPath)) {
      return nodeFs.readFileSync(pkgPath, "utf8");
    }

    return null;
  } catch {
    return null;
  }
}

type BuildTelegraphCssParams = {
  root: Root;
  config: {
    tokens: Array<"light" | "dark" | "default">;
    components: boolean;
  };
};

/**
 * Main function that builds the final CSS by:
 * 1. Getting all Telegraph dependencies
 * 2. Filtering for either token packages or component packages based on config
 * 3. Reading their CSS files
 * 4. Appending all CSS to the PostCSS Root node
 */
const buildTelegraphCss = async ({ root, config }: BuildTelegraphCssParams) => {
  const deps = getTelegraphDeps();

  const depsWithoutTokens =
    config.components === true
      ? Object.values(deps).filter(
          (dep) => !dep.name.includes("@telegraph/tokens"),
        )
      : [];

  const tokensDeps =
    config.tokens.length > 0
      ? Object.values(deps).filter((dep) =>
          dep.name.includes("@telegraph/tokens"),
        )
      : [];

  const cssFiles = depsWithoutTokens
    .map((dep) => getCssStyles({ path: dep.path }))
    .filter(Boolean) as Array<string>;

  const tokensCssFiles = config.tokens
    .map((token) => {
      const cssFile = tokensDeps.map((dep) =>
        getCssStyles({ path: dep.path, fileName: `${token}.css` }),
      );

      return cssFile.filter(Boolean) as Array<string>;
    })
    .filter(Boolean);

  const allCssFiles = [...cssFiles, ...tokensCssFiles];

  for (const content of allCssFiles) {
    const parsed = postcss.parse(content);
    root.append(parsed);
  }
};

/**
 * PostCSS plugin that processes @telegraph rules in CSS files.
 * It looks for @telegraph tokens, @telegraph tokens-light, @telegraph tokens-dark,
 * and @telegraph components rules and includes the appropriate CSS from Telegraph packages.
 */
const styleEnginePostCssPlugin = (): AcceptedPlugin => {
  return {
    postcssPlugin: "@telegraph/style-engine",
    plugins: [
      {
        postcssPlugin: "telegraph",
        AtRule: {
          telegraph() {},
        },
        async Once(root) {
          const run = {
            tokens: [] as BuildTelegraphCssParams["config"]["tokens"],
            components: false,
          };
          root.walkAtRules("telegraph", (atRule) => {
            if (atRule.params === "components") {
              run.components = true;
              atRule.remove();
            }

            if (atRule.params === "tokens-light") {
              run.tokens.push("light");
              atRule.remove();
            }

            if (atRule.params === "tokens-dark") {
              run.tokens.push("dark");
              atRule.remove();
            }

            if (atRule.params === "tokens") {
              run.tokens.push("default");
              atRule.remove();
            }
          });

          await buildTelegraphCss({
            root,
            config: {
              tokens: run.tokens,
              components: run.components,
            },
          });
        },
      },
    ],
  };
};

export default Object.assign(styleEnginePostCssPlugin, {
  postcss: true,
}) as PluginCreator<Record<string, never>>;
