import { describe, expect, it, beforeEach, afterEach } from "vitest";
import mock from "mock-fs";
import { promises as fs } from "node:fs";
import { appendInteractiveBlock } from "../src/style-engine-plugin.js";

describe("appendInteractiveBlock", () => {
  beforeEach(() => {
    mock({
      "test-files": {
        "default.css": "@import \"./Component.styles.css\";\n",
        "with-existing-block.css": `@import "./Component.styles.css";

.component {
  color: red;
}

/* AUTO-GENERATED START */
.old-generated-css {
  color: blue;
}
/* AUTO-GENERATED END */

.another-rule {
  margin: 10px;
}`,
        "empty.css": "",
      },
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("should append auto-generated block to file without existing block", async () => {
    const cssString = `.tgph-box {
  --background-color: none;
}

.tgph-box:hover {
  --background-color: var(--hover_backgroundColor);
}
`;

    await appendInteractiveBlock("test-files/default.css", cssString);

    const result = await fs.readFile("test-files/default.css", "utf-8");

    expect(result).toContain("@import \"./Component.styles.css\";");
    expect(result).toContain("/* AUTO-GENERATED START */");
    expect(result).toContain("/* AUTO-GENERATED END */");
    expect(result).toContain(".tgph-box {");
    expect(result).toContain("--background-color: none;");
    expect(result).toContain(".tgph-box:hover {");
    expect(result).toContain("--background-color: var(--hover_backgroundColor);");
  });

  it("should replace existing auto-generated block without affecting other CSS", async () => {
    const newCssString = `.tgph-button {
  --color: none;
}

.tgph-button:focus {
  --color: var(--focus_color);
}
`;

    await appendInteractiveBlock("test-files/with-existing-block.css", newCssString);

    const result = await fs.readFile("test-files/with-existing-block.css", "utf-8");

    // Original CSS should be preserved
    expect(result).toContain("@import \"./Component.styles.css\";");
    expect(result).toContain(".component {\n  color: red;\n}");
    expect(result).toContain(".another-rule {\n  margin: 10px;\n}");

    // Old generated CSS should be replaced
    expect(result).not.toContain(".old-generated-css");
    expect(result).not.toContain("color: blue;");

    // New generated CSS should be present
    expect(result).toContain("/* AUTO-GENERATED START */");
    expect(result).toContain("/* AUTO-GENERATED END */");
    expect(result).toContain(".tgph-button {");
    expect(result).toContain("--color: none;");
    expect(result).toContain(".tgph-button:focus {");
    expect(result).toContain("--color: var(--focus_color);");
  });

  it("should handle empty CSS string", async () => {
    await appendInteractiveBlock("test-files/default.css", "");

    const result = await fs.readFile("test-files/default.css", "utf-8");

    expect(result).toContain("@import \"./Component.styles.css\";");
    expect(result).toContain("/* AUTO-GENERATED START */");
    expect(result).toContain("/* AUTO-GENERATED END */");
    
    // Should only contain the markers with empty content between
    const startIndex = result.indexOf("/* AUTO-GENERATED START */");
    const endIndex = result.indexOf("/* AUTO-GENERATED END */");
    const between = result.substring(startIndex + "/* AUTO-GENERATED START */".length, endIndex);
    expect(between.trim()).toBe("");
  });

  it("should handle files that start empty", async () => {
    const cssString = `.tgph-test {
  --prop: value;
}
`;

    await appendInteractiveBlock("test-files/empty.css", cssString);

    const result = await fs.readFile("test-files/empty.css", "utf-8");

    expect(result).toContain("/* AUTO-GENERATED START */");
    expect(result).toContain("/* AUTO-GENERATED END */");
    expect(result).toContain(".tgph-test {");
    expect(result).toContain("--prop: value;");
  });

  it("should be idempotent when called multiple times", async () => {
    const cssString1 = `.tgph-first {
  --color: red;
}
`;

    const cssString2 = `.tgph-second {
  --color: blue;
}
`;

    // First append
    await appendInteractiveBlock("test-files/default.css", cssString1);

    // Second append (should replace, not duplicate)
    await appendInteractiveBlock("test-files/default.css", cssString2);
    const result2 = await fs.readFile("test-files/default.css", "utf-8");

    // Should not contain first CSS anymore
    expect(result2).not.toContain(".tgph-first");
    expect(result2).not.toContain("--color: red;");

    // Should contain second CSS
    expect(result2).toContain(".tgph-second");
    expect(result2).toContain("--color: blue;");

    // Should only have one auto-generated block
    const startCount = (result2.match(/\/\* AUTO-GENERATED START \*\//g) || []).length;
    const endCount = (result2.match(/\/\* AUTO-GENERATED END \*\//g) || []).length;
    expect(startCount).toBe(1);
    expect(endCount).toBe(1);
  });

  it("should handle non-existent files gracefully", async () => {
    // Should not throw an error
    await expect(
      appendInteractiveBlock("test-files/non-existent.css", "test css")
    ).resolves.toBeUndefined();
  });
});