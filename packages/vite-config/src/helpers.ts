import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Get all dependencies from packages folder at root
export async function getTelegraphPackages() {
  function getPackageNames(directoryPath: string) {
    return new Promise((resolve, reject) => {
      fs.readdir(
        directoryPath,
        { withFileTypes: true },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, files: any) => {
          if (err) {
            return reject(err);
          }

          const directories = files

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((file: any) => file.isDirectory())
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((file: any) => file.name);

          resolve(directories);
        },
      );
    });
  }

  const packagesPath = path.join(__dirname, "../../../", "packages");

  const telegraphPackages = await getPackageNames(packagesPath)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((packageNames: any) => {
      return packageNames.map(
        (packageName: string) => `@telegraph/${packageName}`,
      );
    })
    .catch((err) => {
      console.error("Error reading packages:", err);
    });

  return telegraphPackages;
}
