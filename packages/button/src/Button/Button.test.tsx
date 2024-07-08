import { Lucide } from "@telegraph/icon";
import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Button } from "./Button";

describe("Button", () => {
  it("text button is accessible", async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
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
    expect(await axe(container)).toHaveNoViolations();
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

    expect(await axe(container)).toHaveNoViolations();
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
    expect(icon?.getAttribute("data-button-icon-color")).toBe("gray");
  });
  it("icon in icon only button  has correct text color", async () => {
    const { container } = render(
      <Button icon={{ icon: Lucide.Bell, alt: "create" }} variant="soft" />,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon?.getAttribute("data-button-icon-color")).toBe("gray");
  });
  it("overrides on text work", async () => {
    const { container } = render(
      <Button.Root>
        <Button.Text color="red" size="9">
          Click me
        </Button.Text>
      </Button.Root>,
    );

    const text = container?.querySelector("[data-button-text]");
    expect(text?.getAttribute("data-button-text-color")).toBe("red");
  });
  it("overrides on icon work", async () => {
    const { container } = render(
      <Button.Root>
        <Button.Icon color="red" size="9" icon={Lucide.Bell} alt="create" />
      </Button.Root>,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon?.getAttribute("data-button-icon-color")).toBe("red");
    expect(container.firstChild.getAttribute("data-tgph-button-color")).toBe(
      "gray",
    );
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
  it("disabled prop displays correct styles", async () => {
    const { container } = render(
      <Button disabled icon={{ icon: Lucide.Bell, alt: "create" }}>
        Button
      </Button>,
    );
    const text = container?.querySelector("[data-button-text]");
    const icon = container?.querySelector("[data-button-icon]");

    expect(text?.getAttribute("data-button-text-color")).toBe("disabled");
    expect(icon?.getAttribute("data-button-icon-color")).toBe("disabled");
    expect(container.firstChild).toHaveAttribute("disabled");
  });
});
