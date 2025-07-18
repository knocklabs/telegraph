import { afterEach, beforeEach, describe, expect, it } from "vitest";
import mock from "mock-fs";

import { generateInteractiveCss } from "../src/style-engine-plugin.js";

beforeEach(() => {
  mock({});
});

afterEach(() => {
  mock.restore();
});

describe("generateInteractiveCss", () => {
  it("should generate CSS for all base properties with interactive states", () => {
    const componentName = "Box";
    const cssVars = {
      backgroundColor: {
        cssVar: "--background-color",
        value: "var(--tgph-VARIABLE)",
      },
      borderColor: {
        cssVar: "--border-color", 
        value: "var(--tgph-VARIABLE)",
      },
      height: {
        cssVar: "--height",
        value: "var(--tgph-spacing-VARIABLE)",
      },
      // Shorthand property that maps to same CSS var as height
      h: {
        cssVar: "--height",
        value: "var(--tgph-spacing-VARIABLE)",
      },
    };

    const result = generateInteractiveCss(componentName, cssVars);

    // Should generate hover states for all properties
    expect(result).toContain(".tgph-box:hover");
    expect(result).toContain("--background-color: var(--hover_backgroundColor);");
    expect(result).toContain("--border-color: var(--hover_borderColor);");
    expect(result).toContain("--height: var(--hover_height);");
    expect(result).toContain("--height: var(--hover_h);");

    // Should generate focus states
    expect(result).toContain(".tgph-box:focus-visible");
    expect(result).toContain("--background-color: var(--focus_backgroundColor);");
    
    // Should generate active states  
    expect(result).toContain(".tgph-box:active");
    expect(result).toContain("--background-color: var(--active_backgroundColor);");
    
    // Should generate focus_within states
    expect(result).toContain(".tgph-box:has(:focus-within)");
    expect(result).toContain("--background-color: var(--focus_within_backgroundColor);");
  });

  it("should handle components with minimal cssVars", () => {
    const componentName = "Button";
    const cssVars = {
      default_buttonShadowColor: {
        cssVar: "--box-shadow",
        value: "inset 0 0 0 1px var(--tgph-VARIABLE)",
      },
    };

    const result = generateInteractiveCss(componentName, cssVars);

    // Should generate interactive states for the button shadow
    expect(result).toContain(".tgph-button:hover");
    expect(result).toContain("--box-shadow: var(--hover_default_buttonShadowColor);");
    expect(result).toContain(".tgph-button:focus-visible");
    expect(result).toContain("--box-shadow: var(--focus_default_buttonShadowColor);");
  });

  it("should return empty string for components without cssVars", () => {
    const componentName = "Empty";
    const cssVars = {};

    const result = generateInteractiveCss(componentName, cssVars);

    expect(result).toBe("");
  });

  it("should group multiple properties that map to same CSS variable", () => {
    const componentName = "Stack";
    const cssVars = {
      padding: {
        cssVar: "--padding",
        value: "var(--tgph-spacing-VARIABLE)",
        direction: "all",
      },
      p: {
        cssVar: "--padding",
        value: "var(--tgph-spacing-VARIABLE)",
        direction: "all",
      },
    };

    const result = generateInteractiveCss(componentName, cssVars);

    // Both padding and p should be in the same hover rule since they share --padding
    const hoverRule = result.match(/\.tgph-stack:hover \{[^}]+\}/s)?.[0];
    expect(hoverRule).toContain("--padding: var(--hover_padding);");
    expect(hoverRule).toContain("--padding: var(--hover_p);");
  });
});