import { render } from "@testing-library/react";
import { Bell } from "lucide-react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from "vitest";
import { axe, expectToHaveNoViolations } from "vitest.axe";

import { Button } from "./Button";
import type { ButtonProps, ButtonRootProps, ButtonTextProps } from "./Button";

// Suppress error from showing in console as we are testing for it
const consoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = consoleError;
});

describe("Button", () => {
  it("text button is accessible", async () => {
    const { container } = render(<Button>Click me</Button>);
    expectToHaveNoViolations(await axe(container));
  });
  it("icon button is accessible", async () => {
    const { container } = render(
      <Button
        leadingIcon={{ icon: Bell, alt: "create" }}
        trailingIcon={{ icon: Bell, alt: "create" }}
      >
        Click me
      </Button>,
    );
    expectToHaveNoViolations(await axe(container));
  });
  it("icon button without alt is inaccessible", async () => {
    // @ts-expect-error Testing error case
    render(<Button leadingIcon={{ icon: Bell }}>Click me</Button>);
    expect(console.error).toHaveBeenCalledWith(
      "@telegraph/icon: alt prop is required",
    );
  });
  it("alt text is optional if icon is aria hidden", async () => {
    const { container } = render(
      <Button leadingIcon={{ icon: Bell, "aria-hidden": true }}>
        Click me
      </Button>,
    );
    expectToHaveNoViolations(await axe(container));
  });
  it("icon in text button icon has correct text color", async () => {
    const { container } = render(
      <Button
        leadingIcon={{ icon: Bell, alt: "create" }}
        trailingIcon={{ icon: Bell, alt: "create" }}
        variant="soft"
      >
        Click me
      </Button>,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveStyle({
      "--color": "var(--tgph-gray-11)",
    });
  });
  it("icon in icon only button  has correct text color", async () => {
    const { container } = render(
      <Button icon={{ icon: Bell, alt: "create" }} variant="soft" />,
    );
    const icon = container?.querySelector("[data-button-icon]");
    expect(icon).toHaveStyle({
      "--color": "var(--tgph-gray-12)",
    });
  });
  it("icon-only button has correct layout", async () => {
    const { container } = render(
      <Button icon={{ icon: Bell, alt: "create" }} />,
    );
    expect(container.firstChild).toHaveAttribute(
      "data-tgph-button-layout",
      "icon-only",
    );
  });
  it("text button has correct layout", async () => {
    const { container } = render(
      <Button icon={{ icon: Bell, alt: "create" }}>Button</Button>,
    );
    expect(container.firstChild).toHaveAttribute(
      "data-tgph-button-layout",
      "default",
    );
  });
  it("disabled prop makes the button disabled", async () => {
    const { container } = render(
      <Button disabled icon={{ icon: Bell, alt: "create" }}>
        Button
      </Button>,
    );
    const text = container?.querySelector("[data-button-text]");
    const icon = container?.querySelector("[data-button-icon]");
    const button = container?.querySelector("[data-tgph-button]");

    expect(button).toBeDisabled();
    expect(text).toHaveStyle({
      "--color": "var(--tgph-gray-9)",
    });
    expect(icon).toHaveStyle({
      "--color": "var(--tgph-gray-8)",
    });
  });
  it("if a button set to an anchor is disabled, it turns into a button", () => {
    const { container } = render(
      <Button as="a" disabled>
        Button
      </Button>,
    );
    expect(container.firstChild?.nodeName).toBe("BUTTON");
  });
  it("default button should not submit form", () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <form onSubmit={handleSubmit}>
        <Button>Button</Button>
      </form>,
    );
    const button = container.querySelector("button");
    button?.click();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
  it("type=undefined should not submit form", () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const { container } = render(
      <form onSubmit={handleSubmit}>
        <Button type={undefined}>Submit</Button>
      </form>,
    );
    const button = container.querySelector("button");
    button?.click();
    expect(handleSubmit).not.toHaveBeenCalled();
  });
  it('type="submit" should submit form', () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const { container } = render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">Submit</Button>
      </form>,
    );
    const button = container.querySelector("button");
    button?.click();
    expect(handleSubmit).toHaveBeenCalled();
  });
  it("type=reset should RESET form", () => {
    const { container } = render(
      <form>
        <input name="foo" defaultValue="bar" />
        <Button type="reset">Reset</Button>
      </form>,
    );
    const input = container.querySelector(
      'input[name="foo"]',
    ) as HTMLInputElement;
    input.value = "changed";
    const button = container.querySelector("button");
    button?.click();
    expect(input.value).toBe("bar");
  });
  it('type prop is not passed when as="a"', () => {
    const { container } = render(
      <Button as="a" type="submit">
        Link Button
      </Button>,
    );
    const anchor = container.querySelector("a");
    expect(anchor).not.toHaveAttribute("type");
  });

  describe("type inheritance", () => {
    it("accepts valid polymorphic props", () => {
      expectTypeOf<ButtonProps<"a">["href"]>().toEqualTypeOf<
        string | undefined
      >();
      expectTypeOf<ButtonRootProps<"a">["href"]>().toEqualTypeOf<
        string | undefined
      >();
      expectTypeOf<ButtonTextProps<"span">["as"]>().toEqualTypeOf<
        "span" | undefined
      >();
    });

    it("accepts valid default button props", () => {
      const validAnchorProps: ButtonProps<"a"> = {
        as: "a",
        href: "/docs",
        children: "Docs",
      };
      expectTypeOf(validAnchorProps.href).toEqualTypeOf<
        string | undefined
      >();

      const validButtonProps: ButtonProps = {
        children: "Save",
        type: "button",
      };
      expectTypeOf(validButtonProps.type).toEqualTypeOf<
        "button" | "submit" | "reset" | undefined
      >();
    });

    it("rejects invalid prop values", () => {
      // @ts-expect-error invalid size token
      const invalidSize: ButtonProps = { size: "99" };
      void invalidSize;

      const invalidVariant: ButtonProps<"button"> = {
        as: "button",
        // @ts-expect-error invalid variant value
        variant: "invalid",
      };
      void invalidVariant;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on ButtonProps
      const invalidButtonProp: ButtonProps = { invalidProp: "invalid" };
      void invalidButtonProp;

      // @ts-expect-error unknown prop rejected on ButtonRootProps
      const invalidRootProp: ButtonRootProps = { invalidProp: "invalid" };
      void invalidRootProp;

      // @ts-expect-error unknown prop rejected on ButtonTextProps
      const invalidTextProp: ButtonTextProps = { invalidProp: "invalid" };
      void invalidTextProp;
    });

    it("rejects unknown props in JSX", () => {
      // @ts-expect-error unknown prop rejected on Button JSX
      const invalidButton = <Button invalidProp="invalid">Invalid</Button>;
      void invalidButton;

      // @ts-expect-error unknown prop rejected on Button.Root JSX
      const invalidRoot = <Button.Root invalidProp="invalid">Invalid</Button.Root>;
      void invalidRoot;

      // @ts-expect-error unknown prop rejected on Button.Text JSX
      const invalidText = <Button.Text invalidProp="invalid">Invalid</Button.Text>;
      void invalidText;
    });

    it("onClick accepts diverse handler types", () => {
      const mouseHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        void event;
      };
      const noArgHandler = () => {};
      const keyboardHandler = (event: KeyboardEvent) => {
        void event;
      };

      const withMouseHandler: ButtonRootProps = { onClick: mouseHandler };
      const withNoArgHandler: ButtonRootProps = { onClick: noArgHandler };
      const withKeyboardHandler: ButtonRootProps = {
        onClick: keyboardHandler,
      };
      void withMouseHandler;
      void withNoArgHandler;
      void withKeyboardHandler;
    });

    it("onClick accepts diverse handlers in JSX", () => {
      const keyboardHandler = (event: KeyboardEvent) => {
        void event;
      };
      const noArgHandler = () => {};

      const withKeyboard = (
        <Button onClick={keyboardHandler}>Click</Button>
      );
      const withNoArg = <Button onClick={noArgHandler}>Click</Button>;
      const withInline = (
        <Button onClick={() => console.log("clicked")}>Click</Button>
      );
      void withKeyboard;
      void withNoArg;
      void withInline;
    });

    it("onClick accepts diverse handlers on Button.Root JSX", () => {
      const keyboardHandler = (event: KeyboardEvent) => {
        void event;
      };

      const withKeyboard = (
        <Button.Root onClick={keyboardHandler}>Click</Button.Root>
      );
      const withInline = (
        <Button.Root onClick={() => {}}>Click</Button.Root>
      );
      void withKeyboard;
      void withInline;
    });

    it("inherits Stack layout props", () => {
      const withGap: ButtonRootProps = { gap: "2" };
      const withAlign: ButtonRootProps = { align: "center" };
      const withDirection: ButtonRootProps = { direction: "row" };
      void withGap;
      void withAlign;
      void withDirection;
    });

    it("inherits Box style props", () => {
      const withPadding: ButtonRootProps = { p: "2" };
      const withBg: ButtonRootProps = { bg: "surface-1" };
      const withRounded: ButtonRootProps = { rounded: "2" };
      void withPadding;
      void withBg;
      void withRounded;
    });
  });
});
