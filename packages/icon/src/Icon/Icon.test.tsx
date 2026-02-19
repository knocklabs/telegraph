import { render } from "@testing-library/react";
import { Bell } from "lucide-react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Icon } from "./Icon";
import type { IconProps } from "./Icon";

// Suppress error from showing in console as we are testing for it
const consoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = consoleError;
});

describe("Icon", () => {
  it("should render without a11y issues", async () => {
    const { container } = render(<Icon icon={Bell} alt="Create a workflow" />);
    expectToHaveNoViolations(await axe(container));
  });
  it("icon without icon prop throws error", async () => {
    // @ts-expect-error Testing error case
    render(<Icon alt="description" />);
    expect(console.error).toHaveBeenCalledWith(
      "@telegraph/icon: icon prop is required",
    );
  });
  it("icon without alt prop throws error", async () => {
    // @ts-expect-error Testing error case
    render(<Icon icon={Bell} />);
    expect(console.error).toHaveBeenCalledWith(
      "@telegraph/icon: alt prop is required",
    );
  });
  it("default props applies correct className", () => {
    const { container } = render(<Icon icon={Bell} alt="Create a workflow" />);

    expect(container.firstChild).toHaveStyle({
      "--color": "var(--tgph-gray-12)",
      "--height": "var(--tgph-spacing-4)",
      "--width": "var(--tgph-spacing-4)",
    });
  });
  it("color prop applies correct className", () => {
    const { container } = render(
      <Icon icon={Bell} alt="Create a workflow" color="red" />,
    );

    expect(container.firstChild).toHaveStyle({
      "--color": "var(--tgph-red-11)",
    });
  });
  it("variant prop applies correct className", () => {
    const { container } = render(
      <Icon
        icon={Bell}
        alt="Create a workflow"
        color="red"
        variant="secondary"
      />,
    );

    expect(container.firstChild).toHaveStyle({
      "--color": "var(--tgph-red-10)",
    });
  });
  it("size prop applies correct className", () => {
    const { container } = render(
      <Icon icon={Bell} alt="Create a workflow" size="9" />,
    );

    expect(container.firstChild).toHaveStyle({
      "--height": "var(--tgph-spacing-12)",
      "--width": "var(--tgph-spacing-12)",
    });
  });

  describe("type inheritance", () => {
    it("accepts valid icon-specific props", () => {
      const validProps: IconProps = {
        icon: Bell,
        alt: "notification",
        size: "2",
        color: "default",
      };
      void validProps;
    });

    it("accepts valid layout props from Box", () => {
      const validProps: IconProps = {
        icon: Bell,
        alt: "notification",
        padding: "1",
        margin: "2",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on IconProps
      const invalidProp: IconProps = {
        icon: Bell,
        alt: "test",
        invalidProp: "invalid",
      };
      void invalidProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Icon JSX
      const invalid = <Icon icon={Bell} alt="test" invalidProp="invalid" />;
      void invalid;
    });
  });
});
