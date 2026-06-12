import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packagesDir = path.join(rootDir, "packages");
const expectedReactPeerRange = "^18.0.0 || ^19.0.0";

const migratedRuntimePackages = new Set([
  "combobox",
  "menu",
  "modal",
  "popover",
  "radio",
  "segmented-control",
  "select",
  "tabs",
  "toggle",
  "tooltip",
]);

const publishedTooltipConsumerPackages = new Set([
  "data-list",
  "tag",
  "truncate",
]);

const outOfScopePackages = new Set(["filter"]);

const ignoredDirectoryNames = new Set([
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "storybook-static",
]);

const sourceExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);
const readmeFileName = "README.md";

const react19OnlyApis = [
  "addTransitionType",
  "cache",
  "cacheSignal",
  "preconnect",
  "preinit",
  "preinitModule",
  "preload",
  "preloadModule",
  "requestFormReset",
  "resume",
  "resumeAndPrerender",
  "resumeToPipeableStream",
  "use",
  "useActionState",
  "useEffectEvent",
  "useFormState",
  "useFormStatus",
  "useOptimistic",
];

const pathExists = async (targetPath) => {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
};

const readJson = async (filePath) => {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents);
};

const listFiles = async (dirPath) => {
  if (!(await pathExists(dirPath))) {
    return [];
  }

  const entries = await readdir(dirPath, { withFileTypes: true });
  const nestedEntries = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        return ignoredDirectoryNames.has(entry.name)
          ? []
          : listFiles(entryPath);
      }

      return entry.isFile() ? [entryPath] : [];
    }),
  );

  return nestedEntries.flat();
};

const getPackageRecords = async () => {
  const entries = await readdir(packagesDir, { withFileTypes: true });
  const packageDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name));

  return Promise.all(
    packageDirs.map(async (packageDir) => {
      const packageJsonPath = path.join(packageDir, "package.json");
      const packageJson = await readJson(packageJsonPath);
      const packageName = path.basename(packageDir);
      const packageFiles = await listFiles(packageDir);
      const sourceFiles = packageFiles.filter((filePath) => {
        return (
          filePath.startsWith(path.join(packageDir, "src")) &&
          sourceExtensions.has(path.extname(filePath))
        );
      });

      return {
        packageDir,
        packageJson,
        packageJsonPath,
        packageName,
        sourceFiles,
      };
    }),
  );
};

const relativePath = (filePath) => path.relative(rootDir, filePath);

const isPublishedPackage = ({ packageJson, packageName }) => {
  return !packageJson.private && !outOfScopePackages.has(packageName);
};

