import postcss, {
  type AcceptedPlugin,
  Helpers,
  type PluginCreator,
  Root,
} from "postcss";

const path = require("path");
const fs = require("fs");

type TelegraphParams = {
  root: Root;
  helpers: Helpers;
};

function findMonorepoRoot(start = process.cwd()): string {
  let current = start;

  while (true) {
    const pkgJsonPath = path.join(current, "package.json");
    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
        if (pkg.workspaces) {
          return current; // found the monorepo root
        }
      } catch {
        // malformed package.json, skip
      }
    }

    const parent = path.dirname(current);
    if (parent === current) break; // hit filesystem root
    current = parent;
  }

  throw new Error(
    'Could not find monorepo root (no package.json with "workspaces" found)',
  );
}

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

const getTelegraphDepsFromPackageJson = (
  pkg: PkgJson,
  pkgPath: string,
): DepObject => {
  if (!pkg.dependencies || Object.keys(pkg.dependencies)?.length === 0) return;

  return Object.entries(pkg.dependencies).reduce((acc, [dep, version]) => {
    if (dep.startsWith("@telegraph/")) {
      acc[dep] = {
        name: dep,
        version,
        path: path.resolve(pkgPath, "node_modules", dep),
      };
    }
    return acc;
  }, {} as DepObject);
};

function getTelegraphDeps(): DepObject {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
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
        pkgJsonPath = path.resolve(
          monorepoRoot,
          "node_modules",
          dep.name,
          "package.json",
        );
        searchPath = monorepoRoot;
      } else {
        pkgJsonPath = path.resolve(
          process.cwd(),
          "node_modules",
          dep.name,
          "package.json",
        );
        searchPath = process.cwd();
      }

      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
        const depDeps = getTelegraphDepsFromPackageJson(pkgJson, searchPath);

        // Merge new dependencies into allDeps
        Object.assign(allDeps, depDeps);

        // Recursively get dependencies of dependencies
        const nestedDeps = recursivelyGetTelegraphDeps(depDeps);
        Object.assign(allDeps, nestedDeps);
      } catch (err) {
        // Skip if package.json cannot be read
        continue;
      }
    }

    return allDeps;
  };

  return recursivelyGetTelegraphDeps(topLevelDeps);
}

function getCssStyles(dep: { name: string; path: string }): string | null {
  try {
    const cssPath = `${dep.path}/dist/css/default.css`;
    const pkgPath = path.resolve(cssPath);

    if (fs.existsSync(pkgPath)) {
      return fs.readFileSync(pkgPath, "utf8");
    }

    return null;
  } catch {
    return null;
  }
}

const telegraph = async ({ root, helpers }: TelegraphParams) => {
  const deps = getTelegraphDeps();
  const cssFiles = Object.values(deps)
    .map(getCssStyles)
    .filter(Boolean) as Array<string>;

  for (const content of cssFiles) {
    const parsed = postcss.parse(content);
    root.append(parsed);
  }
};

const styleEnginePostCssPlugin = (): AcceptedPlugin => {
  return {
    postcssPlugin: "@telegraph/style-engine",
    plugins: [
      {
        postcssPlugin: "style-engine",
        async Once(root, helpers) {
          let shouldRun = false;
          root.walkAtRules("telegraph", (atRule) => {
            if (atRule.params === "components") {
              shouldRun = true;
              atRule.remove();
            }

            if (atRule.params === "tokens") {
              const tokensCss = fs.readFileSync(
                path.resolve(
                  process.cwd(),
                  "../../node_modules/@telegraph/tokens/dist/css/default.css",
                ),
                "utf8",
              );
              atRule.replaceWith(tokensCss);
            }
          });

          if (shouldRun) {
            await telegraph({
              root,
              helpers,
            });
          }
        },
      },
    ],
  };
};

export default Object.assign(styleEnginePostCssPlugin, {
  postcss: true,
}) as PluginCreator<{}>;
