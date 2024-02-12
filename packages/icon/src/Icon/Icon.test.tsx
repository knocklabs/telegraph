import { render } from "@testing-library/react";
import { addSharp } from "ionicons/icons";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Icon } from "./Icon";

describe("Heading", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(
      <Icon icon={addSharp} alt="Create a workflow" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
  it("not including an alt prop should fail a11y", async () => {
    const { container } = render(
      // @ts-expect-error: expected as we're testing the a11y of the component
      <Icon icon={addSharp} />,
    );
    expect(await axe(container)).not.toHaveNoViolations();
  });
  it("default props applies correct className", () => {
    const { container } = render(
      <Icon icon={addSharp} alt="Create a workflow" />,
    );
    expect(container.firstChild).toHaveClass("h-4");
    expect(container.firstChild).toHaveClass("w-4");
    expect(container.firstChild).toHaveClass("text-3");
    expect(container.firstChild).toHaveClass("text-gray-12");
    expect(container.firstChild).toHaveClass("inline-block");
  });
  it("color prop applies correct className", () => {
    const { container } = render(
      <Icon icon={addSharp} alt="Create a workflow" color="red" />,
    );
    expect(container.firstChild).toHaveClass("text-red-11");
  });
  it("variant prop applies correct className", () => {
    const { container } = render(
      <Icon
        icon={addSharp}
        alt="Create a workflow"
        color="red"
        variant="secondary"
      />,
    );
    expect(container.firstChild).toHaveClass("text-red-10");
  });
  it("size prop applies correct className", () => {
    const { container } = render(
      <Icon icon={addSharp} alt="Create a workflow" size="9" />,
    );
    expect(container.firstChild).toHaveClass("text-9");
    expect(container.firstChild).toHaveClass("h-12");
    expect(container.firstChild).toHaveClass("w-12");
  });
});
