import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// The browser-mode test config: real Chromium via Playwright, for behavior jsdom
// can't reproduce (async focus/rAF scheduling, real layout/geometry,
// ResizeObserver, animations, CSS). One config covers every package — any
// `packages/*/src/**/*.browser.test.tsx` is picked up here, and the same glob is
// excluded from the jsdom run (vitest/config.mts). Run with `yarn test:browser`,
// kept separate from the fast jsdom `yarn test` so the common case stays quick.
// See AGENTS.md for when to reach for browser mode over jsdom.
//
// Runs HEADED everywhere on purpose — locally and in CI (under xvfb) — so local
// and CI catch the same things. These bugs need a real display: rAF is driven by
// the display's vsync, so Base UI's rAF-queued initial focus only defers to a
// real frame when there is one. Headless Chromium has no display and fires rAF
// eagerly (like jsdom / happy-dom), hiding the KNO-14086 race — a headless pass
// would be false confidence. The cost is a browser window locally; worth it.
export default defineConfig({
  // @ts-expect-error -- plugin type mismatch, same as vitest/config.mts
  plugins: [tsconfigPaths()],
  test: {
    name: "browser",
    globals: true,
    include: ["packages/*/src/**/*.browser.test.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: false,
      instances: [{ browser: "chromium" }],
    },
  },
});
