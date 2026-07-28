// Real cascade only. Which color a disabled track ends up with is decided by
// three stylesheets competing: Box declares `background-color:
// var(--background-color)`, Button flattens every disabled track to
// `--tgph-gray-3` with an equally specific rule, and Toggle wins it back with
// `!important`. jsdom does not resolve `var()` at all, so it cannot say which
// declaration won — only a real browser can. Toggle.browser.test.css loads the
// competing sheets, in the order that makes the `!important` load-bearing.
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { Toggle } from "./Toggle";
import "./Toggle.browser.test.css";

// From @telegraph/tokens, light appearance.
const BLUE_9 = "rgb(74, 130, 255)";
const GRAY_7 = "rgb(203, 207, 213)";
const GRAY_3 = "rgb(239, 240, 243)";

// The track is a Button.Root with no accessible identity of its own — it is
// labelled by the same text as the checkbox it controls, so `getByLabelText`
// would match both and trip the strict-locator rule. Reach it through the
// toggle root instead.
const trackOf = async (testId: string) => {
  const root = page.getByTestId(testId);
  await expect.element(root).toBeInTheDocument();
  const track = (root.element() as HTMLElement).querySelector(
    "[data-tgph-toggle-switch]",
  );
  return getComputedStyle(track as HTMLElement);
};

describe("Toggle disabled track (real browser)", () => {
  it("distinguishes a disabled toggle that is on from one that is off", async () => {
    await render(
      <>
        <Toggle.Default
          data-testid="on-locked"
          label="On, locked"
          defaultValue
          disabled
        />
        <Toggle.Default
          data-testid="off-locked"
          label="Off, locked"
          defaultValue={false}
          disabled
        />
      </>,
    );

    const on = await trackOf("on-locked");
    const off = await trackOf("off-locked");

    // The regression this file exists for: Button's blanket disabled rule
    // painted both tracks `--tgph-gray-3`, leaving thumb position as the only
    // cue that the toggle was on.
    expect(on.backgroundColor).not.toBe(off.backgroundColor);
    expect(on.backgroundColor).not.toBe(GRAY_3);
    expect(off.backgroundColor).not.toBe(GRAY_3);

    // On keeps its color token, off keeps the unchecked gray, and both read as
    // locked because they are dimmed.
    expect(on.backgroundColor).toBe(BLUE_9);
    expect(off.backgroundColor).toBe(GRAY_7);
    expect(on.opacity).toBe("0.5");
    expect(off.opacity).toBe("0.5");
  });

  it("leaves an enabled toggle at full strength", async () => {
    await render(
      <>
        <Toggle.Default data-testid="on" label="On" defaultValue />
        <Toggle.Default data-testid="off" label="Off" defaultValue={false} />
      </>,
    );

    const on = await trackOf("on");
    const off = await trackOf("off");

    // Same colors as the disabled pair above — dimming is the only difference,
    // so a disabled toggle reads as "on, but locked" rather than as a new state.
    expect(on.backgroundColor).toBe(BLUE_9);
    expect(off.backgroundColor).toBe(GRAY_7);
    expect(on.opacity).toBe("1");
    expect(off.opacity).toBe("1");
  });

  it("dims the color the consumer asked for, not just blue", async () => {
    await render(
      <Toggle.Default
        data-testid="green-locked"
        label="On, locked"
        color="green"
        defaultValue
        disabled
      />,
    );

    // --tgph-green-9. The fix reuses whatever token Button already resolved, so
    // every color survives being disabled, not just the default.
    expect((await trackOf("green-locked")).backgroundColor).toBe(
      "rgb(0, 170, 114)",
    );
  });
});
