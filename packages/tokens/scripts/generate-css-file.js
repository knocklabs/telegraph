const { argv } = require("node:process");
const { parse, format, normalize } = require("node:path");
const path = require("node:path");
const { writeFile, mkdir } = require("node:fs/promises");
const { transform } = require("lightningcss");

// Constant for the prefix used in CSS variables
const TELEGRAPH_VARIABLE_PREFIX = "tgph";

/**
 * Searches for a specific value within an object and returns the path to that value.
 *
 * @param {Object} obj The object to search through.
 * @param {*} targetValue The value to search for.
 * @returns {Object|null} An object containing the path and value if found, otherwise null.
 */
function findPathAndValue(obj, targetValue) {
  function search(currentObject, currentValue, path) {
    if (currentValue === targetValue) {
      return { value: currentValue, path };
    }

    if (typeof currentObject === "object" && currentObject !== null) {
      for (const key of Object.keys(currentObject)) {
        const result = search(
          currentObject[key],
          currentObject[key],
          path ? `${path}.${key}` : key,
        );
        if (result) return result;
      }
    }

    return null;
  }

  return search(obj, obj, "");
}

/**
 * Converts design tokens into CSS custom properties.
 *
 * @param {Object} variables The design tokens to convert.
 * @param {String} mode The mode to use for token conversion (tokens or semantic).
 * @param {Object} source The source object for semantic tokens.
 * @returns {Array} An array containing CSS custom properties for regular, light, and dark themes.
 */
const tokensToCss = (variables = {}, mode = "tokens", source) => {
  let regularVars = "";
  let lightVars = "";
  let darkVars = "";

  function processObject(obj, prefix = "") {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      let currentPrefix = `${prefix}-${key}`;

      if (typeof value === "object" && !Array.isArray(value)) {
        processObject(value, currentPrefix);
      } else {
        if (mode === "semantic") {
          const path = findPathAndValue(source, value)?.path;
          if (path && !path.includes("dark")) {
            const cssVariable = path
              .split(".")
              .filter((i) => !(i === "color" || i === "light"))
              .join("-");
            const filteredPrefix = currentPrefix.replace("-light", "");
            regularVars += `  --${TELEGRAPH_VARIABLE_PREFIX}${filteredPrefix}: var(--${TELEGRAPH_VARIABLE_PREFIX}-${cssVariable});`;
          }
        }

        if (mode === "tokens") {
          if (currentPrefix.includes("color")) {
            if (currentPrefix.includes("dark")) {
              darkVars += `  --${TELEGRAPH_VARIABLE_PREFIX}${currentPrefix.replace("-dark", "").replace("-color", "")}: ${value};`;
            } else if (currentPrefix.includes("light")) {
              lightVars += `  --${TELEGRAPH_VARIABLE_PREFIX}${currentPrefix.replace("-light", "").replace("-color", "")}: ${value};`;
            } else {
              regularVars += `  --${TELEGRAPH_VARIABLE_PREFIX}${currentPrefix.replace("-color", "")}: ${value};`;
            }
          } else {
            regularVars += `  --${TELEGRAPH_VARIABLE_PREFIX}${currentPrefix}: ${value};`;
          }
        }
      }
    });
  }

  processObject(variables);
  return [regularVars, lightVars, darkVars];
};

/**
 * Saves the CSS tokens to a file after processing with lightningcss.
 *
 * @param {string} name The name of the CSS file.
 * @param {string} tokens The CSS content to save.
 */
const saveTokens = async (name, tokens) => {
  try {
    const distDirPath = path.join(__dirname, "../dist");
    await mkdir(distDirPath, { recursive: true });
    const { code } = transform({
      code: Buffer.from(tokens),
      minify: true,
      sourceMap: true,
    });
    await writeFile(path.join(distDirPath, `./${name}.css`), code);
  } catch (e) {
    console.error("There was an error while saving a file.\n", e);
  }
};

/**
 * Converts semantic tokens into CSS custom properties.
 *
 * @param {Object} tgph The object containing both semantic and token values.
 * @returns {String} A string containing the CSS custom properties.
 */
const semanticTokensToCSS = async (tgph) => {
  const tokens = await Promise.all(
    Object.entries(tgph.semantic).map(async ([key]) => {
      return tokensToCss({ [key]: tgph.semantic[key] }, "semantic", {
        [key]: tgph.tokens[key],
      });
    }),
  );

  return tokens
    .flat()
    .filter((i) => i)
    .join("");
};

/**
 * Main function to read design tokens from a file, convert them to CSS,
 * and save the resulting CSS in different themes (default, light, dark, semantic).
 */
const main = async () => {
  try {
    const args = argv.slice(2);
    const tokensPath = format({ root: "./", base: normalize(args[0]) });
    const { tgph } = require(tokensPath);

    const [tokens, lightTokens, darkTokens] = tokensToCss(
      tgph.tokens,
      "tokens",
    );
    const semanticTokens = await semanticTokensToCSS(tgph);

    const defaultCss = `:root {${lightTokens} ${tokens} ${semanticTokens}  @media (prefers-color-scheme: dark) {${darkTokens}}}`;
    const lightCss = `:root {${lightTokens} ${tokens} }`;
    const darkCss = `:root {${darkTokens} ${tokens} }`;
    const semanticCss = `:root {${semanticTokens}}`;

    saveTokens("default", defaultCss);
    saveTokens("light", lightCss);
    saveTokens("dark", darkCss);
    saveTokens("semantic", semanticCss);
  } catch (e) {
    console.error(
      "Provide a correct argument - a relative path to design tokens.\n",
      e,
    );
  }
};

main();

