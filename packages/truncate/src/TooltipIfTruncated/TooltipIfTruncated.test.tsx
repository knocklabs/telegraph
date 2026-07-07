import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentPropsWithoutRef, type Ref } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipIfTruncated } from "./TooltipIfTruncated";

type TestTriggerProps = ComponentPropsWithoutRef<"button"> & {
  tgphRef?: Ref<HTMLButtonElement>;
};

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const TestTrigger = ({
  tgphRef,
  type = "button",
  ...props
}: TestTriggerProps) => {
  return <button ref={tgphRef} type={type} {...props} />;
};

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);

  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get() {
      return Number(this.getAttribute("data-scroll-width") ?? 0);
    },
  });

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return Number(this.getAttribute("data-client-width") ?? 0);
    },
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("TooltipIfTruncated", () => {
  it("shows the tooltip when the child is truncated", async () => {
    const user = userEvent.setup();

    render(
      <TooltipIfTruncated delayDuration={0} skipAnimation>
        <TestTrigger data-scroll-width="200" data-client-width="100">
          Long value
        </TestTrigger>
      </TooltipIfTruncated>,
    );

    await user.hover(screen.getByRole("button", { name: "Long value" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Long value");
  });

  it("uses the explicit label when provided", async () => {
    const user = userEvent.setup();

    render(
      <TooltipIfTruncated
        delayDuration={0}
        label="Explicit tooltip label"
        skipAnimation
      >
        <TestTrigger data-scroll-width="200" data-client-width="100">
          Visible value
        </TestTrigger>
      </TooltipIfTruncated>,
    );

    await user.hover(screen.getByRole("button", { name: "Visible value" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Explicit tooltip label",
    );
  });

  it("uses React element child content as the tooltip label", async () => {
    const user = userEvent.setup();

    render(
      <TooltipIfTruncated delayDuration={0} skipAnimation>
        <TestTrigger data-scroll-width="200" data-client-width="100">
          <span>Element value</span>
        </TestTrigger>
      </TooltipIfTruncated>,
    );

    await user.hover(screen.getByRole("button", { name: "Element value" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Element value",
    );
  });

  it("opens from focus when truncated", async () => {
    const user = userEvent.setup();

    render(
      <TooltipIfTruncated delayDuration={0} skipAnimation>
        <TestTrigger data-scroll-width="200" data-client-width="100">
          Focus value
        </TestTrigger>
      </TooltipIfTruncated>,
    );

    await user.tab();

    expect(screen.getByRole("button", { name: "Focus value" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Focus value");
  });

  it("can suppress focus-triggered open while preserving hover", async () => {
    const user = userEvent.setup();

    render(
      <TooltipIfTruncated delayDuration={0} disableFocusOpen skipAnimation>
        <TestTrigger data-scroll-width="200" data-client-width="100">
          Hover only
        </TestTrigger>
      </TooltipIfTruncated>,
    );

    const trigger = screen.getByRole("button", { name: "Hover only" });

    await user.tab();

    expect(trigger).toHaveFocus();
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    await user.hover(trigger);

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Hover only");
  });

  it("keeps the tooltip disabled when the child is not truncated", async () => {
    const user = userEvent.setup();

    render(
      <TooltipIfTruncated delayDuration={0} skipAnimation>
        <TestTrigger data-scroll-width="80" data-client-width="100">
          Short value
        </TestTrigger>
      </TooltipIfTruncated>,
    );

    await user.hover(screen.getByRole("button", { name: "Short value" }));

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
