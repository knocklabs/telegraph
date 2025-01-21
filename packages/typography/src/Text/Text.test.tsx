import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Text } from "./Text";

describe("Text", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(<Text as="p">Text</Text>);
    expectToHaveNoViolations(await axe(container));
  });
  it("size props applies correct className", () => {
    const { container } = render(
      <Text size="9" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--font-size": "var(--tgph-text-9)",
    });
  });
  it("color props applies correct className", () => {
    const { container } = render(
      <Text color="red" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--color": "var(--tgph-red-11)",
    });
  });
  it("align props applies correct className", () => {
    const { container } = render(
      <Text align="left" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--text-align": "left",
    });
  });
  it("weight props applies correct className", () => {
    const { container } = render(
      <Text weight="medium" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveStyle({
      "--weight": "var(--tgph-weight-medium)",
    });
  });
  it("default props applies correct className", () => {
    const { container } = render(<Text as="p">Text</Text>);
    expect(container.firstChild).toHaveStyle({
      "--color": "var(--tgph-gray-12)",
      "--font-size": "var(--tgph-text-2)",
      "--leading": "var(--tgph-leading-2)",
      "--tracking": "var(--tgph-tracking-2)",
      "--weight": "var(--tgph-weight-regular)",
    });
  });
});
