import React from "react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { render } from "@testing-library/react";

import { Heading } from "./Heading";

describe("Heading", () => {
  it("should render as expected", async () => {
    const { container } = render(<Heading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
