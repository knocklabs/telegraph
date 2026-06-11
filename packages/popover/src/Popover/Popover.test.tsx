import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  createRef,
  useState,
} from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { Popover } from "./Popover";
import type { PopoverContentProps } from "./index";

type TestButtonProps = ComponentPropsWithoutRef<"button"> & {
  tgphRef?: Ref<HTMLButtonElement>;
};

const TestButton = ({
  tgphRef,
  type = "button",
  ...props
}: TestButtonProps) => {
  return <button ref={tgphRef} type={type} {...props} />;
};

afterEach(() => {
  cleanup();
});

describe("Popover", () => {
  describe("type inheritance", () => {
    it("accepts valid content-specific props", () => {
      const validProps: PopoverContentProps = {
        side: "bottom",
        sideOffset: 4,
        skipAnimation: true,
      };
      void validProps;
    });

    it("accepts inherited stack/layout props", () => {
      const validProps: PopoverContentProps = {
        gap: "2",
        padding: "4",
        rounded: "4",
        bg: "surface-1",
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on PopoverContentProps
      const invalidProp: PopoverContentProps = { invalidProp: "invalid" };
      void invalidProp;
    });
  });

  it("is accessible when open", async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content aria-label="Settings" skipAnimation>
          Settings content
        </Popover.Content>
      </Popover.Root>,
    );

    const dialog = await screen.findByRole("dialog");

    expectToHaveNoViolations(await axe(dialog));
  });

  it("opens and closes with the trigger in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover.Root onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content skipAnimation>Settings content</Popover.Content>
      </Popover.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open settings" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Settings content",
    );
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const ControlledPopover = () => {
      const [open, setOpen] = useState(false);

      return (
        <Popover.Root
          open={open}
          onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
        >
          <Popover.Trigger>
            <TestButton>Open settings</TestButton>
          </Popover.Trigger>
          <Popover.Content skipAnimation>Settings content</Popover.Content>
        </Popover.Root>
      );
    };

    render(<ControlledPopover />);

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Settings content",
    );
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("dismisses with Escape and outside pointer interactions", async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = vi.fn();
    const onPointerDownOutside = vi.fn();

    render(
      <>
        <button type="button">Outside</button>
        <Popover.Root defaultOpen>
          <Popover.Trigger>
            <TestButton>Open settings</TestButton>
          </Popover.Trigger>
          <Popover.Content
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            skipAnimation
          >
            Settings content
          </Popover.Content>
        </Popover.Root>
      </>,
    );

    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Open settings" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
  });

  it("keeps the popover open when legacy dismissal handlers prevent default", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Popover.Root defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content
          onEscapeKeyDown={(event) => event.preventDefault()}
          skipAnimation
        >
          Settings content
        </Popover.Content>
      </Popover.Root>,
    );

    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("returns focus to the trigger after dismissal", async () => {
    const user = userEvent.setup();

    render(
      <Popover.Root>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content skipAnimation>Settings content</Popover.Content>
      </Popover.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open settings" });

    await user.click(trigger);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("renders styled content in a scoped portal", async () => {
    const { container } = render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content data-testid="popover-content" skipAnimation>
          Settings content
        </Popover.Content>
      </Popover.Root>,
    );

    const content = await screen.findByTestId("popover-content");

    expect(content).toHaveClass("tgph");
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("role", "dialog");
    expect(content).toHaveStyle({
      transformOrigin: "var(--transform-origin)",
    });
    expect(container).not.toContainElement(content);
  });

  it("forwards trigger and content refs through tgphRef", async () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const triggerTgphRef = createRef<HTMLButtonElement>();
    const contentTgphRef = createRef<HTMLDivElement>();
    const contentStackRef = createRef<HTMLDivElement>();

    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger ref={triggerRef} tgphRef={triggerTgphRef}>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content
          contentStackRef={contentStackRef}
          tgphRef={contentTgphRef}
          skipAnimation
        >
          Settings content
        </Popover.Content>
      </Popover.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Open settings" });
    const content = await screen.findByRole("dialog");

    expect(triggerRef.current).toBe(trigger);
    expect(triggerTgphRef.current).toBe(trigger);
    expect(contentTgphRef.current).toBe(content);
    expect(contentStackRef.current).toBe(content);
  });
});
