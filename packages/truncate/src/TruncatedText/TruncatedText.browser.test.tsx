import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { TruncatedText } from "./TruncatedText";
// The engine modes detect overflow with a pure CSS container size-query: an
// invisible `word-break: break-all` copy that wraps taller than one line flips
// `@container (height > 1lh)`, which fades the marker in. jsdom reports
// scrollWidth/clientWidth as 0 and does not evaluate container queries, so this
// behavior can only be exercised in a real browser. The default (native) mode
// uses inline styles, so only the engine tests below need the stylesheet.
import "./TruncatedText.styles.css";

// Real layout only. `useTruncate` decides truncation from
// `scrollWidth > clientWidth`; jsdom reports both as 0, so every jsdom truncate
// test has to fake the measurement (see the scrollWidth/clientWidth prototype
// stubs in TooltipIfTruncated.test.tsx). In real Chromium the text actually
// overflows its max-width, so the check runs for real and the tooltip is
// enabled only when the text is genuinely clipped.
//
// Query the trigger by test id, never by its text: an open tooltip renders the
// same string, and under xvfb the virtual cursor can sit over the element as it
// mounts and open the tooltip immediately — so `getByText` would match two
// elements and throw a strict-mode violation.
const LONG =
  "apps/web/src/components/WorkflowGraphEditor/nodes/steps/BaseStepCard.tsx";
const SHORT = "Short";

const query = (root: HTMLElement, selector: string) =>
  root.querySelector(selector) as HTMLElement;

describe("TruncatedText native overflow (real browser)", () => {
  it("shows a tooltip on hover when the text is actually clipped", async () => {
    render(
      <TruncatedText
        as="span"
        data-testid="clip"
        style={{ maxWidth: 80 }}
        tooltipProps={{ delayDuration: 0 }}
      >
        {LONG}
      </TruncatedText>,
    );

    const trigger = page.getByTestId("clip");
    await expect.element(trigger).toBeInTheDocument();

    // Real layout genuinely clips the text — this is exactly the condition
    // useTruncate measures, and the whole reason jsdom can't cover it.
    const el = trigger.element() as HTMLElement;
    expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);

    await userEvent.hover(trigger);
    await expect.element(page.getByRole("tooltip")).toBeVisible();
    await expect.element(page.getByRole("tooltip")).toHaveTextContent(LONG);
  });

  it("leaves the tooltip disabled when the text fits", async () => {
    render(
      <TruncatedText
        as="span"
        data-testid="clip"
        style={{ maxWidth: 400 }}
        tooltipProps={{ delayDuration: 0 }}
      >
        {SHORT}
      </TruncatedText>,
    );

    const trigger = page.getByTestId("clip");
    await expect.element(trigger).toBeInTheDocument();

    // The text fits, so useTruncate never flags it as truncated.
    const el = trigger.element() as HTMLElement;
    expect(el.scrollWidth).not.toBeGreaterThan(el.clientWidth);

    // Hovering a non-truncated label must not open a tooltip.
    await userEvent.hover(trigger);
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument();
  });

  it("front-truncates with native RTL ellipsis (never mid-glyph) and shows the full path", async () => {
    render(
      <TruncatedText
        as="span"
        mode="fruncate"
        data-testid="front"
        style={{ maxWidth: 160 }}
        tooltipProps={{ delayDuration: 0 }}
      >
        {LONG}
      </TruncatedText>,
    );

    const trigger = page.getByTestId("front");
    await expect.element(trigger).toBeInTheDocument();
    const el = trigger.element() as HTMLElement;

    // Native front truncation: RTL flips the ellipsis to the start, and
    // `text-overflow: ellipsis` clips on a glyph boundary — no overlay marker
    // that could leave a partial glyph exposed.
    expect(getComputedStyle(el).direction).toBe("rtl");
    expect(getComputedStyle(el).textOverflow).toBe("ellipsis");
    expect(query(el, "[data-tgph-truncate]")).toBeNull();
    expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);

    await userEvent.hover(trigger);
    await expect.element(page.getByRole("tooltip")).toBeVisible();
    await expect.element(page.getByRole("tooltip")).toHaveTextContent(LONG);
  });

  it("middle-truncates by measure-and-slice: crisp …, fits with no gap, no cut letter, full path in tooltip", async () => {
    render(
      <TruncatedText
        as="span"
        mode="middle"
        data-testid="mid"
        style={{ maxWidth: 200 }}
        tooltipProps={{ delayDuration: 0 }}
      >
        {LONG}
      </TruncatedText>,
    );

    const trigger = page.getByTestId("mid");
    await expect.element(trigger).toBeInTheDocument();
    const root = trigger.element() as HTMLElement;

    // The layout effect measures and slices to fit (retried: it also re-measures
    // once the webfont has loaded).
    await vi.waitFor(() =>
      expect(root.querySelector("[data-tgph-middle-truncated]")).not.toBeNull(),
    );
    const span = root.querySelector(
      "[data-tgph-middle-truncated]",
    ) as HTMLElement;
    const rendered = span.textContent ?? "";

    // It's the JS slice, not the CSS engine.
    expect(query(root, "[data-tgph-truncate]")).toBeNull();
    // A single crisp "…", shorter than the full path.
    expect(rendered).toContain("…");
    expect(rendered.length).toBeLessThan(LONG.length);
    // It fits — the slice does not overflow its box, so there is no gap and no
    // hard clip (the whole point of measuring).
    expect(span.scrollWidth).toBeLessThanOrEqual(span.clientWidth);
    // It never cuts a letter: both sides of the "…" are verbatim from LONG.
    const [head, tail] = rendered.split("…");
    expect(LONG).toContain(head);
    expect(LONG).toContain(tail);

    await userEvent.hover(trigger);
    // The tooltip shows the original path, not the sliced version.
    await expect.element(page.getByRole("tooltip")).toBeVisible();
    await expect.element(page.getByRole("tooltip")).toHaveTextContent(LONG);
  });
});

