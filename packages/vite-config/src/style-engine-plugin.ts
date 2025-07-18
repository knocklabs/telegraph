import { promises as fs } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { glob } from "glob";
import type { Plugin } from "vite";

export type CssVarProp = {
  cssVar: string;
  value: string;
  direction?: string;
  interactive?: boolean;
};

export type ComponentCssVars = Record<string, CssVarProp>;
export type ComponentMap = Record<string, ComponentCssVars>;

const STATE_MAP = {
  hover: ":hover",
  focus_within: ":has(:focus-within)",
  focus: ":focus-visible",
  active: ":active",
} as const;

/**
 * Pure helper to collect cssVars from all components in the workspace
 */
export async function collectCssVars(globPattern: string, viteLoadModule?: (options: { id: string }) => Promise<any>): Promise<ComponentMap> {
  const constantsFiles = await glob(globPattern, { ignore: ["**/node_modules/**"] });
  const componentMap: ComponentMap = {};

  for (const filePath of constantsFiles) {
    try {
      // Extract component name from file path (e.g., "Box" from "packages/layout/src/Box/Box.constants.ts")
      const pathParts = filePath.split("/");
      const componentName = pathParts[pathParts.length - 2] || pathParts[pathParts.length - 1]?.replace(/\.constants\.ts$/, "") || "Unknown";
      
      let module;
      if (viteLoadModule) {
        // Use Vite's SSR module loading during build
        const fullPath = resolve(filePath);
        module = await viteLoadModule({ id: fullPath });
      } else {
        // Fallback to require for testing
        const fullPath = resolve(filePath);
        delete require.cache[fullPath];
        module = require(fullPath);
      }
      
      if (module.cssVars) {
        componentMap[componentName] = module.cssVars;
      }
    } catch (error) {
      console.warn(`Failed to load cssVars from ${filePath}:`, error);
    }
  }

  return componentMap;
}

/**
 * Pure helper to generate interactive CSS for a single component
 */
export function generateInteractiveCss(componentName: string, cssVars: ComponentCssVars): string {
  const selectorPrefix = `.tgph-${componentName.toLowerCase()}`;
  let css = "";

  // Collect base properties and their default values
  const baseProps: Record<string, string> = {};
  const interactiveVars: Record<string, Array<{ state: string; cssVar: string; syntheticVar: string }>> = {};

  Object.entries(cssVars).forEach(([key, cssVarProp]) => {
    // Check if this is an interactive prop by prefix OR by interactive flag
    const interactiveMatch = key.match(/^(hover|focus_within|focus|active)_(.+)$/);
    const isInteractiveByFlag = cssVarProp.interactive === true;
    
    if (interactiveMatch || isInteractiveByFlag) {
      const [, state, baseProp] = interactiveMatch || [null, null, null];
      
      // For interactive flag format, extract state from key
      if (isInteractiveByFlag && !interactiveMatch) {
                 const flagMatch = key.match(/^(hover|focus_within|focus|active)_(.+)$/);
        if (flagMatch) {
          const [, flagState, flagBaseProp] = flagMatch;
          const baseCssVar = cssVars[flagBaseProp as keyof typeof cssVars]?.cssVar;
          
          if (baseCssVar && flagState) {
            const syntheticVar = `--${key}`;
            
            if (!interactiveVars[baseCssVar]) {
              interactiveVars[baseCssVar] = [];
            }
            
            interactiveVars[baseCssVar].push({
              state: flagState,
              cssVar: baseCssVar,
              syntheticVar,
            });
          }
        }
      } else if (interactiveMatch) {
        // Handle prefix format
        const baseCssVar = cssVars[baseProp as keyof typeof cssVars]?.cssVar;
        
        if (baseCssVar && state) {
          const syntheticVar = `--${key}`;
          
          if (!interactiveVars[baseCssVar]) {
            interactiveVars[baseCssVar] = [];
          }
          
          interactiveVars[baseCssVar].push({
            state,
            cssVar: baseCssVar,
            syntheticVar,
          });
        }
      }
    } else {
      // This is a base property, collect its default
      if (cssVarProp.cssVar && !cssVarProp.interactive) {
        baseProps[cssVarProp.cssVar] = "none"; // Default value
      }
    }
  });

  // Generate base defaults
  if (Object.keys(baseProps).length > 0) {
    css += `${selectorPrefix} {\n`;
    Object.entries(baseProps).forEach(([cssVar, defaultValue]) => {
      css += `  ${cssVar}: ${defaultValue};\n`;
    });
    css += "}\n\n";
  }

  // Generate interactive states
  Object.entries(interactiveVars).forEach(([baseCssVar, states]) => {
    states.forEach(({ state, syntheticVar }) => {
      const selector = STATE_MAP[state as keyof typeof STATE_MAP];
      if (selector) {
        css += `${selectorPrefix}${selector} {\n`;
        css += `  ${baseCssVar}: var(${syntheticVar});\n`;
        css += "}\n\n";
      }
    });
  });

  return css;
}

