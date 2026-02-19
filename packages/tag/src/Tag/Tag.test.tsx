import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Tag } from "./Tag";
import type {
  DefaultProps as TagProps,
  RootProps as TagRootProps,
  TextProps as TagTextProps,
} from "./Tag";

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

  describe("type inheritance", () => {
    it("accepts valid tag-specific props", () => {
      const validProps: TagProps = {
        size: "1",
        color: "default",
        variant: "soft",
        children: "Tag",
      };
      void validProps;
    });

    it("accepts inherited stack/layout props on Root", () => {
      const validProps: TagRootProps = {
        gap: "2",
        padding: "1",
        display: "flex",
      };
      void validProps;
    });

    it("accepts inherited typography props on Text", () => {
      const validProps: TagTextProps<"span"> = {
        as: "span",
        size: "1",
        weight: "medium",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on TagProps
      const invalidProp: TagProps = { invalidProp: "invalid", children: "Tag" };
      void invalidProp;

      // @ts-expect-error unknown prop rejected on TagRootProps
      const invalidRootProp: TagRootProps = { invalidProp: "invalid" };
      void invalidRootProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Tag JSX
      const invalid = <Tag invalidProp="invalid">Tag</Tag>;
      void invalid;

      // @ts-expect-error unknown prop rejected on Tag.Root JSX
      const invalidRoot = <Tag.Root invalidProp="invalid" />;
      void invalidRoot;
    });
  });
});
