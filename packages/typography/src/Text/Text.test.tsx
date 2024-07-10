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
    expect(container.firstChild).toHaveClass("text-9");
  });
  it("color props applies correct className", () => {
    const { container } = render(
      <Text color="red" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveClass("text-red-11");
  });
  it("align props applies correct className", () => {
    const { container } = render(
      <Text align="left" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveClass("text-left");
  });
  it("weight props applies correct className", () => {
    const { container } = render(
      <Text weight="medium" as="p">
        Text
      </Text>,
    );
    expect(container.firstChild).toHaveClass("font-medium");
  });
  it("default props applies correct className", () => {
    const { container } = render(<Text as="p">Text</Text>);
    expect(container.firstChild).toHaveClass("text-gray-12");
    expect(container.firstChild).toHaveClass("text-2");
    expect(container.firstChild).toHaveClass("leading-2");
    expect(container.firstChild).toHaveClass("tracking-2");
    expect(container.firstChild).toHaveClass("font-regular");
  });
});
