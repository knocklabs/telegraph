import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { Modal } from "./Modal";

// Base UI runs its focus trap (FloatingFocusManager) with real focus/Tab
// handling and an rAF-scheduled initial focus. jsdom can't drive any of that,
// so Modal.test.tsx can only assert scroll-lock side effects — never that
// focus is actually contained. Real Chromium runs the trap for real: initial
// focus lands inside the dialog and Tab/Shift+Tab wrap within it instead of
// escaping to the page.
const TrapModal = () => (
  <Modal.Root open={true} a11yTitle="Settings">
    <Modal.Content>
      <Modal.Header>
        <Modal.Heading>Settings</Modal.Heading>
      </Modal.Header>
      <Modal.Body>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal.Body>
    </Modal.Content>
  </Modal.Root>
);

describe("Modal focus trap (real browser)", () => {
  it("moves focus into the dialog on open and traps Tab within it", async () => {
    render(<TrapModal />);

    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toBeInTheDocument();
    const dialogEl = dialog.element();

    // Base UI schedules initial focus on an animation frame after open, so poll
    // rather than assume it has landed synchronously.
    await vi.waitFor(() => {
      expect(dialogEl.contains(document.activeElement)).toBe(true);
    });

    // Tab past every control and around the end: the trap keeps focus inside
    // the dialog every step, never falling through to document.body. A loop is
    // used over an array method because each assertion runs between awaited
    // keypresses, which don't sequence cleanly through map/reduce.
    for (const tabNumber of [1, 2, 3, 4]) {
      await userEvent.tab();
      expect(
        dialogEl.contains(document.activeElement),
        `focus escaped the dialog after tab ${tabNumber}`,
      ).toBe(true);
    }

    // Shift+Tab is contained the same way.
    await userEvent.tab({ shift: true });
    expect(dialogEl.contains(document.activeElement)).toBe(true);
  });
});
