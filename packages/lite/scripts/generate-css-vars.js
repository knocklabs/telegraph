import { transform } from "lightningcss";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts design tokens into CSS custom properties.
 *
 * @param {Object} variables The design tokens to convert.
 * @param {String} mode The mode to use for token conversion (currently only "tokens" ).
 * @returns {Array} An array containing CSS custom properties for regular, light, and dark themes.
 */
const tokensToCss = (variables = {}) => {
  const cssVars = Object.entries(variables)
    .map(([key, value]) => {
      return `${key}: ${value};`;
    })
    .join("\n");
  return cssVars;
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
    const tokens = tokensToCss(funcArgs?.tokensMap);

    const defaultCss = `:root {${tokens}}`;

    saveTokens("default", defaultCss);
  } catch (e) {
    console.error(
      "Provide a correct argument - a relative path to design tokens.\n",
      e,
    );
  }
};

export default main;
