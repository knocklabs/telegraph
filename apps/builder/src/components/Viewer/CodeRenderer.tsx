// We rely on a local ambient type declaration for @babel/standalone (see types folder).
// The module is cast to `any` so we can access .transform without TypeScript errors.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import BabelUntyped from "@babel/standalone";
// Import Telegraph packages so they're available to generated code.
// Keep these in a dedicated section to make maintenance easy.
import * as TelegraphAppearance from "@telegraph/appearance";
import * as TelegraphButton from "@telegraph/button";
import * as TelegraphCombobox from "@telegraph/combobox";
import * as TelegraphComposeRefs from "@telegraph/compose-refs";
import * as TelegraphFilter from "@telegraph/filter";
import * as TelegraphHelpers from "@telegraph/helpers";
import * as TelegraphIcon from "@telegraph/icon";
import * as TelegraphInput from "@telegraph/input";
import * as TelegraphKbd from "@telegraph/kbd";
import * as TelegraphLayout from "@telegraph/layout";
import * as TelegraphMenu from "@telegraph/menu";
import * as TelegraphModal from "@telegraph/modal";
import * as TelegraphMotion from "@telegraph/motion";
import * as TelegraphPopover from "@telegraph/popover";
import * as TelegraphRadio from "@telegraph/radio";
import * as TelegraphSegmentedControl from "@telegraph/segmented-control";
import * as TelegraphSelect from "@telegraph/select";
import * as TelegraphStyleEngine from "@telegraph/style-engine";
import * as TelegraphTabs from "@telegraph/tabs";
import * as TelegraphTag from "@telegraph/tag";
import * as TelegraphTextarea from "@telegraph/textarea";
import * as TelegraphTokens from "@telegraph/tokens";
import * as TelegraphTooltip from "@telegraph/tooltip";
import * as TelegraphTruncate from "@telegraph/truncate";
import * as TelegraphTypography from "@telegraph/typography";
import React, { Suspense, useEffect, useMemo, useState } from "react";

// Map of module id -> package namespace for requireShim.
const telegraphPackages: Record<string, unknown> = {
  "@telegraph/appearance": TelegraphAppearance,
  "@telegraph/button": TelegraphButton,
  "@telegraph/combobox": TelegraphCombobox,
  "@telegraph/compose-refs": TelegraphComposeRefs,
  "@telegraph/filter": TelegraphFilter,
  "@telegraph/helpers": TelegraphHelpers,
  "@telegraph/icon": TelegraphIcon,
  "@telegraph/input": TelegraphInput,
  "@telegraph/kbd": TelegraphKbd,
  "@telegraph/layout": TelegraphLayout,
  "@telegraph/menu": TelegraphMenu,
  "@telegraph/modal": TelegraphModal,
  "@telegraph/motion": TelegraphMotion,
  "@telegraph/popover": TelegraphPopover,
  "@telegraph/radio": TelegraphRadio,
  "@telegraph/segmented-control": TelegraphSegmentedControl,
  "@telegraph/select": TelegraphSelect,
  "@telegraph/style-engine": TelegraphStyleEngine,
  "@telegraph/tabs": TelegraphTabs,
  "@telegraph/tag": TelegraphTag,
  "@telegraph/textarea": TelegraphTextarea,
  "@telegraph/tokens": TelegraphTokens,
  "@telegraph/tooltip": TelegraphTooltip,
  "@telegraph/truncate": TelegraphTruncate,
  "@telegraph/typography": TelegraphTypography,
};

// Extend the scope with any other frequently-used Telegraph primitives here as needed.
const requireShim = (mod: string) => {
  switch (mod) {
    case "react":
      return React;
    case "react/jsx-runtime":
    case "react/jsx-dev-runtime": {
      // Minimal shim replicating the exports React provides in these modules.
      // We delegate to React.createElement and React.Fragment.
      return {
        jsx: React.createElement,
        jsxs: React.createElement,
        jsxd: React.createElement,
        Fragment: React.Fragment,
      };
    }
    case "@telegraph/layout":
      return TelegraphLayout;
    case "@telegraph/input":
      return TelegraphInput;
    case "@telegraph/button":
      return TelegraphButton;
    case "@telegraph/typography":
      return TelegraphTypography;
    case "@telegraph/textarea":
      return TelegraphTextarea;
    // Any Telegraph package imported by generated code will resolve here.
    default: {
      if (telegraphPackages[mod]) {
        return telegraphPackages[mod as keyof typeof telegraphPackages];
      }
      throw new Error(`Module not found: ${mod}`);
    }
  }
};

