import core from "@actions/core";

const main = async () => {
  const currentPackageSizes = JSON.parse(
    core.getInput("current-package-sizes")
  );
  const previousPackageSizes = JSON.parse(
    core.getInput("previous-package-sizes")
  );

  const packageSizeDifferences = currentPackageSizes.map((currentPackage) => {
    const previousPackage = previousPackageSizes.find(
      (pkg) => pkg.packageName === currentPackage.packageName
    );
    return {
      packageName: currentPackage.packageName,
      size: currentPackage.size - previousPackage.size,
    };
  });

  console.log(
    "Package size differences:" +
      JSON.stringify(packageSizeDifferences, null, 2)
  );

  core.setOutput(
    "package-size-differences",
    JSON.stringify(packageSizeDifferences)
  );
};

main();
