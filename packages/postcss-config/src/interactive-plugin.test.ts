import postcss from "postcss";
import { describe, expect, it } from "vitest";

import interactivePlugin from "./interactive-plugin";

/**
 * Helper to run the interactive plugin on input CSS and return the output.
 */
async function run(input: string): Promise<string> {
  const result = await postcss([interactivePlugin()]).process(input, {
    from: undefined,
  });
  return result.css;
}

/**
 * Helper to parse output CSS into an array of { selector, declarations }
 * for easier assertion. Skips the base rule.
 */
function parseRules(
  css: string,
): { selector: string; declarations: { prop: string; value: string }[] }[] {
  const root = postcss.parse(css);
  const rules: {
    selector: string;
    declarations: { prop: string; value: string }[];
  }[] = [];

  root.walkRules((rule) => {
    const declarations: { prop: string; value: string }[] = [];
    rule.walkDecls((decl) => {
      declarations.push({ prop: decl.prop, value: decl.value });
    });
    rules.push({ selector: rule.selector, declarations });
  });

  return rules;
}

describe("interactive PostCSS plugin", () => {
  describe("basic generation", () => {
    it("generates all 5 pseudo-state rules from a single property", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Base rule + 5 pseudo states
      expect(rules).toHaveLength(6);

      // Verify selectors in order
      expect(rules[0].selector).toBe(".tgph-box");
      expect(rules[1].selector).toBe(".tgph-box--interactive:hover");
      expect(rules[2].selector).toBe(".tgph-box--interactive:focus-visible");
      expect(rules[3].selector).toBe(".tgph-box--interactive:active");
      expect(rules[4].selector).toBe(
        ".tgph-box--interactive:has(:focus-visible)",
      );
      expect(rules[5].selector).toContain(".tgph-box--interactive:disabled");
      expect(rules[5].selector).toContain(
        '.tgph-box--interactive[aria-disabled="true"]',
      );
    });

    it("generates correct cascade fallback values", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // hover
      expect(rules[1].declarations).toEqual([
        {
          prop: "background-color",
          value: "var(--hover--background-color, var(--background-color))",
        },
      ]);

      // focus
      expect(rules[2].declarations).toEqual([
        {
          prop: "background-color",
          value: "var(--focus--background-color, var(--background-color))",
        },
      ]);

      // active
      expect(rules[3].declarations).toEqual([
        {
          prop: "background-color",
          value: "var(--active--background-color, var(--background-color))",
        },
      ]);

      // focus-within
      expect(rules[4].declarations).toEqual([
        {
          prop: "background-color",
          value:
            "var(--focus-within--background-color, var(--background-color))",
        },
      ]);

      // disabled
      expect(rules[5].declarations).toEqual([
        {
          prop: "background-color",
          value: "var(--disabled--background-color, var(--background-color))",
        },
      ]);
    });
  });

  describe("multiple properties", () => {
    it("includes all matching properties in each pseudo-state rule", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
          border-color: var(--border-color);
          box-shadow: var(--box-shadow);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Each pseudo rule should have 3 declarations
      for (let i = 1; i <= 5; i++) {
        expect(rules[i].declarations).toHaveLength(3);
      }

      // Verify hover has all 3 properties
      expect(rules[1].declarations[0].prop).toBe("background-color");
      expect(rules[1].declarations[1].prop).toBe("border-color");
      expect(rules[1].declarations[2].prop).toBe("box-shadow");

      // Verify values use correct prefix
      expect(rules[1].declarations[1].value).toBe(
        "var(--hover--border-color, var(--border-color))",
      );
    });

    it("preserves declaration order from the base rule", async () => {
      const input = `
        .my-component {
          z-index: var(--z-index);
          padding: var(--padding);
          margin: var(--margin);
        }
        @telegraph interactive(.my-component);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Check hover rule preserves order
      expect(rules[1].declarations.map((d) => d.prop)).toEqual([
        "z-index",
        "padding",
        "margin",
      ]);
    });
  });

  describe("custom property filtering", () => {
    it("skips custom property definitions (--variable: value)", async () => {
      const input = `
        .tgph-box {
          --background-color: none;
          --border-color: var(--tgph-gray-5);
          background-color: var(--background-color);
          border-color: var(--border-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Only the 2 real CSS properties should appear, not the custom property definitions
      expect(rules[1].declarations).toHaveLength(2);
      expect(rules[1].declarations[0].prop).toBe("background-color");
      expect(rules[1].declarations[1].prop).toBe("border-color");
    });

    it("skips declarations with fallback values in var()", async () => {
      const input = `
        .my-component {
          background-color: var(--background-color);
          color: var(--text-color, red);
        }
        @telegraph interactive(.my-component);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Only background-color should be picked up (no fallback in var())
      // color has a fallback (red), so it's skipped
      expect(rules[1].declarations).toHaveLength(1);
      expect(rules[1].declarations[0].prop).toBe("background-color");
    });

    it("skips declarations with non-var() values", async () => {
      const input = `
        .my-component {
          background-color: var(--background-color);
          display: flex;
          position: relative;
          opacity: 0.5;
        }
        @telegraph interactive(.my-component);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Only background-color uses var(--custom-prop) pattern
      expect(rules[1].declarations).toHaveLength(1);
      expect(rules[1].declarations[0].prop).toBe("background-color");
    });
  });

  describe("directive removal", () => {
    it("removes the @telegraph interactive directive from output", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      expect(output).not.toContain("@telegraph");
    });
  });

  describe("no-op behavior", () => {
    it("passes through CSS without @telegraph directives unchanged", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Only the base rule, no generated rules
      expect(rules).toHaveLength(1);
      expect(rules[0].selector).toBe(".tgph-box");
    });

    it("ignores non-interactive @telegraph directives", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph components;
        @telegraph tokens;
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // Base rule only, the other @telegraph directives remain untouched
      expect(rules).toHaveLength(1);
      // The non-interactive directives should still be in the output
      expect(output).toContain("@telegraph components");
      expect(output).toContain("@telegraph tokens");
    });
  });

  describe("error handling", () => {
    it("throws when the base selector is not found", async () => {
      const input = `
        .some-other-rule {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      await expect(run(input)).rejects.toThrow(
        'could not find base rule ".tgph-box"',
      );
    });

    it("throws when the base rule has no matching declarations", async () => {
      const input = `
        .tgph-box {
          display: flex;
          position: relative;
        }
        @telegraph interactive(.tgph-box);
      `;

      await expect(run(input)).rejects.toThrow(
        'no "property: var(--name)" declarations found',
      );
    });

    it("throws when the base rule only has custom property definitions", async () => {
      const input = `
        .tgph-box {
          --background-color: none;
          --border-color: var(--tgph-gray-5);
        }
        @telegraph interactive(.tgph-box);
      `;

      await expect(run(input)).rejects.toThrow(
        'no "property: var(--name)" declarations found',
      );
    });
  });

  describe("multiple directives", () => {
    it("handles multiple @telegraph interactive directives in one file", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);

        .tgph-button {
          box-shadow: var(--box-shadow);
        }
        @telegraph interactive(.tgph-button);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // 2 base rules + 5 pseudo states each = 12
      expect(rules).toHaveLength(12);

      // First batch
      expect(rules[0].selector).toBe(".tgph-box");
      expect(rules[1].selector).toBe(".tgph-box--interactive:hover");

      // Second batch
      expect(rules[6].selector).toBe(".tgph-button");
      expect(rules[7].selector).toBe(".tgph-button--interactive:hover");

      // Verify the button hover uses box-shadow, not background-color
      expect(rules[7].declarations).toEqual([
        {
          prop: "box-shadow",
          value: "var(--hover--box-shadow, var(--box-shadow))",
        },
      ]);
    });
  });

  describe("selector handling", () => {
    it("works with any class selector", async () => {
      const input = `
        .my-custom-component {
          color: var(--color);
        }
        @telegraph interactive(.my-custom-component);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      expect(rules[1].selector).toBe(".my-custom-component--interactive:hover");
    });

    it("handles selector with extra whitespace in the directive", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(  .tgph-box  );
      `;

      const output = await run(input);
      const rules = parseRules(output);

      expect(rules[1].selector).toBe(".tgph-box--interactive:hover");
    });
  });

  describe("rule ordering", () => {
    it("generates pseudo-state rules in the correct order: hover, focus, active, focus-within, disabled", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      const selectors = rules.slice(1).map((r) => r.selector);
      expect(selectors[0]).toContain(":hover");
      expect(selectors[1]).toContain(":focus-visible");
      expect(selectors[2]).toContain(":active");
      expect(selectors[3]).toContain(":has(:focus-visible)");
      expect(selectors[4]).toContain(":disabled");
    });

    it("inserts generated rules at the position of the directive", async () => {
      const input = `
        .before {
          color: red;
        }
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
        .after {
          color: blue;
        }
      `;

      const output = await run(input);
      const rules = parseRules(output);

      expect(rules[0].selector).toBe(".before");
      expect(rules[1].selector).toBe(".tgph-box");
      // 5 generated pseudo rules
      expect(rules[2].selector).toContain(":hover");
      expect(rules[6].selector).toContain(":disabled");
      // The rule that was after the directive
      expect(rules[7].selector).toBe(".after");
    });
  });

  describe("disabled selector", () => {
    it("generates both :disabled and aria-disabled selectors", async () => {
      const input = `
        .tgph-box {
          background-color: var(--background-color);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // The disabled rule (last generated one) should have both selectors
      const disabledRule = rules[rules.length - 1];
      expect(disabledRule.selector).toContain(
        ".tgph-box--interactive:disabled",
      );
      expect(disabledRule.selector).toContain(
        '.tgph-box--interactive[aria-disabled="true"]',
      );
    });
  });

  describe("real-world: Box.styles.css pattern", () => {
    it("correctly processes a realistic Box base rule with mixed declarations", async () => {
      const input = `
        .tgph-box {
          --background-color: none;
          --border-color: var(--tgph-gray-5);
          --box-shadow: none;
          --border-style: solid;
          --border-width: 0;
          --padding: 0;

          background-color: var(--background-color);
          border-width: var(--border-width);
          border-style: var(--border-style);
          border-color: var(--border-color);
          box-shadow: var(--box-shadow);
          padding: var(--padding);
        }
        @telegraph interactive(.tgph-box);
      `;

      const output = await run(input);
      const rules = parseRules(output);

      // base + 5 pseudo-state rules
      expect(rules).toHaveLength(6);

      // Hover should have exactly 6 declarations (the real CSS properties, not the custom prop defs)
      expect(rules[1].declarations).toHaveLength(6);

      // Verify a sampling of values
      expect(rules[1].declarations[0]).toEqual({
        prop: "background-color",
        value: "var(--hover--background-color, var(--background-color))",
      });
      expect(rules[1].declarations[3]).toEqual({
        prop: "border-color",
        value: "var(--hover--border-color, var(--border-color))",
      });

      // No @telegraph directives remain
      expect(output).not.toContain("@telegraph");

      // Custom property definitions should remain in the base rule untouched
      expect(rules[0].declarations).toContainEqual({
        prop: "--background-color",
        value: "none",
      });
      expect(rules[0].declarations).toContainEqual({
        prop: "--border-color",
        value: "var(--tgph-gray-5)",
      });
    });
  });
});
