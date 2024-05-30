import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Lucide } from "../index";

import { Icon } from "./Icon";

describe("Heading", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(
      <Icon icon={Lucide.Bell} alt="Create a workflow" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
  it("icon without icon prop throws error", async () => {
    expect(() => render(<Icon alt="description" />)).toThrow(
      "@telegraph/icon: icon prop is required",
    );
  });
  it("icon without alt prop throws error", async () => {
    expect(() => render(<Icon icon={{ icon: Lucide.Bell }} />)).toThrow(
      "@telegraph/icon: alt prop is required",
    );
  });
  it("default props applies correct className", () => {
    const { container } = render(
      <Icon icon={Lucide.Bell} alt="Create a workflow" />,
    );
    expect(container.firstChild).toHaveClass("h-4");
    expect(container.firstChild).toHaveClass("w-4");
    expect(container.firstChild).toHaveClass("text-gray-12");
    expect(container.firstChild).toHaveClass("inline-block");
  });
  it("color prop applies correct className", () => {
    const { container } = render(
      <Icon icon={Lucide.Bell} alt="Create a workflow" color="red" />,
    );
    expect(container.firstChild).toHaveClass("text-red-11");
  });
  it("variant prop applies correct className", () => {
    const { container } = render(
      <Icon
        icon={Lucide.Bell}
        alt="Create a workflow"
        color="red"
        variant="secondary"
      />,
    );
    expect(container.firstChild).toHaveClass("text-red-10");
  });
  it("size prop applies correct className", () => {
    const { container } = render(
      <Icon icon={Lucide.Bell} alt="Create a workflow" size="9" />,
    );
    expect(container.firstChild).toHaveClass("h-12");
    expect(container.firstChild).toHaveClass("w-12");
  });
});