const containsReactImport = (contents) => {
  return (
    /from\s+["']react["']/.test(contents) ||
    /require\(["']react["']\)/.test(contents)
  );
};

const containsReactDomImport = (contents) => {
  return (
    /from\s+["']react-dom(?:\/client)?["']/.test(contents) ||
    /require\(["']react-dom(?:\/client)?["']\)/.test(contents)
  );
};

const containsRuntimeRadixImport = (contents) => {
  return (
    /from\s+["']@radix-ui\//.test(contents) ||
    /require\(["']@radix-ui\//.test(contents) ||
    /import\(["']@radix-ui\//.test(contents)
  );
};

const matchesExpectedReactPeerRange = (range) => {
  return range === expectedReactPeerRange;
};

const getMatchingLines = (contents, matcher) => {
  return contents.split(/\r?\n/).flatMap((line, index) => {
    return matcher(line)
      ? [
          {
            lineNumber: index + 1,
            text: line.trim(),
          },
        ]
      : [];
  });
};

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const getLineMatchAtIndex = (contents, index) => {
  const lineNumber = contents.slice(0, index).split(/\r?\n/).length;
  const text = contents.split(/\r?\n/)[lineNumber - 1]?.trim() ?? "";

  return {
    lineNumber,
    text,
  };
};

const getRegexMatches = (contents, matcher, getMatchIndex) => {
  return Array.from(contents.matchAll(matcher)).map((match) => {
    return getLineMatchAtIndex(contents, getMatchIndex(match));
  });
};

const findReact19ApiMatches = (filePath, contents) => {
  return react19OnlyApis.flatMap((apiName) => {
    const escapedApiName = escapeRegExp(apiName);
    const reactImportMatcher = new RegExp(
      `import\\s*\\{[^}]*\\b${escapedApiName}\\b[^}]*\\}\\s*from\\s*["']react["']`,
      "g",
    );
    const reactDomImportMatcher = new RegExp(
      `import\\s*\\{[^}]*\\b${escapedApiName}\\b[^}]*\\}\\s*from\\s*["']react-dom(?:/client)?["']`,
      "g",
    );
    const reactNamespaceMatcher = new RegExp(`\\bReact\\.${escapedApiName}\\b`);
    const reactDomNamespaceMatcher = new RegExp(
      `\\bReactDOM\\.${escapedApiName}\\b`,
    );
    const apiNameMatcher = new RegExp(`\\b${escapedApiName}\\b`);
    const getApiMatchIndex = (match) => {
      const apiIndex = match[0].search(apiNameMatcher);

      return (match.index ?? 0) + Math.max(apiIndex, 0);
    };

    return [
      ...getRegexMatches(contents, reactImportMatcher, getApiMatchIndex),
      ...getRegexMatches(contents, reactDomImportMatcher, getApiMatchIndex),
      ...getMatchingLines(contents, (line) => {
        return (
          reactNamespaceMatcher.test(line) ||
          reactDomNamespaceMatcher.test(line)
        );
      }),
    ].map((match) => ({
      ...match,
      apiName,
      filePath,
    }));
  });
};

const getPackageSourceUsage = async (record) => {
  const sourceFileContents = await Promise.all(
    record.sourceFiles.map(async (filePath) => ({
      contents: await readFile(filePath, "utf8"),
      filePath,
    })),
  );

  return {
    importsReact: sourceFileContents.some(({ contents }) =>
      containsReactImport(contents),
    ),
    importsReactDom: sourceFileContents.some(({ contents }) =>
      containsReactDomImport(contents),
    ),
    react19ApiMatches: sourceFileContents.flatMap(({ contents, filePath }) =>
      findReact19ApiMatches(filePath, contents),
    ),
    runtimeRadixImportMatches: sourceFileContents.flatMap(
      ({ contents, filePath }) =>
        getMatchingLines(contents, containsRuntimeRadixImport).map((match) => ({
          ...match,
          filePath,
        })),
    ),
  };
};

const getDependencyNames = (packageJson, dependencyKey) => {
  return Object.keys(packageJson[dependencyKey] ?? {});
};

const getRadixDependencyMatches = (record) => {
  return ["dependencies", "peerDependencies", "devDependencies"].flatMap(
    (dependencyKey) => {
      return getDependencyNames(record.packageJson, dependencyKey)
        .filter((dependencyName) => dependencyName.startsWith("@radix-ui/"))
        .map((dependencyName) => ({
          dependencyKey,
          dependencyName,
          filePath: record.packageJsonPath,
        }));
    },
  );
};

const getReadmeAudit = async (record) => {
  const readmePath = path.join(record.packageDir, readmeFileName);

  if (!(await pathExists(readmePath))) {
    return {
      baseUiMentions: false,
      radixMatches: [],
      readmeExists: false,
      readmePath,
    };
  }

  const contents = await readFile(readmePath, "utf8");

  return {
    baseUiMentions: /Base UI/i.test(contents),
    radixMatches: getMatchingLines(contents, (line) => /radix/i.test(line)).map(
      (match) => ({
        ...match,
        filePath: readmePath,
      }),
    ),
    readmeExists: true,
    readmePath,
  };
};

const isAllowedReadmeRadixReference = (match) => {
  return /Radix-compatible|--radix-|no longer depends on Radix|does not depend on Radix|Radix-style prop names/i.test(
    match.text,
  );
};

const packageUsesBaseUi = (record) => {
  return Boolean(record.packageJson.dependencies?.["@base-ui/react"]);
};

const formatFileMatch = ({
  apiName,
  dependencyKey,
  dependencyName,
  filePath,
  lineNumber,
  text,
}) => {
  const location = lineNumber
    ? `${relativePath(filePath)}:${lineNumber}`
    : relativePath(filePath);
  const detail = apiName
    ? `React 19-only API ${apiName}`
    : dependencyName
      ? `${dependencyKey} ${dependencyName}`
      : text;

  return `${location} - ${detail}`;
};

const printSection = (title, lines) => {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
  lines.forEach((line) => console.log(line));
};

const main = async () => {
  const packageRecords = await getPackageRecords();
  const packageUsages = await Promise.all(
    packageRecords.map(async (record) => ({
      record,
      readmeAudit: await getReadmeAudit(record),
      sourceUsage: await getPackageSourceUsage(record),
    })),
  );

  const publishedReactPeerFailures = packageUsages.flatMap(
    ({ record, sourceUsage }) => {
      if (!isPublishedPackage(record) || !sourceUsage.importsReact) {
        return [];
      }

      return matchesExpectedReactPeerRange(
        record.packageJson.peerDependencies?.react,
      )
        ? []
        : [
            `${record.packageJson.name} must declare peerDependencies.react as ${expectedReactPeerRange}`,
          ];
    },
  );

  const publishedReactDomPeerFailures = packageUsages.flatMap(
    ({ record, sourceUsage }) => {
      if (!isPublishedPackage(record) || !sourceUsage.importsReactDom) {
        return [];
      }

      return matchesExpectedReactPeerRange(
        record.packageJson.peerDependencies?.["react-dom"],
      )
        ? []
        : [
            `${record.packageJson.name} must declare peerDependencies.react-dom as ${expectedReactPeerRange}`,
          ];
    },
  );

  const migratedReactDomPeerFailures = packageUsages.flatMap(({ record }) => {
    if (!migratedRuntimePackages.has(record.packageName)) {
      return [];
    }

    return matchesExpectedReactPeerRange(
      record.packageJson.peerDependencies?.["react-dom"],
    )
      ? []
      : [
          `${record.packageJson.name} must declare peerDependencies.react-dom as ${expectedReactPeerRange}`,
        ];
  });

  const react19ApiMatches = packageUsages.flatMap(({ record, sourceUsage }) => {
    return outOfScopePackages.has(record.packageName)
      ? []
      : sourceUsage.react19ApiMatches;
  });

  const runtimeRadixImportMatches = packageUsages.flatMap(
    ({ record, sourceUsage }) => {
      return outOfScopePackages.has(record.packageName)
        ? []
        : sourceUsage.runtimeRadixImportMatches;
    },
  );

  const radixDependencyMatches = packageUsages.flatMap(({ record }) => {
    return outOfScopePackages.has(record.packageName)
      ? []
      : getRadixDependencyMatches(record);
  });

  const staleMigratedReadmeRadixMatches = packageUsages.flatMap(
    ({ record, readmeAudit }) => {
      if (!migratedRuntimePackages.has(record.packageName)) {
        return [];
      }

      return readmeAudit.radixMatches
        .filter((match) => !isAllowedReadmeRadixReference(match))
        .map((match) => ({
          ...match,
          packageName: record.packageName,
        }));
    },
  );

  const missingMigratedReadmeBaseUiMentions = packageUsages.flatMap(
    ({ record, readmeAudit }) => {
      if (!migratedRuntimePackages.has(record.packageName)) {
        return [];
      }

      return readmeAudit.baseUiMentions || !packageUsesBaseUi(record)
        ? []
        : [
            `${record.packageJson.name} README should mention Base UI implementation details`,
          ];
    },
  );

  const tooltipConsumerReadmeFailures = packageUsages.flatMap(
    ({ record, readmeAudit }) => {
      if (!publishedTooltipConsumerPackages.has(record.packageName)) {
        return [];
      }

      return readmeAudit.readmeExists
        ? []
        : [
            `${record.packageJson.name} must keep a README after tooltip-consumer verification`,
          ];
    },
  );

  const failures = [
    ...publishedReactPeerFailures,
    ...publishedReactDomPeerFailures,
    ...migratedReactDomPeerFailures,
    ...react19ApiMatches.map(formatFileMatch),
    ...runtimeRadixImportMatches.map(formatFileMatch),
    ...radixDependencyMatches.map(formatFileMatch),
    ...staleMigratedReadmeRadixMatches.map(formatFileMatch),
    ...missingMigratedReadmeBaseUiMentions,
    ...tooltipConsumerReadmeFailures,
  ];

  const migratedPackageNames = [...migratedRuntimePackages]
    .map((packageName) => `@telegraph/${packageName}`)
    .sort();
  const publishedConsumerNames = [...publishedTooltipConsumerPackages]
    .map((packageName) => `@telegraph/${packageName}`)
    .sort();

  printSection("React 18 compatibility scope", [
    `Expected peer range: ${expectedReactPeerRange}`,
    `Migrated packages checked: ${migratedPackageNames.join(", ")}`,
    `Published tooltip consumers checked: ${publishedConsumerNames.join(", ")}`,
    "Checks: peer dependency range, React 19-only API usage, and package README migration notes.",
  ]);

  printSection("Radix runtime scan", [
    `Runtime @radix-ui imports outside @telegraph/filter: ${runtimeRadixImportMatches.length}`,
    `@radix-ui package dependencies outside @telegraph/filter: ${radixDependencyMatches.length}`,
    "@telegraph/filter remains intentionally out of published-scope cleanup.",
  ]);

  printSection("README migration audit", [
    `Stale migrated-package Radix README references: ${staleMigratedReadmeRadixMatches.length}`,
    `Migrated-package READMEs missing Base UI notes: ${missingMigratedReadmeBaseUiMentions.length}`,
    `Tooltip consumer README failures: ${tooltipConsumerReadmeFailures.length}`,
  ]);

  if (failures.length > 0) {
    printSection(
      "Failures",
      failures.map((failure) => `- ${failure}`),
    );
    process.exitCode = 1;
    return;
  }

  printSection("Result", ["Base UI migration checkpoint checks passed."]);
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}

export { findReact19ApiMatches };
