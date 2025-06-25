import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const maxDuration = 30;

// Runtime must be Node so we can access the filesystem
export const runtime = "nodejs";

// Helper: walk up the directory tree until we find the monorepo root (contains `packages`)
// In some build/runtime environments (e.g. within Next.js's .next output) the working
// directory can be nested many levels deep. We therefore allow a generous search depth
// (default 25 levels) before giving up.
async function getRepoRoot(startDir: string, maxDepth = 25): Promise<string> {
  try {
    let current = path.resolve(startDir);
    for (let depth = 0; depth <= maxDepth; depth++) {
      try {
        const stat = await fs.stat(path.join(current, "packages"));
        if (stat.isDirectory()) {
          return current;
        }
      } catch {
        /* `packages` not found at this level – keep walking */
      }

      const parent = path.dirname(current);
      if (parent === current) {
        // Reached filesystem root – stop searching
        break;
      }
      current = parent;
    }

    // If we couldn't locate the repo root we fall back to the original directory.
    // This keeps the tools functional (they'll simply report "path not found")
    // instead of throwing which would crash the entire route.
    return startDir;
  } catch (error) {
    console.error("Error getting repo root", error);
    return startDir;
  }
}

let _repoRoot: string | null = null;

/**
 * Resolve the monorepo root directory (the folder that directly contains the
 * top-level `packages/` directory). We employ a defensive strategy that tries a
 * few likely starting locations because {@link process.cwd} and `__dirname`
 * can differ between local dev, build output and serverless runtimes.
 */
