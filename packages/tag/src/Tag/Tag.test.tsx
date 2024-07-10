import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Tag } from "./Tag";

describe("Tag", () => {
  it("should render without a11y violations", async () => {
    const { container } = render(<Tag text="Tag" size="2" color="default" />);
    const results = await axe(container);
    expectToHaveNoViolations(results);
  });
  it("tag with button should render without a11y violations", async () => {
    const { container } = render(
      <Tag text="Tag" size="2" color="default" onCopy={() => {}} />,
    );
    const results = await axe(container);
    expectToHaveNoViolations(results);
  });
  it.each([
    "default",
    "accent",
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
  ] as Array<React.ComponentProps<typeof Tag>["color"]>)(
    "%s background color of tag should match the button color",
    (color) => {
      const { container } = render(
        <Tag text="Tag" size="2" color={color} onCopy={() => {}} />,
      );
      const tag = container.querySelector("[data-tag]");
      const button = container.querySelector("button");

      const tagBgClassName = tag?.className.match(/bg-(?!none)[^"\s]+/)?.[0];
      const buttonBgClassName = button?.className.match(/bg-(?!none)[^"\s]+/);

      expect(tagBgClassName).toEqual(buttonBgClassName![0]);
    },
  );
});
