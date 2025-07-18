import { describe, expect, it, beforeEach, afterEach } from "vitest";
import mock from "mock-fs";
import { collectCssVars } from "../src/style-engine-plugin.js";

describe("collectCssVars", () => {
  beforeEach(() => {
    // Mock a virtual file system with some constants files
    mock({
      "packages": {
        "layout": {
          "src": {
            "Box": {
              "Box.constants.ts": `
                export const cssVars = {
                  backgroundColor: {
                    cssVar: "--background-color",
                    value: "var(--tgph-VARIABLE)",
                  },
                  padding: {
                    cssVar: "--padding",
                    value: "var(--tgph-spacing-VARIABLE)",
                    direction: "all",
                  },
                };
              `,
            },
            "Stack": {
              "Stack.constants.ts": `
                export const cssVars = {
                  gap: {
                    cssVar: "--gap",
                    value: "var(--tgph-spacing-VARIABLE)",
                  },
                };
              `,
            },
          },
        },
        "button": {
          "src": {
            "Button": {
              "Button.constants.ts": `
                export const cssVars = {
                  buttonShadowColor: {
                    cssVar: "--box-shadow",
                    value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
                  },
                };
              `,
            },
          },
        },
        "empty": {
          "src": {
            "Empty": {
              "Empty.constants.ts": `
                // No cssVars export
                export const otherExport = {};
              `,
            },
          },
        },
      },
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("should discover and load cssVars from all components", async () => {
    const result = await collectCssVars("packages/**/src/**/*.constants.ts");

    expect(result).toHaveProperty("Box");
    expect(result).toHaveProperty("Stack");
    expect(result).toHaveProperty("Button");

    expect(result.Box).toBeDefined();
    expect(result.Box?.backgroundColor).toEqual({
      cssVar: "--background-color",
      value: "var(--tgph-VARIABLE)",
    });

    expect(result.Stack).toBeDefined();
    expect(result.Stack?.gap).toEqual({
      cssVar: "--gap",
      value: "var(--tgph-spacing-VARIABLE)",
    });

    expect(result.Button).toBeDefined();
    expect(result.Button?.buttonShadowColor).toEqual({
      cssVar: "--box-shadow",
      value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
    });
  });

  it("should handle files without cssVars export", async () => {
    const result = await collectCssVars("packages/**/src/**/*.constants.ts");

    // Empty component should not be included since it has no cssVars export
    expect(result).not.toHaveProperty("Empty");
  });

  it("should handle empty glob results", async () => {
    const result = await collectCssVars("nonexistent/**/path/*.ts");

    expect(result).toEqual({});
  });

  it("should extract component names correctly from file paths", async () => {
    const result = await collectCssVars("packages/**/src/**/*.constants.ts");

    // Should extract Box from packages/layout/src/Box/Box.constants.ts
    expect(result).toHaveProperty("Box");
    // Should extract Stack from packages/layout/src/Stack/Stack.constants.ts  
    expect(result).toHaveProperty("Stack");
    // Should extract Button from packages/button/src/Button/Button.constants.ts
    expect(result).toHaveProperty("Button");
  });
});