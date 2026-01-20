import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTruncate } from "./useTruncate";

// Mock ResizeObserver since it's not available in test environment
let resizeCallback: ResizeObserverCallback | null = null;
const mockObserver = {
  observe() {},
  unobserve() {},
  disconnect() {},
} as ResizeObserver;

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

describe("useTruncate", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    resizeCallback = null;
  });

  it("returns false when element is not truncated", () => {
    // Mock the element properties
    const mockElement = document.createElement("div");
    Object.defineProperty(mockElement, "scrollWidth", { value: 50 });
    Object.defineProperty(mockElement, "clientWidth", { value: 100 });

    const TestComponent = () => {
      const ref = React.useRef(mockElement);
      const { truncated } = useTruncate({ tgphRef: ref });

      return (
        <div data-testid="truncated-value">{truncated ? "true" : "false"}</div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByTestId("truncated-value")).toHaveTextContent("false");
  });

  it("returns true when element is truncated", () => {
    // Mock the element properties
    const mockElement = document.createElement("div");
    Object.defineProperty(mockElement, "scrollWidth", { value: 200 });
    Object.defineProperty(mockElement, "clientWidth", { value: 100 });

    const TestComponent = () => {
      const ref = React.useRef(mockElement);
      const { truncated } = useTruncate({ tgphRef: ref });

      return (
        <div data-testid="truncated-value">{truncated ? "true" : "false"}</div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByTestId("truncated-value")).toHaveTextContent("true");
  });

  it("updates when dependencies change", async () => {
    // Create a mock element with a proxy to handle property access
    const mockElement = document.createElement("div");
    let currentScrollWidth = 50;

    const proxyElement = new Proxy(mockElement, {
      get(target, prop) {
        if (prop === "scrollWidth") {
          return currentScrollWidth;
        }
        if (prop === "clientWidth") {
          return 100;
        }
        return target[prop as keyof typeof target];
      },
    });

    const TestComponent = ({ width }: { width: string }) => {
      const ref = React.useRef(proxyElement);
      const { truncated } = useTruncate({ tgphRef: ref }, [width]);

      React.useEffect(() => {
        // Update the scrollWidth based on the width prop
        currentScrollWidth = width === "50px" ? 50 : 200;
        // Trigger the resize observer callback
        if (resizeCallback) {
          const mockEntry = {
            target: proxyElement,
            borderBoxSize: [{ blockSize: 0, inlineSize: 0 }],
            contentBoxSize: [{ blockSize: 0, inlineSize: 0 }],
            contentRect: new DOMRect(),
            devicePixelContentBoxSize: [{ blockSize: 0, inlineSize: 0 }],
          } as ResizeObserverEntry;
          resizeCallback([mockEntry], mockObserver);
        }
      }, [width]);

      return (
        <div data-testid="truncated-value">{truncated ? "true" : "false"}</div>
      );
    };

    const { rerender } = render(<TestComponent width="50px" />);
    expect(screen.getByTestId("truncated-value")).toHaveTextContent("false");

    // Rerender with new width and wait for state updates
    await act(async () => {
      rerender(<TestComponent width="200px" />);
      // Wait a tick for the effect to run
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByTestId("truncated-value")).toHaveTextContent("true");
  });

  it("handles null ref gracefully", () => {
    const TestComponent = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      const { truncated } = useTruncate({ tgphRef: ref });
      return (
        <div>
          <div>No ref attached</div>
          <div data-testid="truncated-value">
            {truncated ? "true" : "false"}
          </div>
        </div>
      );
    };

    render(<TestComponent />);
    expect(screen.getByTestId("truncated-value")).toHaveTextContent("false");
  });
});
