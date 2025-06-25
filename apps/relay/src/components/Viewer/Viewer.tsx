import { useChat } from "@ai-sdk/react";
import { Stack } from "@telegraph/layout";
import prettierConfig from "@telegraph/prettier-config";
import { SegmentedControl } from "@telegraph/segmented-control";
import { Tag } from "@telegraph/tag";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import type { Plugin } from "prettier";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import prettierStandalone from "prettier/standalone";
import { Suspense, useEffect, useMemo, useState } from "react";

import { CodeBlock } from "@/components/CodeBlock";

type ViewerProps = {
  chat: ReturnType<typeof useChat>;
};

const CodeRenderer = dynamic(
  () => import("./CodeRenderer").then((m) => m.CodeRenderer),
  {
    ssr: false,
  },
);

const Viewer = ({ chat }: ViewerProps) => {
  const { messages } = chat;

  // Extract the most recent React/TSX code block returned by the assistant
  // This is derived state – we compute it from the latest messages array, so no extra local state needed.
  const generatedReactCode = useMemo(() => {
    // Traverse messages from newest to oldest to get the latest generated code
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg.role === "assistant" && typeof msg.content === "string") {
        // Look for a fenced code block: ```tsx ... ``` (tsx / jsx / js also acceptable)
        const match = msg.content.match(
          /```(?:t?sx|jsx|javascript)?\s*\n([\s\S]*?)\n```/,
        );
        if (match) {
          return match[1].trim();
        }
      }
    }
    return null;
  }, [messages]);

  // Hold the formatted code in state since Prettier may be async and return a Promise.
  const [formattedReactCode, setFormattedReactCode] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!generatedReactCode) {
      setFormattedReactCode(null);
      return;
    }

    let cancelled = false;

    const format = async () => {
      try {
        const configWithoutPlugins = {
          ...(prettierConfig as Record<string, unknown>),
        } as Record<string, unknown>;

        // Remove the 'plugins' key to avoid attempting to load server-side plugins in the browser
        delete configWithoutPlugins.plugins;

        const maybePromise = prettierStandalone.format(generatedReactCode, {
          parser: "babel",
          plugins: [parserEstree as Plugin, parserBabel as Plugin],
          ...configWithoutPlugins,
        });

        const result =
          typeof (maybePromise as Promise<unknown>).then === "function"
            ? await maybePromise
            : (maybePromise as unknown as string);

        if (!cancelled) {
          setFormattedReactCode(result as string);
        }
      } catch (err) {
        console.error("[Chat] Prettier formatting error", err);
        if (!cancelled) {
          setFormattedReactCode(generatedReactCode);
        }
      }
    };

    void format();

    return () => {
      cancelled = true;
    };
  }, [generatedReactCode]);

  const router = useRouter();
  const { tab = "preview" } = router.query;

  return (
    <Stack
      w="full"
      h="full"
      direction="column"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <Stack
        borderBottom="px"
        px="4"
        minH="14"
        align="center"
        justify="space-between"
      >
        <SegmentedControl.Root
          value={tab}
          onValueChange={(value: string) => {
            router.replace({
              pathname: router.pathname,
              query: { ...router.query, tab: value },
            });
          }}
        >
          <SegmentedControl.Option value="preview">
            Preview
          </SegmentedControl.Option>
          <SegmentedControl.Option value="code">Code</SegmentedControl.Option>
        </SegmentedControl.Root>
        <Tag
          size="2"
          onCopy={() => {
            // eslint-disable-next-line
            formattedReactCode &&
              navigator.clipboard.writeText(formattedReactCode);
          }}
        >
          Copy Code
        </Tag>
      </Stack>
      <Suspense fallback={<div />}>
        {tab === "preview" && (
          <Stack w="full" h="full" p="4">
            {generatedReactCode && <CodeRenderer code={generatedReactCode} />}
          </Stack>
        )}
        {tab === "code" && (
          <Stack w="full" h="full">
            {formattedReactCode && <CodeBlock code={formattedReactCode} />}
          </Stack>
        )}
      </Suspense>
    </Stack>
  );
};

export { Viewer };
