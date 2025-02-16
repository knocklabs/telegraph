import { mkdir, writeFile } from "node:fs/promises";
import { format, normalize } from "node:path";
import path from "node:path";

import { loadModule } from "./helpers";

// Constant for the prefix used in CSS variables
const TELEGRAPH_VARIABLE_PREFIX = "tgph";

const THEME_NAMES = ["light", "dark"];

/**
 * Maps CSS variables to class names based on the provided object structure.
 * @param {Object} obj - The object containing design tokens.
 * @param {String} prefix - Prefix for the class name.

 * @param {Boolean} includeVariableNamePrefix - Flag to include/exclude the prefix in variable names.
 * @returns {Object} - Mapped CSS variables to class names.
 */
const mapCssVarToClassName = (obj, prefix, includeVariableNamePrefix) => {
  const result = {};

  // Helper function to recursively traverse the object
  function traverseObject(obj, path = []) {
    for (const key in obj) {
      // Construct the path for the current key
      const currentPath = path.concat(key);

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        // Recurse into nested objects
        traverseObject(obj[key], currentPath);
      } else {
        // Process leaf nodes
        if (!currentPath.includes(THEME_NAMES[1])) {
          const filteredPath = currentPath
            .filter((t) => t && !THEME_NAMES.includes(t))
            .join("-");

          // Construct variable name and CSS variable
          const variableName = `${prefix && includeVariableNamePrefix ? `${prefix}-` : ""}${filteredPath}`;
          const cssVar = `var(--${TELEGRAPH_VARIABLE_PREFIX}${prefix ? `-${prefix}` : ""}-${filteredPath})`;

          result[variableName] = cssVar;
        }
      }
    }
  }
  traverseObject(obj);

  return result;
};

const flattenTokens = (obj) => {
  // Helper function to recursively traverse the object
  function traverseObject(obj, path = [], result = {}) {
    for (const key in obj) {
      // Construct the path for the current key
      const currentPath = path.concat(key);

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        // Recurse into nested objects
        traverseObject(obj[key], currentPath, result);
      } else {
        // Process leaf nodes
        if (!currentPath.includes(THEME_NAMES[1])) {
          const filteredPath = currentPath
            .filter((t) => t && !THEME_NAMES.includes(t) && t !== "color")
            .join("-");

          // Construct variable name and CSS variable
          const cssVar = `var(--${TELEGRAPH_VARIABLE_PREFIX}-${filteredPath})`;

          result[filteredPath] = cssVar;
        }
      }
    }

    return result;
  }

  const result = {};

  Object.keys(obj).forEach((key) => {
    result[key] = traverseObject(obj[key], [key]);
  });

  return result;
};

/**
 * Saves the generated mapping to a JSON file.
 * @param {String} name - The name of the file (without extension).
 * @param {Object} tokens - The object containing the mappings to save.
 */
const saveMapping = async (name, tokens) => {
  try {
    // Define the directory path where the mappings will be saved
    const distDirPath = path.join(__dirname, "../dist/json");
    // Ensure the directory exists (create it if not)
    await mkdir(distDirPath, { recursive: true });
    // Write the mappings to a JSON file
    await writeFile(
      path.join(distDirPath, `./${name}.json`),
      JSON.stringify(tokens),
    );
  } catch (e) {
    console.error("There was an error while saving a file.\n", e);
  }
};

/**
 * The main function that orchestrates reading command line arguments,
 * processing tokens, and saving mappings.
 */
const main = async (funcArgs) => {
  try {
    const funcArgsPath = funcArgs?.tokensPath;
    const tokensPath = path.join(__dirname, "../", normalize(funcArgsPath));
    const tgph = await loadModule(tokensPath);

    // Generate mappings for tokens
    const tokens = Object.assign(
      ...Object.entries(tgph.tokens).map(([key, value]) => {
        if (key === "color") {
          return {
            [key]: mapCssVarToClassName(value, "", true),
          };
        }
        return {
          [key]: mapCssVarToClassName(value, key),
        };
      }),
    );

    const flattenedTokens = flattenTokens(tgph.tokens);

    // Save the generated mappings
    saveMapping("tokens", tokens);
    saveMapping("flattened-tokens", flattenedTokens);
  } catch (e) {
    console.error(
      "Provide a correct argument - a relative path to design tokens.\n",
      e,
    );
  }
};

export default main;
