/**
 * WHY THESE TESTS USE A REAL TEMP FILESYSTEM INSTEAD OF MOCKS
 * ------------------------------------------------------------
 * The PostCSS plugin (`postcss.ts`) caches its `fs` reference at module load
 * time using a CJS `require()` call:
 *
 *   const nodeFs = require("node:fs");
 *
 * This is intentional — the file uses `require()` rather than ESM `import` to
 * avoid known ESM-related bugs in the PostCSS plugin pipeline.
 *
 * The consequence is that standard Vitest mocking approaches don't work here:
 *
 * - `vi.mock("node:fs", factory)` — only intercepts ESM `import` statements.
 *   Vitest's docs explicitly state it does not work with `require()`.
 *
 * - `__mocks__/fs.cjs` + `vi.mock("node:fs")` — same limitation: the mock is
 *   applied at the ESM module-runner layer and does not reach CJS `require()`.
 *
 * - `memfs` — recommended by Vitest's own docs for filesystem mocking, but
 *   still relies on `vi.mock` under the hood, so it has the same problem.
 *
 * - `fs-monkey`'s `patchFs` — would technically work by mutating the real `fs`
 *   object in-place, but it patches globally across the entire process for the
 *   duration of the test, making it fragile and harder to reason about.
 *
 * The correct approach for this module is to use a real temp directory:
 * `os.tmpdir()` + `fs.mkdtempSync()` produces a unique, writable directory per
 * test run. This is reliable in CI — GitHub Actions runners (ubuntu-latest and
 * macos-latest) both expose a writable temp directory via `os.tmpdir()`, and
 * the randomised suffix from `mkdtempSync` prevents collisions between parallel
 * Vitest workers. Each test cleans up its temp dir in `afterEach`.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import postcss from "postcss";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import styleEnginePlugin from "./postcss";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Run the style engine PostCSS plugin on an input CSS string.
 *
 * @param input - The CSS to process.
 * @param from  - The `from` option passed to PostCSS (simulates the CSS file's
 *   absolute path). When undefined the plugin falls back to process.cwd().
 */
async function run(input: string, from?: string): Promise<string> {
  const result = await postcss([styleEnginePlugin()]).process(input, { from });
  return result.css;
}

// ---------------------------------------------------------------------------
// Temp filesystem scaffold
// ---------------------------------------------------------------------------

/**
 * A minimal fake monorepo on disk used across tests.
 *
 * Layout:
 *   <tmp>/
 *     package.json                          – root with "workspaces" key
 *     packages/
 *       react/
 *         package.json                      – consumer with @telegraph/* deps
 *         src/
 *           globals.css                     – (not created; path used as `from`)
 *           modules/guide/components/Toolbar/
 *             styles.css                    – (not created; path used as `from`)
 *     node_modules/
 *       @telegraph/
 *         button/
 *           package.json
 *           dist/css/default.css
 *         toggle/
 *           package.json
 *           dist/css/default.css
 *         tokens/
 *           package.json
 *           dist/css/default.css
 *           dist/css/light.css
 *           dist/css/dark.css
 */

let tmpDir: string;

function writeJson(filePath: string, data: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data));
}

function writeFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function scaffoldMonorepo(
  opts: { consumerDeps?: Record<string, string> } = {},
) {
  // Use workspace: versions so the plugin's monorepoRoot branch is exercised —
  // this is the realistic scenario (JS monorepo where sibling packages use
  // workspace: protocol and are hoisted to the root node_modules).
  const deps = opts.consumerDeps ?? {
    "@telegraph/button": "workspace:^",
    "@telegraph/toggle": "workspace:^",
    "@telegraph/tokens": "workspace:^",
  };

  // Monorepo root
  writeJson(path.join(tmpDir, "package.json"), {
    workspaces: ["packages/*"],
  });

  // Consumer package
  writeJson(path.join(tmpDir, "packages/react/package.json"), {
    name: "@test/react",
    dependencies: deps,
  });

  // @telegraph/button (leaf, has CSS)
  writeJson(path.join(tmpDir, "node_modules/@telegraph/button/package.json"), {
    name: "@telegraph/button",
    dependencies: {},
  });
  writeFile(
    path.join(tmpDir, "node_modules/@telegraph/button/dist/css/default.css"),
    ".tgph-button { display: inline-flex; }",
  );

  // @telegraph/toggle (leaf, has CSS)
  writeJson(path.join(tmpDir, "node_modules/@telegraph/toggle/package.json"), {
    name: "@telegraph/toggle",
    dependencies: {},
  });
  writeFile(
    path.join(tmpDir, "node_modules/@telegraph/toggle/dist/css/default.css"),
    "[data-tgph-toggle-switch] { cursor: pointer; }",
  );

  // @telegraph/tokens (leaf, has token CSS files)
  writeJson(path.join(tmpDir, "node_modules/@telegraph/tokens/package.json"), {
    name: "@telegraph/tokens",
    dependencies: {},
  });
  writeFile(
    path.join(tmpDir, "node_modules/@telegraph/tokens/dist/css/default.css"),
    ":root { --tgph-gray-1: #fff; }",
  );
  writeFile(
    path.join(tmpDir, "node_modules/@telegraph/tokens/dist/css/light.css"),
    ":root { --tgph-gray-1-light: #fff; }",
  );
  writeFile(
    path.join(tmpDir, "node_modules/@telegraph/tokens/dist/css/dark.css"),
    ":root { --tgph-gray-1-dark: #000; }",
  );
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "style-engine-test-"));
});

