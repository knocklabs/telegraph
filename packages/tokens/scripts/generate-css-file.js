const { argv } = require("node:process");
const path = require("node:path");
const { parse, format, normalize } = require("node:path");
const { writeFile, mkdir } = require("node:fs/promises");
const tokensToCss = (object = {}, base = `-`) =>
  Object.entries(object).reduce((css, [key, value]) => {
    let newBase = base + `-${key}`;
    if (typeof value !== "object") {
      return css + newBase + `: ${value};\n`;
    }
    return css + tokensToCss(value, newBase);
  }, ``);

const saveTokens = async (name, tokens) => {
  try {
    const distDirPath = path.join(__dirname, "../dist");
    await mkdir(distDirPath, { recursive: true });
    await writeFile(path.join(distDirPath, `./${name}.css`), tokens);
  } catch (e) {
    console.log("There was an error while saving a file.\n", e);
  }
};
// TODO: Seperate out dark variables into media query
try {
  const args = argv.slice(2);
  const tokensPath = format({ root: "./", base: normalize(args[0]) });
  const tokens = require(tokensPath);
  const name = args?.[1] || parse(tokensPath)?.name;

  const cssVariables = tokensToCss(tokens);
  const cssClass = `:root {\n${cssVariables.replaceAll("--", "  --")}}\n`;
  saveTokens(name, cssClass);
} catch (e) {
  console.log(
    "Provide a correct argument - a relative path to design tokens.\n",
    e,
  );
}