async function repoRoot() {
  try {
    if (_repoRoot) return _repoRoot;

    const candidates = [process.cwd()].filter(Boolean) as string[];

    for (const startDir of candidates) {
      const root = await getRepoRoot(startDir);
      try {
        const stat = await fs.stat(path.join(root, "packages"));
        if (stat.isDirectory()) {
          _repoRoot = root;
          return root;
        }
      } catch {
        /* continue searching with next candidate */
      }
    }

    // Fallback: last resort use process.cwd(). This keeps the tools functional
    // (they'll surface "path not found" errors instead of throwing).
    _repoRoot = process.cwd();
    return _repoRoot;
  } catch (error) {
    console.error("Error getting repo root", error);
    return process.cwd();
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Prepend system prompt giving high-level guidance on how to build components
    const systemPrompt = {
      role: "system" as const,
      content: [
        "You are a senior Telegraph UI engineer tasked with generating **runnable** TypeScript React components that strictly follow Telegraph's design-system conventions.",
        "Absolute MUST-FOLLOW rules (violations will be rejected):",
        "1. Use ONLY Telegraph primitives (the `@telegraph/*` packages) – never raw HTML elements except through the `as` prop provided by the primitive.",
        "2. For headings and inline copy use `Heading` or `Text` from `@telegraph/typography` (never `<h2>`, `<p>` directly).",
        "3. Layout must use `Box`, `Stack`, or other primitives from `@telegraph/layout`. **You do NOT need to specify the `as` prop for Box/Stack unless rendering a different HTML element.**",
        "4. Only typography primitives (`Heading`, `Text`, etc.) require an explicit `as` prop if you need a tag other than their default.",
        "5. All interactive elements (buttons, inputs, etc.) must import from their dedicated packages (`@telegraph/button`, `@telegraph/input`, …).",
        "6. Props must match the exported component's typings. When unsure, open the component's *.stories.tsx OR the constants file (e.g. Box.constants.ts, Stack.constants.ts) via the tools – use only the keys defined there.",
        '   • Never invent prop values. For example, Button\'s "color" prop accepts only: default, gray, red, accent, green, blue, yellow, purple. Do NOT use "primary" or any undefined values.',
        '7. For layout: Stack uses the prop **gap** (token key from tokens.spacing), not spacing/space. Box accepts spacing tokens for padding/margin props like `padding="2"`.',
        "8. For compound components such as Button, Menu, etc., prefer the top-level export (e.g. `<Button>`). Use `<Button.Root>` and other sub-parts ONLY when implementing advanced custom patterns that the stories demonstrate.",
        "9. No inline styles. Use props / style tokens exposed by Telegraph components.",
        "10. Return a single **complete** `.tsx` file wrapped in triple back-ticks and NOTHING else (no prose).",
        "11. When asked to stack things, utilize the `Stack` component from `@telegraph/layout` with the `direction` prop set to `column`, `row`, `row-reverse`, or `column-reverse`.",
        "12. The react component should never have a `React.FC` or `React.Component` type. It should only be a function component. NEVER EVER write `React.FC` or `React.Component` in the generated code.",
        "13. Always look to use the 'default' variation of a component, i.e. use `<Button>` instead of `<Button.Root>`, only in special cases where you need to do something that is not possible with the default component use the component's sub-parts.",
        "14. When adding props to a component, always try to use the shorthand varation of the prop name, i.e. use `pb` instead of `paddingBottom`.",
        "15. It's VERY VERY RARE, and should not be used unless explicitly acess for, but if a style is not possible via the props of a component, you can use the `style` prop to add inline styles to the component. This should only be used at an absolute last resort.",
        "16. When using margin and padding, if you need the same space on both sides, use the `mx` or `my` prop instead of `ml` or `mr`.",
        "17. You're an accessibility expert. Components should ALWAYS be accessible. Follow best practices for accessibility when building the components no matter what. ex: labbels on inputs, etc.",
        "18. Only apply props if they're not already the default prop values applied to the component. ex: if the component has a `color` prop, don't apply the `color` prop if it's already the default value.",
        "19. For any primitve prop values only use those defined from the component and `@telegraph/tokens`, i.e. never do `w='400px'`, utilize the defined tokens instead.",
        "Tools available: • `list_telegraph_packages` • `list_telegraph_files` • `read_telegraph_file`. Use them liberally (especially the *.stories.tsx / .constants.ts files) to inspect prop definitions and composition patterns.",
        "If a file or constant cannot be found, gracefully continue – try alternative files or proceed with best-guess typings that follow guidelines, but be conservative and prefer patterns observed in the stories. This should always be formatted in markdown.",
        "Always return a message describing the component you are generating or the changes you are making.",
      ].join("\n"),
    };

    const result = streamText({
      model: openai("gpt-4o"),
      messages: [systemPrompt, ...messages],
      maxSteps: 8,
      tools: {
        read_telegraph_file: tool({
          description:
            "Read a file from the Telegraph monorepo and return its contents so the model can use it as context.",
          parameters: z.object({
            path: z
              .string()
              .describe(
                "Relative path from the repo root (`telegraph/`) to the file you want to read.",
              ),
          }),
          execute: async ({ path: filePath }) => {
            const root = await repoRoot();
            // Normalise the incoming path so it is always relative to the monorepo root.
            // 1. Trim whitespace
            // 2. Remove any leading slashes
            // 3. Remove a leading "telegraph/" segment if the caller included the repo
            //    name (which the system prompt examples sometimes do)
            const normalizedPath = filePath
              .trim()
              .replace(/^\/+/g, "")
              .replace(/^telegraph\//, "");
            const absPath = path.resolve(root, normalizedPath);

            // Guard against directory traversal & non-existent paths
            if (!absPath.startsWith(root)) {
              return { error: "Path is outside the repository" };
            }

            try {
              const stat = await fs.stat(absPath);
              if (stat.isDirectory()) {
                const entries = await fs.readdir(absPath, {
                  withFileTypes: true,
                });
                return {
                  directory: filePath,
                  files: entries.map((e) => ({
                    name: e.name,
                    isDir: e.isDirectory(),
                  })),
                };
              }

              const code = await fs.readFile(absPath, "utf8");
              return { path: filePath, code };
            } catch (err: unknown) {
              // Attempt within packages/ if not already namespaced
              if (!normalizedPath.startsWith("packages/")) {
                const pkgNormalized = path.posix.join(
                  "packages",
                  normalizedPath,
                );
                const pkgAbs = path.resolve(root, pkgNormalized);
                const statPkg = await fs.stat(pkgAbs);
                if (!statPkg.isDirectory()) {
                  const code = await fs.readFile(pkgAbs, "utf8");
                  return { path: `packages/${filePath}`, code };
                }
              }

              return {
                error: `File not found or unreadable: ${filePath}`,
                details: [
                  `Local FS error: ${String(err)}`,
                  "GitHub fallback: file not found",
                ].join(" | "),
              };
            }
          },
        }),
        list_telegraph_packages: tool({
          description:
            "List all Telegraph component packages available in the monorepo. Useful for discovery before reading specific files.",
          parameters: z.object({}),
          execute: async () => {
            const root = await repoRoot();
            const packagesDir = path.join(root, "packages");
            const entries = await fs.readdir(packagesDir, {
              withFileTypes: true,
            });
            const packages = entries
              .filter((e) => e.isDirectory())
              .map((e) => e.name);
            return { packages };
          },
        }),
        list_telegraph_files: tool({
          description:
            "List files within a directory inside the Telegr​aph repo so the model can determine exact filenames (e.g. to locate Input.tsx). Accepts a relative directory path and returns its immediate children (files & sub-dirs).",
          parameters: z.object({
            path: z
              .string()
              .describe(
                "Directory path relative to the repo root (`telegraph/`) whose contents you want to list.",
              ),
          }),
          execute: async ({ path: dirPath }) => {
            const root = await repoRoot();
            const normalizedDir = dirPath
              .trim()
              .replace(/^\/+/g, "")
              .replace(/^telegraph\//, "");
            const absDir = path.resolve(root, normalizedDir);

            if (!absDir.startsWith(root)) {
              return { error: "Path is outside the repository" };
            }

            try {
              const entries = await fs.readdir(absDir, { withFileTypes: true });
              return {
                files: entries.map((e) => ({
                  name: e.name,
                  isDir: e.isDirectory(),
                })),
              };
            } catch (err: unknown) {
              // Attempt within packages/ if not already namespaced
              if (!normalizedDir.startsWith("packages/")) {
                const pkgDirNormalized = path.posix.join(
                  "packages",
                  normalizedDir,
                );
                const pkgDirAbs = path.resolve(root, pkgDirNormalized);
                const entriesPkg = await fs.readdir(pkgDirAbs, {
                  withFileTypes: true,
                });
                return {
                  files: entriesPkg.map((e) => ({
                    name: e.name,
                    isDir: e.isDirectory(),
                  })),
                };
              }

              return {
                error: `Directory not found or unreadable: ${dirPath}`,
                details: [
                  `Local FS error: ${String(err)}`,
                  "GitHub fallback: directory not found",
                ].join(" | "),
              };
            }
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route", error);
    return new Response("Internal server error", { status: 500 });
  }
}
