import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

// Runtime must be Node so we can access the filesystem
export const runtime = "nodejs";

import fs from "node:fs/promises";
import path from "node:path";

// Helper: walk up the directory tree until we find the monorepo root (contains `packages`)
async function getRepoRoot(startDir: string): Promise<string> {
  let current = startDir;
  for (let i = 0; i < 5; i++) {
    try {
      const stat = await fs.stat(path.join(current, "packages"));
      if (stat.isDirectory()) {
        return current;
      }
    } catch {
      /* not found – keep walking */
    }
    const parent = path.dirname(current);
    if (parent === current) break; // reached the fs root
    current = parent;
  }
  return startDir; // fallback – shouldn't happen in the repo
}

// Memoise repoRoot discovery so we don't hit fs for every tool call
let _repoRoot: string | null = null;
async function repoRoot() {
  if (!_repoRoot) {
    _repoRoot = await getRepoRoot(process.cwd());
  }
  return _repoRoot;
}

export async function POST(req: Request) {
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
      "Tools available: • `list_telegraph_packages` • `list_telegraph_files` • `read_telegraph_file`. Use them liberally (especially the *.stories.tsx / .constants.ts files) to inspect prop definitions and composition patterns.",
      "If a file or constant cannot be found, gracefully continue – try alternative files or proceed with best-guess typings that follow guidelines, but be conservative and prefer patterns observed in the stories.",
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
              "Relative path from the repo root (`telegraph/`) to the file you want to read."
            ),
        }),
        execute: async ({ path: filePath }) => {
          const root = await repoRoot();
          const normalizedPath = filePath.trim().replace(/^\/+/g, "");
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
            return {
              error: `File not found or unreadable: ${filePath}`,
              details: String(err),
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
              "Directory path relative to the repo root (`telegraph/`) whose contents you want to list."
            ),
        }),
        execute: async ({ path: dirPath }) => {
          const root = await repoRoot();
          const normalizedDir = dirPath.trim().replace(/^\/+/g, "");
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
            return {
              error: `Directory not found or unreadable: ${dirPath}`,
              details: String(err),
            };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
