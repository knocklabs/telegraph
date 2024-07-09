import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Lucide } from "../index";

import { Icon } from "./Icon";

// Surpress error from showing in console as we are testing for it
const consoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = consoleError;
});

describe("Icon", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(
      <Icon icon={Lucide.Bell} alt="Create a workflow" />,
    );
    expectToHaveNoViolations(await axe(container));
  });
  it("icon without icon prop throws error", async () => {
    // @ts-expect-error Testing error case
    expect(() => render(<Icon alt="description" />)).toThrowError(
      "@telegraph/icon: icon prop is required",
    );
  });
  it("icon without alt prop throws error", async () => {
    expect(() =>
      // @ts-expect-error Testing error case
      render(<Icon icon={{ icon: Lucide.Bell }} />),
    ).toThrowError("@telegraph/icon: alt prop is required");
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
