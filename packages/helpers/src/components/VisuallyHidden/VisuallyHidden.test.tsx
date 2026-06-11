import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders content with visually hidden styles", () => {
    render(<VisuallyHidden>Hidden label</VisuallyHidden>);

    expect(screen.getByText("Hidden label")).toHaveStyle({
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
    });
  });

  it("merges custom styles", () => {
    render(
      <VisuallyHidden style={{ whiteSpace: "normal" }}>
        Wrapped label
      </VisuallyHidden>,
    );

    expect(screen.getByText("Wrapped label")).toHaveStyle({
      whiteSpace: "normal",
    });
  });

  it("renders through TgphSlot when asChild is true", () => {
    render(
      <VisuallyHidden asChild>
        <label htmlFor="email">Email</label>
      </VisuallyHidden>,
    );

    expect(screen.getByText("Email").tagName).toBe("LABEL");
    expect(screen.getByText("Email")).toHaveAttribute("for", "email");
  });
});
