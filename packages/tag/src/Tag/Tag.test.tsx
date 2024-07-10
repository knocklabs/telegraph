import { render } from "@testing-library/react";
import { describe, it } from "vitest";
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
});
