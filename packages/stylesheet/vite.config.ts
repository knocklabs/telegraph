import path from "path";
import { defineConfig } from "vite";
import { globSync } from "glob";
import fs from "fs/promises";
import fsSync from "fs";
import { transform } from "lightningcss";

const dynamicCssImporter = () => {
  return {
    name: "dynamic-css-importer", // Required, will show up in warnings and errors
    async buildStart() {
      const pattern = path.join(path.resolve(__dirname, "../**/*.css")); // Adjust based on your monorepo structure
      const files = globSync(pattern);

      const builtCssFilePath = "./dist/style.css";

      const fileContents = await Promise.all(
        files.map(async (file) => {
          return await fs.readFile(file, "utf-8");
        }),
      );
      await fs.mkdir(path.dirname(builtCssFilePath), { recursive: true });

      const { code } = transform({
        filename: "style.css",
        code: Buffer.from(fileContents.join("\n"), "utf-8"),
        minify: true,
        sourceMap: true,
      });

      await fs.writeFile(path.resolve(__dirname, "dist/style.css"), code);
    },
  };
};

export default defineConfig({
  plugins: [dynamicCssImporter()],
});
