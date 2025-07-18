import { describe, expect, it } from "vitest";
import { generateInteractiveCss } from "../src/style-engine-plugin.js";

describe("generateInteractiveCss", () => {
  it("should generate CSS for interactive states", () => {
    const cssVars = {
      backgroundColor: {
        cssVar: "--background-color",
        value: "var(--tgph-VARIABLE)",
      },
      hover_backgroundColor: {
        cssVar: "--hover_backgroundColor",
        value: "var(--tgph-VARIABLE)",
        interactive: true,
      },
      focus_backgroundColor: {
        cssVar: "--focus_backgroundColor", 
        value: "var(--tgph-VARIABLE)",
        interactive: true,
      },
      borderColor: {
        cssVar: "--border-color",
        value: "var(--tgph-VARIABLE)",
      },
      active_borderColor: {
        cssVar: "--active_borderColor",
        value: "var(--tgph-VARIABLE)",
        interactive: true,
      },
    };

    const result = generateInteractiveCss("Box", cssVars);

    // Should contain base defaults
    expect(result).toContain(".tgph-box {");
    expect(result).toContain("--background-color: none;");
    expect(result).toContain("--border-color: none;");

    // Should contain hover state
    expect(result).toContain(".tgph-box:hover {");
    expect(result).toContain("--background-color: var(--hover_backgroundColor);");

    // Should contain focus state
    expect(result).toContain(".tgph-box:focus-visible {");
    expect(result).toContain("--background-color: var(--focus_backgroundColor);");

    // Should contain active state
    expect(result).toContain(".tgph-box:active {");
    expect(result).toContain("--border-color: var(--active_borderColor);");
  });

  it("should handle focus_within state", () => {
    const cssVars = {
      backgroundColor: {
        cssVar: "--background-color",
        value: "var(--tgph-VARIABLE)",
      },
      focus_within_backgroundColor: {
        cssVar: "--focus_within_backgroundColor",
        value: "var(--tgph-VARIABLE)",
        interactive: true,
      },
    };

    const result = generateInteractiveCss("Card", cssVars);

    expect(result).toContain(".tgph-card:has(:focus-within) {");
    expect(result).toContain("--background-color: var(--focus_within_backgroundColor);");
  });

  it("should handle components with no interactive props", () => {
    const cssVars = {
      gap: {
        cssVar: "--gap",
        value: "var(--tgph-spacing-VARIABLE)",
      },
      direction: {
        cssVar: "--direction",
        value: "VARIABLE",
      },
    };

    const result = generateInteractiveCss("Stack", cssVars);

    // Should contain base defaults
    expect(result).toContain(".tgph-stack {");
    expect(result).toContain("--gap: none;");
    expect(result).toContain("--direction: none;");

    // Should not contain any interactive states
    expect(result).not.toContain(":hover");
    expect(result).not.toContain(":focus");
    expect(result).not.toContain(":active");
    expect(result).not.toContain(":focus-within");
  });

  it("should handle empty cssVars", () => {
    const result = generateInteractiveCss("Empty", {});

    expect(result).toBe("");
  });

  it("should handle interactive props without matching base props", () => {
    const cssVars = {
      hover_nonExistentProp: {
        cssVar: "--hover_nonExistentProp",
        value: "var(--tgph-VARIABLE)",
        interactive: true,
      },
    };

    const result = generateInteractiveCss("Test", cssVars);

    // Should not generate any CSS since there's no base prop to match
    expect(result).toBe("");
  });

  it("should use correct selector format for component names", () => {
    const cssVars = {
      color: {
        cssVar: "--color",
        value: "var(--tgph-VARIABLE)",
      },
    };

    const result1 = generateInteractiveCss("Button", cssVars);
    expect(result1).toContain(".tgph-button {");

    const result2 = generateInteractiveCss("SegmentedControl", cssVars);
    expect(result2).toContain(".tgph-segmentedcontrol {");
  });

  it("should handle props with special cssVar mapping", () => {
    const cssVars = {
      buttonShadow: {
        cssVar: "--box-shadow",
        value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
      },
      hover_buttonShadow: {
        cssVar: "--hover_buttonShadow",
        value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
        interactive: true,
      },
    };

    const result = generateInteractiveCss("Button", cssVars);

    expect(result).toContain("--box-shadow: none;");
    expect(result).toContain(".tgph-button:hover {");
    expect(result).toContain("--box-shadow: var(--hover_buttonShadow);");
  });
});