const { argv } = require("node:process"); // For accessing command line arguments
const { format, normalize } = require("node:path"); // For path manipulation
const path = require("node:path"); // For path operations
const { writeFile, mkdir } = require("node:fs/promises"); // For file system operations (async)

// Constant for the prefix used in CSS variables
const TELEGRAPH_VARIABLE_PREFIX = "tgph";

/**
 * Maps CSS variables to class names based on the provided object structure.
 * @param {Object} obj - The object containing design tokens.
 * @param {String} prefix - Prefix for the class name.
 * @param {Boolean} noVariableNamePrefix - Flag to include/exclude the prefix in variable names.
 * @returns {Object} - Mapped CSS variables to class names.
 */
const mapCssVarToClassName = (obj, prefix, noVariableNamePrefix) => {
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
        if (!currentPath.includes("dark")) {
          const filteredPath = currentPath
            .filter((t) => t !== "dark" && t !== "light" && t)
            .join("-");

          // Construct variable name and CSS variable
          const variableName = `${prefix && !noVariableNamePrefix ? `${prefix}-` : ""}${filteredPath}`;
          const cssVar = `var(--${TELEGRAPH_VARIABLE_PREFIX}${prefix ? `-${prefix}` : ""}-${filteredPath})`;

          result[variableName] = cssVar;
        }
      }
    }
  }
  traverseObject(obj);

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
    const distDirPath = path.join(__dirname, "../dist/mappings");
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
const main = async () => {
  try {
    // Process command line arguments
    const args = argv.slice(2);
    const tokensPath = format({ root: "./", base: normalize(args[0]) });
    const tgph = require(tokensPath);

    // Generate mappings for tokens
    const tokens = Object.assign(
      ...Object.entries(tgph.tokens).map(([key, value]) => {
        if (key === "color") {
          return {
            [key]: mapCssVarToClassName(value, "", false),
          };
        }
        return {
          [key]: mapCssVarToClassName(value, key, true),
        };
      }),
    );

    // Generate mappings for semantic tokens
    const semantic = Object.assign(
      ...Object.entries(tgph.semantic).map(([key, value]) => {
        return {
          [key]: mapCssVarToClassName(value, key, true),
        };
      }),
    );

    // Save the generated mappings
    saveMapping("tokens", tokens);
    saveMapping("semantic", semantic);
  } catch (e) {
    console.error(
      "Provide a correct argument - a relative path to design tokens.\n",
      e,
    );
  }
};

main();
