// Real computed z-index only. Each stacked modal sets
// `z-index: calc(var(--tgph-zIndex-modal) + layer)` on its fixed layer.
// jsdom keeps that `calc()` as text and reports the same unresolved value for
// every layer, so a unit test cannot see which dialog the renderer paints on
// top. Chromium resolves the variable and the addition.
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { Modal } from "./Modal";
import { ModalStackingProvider } from "./ModalStacking";
import "./Modal.stacking.browser.test.css";

// `--tgph-zIndex-modal` from @telegraph/tokens.
const MODAL_Z_INDEX = 1400;

// The dialog node itself is `z-index: auto`. The integer lives on the fixed
// layer container above it — the element the stack actually paints with.
const resolvedLayerZIndex = (node: Element) => {
  let current: Element | null = node;

  while (current) {
    const zIndex = getComputedStyle(current).zIndex;

    if (zIndex !== "auto") {
      return Number(zIndex);
    }

    current = current.parentElement;
  }

  return Number.NaN;
};

const StackedModals = () => {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(true);
  const [confirmMounted, setConfirmMounted] = useState(true);

  return (
    <ModalStackingProvider>
      <Modal.Root
        a11yTitle="Outer modal"
        open={outerOpen}
        onOpenChange={setOuterOpen}
      >
        <Modal.Content data-testid="outer-layer">
          <Modal.Header>
            <Modal.Heading>Outer modal</Modal.Heading>
            <Modal.Close />
          </Modal.Header>
          <Modal.Body>Outer body</Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Modal.Root
        a11yTitle="Inner modal"
        open={innerOpen}
        onOpenChange={setInnerOpen}
      >
        <Modal.Content data-testid="inner-layer">
          <Modal.Header>
            <Modal.Heading>Inner modal</Modal.Heading>
            {/* Two close buttons share the accessible name, and the lower
                dialog is aria-hidden while a modal is stacked on it. */}
            <Modal.Close data-testid="inner-close" />
          </Modal.Header>
          <Modal.Body>Inner body</Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {confirmMounted && (
        <Modal.Root open a11yTitle="Confirm modal">
          <Modal.Content data-testid="confirm-layer">
            <Modal.Header>
              <Modal.Heading>Confirm modal</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <button type="button" onClick={() => setConfirmMounted(false)}>
                Unmount confirm
              </button>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
    </ModalStackingProvider>
  );
};

describe("Modal stacking z-index (real browser)", () => {
  it("paints each open layer above the one beneath it", async () => {
    await render(<StackedModals />);

    const outer = page.getByTestId("outer-layer");
    const inner = page.getByTestId("inner-layer");
    const confirm = page.getByTestId("confirm-layer");

    await expect.element(confirm).toBeVisible();

    await vi.waitFor(() => {
      expect(resolvedLayerZIndex(outer.element())).toBe(MODAL_Z_INDEX);
      expect(resolvedLayerZIndex(inner.element())).toBe(MODAL_Z_INDEX + 1);
      expect(resolvedLayerZIndex(confirm.element())).toBe(MODAL_Z_INDEX + 2);
    });

    const confirmElement = confirm.element() as HTMLElement;
    const confirmBox = confirmElement.getBoundingClientRect();
    const painted = document.elementFromPoint(
      confirmBox.left + confirmBox.width / 2,
      confirmBox.top + confirmBox.height / 2,
    );

    expect(confirmElement.contains(painted)).toBe(true);
  });

  it("keeps the modal beneath on top after a stacked modal unmounts while open", async () => {
    await render(<StackedModals />);

    const outer = page.getByTestId("outer-layer");
    const inner = page.getByTestId("inner-layer");
    const confirm = page.getByTestId("confirm-layer");

    await expect.element(confirm).toBeVisible();
    await userEvent.click(
      page.getByRole("button", { name: "Unmount confirm" }),
    );
    await expect.element(confirm).not.toBeInTheDocument();

    // Releasing the unmounted layer must not drop or reorder the ones still
    // open. A stale top id would also ignore the close click below.
    await vi.waitFor(() => {
      expect(resolvedLayerZIndex(outer.element())).toBe(MODAL_Z_INDEX);
      expect(resolvedLayerZIndex(inner.element())).toBe(MODAL_Z_INDEX + 1);
    });

    const innerElement = inner.element() as HTMLElement;
    const innerBox = innerElement.getBoundingClientRect();
    const painted = document.elementFromPoint(
      innerBox.left + innerBox.width / 2,
      innerBox.top + innerBox.height / 2,
    );

    expect(innerElement.contains(painted)).toBe(true);

    await userEvent.click(page.getByTestId("inner-close"));
    await expect.element(inner).not.toBeInTheDocument();

    await vi.waitFor(() => {
      expect(resolvedLayerZIndex(outer.element())).toBe(MODAL_Z_INDEX);
    });
  });
});
