import fs from "fs/promises";
import path from "path";
import core from "@actions/core";

const bytesToKilobytes = (bytes) => parseFloat((bytes / 1024).toFixed(2));

const getAllFilesInDirectory = async (directory) => {
  const files = await fs.readdir(directory, { withFileTypes: true });
  const filesPaths = files.map((file) => {
    const filePath = path.join(directory, file.name);
    return file.isDirectory() ? getAllFilesInDirectory(filePath) : filePath;
  });
  return (await Promise.all(filesPaths)).flat();
};

const getDistFolderSize = async (packageName) => {
  const directory = path.join("../../packages", packageName, "dist");
  const files = await getAllFilesInDirectory(directory);
  const stats = files.map((file) => fs.stat(file));
  const sizes = (await Promise.all(stats)).reduce(
    (acc, stat) => acc + stat.size,
    0
  );
  return sizes;
};

const getAllPackages = async () => {
  const packages = await fs.readdir(path.join("../..//packages"));
  const filteredPackages = packages.filter((pkg) => !pkg.startsWith("."));
  return filteredPackages;
};

const main = async () => {
  const packages = await getAllPackages();
  const packageSizes = await Promise.all(packages.map(getDistFolderSize));

  const formattedPackageSizes = packageSizes.map((size, index) => ({
    packageName: packages[index],
    size: bytesToKilobytes(size),
  }));

  const totalSize = parseFloat(
    formattedPackageSizes.reduce((acc, { size }) => acc + size, 0).toFixed(2)
  );

  console.log(
    "Package sizes:" + JSON.stringify(formattedPackageSizes, null, 2)
  );
  console.log("Total size: " + totalSize + " KB");

  core.setOutput("package-sizes", JSON.stringify(formattedPackageSizes));
  core.setOutput("total-size", totalSize);
};

main();
