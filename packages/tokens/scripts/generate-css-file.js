import { transform } from "lightningcss";
import { mkdir, writeFile } from "node:fs/promises";
import { normalize } from "node:path";
import path from "node:path";

import { loadModule } from "./helpers";

// const { argv } = require("node:process");

// Constant for the prefix used in CSS variables
const TELEGRAPH_VARIABLE_PREFIX = "tgph";

/**
 * Converts design tokens into CSS custom properties.
 *
 * @param {Object} variables The design tokens to convert.
 * @param {String} mode The mode to use for token conversion (currently only "tokens" ).
 * @returns {Array} An array containing CSS custom properties for regular, light, and dark themes.
 */
const tokensToCss = (variables = {}, mode = "tokens") => {
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
        } else if (mode === "breakpoint") {
          if (currentPrefix.includes("breakpoint")) {
            regularVars += `  @custom-media --${TELEGRAPH_VARIABLE_PREFIX}${currentPrefix} (min-width: ${value});`;
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
    await mkdir(`${distDirPath}/css`, { recursive: true });
    const { code } = transform({
      code: Buffer.from(tokens),
      minify: true,
      sourceMap: true,
    });
    await writeFile(path.join(distDirPath, `./css/${name}.css`), code);
  } catch (e) {
    console.error("There was an error while saving a file.\n", e);
  }
};

/**
 * Main function to read design tokens from a file, convert them to CSS,
 * and save the resulting CSS in different themes (default, light, dark).
 */
const main = async (funcArgs) => {
  try {
    const funcArgsPath = funcArgs?.tokensPath;
    const tokensPath = path.join(__dirname, "../", normalize(funcArgsPath));
    const tgph = await loadModule(tokensPath);

    const [tokens, lightTokens, darkTokens] = tokensToCss(
      tgph.tokens,
      "tokens",
    );
    const [breakpointTokens] = tokensToCss(tgph.tokens, "breakpoint");

    const defaultCss = `:root {${tokens} ${lightTokens}} [data-tgph-appearance="dark"]{${darkTokens}}`;
    const lightCss = `:root {${lightTokens} ${tokens} }`;
    const darkCss = `:root {${darkTokens} ${tokens} }`;
    const breakpointCss = `${breakpointTokens}`;

    saveTokens("default", defaultCss);
    saveTokens("light", lightCss);
    saveTokens("dark", darkCss);
    saveTokens("breakpoints", breakpointCss);
  } catch (e) {
    console.error(
      "Provide a correct argument - a relative path to design tokens.\n",
      e,
    );
  }
};

export default main;
