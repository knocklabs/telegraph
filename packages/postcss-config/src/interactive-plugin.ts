import type { AcceptedPlugin, AtRule, Declaration, Rule } from "postcss";

/**
 * Mapping from pseudo-state names to the CSS variable prefix used in
 * the cascade-fallback pattern.
 *
 * This must stay in sync with PSEUDO_CSS_PREFIX in
 * packages/style-engine/src/helpers/getStyleProp/getStyleProp.ts
 */
const PSEUDO_STATE_MAP: Record<string, string> = {
  hover: "hover",
  focus: "focus",
  active: "active",
  "focus-within": "focus-within",
  disabled: "disabled",
};

/**
 * Maps pseudo-state names to their CSS selectors.
 * Each state may have multiple selector variants (e.g. disabled also matches
 * aria-disabled).
 */
const PSEUDO_SELECTORS: Record<string, string[]> = {
  hover: [":hover"],
  focus: [":focus-visible"],
  active: [":active"],
  "focus-within": [":has(:focus-within)"],
  disabled: [":disabled", '[aria-disabled="true"]'],
};

type InteractiveDeclaration = {
  /** The CSS property name, e.g. "background-color" */
  property: string;
  /** The base CSS custom property name, e.g. "--background-color" */
  cssVar: string;
};

/**
 * Extracts declarations from a rule that follow the pattern:
 *   property: var(--custom-prop);
 *
 * These are the declarations we'll generate pseudo-state variants for.
 * We only match simple `var(--name)` references (no fallbacks in the base rule)
 * since those are the style-engine-managed properties.
 */
function extractInteractiveDeclarations(rule: Rule): InteractiveDeclaration[] {
  const declarations: InteractiveDeclaration[] = [];

  rule.walkDecls((decl: Declaration) => {
    // Skip custom property definitions (e.g. --background-color: none).
    // We only want real CSS property declarations like `background-color: var(--background-color)`.
    if (decl.prop.startsWith("--")) return;

    // Match `var(--some-name)` — simple variable reference with no fallback
    const match = decl.value.match(/^var\((--[\w-]+)\)$/);
    if (match && match[1]) {
      declarations.push({
        property: decl.prop,
        cssVar: match[1],
      });
    }
  });

  return declarations;
}

/**
 * Builds the pseudo-state selector string for a given base selector and state.
 *
 * Examples:
 *   buildSelector(".tgph-box", "hover")
 *     => ".tgph-box--interactive:hover"
 *   buildSelector(".tgph-box", "disabled")
 *     => ".tgph-box--interactive:disabled, .tgph-box--interactive[aria-disabled=\"true\"]"
 */
function buildSelector(baseSelector: string, state: string): string {
  const pseudoSelectors = PSEUDO_SELECTORS[state];
  if (!pseudoSelectors) return "";

  return pseudoSelectors
    .map((pseudo) => `${baseSelector}--interactive${pseudo}`)
    .join(",\n");
}

/**
 * PostCSS plugin: @telegraph/interactive
 *
 * Processes `@telegraph interactive(<selector>)` at-rules and auto-generates
 * pseudo-class cascade rules based on the base rule's declarations.
 *
 * Input:
 *   .tgph-box {
 *     --background-color: none;
 *     background-color: var(--background-color);
 *     border-color: var(--border-color);
 *   }
 *   @telegraph interactive(.tgph-box);
 *
 * Output (appended):
 *   .tgph-box--interactive:hover {
 *     background-color: var(--hover--background-color, var(--background-color));
 *     border-color: var(--hover--border-color, var(--border-color));
 *   }
 *   .tgph-box--interactive:focus-visible { ... }
 *   .tgph-box--interactive:active { ... }
 *   .tgph-box--interactive:has(:focus-within) { ... }
 *   .tgph-box--interactive:disabled,
 *   .tgph-box--interactive[aria-disabled="true"] { ... }
 */
const interactivePlugin = (): AcceptedPlugin => {
  return {
    postcssPlugin: "@telegraph/interactive",
    Once(root) {
      // Collect all @telegraph interactive(...) directives
      const directives: { atRule: AtRule; selector: string }[] = [];

      root.walkAtRules("telegraph", (atRule: AtRule) => {
        const match = atRule.params.match(/^interactive\((.+)\)$/);
        if (match && match[1]) {
          directives.push({
            atRule,
            selector: match[1].trim(),
          });
        }
      });

      if (directives.length === 0) return;

      for (const { atRule, selector } of directives) {
        // Find the base rule matching the selector
        let baseRule: Rule | null = null;

        root.walkRules((rule: Rule) => {
          if (rule.selector === selector) {
            baseRule = rule;
          }
        });

        if (!baseRule) {
          throw atRule.error(
            `@telegraph interactive: could not find base rule "${selector}" in this file.`,
          );
        }

        const declarations = extractInteractiveDeclarations(baseRule);

        if (declarations.length === 0) {
          throw atRule.error(
            `@telegraph interactive: no "property: var(--name)" declarations found in "${selector}".`,
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const postcss = require("postcss");

        // Track the last inserted node so rules are appended in order
        let lastInserted: AtRule | Rule = atRule;

        // Generate pseudo-state rules for each state
        for (const state of Object.keys(PSEUDO_STATE_MAP)) {
          const prefix = PSEUDO_STATE_MAP[state];
          const pseudoSelector = buildSelector(selector, state);

          if (!pseudoSelector) continue;

          const rule = postcss.rule({ selector: pseudoSelector });

          for (const decl of declarations) {
            rule.append(
              postcss.decl({
                prop: decl.property,
                value: `var(--${prefix}--${decl.cssVar.replace(/^--/, "")}, var(${decl.cssVar}))`,
              }),
            );
          }

          // Insert after the last inserted node to preserve order
          atRule.parent?.insertAfter(lastInserted, rule);
          lastInserted = rule;
        }

        // Remove the directive
        atRule.remove();
      }
    },
  };
};

export default interactivePlugin;
