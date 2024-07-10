import core from "@actions/core";

const SIZE_THRESHOLD = 20;

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

  const packagesWithThreshold = packageSizeDifferences.filter(
    (pkg) => Math.abs(pkg.size) > SIZE_THRESHOLD
  );

  const prComment = `
    #### Package size differences

    ${
      packagesWithThreshold.length > 0 &&
      `
        The following packages have size differences greater than 20KB
        ${packagesWithThreshold.map(
          (pkg) => `
            - ${pkg.packageName}: ${pkg.size > 0 ? "+" : ""}${pkg.size}KB
          `
        )}
    `
    }
    
    <details>
        <summary>All package size differences</summary>
        ${packageSizeDifferences.map(
          (pkg) => `
                - ${pkg.packageName}: ${pkg.size > 0 ? "+" : ""}${pkg.size}KB
            `
        )}
    </details>
  `;

  core.setOutput("pr-comment", prComment);
};

main();
