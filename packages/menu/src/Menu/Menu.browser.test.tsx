import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { Menu } from "./Menu";
import { TypeableTriggerExample } from "./Menu.fixtures";

// Reproduces KNO-14086 end-to-end: a typeable input composed inside
// Menu.Trigger that prevents the legacy openAutoFocus. Base UI defers its
// initial popup focus to a real animation frame, so this only reproduces in a
// headed browser with real vsync — every headless environment (jsdom,
// happy-dom, headless Chromium) fires that focus eagerly and hides the race.
// The old setTimeout(0) restore lost the race here (focus landed in the popup);
// the focusin bounce wins.
const TypeableTriggerMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Menu.Root open={open} onOpenChange={setOpen}>
      <Menu.Trigger nativeButton={false}>
        <div>
          <input aria-label="Filter" onChange={() => setOpen(true)} />
        </div>
      </Menu.Trigger>
      <Menu.Content onOpenAutoFocus={(event) => event.preventDefault()}>
        <Menu.Button>Item one</Menu.Button>
        <Menu.Button>Item two</Menu.Button>
      </Menu.Content>
    </Menu.Root>
  );
};

const waitFrames = (count: number) =>
  new Promise<void>((resolve) => {
    let remaining = count;
    const step = () => {
      remaining -= 1;
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

describe("Menu typeable trigger (real browser)", () => {
  it("keeps focus on the trigger input across Base UI's initial focus", async () => {
    render(<TypeableTriggerMenu />);
    const inputLocator = page.getByRole("textbox", { name: "Filter" });
    await expect.element(inputLocator).toBeInTheDocument();
    const input = inputLocator.element() as HTMLInputElement;

    input.focus();
    expect(document.activeElement).toBe(input);

    // Typing opens the menu; Base UI queues its initial focus for a later frame.
    await userEvent.keyboard("i");
    // Wait past the frame where Base UI's FloatingFocusManager runs its initial
    // focus — the bounce runs inside that same focus event.
    await waitFrames(4);

    // The fix keeps focus on the input. The old setTimeout(0) restore fired
    // before Base UI's frame and lost the race, so focus landed in the popup.
    expect(document.activeElement).toBe(input);

    // Continued typing must feed the input, not the menu's typeahead.
    await userEvent.keyboard("tem");
    await waitFrames(2);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe("item");
  });
});

// Drives the exact composition the Storybook `TypeableTrigger` story ships, the
// way a user would (real click + typing), so a broken demo can't slip through.
describe("Menu typeable trigger story (real browser)", () => {
  it("opens on click and keeps focus in the input while typing to filter", async () => {
    render(<TypeableTriggerExample />);
    const inputLocator = page.getByRole("textbox", {
      name: "Filter properties",
    });
    await expect.element(inputLocator).toBeInTheDocument();
    const input = inputLocator.element() as HTMLInputElement;

    await userEvent.click(input);
    await waitFrames(4);
    expect(document.activeElement, "focus after click").toBe(input);
    expect(
      document.querySelector('[role="menu"]'),
      "menu open after click",
    ).toBeTruthy();

    // Type one char at a time so the controlled input keeps up; keystrokes must
    // land in the input (not the menu typeahead) and focus must stay.
    for (const char of "workflow") {
      await userEvent.keyboard(char);
      await waitFrames(1);
    }
    expect(document.activeElement, "focus while typing").toBe(input);
    expect(input.value).toBe("workflow");
    // Filtered down to the two workflow.* options.
    expect(document.querySelectorAll('[role="menuitem"]').length).toBe(2);
  });
});
