import { playwright } from "@vitest/browser-playwright";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Real-browser tests for behavior jsdom can't reproduce (async focus/rAF races,
// real layout/positioning). Kept separate from the jsdom project so `yarn test`
// is unaffected; run with `yarn workspace @telegraph/menu test:browser`.
//
// Headless by default so local runs don't pop a window; the fix is deterministic
// so these pass headless. To reproduce the KNO-14086 race itself, run headed
// (`test:browser:headed`, i.e. `--browser.headless=false`): it only surfaces
// with real vsync, because headless Chromium fires Base UI's rAF-queued initial
// focus eagerly and hides the bug.
export default defineConfig({
  root: dirname(fileURLToPath(import.meta.url)),
  // @ts-expect-error -- plugin type mismatch, same as vitest/config.mts
  plugins: [tsconfigPaths()],
  test: {
    name: "menu-browser",
    globals: true,
    include: ["src/**/*.browser.test.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
