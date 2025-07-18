import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { glob } from "glob";
import type { Plugin } from "vite";

// Types for CSS variable props
export type CssVarProp = {
  cssVar: string;
  value: string;
  direction?: string;
  interactive?: boolean;
};

export type ComponentCssVars = Record<string, CssVarProp>;
export type ComponentMap = Record<string, ComponentCssVars>;

/**
 * Collect cssVars from all component constant files
 */
export async function collectCssVars(
  pattern: string,
  viteLoadModule?: (id: string) => Promise<Record<string, unknown>>,
): Promise<ComponentMap> {
  const componentMap: ComponentMap = {};
  const files = await glob(pattern);

  for (const file of files) {
    try {
      let module: Record<string, unknown>;

      if (viteLoadModule) {
        // Use Vite's module loading in plugin context
        module = await viteLoadModule(file);
      } else {
        // Fallback to require for tests
        module = require(file);
      }

      if (module.cssVars) {
        // Extract component name from file path
        const pathParts = file.split("/");
        const componentDir = pathParts.find((part: string, i: number) => {
          return pathParts[i + 1] === "src" && pathParts[i + 2];
        });
        const componentName = componentDir || "Unknown";

        componentMap[componentName] = module.cssVars as ComponentCssVars;
      }
    } catch (error) {
      console.warn(`Failed to load cssVars from ${file}:`, error);
    }
  }

  return componentMap;
}

/**
 * Generate interactive CSS for a single component
 */
export const generateInteractiveCss = (componentName: string, cssVars: ComponentCssVars): string => {
  const cssRules: string[] = [];
  const STATE_MAP = {
    hover: ":hover",
    focus: ":focus-visible", 
    active: ":active",
    focus_within: ":has(:focus-within)",
  } as const;

  // Group CSS variables by their CSS property
  const cssVarsByProperty: Record<string, { cssVar: string; direction?: string }[]> = {};
  
  Object.entries(cssVars).forEach(([_key, cssVarProp]) => {
    const { cssVar, direction } = cssVarProp;
    
    if (!cssVarsByProperty[cssVar]) {
      cssVarsByProperty[cssVar] = [];
    }
    
    cssVarsByProperty[cssVar].push({ cssVar, direction });
  });

  // Generate interactive CSS rules for each CSS property
  Object.entries(cssVarsByProperty).forEach(([baseCssVar, _variants]) => {
    // For each interactive state
    Object.entries(STATE_MAP).forEach(([state, pseudoSelector]) => {
      
      // Get all potential property keys that could generate this CSS var
      const potentialKeys = Object.entries(cssVars)
        .filter(([, cssVarProp]) => cssVarProp.cssVar === baseCssVar)
        .map(([key]) => key);
      
      if (potentialKeys.length > 0) {
        // Generate CSS rule that maps the base CSS property to synthetic variables
        const syntheticVarDeclarations = potentialKeys.map(propKey => {
          const syntheticVar = `--${state}_${propKey}`;
          return `${baseCssVar}: var(${syntheticVar});`;
        }).join('\n  ');
        
        const selector = `.tgph-${componentName.toLowerCase()}${pseudoSelector}`;
        cssRules.push(`${selector} {\n  ${syntheticVarDeclarations}\n}`);
      }
    });
  });

  return cssRules.join('\n\n');
};

/**
 * Appends or replaces the auto-generated CSS block in a default.css file
 */
export async function appendInteractiveBlock(cssFilePath: string, css: string): Promise<void> {
  try {
    const existingContent = await readFile(cssFilePath, "utf-8");
    
    const startMarker = "/* AUTO-GENERATED START */";
    const endMarker = "/* AUTO-GENERATED END */";
    
    const startIndex = existingContent.indexOf(startMarker);
    const endIndex = existingContent.indexOf(endMarker);
    
    let newContent: string;
    
    if (startIndex !== -1 && endIndex !== -1) {
      // Replace existing block
      const before = existingContent.substring(0, startIndex);
      const after = existingContent.substring(endIndex + endMarker.length);
      newContent = `${before}${startMarker}\n${css}\n${endMarker}${after}`;
    } else {
      // Append new block
      const separator = existingContent.trim() ? "\n\n" : "";
      newContent = `${existingContent}${separator}${startMarker}\n${css}\n${endMarker}\n`;
    }
    
    await writeFile(cssFilePath, newContent, "utf-8");
  } catch (error) {
    console.warn(`Failed to update ${cssFilePath}:`, error);
  }
}

/**
 * Vite plugin for auto-generating interactive CSS
 */
export function tgphStyleEngine(): Plugin {
  return {
    name: "tgph-style-engine",
    async buildStart() {
      // Collect CSS vars from all components
      const componentMap = await collectCssVars("packages/**/src/**/*.constants.ts", 
        async (id: string) => {
          // In build context, we'll use require as fallback since this.load is complex
          try {
            return require(id);
          } catch {
            return {};
          }
        });
      
      // Generate and append CSS for each component
      for (const [componentName, cssVars] of Object.entries(componentMap)) {
        const css = generateInteractiveCss(componentName, cssVars);
        
        if (css.trim()) {
          // Map component names to their package locations
          const packageMap: Record<string, string> = {
            'Box': 'layout',
            'Stack': 'layout', 
            'Button': 'button',
            'Text': 'typography',
            'Heading': 'typography',
            'Code': 'typography',
          };
          
          const packageName = packageMap[componentName];
          if (packageName) {
            const cssFile = `packages/${packageName}/src/default.css`;
            await appendInteractiveBlock(cssFile, css);
          }
        }
      }
    },
    async handleHotUpdate({ file, server }: { file: string; server: any }) {
      // Regenerate CSS when constants files change
      if (file.endsWith(".constants.ts")) {
        const module = await server.ssrLoadModule(file);
        
        if (module.cssVars) {
          // Extract component name from file path
          const pathParts = file.split("/");
          const componentDir = pathParts.find((part: string, i: number) => {
            return pathParts[i + 1] === "src" && pathParts[i + 2];
          });
          const componentName = componentDir || "Unknown";
          
          const css = generateInteractiveCss(componentName, module.cssVars);
          
          if (css.trim()) {
            const defaultCssPath = join(dirname(file), "../default.css");
            await appendInteractiveBlock(defaultCssPath, css);
          }
        }
      }
    },
  };
}