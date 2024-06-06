import { promises as fs } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the module while clearning the cache
// so that we get the latest version of the module
// when it is reloaded.
export const loadModule = async (modulePath) => {
  try {
    // Read the module file contents
    const moduleContent = await fs.readFile(modulePath, "utf-8");

    // Create a new module by wrapping the content
    const moduleWrapper = new Function(
      "exports",
      "require",
      "module",
      "__filename",
      "__dirname",
      moduleContent,
    );

    // Create a new module instance
    const moduleExports = {};
    const moduleInstance = { exports: moduleExports };
    moduleWrapper(
      moduleExports,
      require,
      moduleInstance,
      modulePath,
      process.cwd(),
    );

    return moduleInstance.exports;
  } catch (error) {
    console.error("Error loading module:", error);
  }
};
