import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  findMissingPackages,
  isAtLeast,
  publishablePackages,
} from "../npm-trusted-publishing.mjs";

describe("isAtLeast", () => {
  it.each([
    // 11.6.2 sorts after 11.15.0 as text, so this catches a string compare.
    { version: "11.6.2", expected: false },
    { version: "11.14.9", expected: false },
    { version: "11.15.0", expected: true },
    { version: "11.15.1", expected: true },
    // A higher major wins even though its minor is lower.
    { version: "12.0.0", expected: true },
  ])(
    "treats npm $version as $expected against 11.15.0",
    ({ version, expected }) => {
      expect(isAtLeast({ version, minimum: "11.15.0" })).toBe(expected);
    },
  );
});

describe("publishablePackages", () => {
  let root;

  const addPackage = ({ dir, manifest }) => {
    mkdirSync(join(root, "packages", dir), { recursive: true });
    if (manifest) {
      writeFileSync(
        join(root, "packages", dir, "package.json"),
        JSON.stringify(manifest),
      );
    }
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "trusted-publishing-test-"));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("returns public @telegraph packages and skips the rest", () => {
    addPackage({
      dir: "tooltip",
      manifest: { name: "@telegraph/tooltip", version: "1.0.0" },
    });
    addPackage({
      dir: "button",
      manifest: { name: "@telegraph/button", version: "1.0.0" },
    });
    addPackage({
      dir: "filter",
      manifest: { name: "@telegraph/filter", version: "1.0.0", private: true },
    });
    addPackage({
      dir: "other-scope",
      manifest: { name: "@knocklabs/thing", version: "1.0.0" },
    });
    addPackage({ dir: "no-manifest" });
    writeFileSync(join(root, "packages", "README.md"), "");

    const names = publishablePackages({ root }).map((p) => p.name);
    expect([...names].sort()).toEqual([
      "@telegraph/button",
      "@telegraph/tooltip",
    ]);
  });
});

describe("findMissingPackages", () => {
  // Answers requests the way registry.npmjs.org does, keyed by package name.
  const stubRegistry = ({ statusByName }) => {
    vi.stubGlobal("fetch", async (url) => {
      const name = decodeURIComponent(new URL(url).pathname.slice(1));
      return new Response(null, { status: statusByName[name] });
    });
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns only the packages the registry does not have", async () => {
    stubRegistry({
      statusByName: { "@telegraph/button": 200, "@telegraph/brand-new": 404 },
    });

    const missing = await findMissingPackages({
      packages: [
        { name: "@telegraph/button" },
        { name: "@telegraph/brand-new" },
      ],
    });

    expect(missing.map((p) => p.name)).toEqual(["@telegraph/brand-new"]);
  });

  it("fails rather than guessing when the registry errors", async () => {
    stubRegistry({ statusByName: { "@telegraph/button": 503 } });

    await expect(
      findMissingPackages({ packages: [{ name: "@telegraph/button" }] }),
    ).rejects.toThrow("503");
  });
});
