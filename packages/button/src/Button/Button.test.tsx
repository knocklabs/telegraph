import { Lucide } from "@telegraph/icon";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Button } from "./Button";

// Suppress error from showing in console as we are testing for it
const consoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = consoleError;
});

describe("Button", () => {
  it("text button is accessible", async () => {
    const { container } = render(<Button>Click me</Button>);
    expectToHaveNoViolations(await axe(container));
  });
  it("icon button is accessible", async () => {
    const { container } = render(
      <Button
        leadingIcon={{ icon: Lucide.Bell, alt: "create" }}
        trailingIcon={{ icon: Lucide.Bell, alt: "create" }}
      >
        Click me
      </Button>,
    );
    expectToHaveNoViolations(await axe(container));
  });
  it("icon button without alt is inaccessible", async () => {
    expect(() =>
      // @ts-expect-error Testing error case
      render(<Button leadingIcon={{ icon: Lucide.Bell }}>Click me</Button>),
    ).toThrow("@telegraph/icon: alt prop is required");
  });
  it("alt text is optional if icon is aria hidden", async () => {
    const { container } = render(
      <Button leadingIcon={{ icon: Lucide.Bell, "aria-hidden": true }}>
        Click me
      </Button>,
    );
    expectToHaveNoViolations(await axe(container));
  });
  it("icon in text button icon has correct text color", async () => {
    const { container } = render(
      <Button
        leadingIcon={{ icon: Lucide.Bell, alt: "create" }}
        trailingIcon={{ icon: Lucide.Bell, alt: "create" }}
        variant="soft"
      >
        Click me
      </Button>,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveClass("text-gray-11");
  });
  it("icon in icon only button  has correct text color", async () => {
    const { container } = render(
      <Button icon={{ icon: Lucide.Bell, alt: "create" }} variant="soft" />,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveClass("text-gray-12");
  });
  it("icon-only button has correct layout", async () => {
    const { container } = render(
      <Button icon={{ icon: Lucide.Bell, alt: "create" }} />,
    );
    expect(container.firstChild).toHaveAttribute(
      "data-tgph-button-layout",
      "icon-only",
    );
  });
  it("text button has correct layout", async () => {
    const { container } = render(
      <Button icon={{ icon: Lucide.Bell, alt: "create" }}>Button</Button>,
    );
    expect(container.firstChild).toHaveAttribute(
      "data-tgph-button-layout",
      "default",
    );
  });
  it("disabled prop makes the button disabled", async () => {
    const { container } = render(
      <Button disabled icon={{ icon: Lucide.Bell, alt: "create" }}>
        Button
      </Button>,
    );
    const text = container?.querySelector("[data-button-text]");
    const icon = container?.querySelector("[data-button-icon]");
    const button = container?.querySelector("[data-tgph-button]");

    expect(button).toBeDisabled();
    expect(text).toHaveClass("text-gray-9");
    expect(icon).toHaveClass("text-gray-8");
  });
  it("if a button set to an anchor is disabled, it turns into a button", () => {
    const { container } = render(
      <Button as="a" disabled>
        Button
      </Button>,
    );
    expect(container.firstChild?.nodeName).toBe("BUTTON");
  });
});