/**
 * Appends or replaces the auto-generated CSS block in a default.css file
 */
export async function appendInteractiveBlock(defaultCssPath: string, cssString: string): Promise<void> {
  const startMarker = "/* AUTO-GENERATED START */";
  const endMarker = "/* AUTO-GENERATED END */";
  
  try {
    let existingContent = await fs.readFile(defaultCssPath, "utf-8");
    
    // Check if there's already an auto-generated block
    const startIndex = existingContent.indexOf(startMarker);
    const endIndex = existingContent.indexOf(endMarker);
    
    if (startIndex !== -1 && endIndex !== -1) {
      // Replace existing block
      const before = existingContent.substring(0, startIndex);
      const after = existingContent.substring(endIndex + endMarker.length);
      const newContent = `${before}${startMarker}\n${cssString}${endMarker}${after}`;
      await fs.writeFile(defaultCssPath, newContent, "utf-8");
    } else {
      // Append new block
      const newContent = `${existingContent}\n${startMarker}\n${cssString}${endMarker}\n`;
      await fs.writeFile(defaultCssPath, newContent, "utf-8");
    }
  } catch (error) {
    console.warn(`Failed to update ${defaultCssPath}:`, error);
  }
}

/**
 * Main Vite plugin for Telegraph style engine
 */
export function tgphStyleEngine(): Plugin {
  let componentMap: ComponentMap = {};
  
  return {
    name: "tgph-style-engine",
    
    async buildStart() {
      // Discover all constants files in packages
      const globPattern = "packages/**/src/**/*.constants.ts";
      componentMap = await collectCssVars(globPattern, this.load);
      
      // Generate and append CSS for each component
      for (const [componentName, cssVars] of Object.entries(componentMap)) {
        const css = generateInteractiveCss(componentName, cssVars);
        
        if (css.trim()) {
          // Find the corresponding default.css file
          const constantsFiles = await glob(`packages/**/src/**/${componentName}.constants.ts`);
          
          for (const constantsFile of constantsFiles) {
            const defaultCssPath = join(dirname(constantsFile), "../default.css");
            
            try {
              await fs.access(defaultCssPath);
              await appendInteractiveBlock(defaultCssPath, css);
            } catch {
              // default.css doesn't exist, skip
            }
          }
        }
      }
    },

    async handleHotUpdate({ file, server }) {
      // Watch for changes to constants files
      if (file.endsWith(".constants.ts")) {
        const componentName = file.split("/").slice(-2, -1)[0] || file.split("/").slice(-1)[0]?.replace(/\.constants\.ts$/, "") || "Unknown";
        
        try {
          // Reload the module using Vite's SSR loading
          const fullPath = resolve(file);
          const module = await server.ssrLoadModule(fullPath);
          
          if (module.cssVars) {
            componentMap[componentName] = module.cssVars;
            const css = generateInteractiveCss(componentName, module.cssVars);
            
            if (css.trim()) {
              const defaultCssPath = join(dirname(file), "../default.css");
              
              try {
                await fs.access(defaultCssPath);
                await appendInteractiveBlock(defaultCssPath, css);
                
                // Trigger HMR for the updated CSS
                const module = server.moduleGraph.getModuleById(defaultCssPath);
                if (module) {
                  server.reloadModule(module);
                }
              } catch {
                // default.css doesn't exist, skip
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to hot reload ${file}:`, error);
        }
      }
    },
  };
}