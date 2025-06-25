import { Box } from "@telegraph/layout";
import { useMemo } from "react";
import Prism from "prismjs";

// Import the TSX / JSX grammars so Prism can tokenize the code correctly.
// These side-effects augment `Prism.languages`.
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "./prism-theme.css";

type CodeBlockProps = {
  /** The raw TSX/React source code to highlight */
  code: string;
};

/**
 * Renders highlighted TSX code using PrismJS.
 *
 * We output `<pre><code class="language-tsx" />` so that you can supply your own
 * Prism theme (e.g. via `prismjs/themes/prism-okaidia.css` or a custom CSS
 * file). Styling is entirely driven by the standard Prism CSS token classes
 * (e.g. `.token.comment`, `.token.keyword`).
 */

const CodeBlock = ({ code }: CodeBlockProps) => {
  // Memoize the highlighted HTML so we only re-tokenize when the input changes.
  const highlighted = useMemo(() => {
    try {
      return Prism.highlight(code, Prism.languages.tsx, "tsx");
    } catch {
      // If highlighting fails for some reason, just escape the code.
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  }, [code]);

  return (
    <Box
      as="pre"
      w="full"
      h="full"
      data-language="tsx"
      bg="gray-12"
      position="relative"
      p="4"
      style={{ fontFamily: "Geist Mono !important", overflow: "auto" }}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <code
        className="language-tsx"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </Box>
  );
};

export { CodeBlock };
