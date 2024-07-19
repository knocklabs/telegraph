import core from "@actions/core";

const SIZE_THRESHOLD = 20;

const main = async () => {
  const currentPackageSizes = JSON.parse(
    core.getInput("current-package-sizes"),
  );
  const previousPackageSizes = JSON.parse(
    core.getInput("previous-package-sizes"),
  );

  const packageSizeDifferences = currentPackageSizes.map((currentPackage) => {
    const previousPackage = previousPackageSizes.find(
      (pkg) => pkg.packageName === currentPackage.packageName,
    );

    // Previous package may be undefined, for example if a new package was added
    const previousPackageSize = previousPackage ? previousPackage.size : 0;

    return {
      packageName: currentPackage.packageName,
      size: currentPackage.size - previousPackageSize,
    };
  });

  const packagesWithThreshold = packageSizeDifferences.filter(
    (pkg) => Math.abs(pkg.size) > SIZE_THRESHOLD,
  );

  const prComment = `
### Package size differences

${
  packagesWithThreshold.length > 0
    ? `The following packages have size differences greater than 20 KB
    
${packagesWithThreshold
          .map(
            (pkg) =>
              `- \`@telegraph/${pkg.packageName}\`: ${pkg.size > 0 ? "+" : ""}${parseFloat(pkg.size).toFixed(2)} KB`,
          )
          .join("\n")}
    `
    : `No package size differences greater than ${SIZE_THRESHOLD} KB 🚀`
}


<details>
<summary>All package size differences</summary>

${packageSizeDifferences
  .map(
    (pkg) =>
      `- \`@telegraph/${pkg.packageName}\`: ${pkg.size > 0 ? "+" : ""}${parseFloat(pkg.size).toFixed(2)} KB`,
  )
  .join("\n")}

</details>

  `;

  core.setOutput("pr-comment", prComment);
};

main();