// Cast to `any` because the package lacks proper TS types.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const Babel: any = BabelUntyped;

// Utility: transforms TypeScript/TSX into runnable JS using Babel.
function transformCode(code: string): string {
  return Babel.transform(code, {
    presets: [
      [
        "react",
        {
          runtime: "automatic",
        },
      ],
      "typescript",
    ],
    plugins: ["transform-modules-commonjs"],
    filename: "generated.tsx",
    babelrc: false,
    configFile: false,
    sourceType: "module",
  }).code as string;
}

type CodeRendererProps = {
  code: string | null;
};

export const CodeRenderer: React.FC<CodeRendererProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compiledCode = useMemo(() => {
    if (!code) return null;
    try {
      // 1. Return early if already a JS/TSX module with imports – we rely on Babel to handle ESM & imports via requireShim
      const transformed = transformCode(code);
      return transformed;
    } catch (err) {
      setError((err as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (!compiledCode) {
      setComponent(null);
      return;
    }
    try {
      const moduleExports: Record<string, unknown> = {};
      // eslint-disable-next-line no-new-func
      const func = new Function(
        "exports",
        "require",
        "module",
        "React",
        compiledCode + "\nreturn module.exports;",
      );
      const moduleObj = { exports: moduleExports };
      const exportsReturned = func(
        moduleExports,
        requireShim,
        moduleObj,
        React,
      );
      const defaultExport =
        (exportsReturned &&
          (exportsReturned as Record<string, unknown>).default) ||
        (moduleObj.exports as Record<string, unknown>).default;

      const wrapMaybeAsyncComponent = (
        Comp: (...args: never[]) => unknown,
      ): React.ComponentType => {
        const Wrapper: React.FC = (props) => {
          const [resolved, setResolved] = useState<React.ReactNode | null>(
            null,
          );
          const [loading, setLoading] = useState(false);
          const [asyncError, setAsyncError] = useState<unknown>(null);

          // Use a ref to avoid re-invoking on every render unless props change
          const propsKey = JSON.stringify(props);

          useEffect(() => {
            let cancelled = false;

            try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const result = (Comp as any)(props);

              if (
                result &&
                typeof (result as Promise<unknown>).then === "function"
              ) {
                setLoading(true);
                (result as Promise<React.ReactNode>).then(
                  (node) => {
                    if (!cancelled) {
                      setResolved(node);
                      setLoading(false);
                    }
                  },
                  (err) => {
                    if (!cancelled) {
                      setAsyncError(err);
                      setLoading(false);
                    }
                  },
                );
              } else {
                setResolved(result as React.ReactNode);
              }
            } catch (err) {
              // If Comp throws a promise (Suspense), rethrow so React handles it normally
              if (err && typeof (err as Promise<unknown>).then === "function") {
                throw err;
              }
              setAsyncError(err);
            }

            return () => {
              cancelled = true;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [propsKey]);

          if (asyncError) {
            throw asyncError;
          }

          if (loading || resolved === null) {
            return React.createElement("span", null, "Loading…");
          }

          // If resolved value itself is a React element or node, render it; otherwise nothing
          return <>{resolved as React.ReactNode}</>;
        };
        return Wrapper;
      };

      if (typeof defaultExport === "function") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setComponent(() => wrapMaybeAsyncComponent(defaultExport as any));
      } else if (
        defaultExport &&
        typeof (defaultExport as Promise<unknown>).then === "function"
      ) {
        // The default export itself is a Promise (e.g., dynamic import). Use React.lazy.
        setComponent(() =>
          React.lazy(() =>
            (defaultExport as Promise<unknown>).then((mod) => {
              return {
                default: wrapMaybeAsyncComponent(
                  (mod as Record<string, unknown>).default as (
                    ...args: never[]
                  ) => unknown,
                ),
              };
            }),
          ),
        );
      } else {
        setError("No default export found in generated code");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, [compiledCode]);

  if (!code) {
    return null;
  }

  if (error) {
    return <pre style={{ color: "red" }}>{error}</pre>;
  }

  if (!Component) {
    return <pre>Loading component…</pre>;
  }

  return (
    // Render the dynamically generated component (support Suspense for lazy-loaded components)
    <Suspense fallback={<pre>Loading component…</pre>}>
      <Component />
    </Suspense>
  );
};