// A custom `marker` (here the default ellipsis) opts end-truncation into the
// CSS engine, so these exercise the container size-query reveal directly.
describe("TruncatedText engine modes (real browser)", () => {
  it("reveals the marker when the engine actually clips the text", async () => {
    render(
      <div style={{ width: 120 }} data-testid="wrap">
        <TruncatedText as="span" marker="…">
          {LONG}
        </TruncatedText>
      </div>,
    );

    const wrap = page.getByTestId("wrap");
    await expect.element(wrap).toBeInTheDocument();
    const root = wrap.element() as HTMLElement;
    const clip = query(root, "[data-tgph-truncate]");

    // Real layout genuinely clips the text — the exact condition the CSS
    // measures, and the whole reason jsdom (which reports 0) can't cover it.
    expect(clip.scrollWidth).toBeGreaterThan(clip.clientWidth);

    // The container query flips the marker to opacity 1 (after its fade-in).
    const marker = query(root, "[data-tgph-truncate-marker]");
    await vi.waitFor(() => expect(getComputedStyle(marker).opacity).toBe("1"));
  });

  it("keeps the marker hidden when the text fits", async () => {
    render(
      <div style={{ width: 400 }} data-testid="wrap">
        <TruncatedText as="span" marker="…">
          {SHORT}
        </TruncatedText>
      </div>,
    );

    const wrap = page.getByTestId("wrap");
    await expect.element(wrap).toBeInTheDocument();
    const root = wrap.element() as HTMLElement;
    const clip = query(root, "[data-tgph-truncate]");

    // The text fits, so nothing overflows and the container query never fires.
    expect(clip.scrollWidth).not.toBeGreaterThan(clip.clientWidth);

    const marker = query(root, "[data-tgph-truncate-marker]");
    expect(getComputedStyle(marker).opacity).toBe("0");
  });

  it("fades the marker into the background for variant='fade'", async () => {
    render(
      <div style={{ width: 120 }} data-testid="wrap">
        <TruncatedText as="span" variant="fade">
          {LONG}
        </TruncatedText>
      </div>,
    );

    const wrap = page.getByTestId("wrap");
    await expect.element(wrap).toBeInTheDocument();
    const root = wrap.element() as HTMLElement;
    const marker = query(root, "[data-tgph-truncate-marker]");

    // Same reveal mechanism as the default marker.
    await vi.waitFor(() => expect(getComputedStyle(marker).opacity).toBe("1"));

    // Fade treatment (vs the default solid ellipsis): no solid marker
    // background, and a gradient overlay painted via ::before.
    expect(getComputedStyle(marker).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(getComputedStyle(marker, "::before").backgroundImage).toContain(
      "gradient",
    );
  });
});
