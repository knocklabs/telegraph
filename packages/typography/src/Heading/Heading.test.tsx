import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Heading } from "./Heading";

describe("Heading", () => {
  it("should render as expected", async () => {
    const { container } = render(<Heading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
