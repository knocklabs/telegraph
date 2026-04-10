import React, { useEffect, useMemo, useState } from "react";
import { DocsContainer as BaseDocsContainer } from "@storybook/addon-docs/blocks";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes, create } from "storybook/theming";
import type { PropsWithChildren } from "react";

const THEME_MAP: Record<string, string> = {
  light: "light",
  dark: "dark",
};
const DEFAULT_THEME = "light";
const ATTRIBUTE_NAME = "data-tgph-appearance";

const darkStorybookTheme = create({
  base: "dark",
  appBg: "#18191b",
  appContentBg: "#18191b",
  appPreviewBg: "#18191b",
  textColor: "#edeeef",
  textMutedColor: "#afb5bb",
  barBg: "#18191b",
  appBorderColor: "#282a2d",
  fontBase:
    'Inter, -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif',
  fontCode: "Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace",
  colorPrimary: "#ff573a",
  colorSecondary: "#4a82ff",
});

function getInitialTheme(context: any): string {
  // Try reading from a story's globals (works on component docs pages)
  try {
    const story = context.componentStories()?.[0];
    if (story) {
      return context.getStoryContext(story).globals?.theme || DEFAULT_THEME;
    }
  } catch {}

  // Try reading from the store's userGlobals (works on docs-only pages)
  try {
    const globals = context.store?.userGlobals?.get?.();
    if (globals?.theme) {
      return globals.theme;
    }
  } catch {}

  // Fall back to the current DOM attribute to preserve theme across navigation
  const current = document.documentElement.getAttribute(ATTRIBUTE_NAME);
  if (current && current in THEME_MAP) {
    return current;
  }

  return DEFAULT_THEME;
}

export function DocsContainer({
  children,
  context,
}: PropsWithChildren<{ context: any }>) {
  const [theme, setTheme] = useState(() => getInitialTheme(context));

  useEffect(() => {
    const onGlobalsUpdated = (changed: { globals: Record<string, any> }) => {
      setTheme(changed.globals?.theme || DEFAULT_THEME);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context.channel]);

  useEffect(() => {
    const themeValue = THEME_MAP[theme] || THEME_MAP[DEFAULT_THEME];
    document.documentElement.setAttribute(ATTRIBUTE_NAME, themeValue);
  }, [theme]);

  const storybookTheme = useMemo(
    () => (theme === "dark" ? darkStorybookTheme : themes.light),
    [theme],
  );

  return (
    <BaseDocsContainer context={context} theme={storybookTheme}>
      <div className="tgph">{children}</div>
    </BaseDocsContainer>
  );
}
