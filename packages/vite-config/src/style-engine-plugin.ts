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
  
  Object.entries(cssVars).forEach(([key, cssVarProp]) => {
    const { cssVar, direction } = cssVarProp;
    
    if (!cssVarsByProperty[cssVar]) {
      cssVarsByProperty[cssVar] = [];
    }
    
    cssVarsByProperty[cssVar].push({ cssVar, direction });
  });

  // Generate interactive CSS rules for each CSS property
  Object.entries(cssVarsByProperty).forEach(([baseCssVar, variants]) => {
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