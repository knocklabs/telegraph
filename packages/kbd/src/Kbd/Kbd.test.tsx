import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Kbd } from "./Kbd";

describe("Kbd", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(<Kbd label="Enter" />);
    expectToHaveNoViolations(await axe(container));
  });
  it("should contain the correct text", () => {
    const { getByText } = render(<Kbd label="K" />);
    expect(getByText("K")).toBeInTheDocument();
  });
  it("should contain the correct icon", () => {
    const { getByRole } = render(<Kbd label="ArrowRight" />);
    expect(getByRole("img")).toBeInTheDocument();
  });
  it("should respond to pressed state", async () => {
    const user = userEvent.setup();
    const { container } = render(<Kbd label="ArrowRight" />);
    const kbd = container.querySelector("[data-tgph-kbd]");
    // This user keyboard event holds the ArrowRight key down
    // with the `>` modifier.
    await user.keyboard("{ArrowRight>}");
    expect(kbd).toHaveStyle({
      "--background-color": "var(--tgph-gray-4)",
    });
    // Then `/` modifier releases the key.
    await user.keyboard("{/ArrowRight}");
    expect(kbd).toHaveStyle({
      "--background-color": "var(--tgph-surface-1)",
    });
  });
});
