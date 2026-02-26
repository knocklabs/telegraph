import { render, screen } from "@testing-library/react";
import { ArrowUpRight } from "lucide-react";
import { describe, expect, expectTypeOf, it } from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Link } from "./Link";
import type {
  LinkIconProps,
  LinkProps,
  LinkRootProps,
  LinkTextProps,
} from "./Link";

describe("Link", () => {
  it("default link is accessible", async () => {
    const { container } = render(<Link href="/docs">Docs</Link>);
    expectToHaveNoViolations(await axe(container));
  });

  it("link with trailing icon is accessible", async () => {
    const { container } = render(
      <Link href="/docs" icon={{ icon: ArrowUpRight, "aria-hidden": true }}>
        Docs
      </Link>,
    );
    expectToHaveNoViolations(await axe(container));
  });

  it("defaults to rendering an anchor element", () => {
    const { container } = render(<Link href="/docs">Docs</Link>);
    expect(container.querySelector("a")).toBeInTheDocument();
  });

  it("supports rendering polymorphically via as prop", () => {
    const { container } = render(
      <Link as="button" type="button">
        Docs
      </Link>,
    );
    expect(container.querySelector("button")).toBeInTheDocument();
  });

  it("forwards anchor attributes", () => {
    render(
      <Link href="/docs" target="_blank" rel="noreferrer">
        Docs
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders trailing icon when icon prop is provided", () => {
    const { container } = render(
      <Link href="/docs" icon={{ icon: ArrowUpRight, "aria-hidden": true }}>
        Docs
      </Link>,
    );
    expect(container.querySelector("[data-link-icon]")).toBeInTheDocument();
  });

  it("applies text and icon overrides through default props", () => {
    const { container } = render(
      <Link
        href="/docs"
        textProps={{ as: "strong", "data-testid": "text-node" }}
        icon={{ icon: ArrowUpRight, alt: "Docs link icon", size: "3" }}
      >
        Docs
      </Link>,
    );
    expect(container.querySelector("strong")).toBeInTheDocument();
    expect(screen.getByLabelText("Docs link icon")).toBeInTheDocument();
  });

  it("applies link data attributes for size/color/weight", () => {
    const { container } = render(
      <Link href="/docs" size="3" color="accent" weight="regular">
        Docs
      </Link>,
    );
    expect(container.firstChild).toHaveAttribute("data-tgph-link-size", "3");
    expect(container.firstChild).toHaveAttribute(
      "data-tgph-link-color",
      "accent",
    );
    expect(container.firstChild).toHaveAttribute(
      "data-tgph-link-weight",
      "regular",
    );
  });

  describe("type inheritance", () => {
    it("accepts valid polymorphic props", () => {
      expectTypeOf<LinkProps<"a">["href"]>().toEqualTypeOf<
        string | undefined
      >();
      expectTypeOf<LinkRootProps<"a">["href"]>().toEqualTypeOf<
        string | undefined
      >();
      expectTypeOf<LinkTextProps<"span">["as"]>().toEqualTypeOf<
        "span" | undefined
      >();
      expectTypeOf<LinkIconProps<"span">["as"]>().toEqualTypeOf<
        "span" | undefined
      >();
    });

    it("rejects invalid values on type level", () => {
      // @ts-expect-error invalid size
      const invalidSize: LinkProps = { size: "9" };
      void invalidSize;

      // @ts-expect-error invalid color
      const invalidColor: LinkProps = { color: "orange" };
      void invalidColor;

      // @ts-expect-error invalid weight
      const invalidWeight: LinkProps = { weight: "bold" };
      void invalidWeight;

      // @ts-expect-error underlined is not a public prop
      const invalidUnderlined: LinkProps = { underlined: true };
      void invalidUnderlined;

      // @ts-expect-error icon must be an icon props object
      const invalidIcon: LinkProps = { icon: true };
      void invalidIcon;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop
      const invalidLink = <Link unknownProp="invalid">Docs</Link>;
      void invalidLink;

      // @ts-expect-error unknown prop
      const invalidRoot = <Link.Root unknownProp="invalid">Docs</Link.Root>;
      void invalidRoot;

      // @ts-expect-error unknown prop
      const invalidText = <Link.Text unknownProp="invalid">Docs</Link.Text>;
      void invalidText;
    });
  });
});
