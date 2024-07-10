import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Heading } from "./Heading";

describe("Heading", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(<Heading as="h1">Heading</Heading>);
    expectToHaveNoViolations(await axe(container));
  });
  it("size props applies correct className", () => {
    const { container } = render(
      <Heading size="9" as="h1">
        Heading
      </Heading>,
    );
    expect(container.firstChild).toHaveClass("text-9");
  });
  it("color props applies correct className", () => {
    const { container } = render(
      <Heading color="red" as="h1">
        Heading
      </Heading>,
    );
    expect(container.firstChild).toHaveClass("text-red-11");
  });
  it("align props applies correct className", () => {
    const { container } = render(
      <Heading align="left" as="h1">
        Heading
      </Heading>,
    );
    expect(container.firstChild).toHaveClass("text-left");
  });
  it("default props applies correct className", () => {
    const { container } = render(<Heading as="h1">Heading</Heading>);
    expect(container.firstChild).toHaveClass("text-gray-12");
    expect(container.firstChild).toHaveClass("text-2");
    expect(container.firstChild).toHaveClass("leading-2");
    expect(container.firstChild).toHaveClass("tracking-2");
    expect(container.firstChild).toHaveClass("font-semi-bold");
  });
});
