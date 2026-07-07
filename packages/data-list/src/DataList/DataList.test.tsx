import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DataList } from "./DataList";

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DataList", () => {
  it("shows label descriptions through the migrated Tooltip", async () => {
    const user = userEvent.setup();

    render(
      <DataList.Label
        description="The unique identifier for this user"
        tooltipProps={{ delayDuration: 0, skipAnimation: true }}
      >
        User ID
      </DataList.Label>,
    );

    await user.hover(screen.getByText("User ID"));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "The unique identifier for this user",
    );
  });

  it("keeps the label tooltip disabled without a description", async () => {
    const user = userEvent.setup();

    render(
      <DataList.Label tooltipProps={{ delayDuration: 0, skipAnimation: true }}>
        User ID
      </DataList.Label>,
    );

    await user.hover(screen.getByText("User ID"));

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
