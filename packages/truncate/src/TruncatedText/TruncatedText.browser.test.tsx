import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { TruncatedText } from "./TruncatedText";

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
  "This is a long label that overflows a narrow fixed-width container";
const SHORT = "Short";

describe("TruncatedText real overflow (real browser)", () => {
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
});