afterEach(() => {
  // Best-effort cleanup. If a worker crashes mid-test the temp dir may already
  // be gone or partially removed; ignoring errors here ensures that doesn't
  // cause a spurious failure in the next test run.
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // intentionally empty
  }
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("@telegraph/style-engine PostCSS plugin", () => {
  // -------------------------------------------------------------------------
  // Core bug fix: CSS file path → nearest package.json
  // -------------------------------------------------------------------------
  describe("monorepo: uses CSS file path to find the consumer package.json", () => {
    it("injects component CSS when `from` points deep inside a consumer package", async () => {
      scaffoldMonorepo();

      const css = await run(
        "@telegraph components;",
        // CSS file is inside the react package — NOT the monorepo root
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).toContain(".tgph-button");
      expect(css).toContain("[data-tgph-toggle-switch]");
    });

    it("injects toggle CSS via @telegraph components in a JS monorepo (KNO-12330 regression)", async () => {
      scaffoldMonorepo();

      // Simulates the exact path structure from the JS repo that triggered KNO-12330
      const css = await run(
        "@telegraph components;",
        path.join(
          tmpDir,
          "packages/react/src/modules/guide/components/Toolbar/styles.css",
        ),
      );

      expect(css).toContain("[data-tgph-toggle-switch]");
    });

    it("does NOT inject component CSS when `from` points to the monorepo root (old broken behavior)", async () => {
      scaffoldMonorepo();

      // The monorepo root package.json has no @telegraph/* deps — this
      // reproduces the bug that existed before the fix.
      const css = await run(
        "@telegraph components;",
        path.join(tmpDir, "some-file-at-root.css"),
      );

      // Root has no @telegraph/* deps, so nothing is injected
      expect(css).not.toContain(".tgph-button");
      expect(css).not.toContain("[data-tgph-toggle-switch]");
    });

    it("removes the @telegraph components directive from output", async () => {
      scaffoldMonorepo();

      const css = await run(
        "@telegraph components;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).not.toContain("@telegraph components");
    });

    it("injects default token CSS for @telegraph tokens", async () => {
      scaffoldMonorepo();

      const css = await run(
        "@telegraph tokens;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).toContain("--tgph-gray-1");
      expect(css).not.toContain("@telegraph tokens");
    });

    it("injects light token CSS for @telegraph tokens-light", async () => {
      scaffoldMonorepo();

      const css = await run(
        "@telegraph tokens-light;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).toContain("--tgph-gray-1-light");
    });

    it("injects dark token CSS for @telegraph tokens-dark", async () => {
      scaffoldMonorepo();

      const css = await run(
        "@telegraph tokens-dark;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).toContain("--tgph-gray-1-dark");
    });
  });

  // -------------------------------------------------------------------------
  // findNearestPackageJsonDir: walks up from the CSS file directory
  // -------------------------------------------------------------------------
  describe("findNearestPackageJsonDir", () => {
    it("finds the package.json when the CSS file is deeply nested", async () => {
      scaffoldMonorepo();

      // CSS file is 5 levels deep inside the react package
      const css = await run(
        "@telegraph components;",
        path.join(
          tmpDir,
          "packages/react/src/modules/guide/components/Toolbar/styles.css",
        ),
      );

      expect(css).toContain(".tgph-button");
      expect(css).toContain("[data-tgph-toggle-switch]");
    });
  });

  // -------------------------------------------------------------------------
  // Fallback: when `from` is undefined, falls back to process.cwd()
  // -------------------------------------------------------------------------
  describe("fallback behavior when from is undefined", () => {
    it("does not throw when from is undefined", async () => {
      await expect(run("@telegraph components;")).resolves.not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // Recursive dependency resolution
  // -------------------------------------------------------------------------
  describe("recursive dependency resolution", () => {
    it("discovers @telegraph/* deps of deps transitively", async () => {
      scaffoldMonorepo();

      // Patch button to depend on @telegraph/icon (a transitive dep).
      // Use workspace: so the plugin resolves icon from monorepoRoot/node_modules.
      writeJson(
        path.join(tmpDir, "node_modules/@telegraph/button/package.json"),
        {
          name: "@telegraph/button",
          dependencies: { "@telegraph/icon": "workspace:^" },
        },
      );
      writeJson(
        path.join(tmpDir, "node_modules/@telegraph/icon/package.json"),
        { name: "@telegraph/icon", dependencies: {} },
      );
      writeFile(
        path.join(tmpDir, "node_modules/@telegraph/icon/dist/css/default.css"),
        ".tgph-icon { display: inline-block; }",
      );

      const css = await run(
        "@telegraph components;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).toContain(".tgph-button");
      expect(css).toContain(".tgph-icon");
    });
  });

  // -------------------------------------------------------------------------
  // Tokens are excluded from @telegraph components
  // -------------------------------------------------------------------------
  describe("token packages are excluded from @telegraph components", () => {
    it("does not inject token CSS when only @telegraph components is used", async () => {
      scaffoldMonorepo();

      const css = await run(
        "@telegraph components;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).not.toContain("--tgph-gray-1");
    });
  });

  // -------------------------------------------------------------------------
  // Packages without a dist/css/default.css are silently skipped
  // -------------------------------------------------------------------------
  describe("missing CSS files are skipped gracefully", () => {
    it("skips a package with no dist/css/default.css without throwing", async () => {
      scaffoldMonorepo();

      // Remove toggle's CSS dist file
      fs.rmSync(
        path.join(
          tmpDir,
          "node_modules/@telegraph/toggle/dist/css/default.css",
        ),
      );

      const css = await run(
        "@telegraph components;",
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      // button CSS still injected, toggle silently skipped
      expect(css).toContain(".tgph-button");
      expect(css).not.toContain("[data-tgph-toggle-switch]");
    });
  });

  // -------------------------------------------------------------------------
  // No-op when no @telegraph directives are present
  // -------------------------------------------------------------------------
  describe("no-op when no @telegraph directives present", () => {
    it("passes CSS through unchanged when no @telegraph rules are found", async () => {
      scaffoldMonorepo();

      const input = ".foo { color: red; }";
      const css = await run(
        input,
        path.join(tmpDir, "packages/react/src/globals.css"),
      );

      expect(css).toBe(input);
    });
  });

  // -------------------------------------------------------------------------
  // Non-workspace (semver) deps — the `else` branch of recursivelyGetTelegraphDeps
  //
  // All existing tests use `workspace:^` versions so the plugin resolves deps
  // from monorepoRoot/node_modules via the `if (workspace:)` branch. This
  // covers the `else` branch, which is the path taken in standalone (non-
  // monorepo) consumers — e.g. a Next.js app that does `npm install @telegraph/*`.
  // In that case there is no monorepoRoot, and deps are resolved from
  // consumerDir/node_modules instead.
  // -------------------------------------------------------------------------
  describe("non-workspace (semver) deps resolved from consumerDir/node_modules", () => {
    it("resolves deps from consumerDir/node_modules when versions are plain semver", async () => {
      // No workspaces key in root → findMonorepoRoot returns undefined.
      // Deps use plain semver → plugin takes the else branch and looks in
      // consumerDir/node_modules for CSS files.
      writeJson(path.join(tmpDir, "package.json"), { name: "standalone-app" });
      writeJson(path.join(tmpDir, "src/package.json"), {
        name: "standalone-app",
        dependencies: {
          "@telegraph/button": "^1.0.0",
          "@telegraph/toggle": "^1.0.0",
        },
      });
      writeJson(
        path.join(tmpDir, "src/node_modules/@telegraph/button/package.json"),
        { name: "@telegraph/button", dependencies: {} },
      );
      writeFile(
        path.join(
          tmpDir,
          "src/node_modules/@telegraph/button/dist/css/default.css",
        ),
        ".tgph-button { display: inline-flex; }",
      );
      writeJson(
        path.join(tmpDir, "src/node_modules/@telegraph/toggle/package.json"),
        { name: "@telegraph/toggle", dependencies: {} },
      );
      writeFile(
        path.join(
          tmpDir,
          "src/node_modules/@telegraph/toggle/dist/css/default.css",
        ),
        "[data-tgph-toggle-switch] { cursor: pointer; }",
      );

      const css = await run(
        "@telegraph components;",
        // CSS file sits next to the package.json — consumerDir = tmpDir/src
        path.join(tmpDir, "src/globals.css"),
      );

      expect(css).toContain(".tgph-button");
      expect(css).toContain("[data-tgph-toggle-switch]");
    });
  });

  // -------------------------------------------------------------------------
  // findNearestPackageJsonDir stops at the FIRST package.json walking up.
  // A CSS file that lives inside a deeply nested node_modules package (which
  // has its own package.json) should not pick up that nested package's deps —
  // this scenario shouldn't occur in practice, but ensures the upward walk
  // terminates at the nearest ancestor rather than skipping over it.
  // -------------------------------------------------------------------------
  describe("findNearestPackageJsonDir stops at the nearest package.json", () => {
    it("uses the innermost package.json, not a higher-level ancestor", async () => {
      // Two nested packages: outer has button, inner has toggle only.
      // CSS file is inside inner — should only pick up inner's deps.
      writeJson(path.join(tmpDir, "package.json"), {
        workspaces: ["packages/*"],
      });
      writeJson(path.join(tmpDir, "packages/outer/package.json"), {
        name: "outer",
        dependencies: { "@telegraph/button": "workspace:^" },
      });
      writeJson(path.join(tmpDir, "packages/outer/inner/package.json"), {
        name: "inner",
        dependencies: { "@telegraph/toggle": "workspace:^" },
      });
      writeJson(
        path.join(tmpDir, "node_modules/@telegraph/button/package.json"),
        { name: "@telegraph/button", dependencies: {} },
      );
      writeFile(
        path.join(
          tmpDir,
          "node_modules/@telegraph/button/dist/css/default.css",
        ),
        ".tgph-button { display: inline-flex; }",
      );
      writeJson(
        path.join(tmpDir, "node_modules/@telegraph/toggle/package.json"),
        { name: "@telegraph/toggle", dependencies: {} },
      );
      writeFile(
        path.join(
          tmpDir,
          "node_modules/@telegraph/toggle/dist/css/default.css",
        ),
        "[data-tgph-toggle-switch] { cursor: pointer; }",
      );

      const css = await run(
        "@telegraph components;",
        // CSS file is inside inner — nearest package.json is inner's
        path.join(tmpDir, "packages/outer/inner/src/styles.css"),
      );

      // Only toggle (inner's dep), not button (outer's dep)
      expect(css).toContain("[data-tgph-toggle-switch]");
      expect(css).not.toContain(".tgph-button");
    });
  });
});
