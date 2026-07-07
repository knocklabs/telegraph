import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Appearance,
  InvertedAppearance,
  OverrideAppearance,
} from "./useAppearance";

describe("Appearance", () => {
  it("applies appearance data attributes to the default wrapper", () => {
    render(
      <Appearance appearance="dark" data-testid="appearance">
        Content
      </Appearance>,
    );

    expect(screen.getByTestId("appearance")).toHaveAttribute(
      "data-tgph-appearance",
      "dark",
    );
  });

  it("merges props into the child when asChild is true", async () => {
    const childClick = vi.fn();
    const slotClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Appearance
        appearance="dark"
        asChild
        className="appearance"
        data-testid="appearance-button"
        onClick={slotClick}
      >
        <button className="child" onClick={childClick} type="button">
          Toggle
        </button>
      </Appearance>,
    );

    const button = screen.getByTestId("appearance-button");
    await user.click(button);

    expect(button).toHaveClass("appearance");
    expect(button).toHaveClass("child");
    expect(button).toHaveAttribute("data-tgph-appearance", "dark");
    expect(childClick).toHaveBeenCalledOnce();
    expect(slotClick).toHaveBeenCalledOnce();
  });

  it("applies explicit and inverted appearance data attributes", () => {
    render(
      <>
        <OverrideAppearance appearance="light" data-testid="override" />
        <InvertedAppearance appearance="light" data-testid="inverted" />
      </>,
    );

    expect(screen.getByTestId("override")).toHaveAttribute(
      "data-tgph-appearance",
      "light",
    );
    expect(screen.getByTestId("inverted")).toHaveAttribute(
      "data-tgph-appearance",
      "dark",
    );
  });
});
