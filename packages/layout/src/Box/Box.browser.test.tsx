// Real parsing only. A directional border color expands into the four-value
// `--border-color`, and whether that value is legal CSS is the whole question:
// `border-color: 0 0 <color> 0` is invalid, so the browser drops the
// declaration and the border paints in `currentColor` instead of the token.
// jsdom stores custom properties as text and never resolves `var()`, so it
// reports the same string either way and cannot see the fallback (KNO-14699).
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { Box } from "./Box";
import "./Box.browser.test.css";

// From @telegraph/tokens.
const GRAY_4 = "rgb(230, 232, 235)";
const GRAY_5 = "rgb(223, 226, 229)";
const DARK_GRAY_4 = "rgb(40, 42, 45)";
const TRANSPARENT = "rgba(0, 0, 0, 0)";

// The color a broken directional prop falls back to. Deliberately not a token,
// so a passing assertion cannot be currentColor by coincidence. It is set on a
// plain `div` wrapper rather than a Box because Box has no prop that paints
// `color` — the inherited value is the whole point of these assertions.
const CURRENT_COLOR = "rgb(255, 0, 255)";

const borderOf = async (testId: string) => {
  const box = page.getByTestId(testId);
  await expect.element(box).toBeInTheDocument();
  return getComputedStyle(box.element() as HTMLElement);
};

describe("Box directional border colors (real browser)", () => {
  it("paints the token on the edge it names, not the text color", async () => {
    await render(
      <div style={{ color: CURRENT_COLOR }}>
        <Box
          data-testid="bottom-only"
          borderStyle="solid"
          borderWidth="px"
          borderBottomColor="gray-4"
        />
      </div>,
    );

    const border = await borderOf("bottom-only");

    expect(border.borderBottomColor).toBe(GRAY_4);
    expect(border.borderBottomColor).not.toBe(CURRENT_COLOR);
  });

  it("draws nothing on the sides it does not name", async () => {
    await render(
      <div style={{ color: CURRENT_COLOR }}>
        <Box
          data-testid="unset-sides"
          borderStyle="solid"
          borderWidth="px"
          borderBottomColor="gray-4"
        />
      </div>,
    );

    const border = await borderOf("unset-sides");

    expect(border.borderTopColor).toBe(TRANSPARENT);
    expect(border.borderLeftColor).toBe(TRANSPARENT);
    expect(border.borderRightColor).toBe(TRANSPARENT);
  });

  it("keeps a base borderColor on the sides a directional prop leaves alone", async () => {
    await render(
      <div style={{ color: CURRENT_COLOR }}>
        <Box
          data-testid="base-plus-directional"
          borderStyle="solid"
          borderWidth="px"
          borderColor="gray-5"
          borderBottomColor="gray-4"
        />
      </div>,
    );

    const border = await borderOf("base-plus-directional");

    expect(border.borderBottomColor).toBe(GRAY_4);
    expect(border.borderTopColor).toBe(GRAY_5);
    expect(border.borderLeftColor).toBe(GRAY_5);
    expect(border.borderRightColor).toBe(GRAY_5);
  });

  it("resolves the token in the dark appearance too", async () => {
    await render(
      <div data-tgph-appearance="dark" style={{ color: CURRENT_COLOR }}>
        <Box
          data-testid="dark-bottom"
          borderStyle="solid"
          borderWidth="px"
          borderBottomColor="gray-4"
        />
      </div>,
    );

    const border = await borderOf("dark-bottom");

    expect(border.borderBottomColor).toBe(DARK_GRAY_4);
  });

  it("still expands a directional width against a 0 neutral", async () => {
    await render(
      <Box
        data-testid="bottom-width"
        borderStyle="solid"
        borderBottomWidth="px"
        borderColor="gray-4"
      />,
    );

    const border = await borderOf("bottom-width");

    expect(border.borderBottomWidth).toBe("1px");
    expect(border.borderTopWidth).toBe("0px");
  });
});
