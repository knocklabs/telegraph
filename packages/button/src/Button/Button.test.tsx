import { addSharp } from "@telegraph/icon";
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
        leadingIcon={{ icon: addSharp, alt: "create" }}
        trailingIcon={{ icon: addSharp, alt: "create" }}
      >
        Click me
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
  it("icon button without alt is inaccessible", async () => {
    const { container } = render(
      <Button leadingIcon={{ icon: addSharp }}>Click me</Button>,
    );
    expect(await axe(container)).not.toHaveNoViolations();
  });
  it("icon in text button icon has correct text color", async () => {
    const { container } = render(
      <Button
        leadingIcon={{ icon: addSharp, alt: "create" }}
        trailingIcon={{ icon: addSharp, alt: "create" }}
        variant="soft"
      >
        Click me
      </Button>,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveClass("text-gray-10");
  });
  it("icon in icon only button  has correct text color", async () => {
    const { container } = render(
      <Button icon={{ icon: addSharp, alt: "create" }} variant="soft" />,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveClass("text-gray-11");
  });
  it("overrides on text work", async () => {
    const { container } = render(
      <Button.Root>
        <Button.Text color="red" size="9">
          Click me
        </Button.Text>
      </Button.Root>,
    );

    expect(container.firstChild).toHaveClass("bg-gray-9");
    const text = container?.querySelector("[data-button-text]");
    expect(text).toHaveClass("text-red-11");
    expect(text).toHaveClass("text-9");
  });
  it("overrides on icon work", async () => {
    const { container } = render(
      <Button.Root>
        <Button.Icon color="red" size="9" icon={addSharp} alt="create" />
      </Button.Root>,
    );
    expect(container.firstChild).toHaveClass("bg-gray-9");
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveClass("text-red-11");
    expect(icon).toHaveClass("text-9");
  });
  it("icon-only button has correct layout", async () => {
    const { container } = render(
      <Button icon={{ icon: addSharp, alt: "create" }} />,
    );
    expect(container.firstChild).toHaveAttribute(
      "data-button-layout",
      "icon-only",
    );
  });
  it("text button has correct layout", async () => {
    const { container } = render(
      <Button icon={{ icon: addSharp, alt: "create" }}>Button</Button>,
    );
    expect(container.firstChild).toHaveAttribute(
      "data-button-layout",
      "default",
    );
  });
  it("disabled prop displays correct styles", async () => {
    const { container } = render(
      <Button disabled icon={{ icon: addSharp, alt: "create" }}>
        Button
      </Button>,
    );
    const text = container?.querySelector("[data-button-text]");
    const icon = container?.querySelector("[data-button-icon]");

    expect(container.firstChild).toHaveClass("cursor-not-allowed");
    expect(container.firstChild).toHaveClass("bg-gray-2");
    expect(text).toHaveClass("text-gray-9");
    expect(icon).toHaveClass("text-gray-8");
  });
});
