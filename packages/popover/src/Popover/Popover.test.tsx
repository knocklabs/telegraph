import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  createRef,
  useState,
} from "react";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { Popover } from "./Popover";
import type { PopoverContentProps } from "./index";

type PopoverRootActions = NonNullable<
  NonNullable<
    ComponentPropsWithoutRef<typeof Popover.Root>["actionsRef"]
  >["current"]
>;

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
        avoidCollisions: false,
        hideWhenDetached: true,
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

    // Compile-time check for KNO-14309, asserted by `tsc`/the IDE — `vitest`
    // does not typecheck, so these do not fail the jsdom run; the durable guard
    // is the shipped `ContentProps` types, which error in any consumer's
    // typecheck. Base UI hands dismiss handlers the native DOM event, but the
    // shim kept Radix's prop names. When ContentProps wrapped the generic
    // `Stack<T>` in an `Omit`, TypeScript stopped computing a contextual type
    // for these callbacks and their `event` widened to implicit `any` at the
    // JSX call site — letting a stale Radix handler read
    // `event.detail.originalEvent` and crash at runtime. These render nothing;
    // the handlers exist so `tsc` checks the inferred `event` type.
    it("infers concrete Event types for inline dismiss handlers", () => {
      const tree = (
        <Popover.Content
          onInteractOutside={(event) => {
            expectTypeOf(event).toEqualTypeOf<Event>();
          }}
          onPointerDownOutside={(event) => {
            expectTypeOf(event).toEqualTypeOf<
              MouseEvent | PointerEvent | TouchEvent
            >();
          }}
          onFocusOutside={(event) => {
            expectTypeOf(event).toEqualTypeOf<FocusEvent | KeyboardEvent>();
          }}
          onEscapeKeyDown={(event) => {
            expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
          }}
        />
      );
      void tree;
    });

    it("rejects stale Radix event.detail access in inline dismiss handlers", () => {
      const tree = (
        <Popover.Content
          onInteractOutside={(event) => {
            // @ts-expect-error KNO-14309: native Event has no `detail` object
            void event.detail.originalEvent.target;
          }}
        />
      );
      void tree;
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

  it("opens on hover when Base UI trigger hover props are passed", async () => {
    const user = userEvent.setup();

    render(
      <Popover.Root>
        <Popover.Trigger openOnHover delay={0} closeDelay={0}>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content skipAnimation>Settings content</Popover.Content>
      </Popover.Root>,
    );

    await user.hover(screen.getByRole("button", { name: "Open settings" }));

    expect(await screen.findByRole("dialog")).toHaveTextContent(
      "Settings content",
    );
  });

  it("preserves Base UI touch-aware default open focus", async () => {
    const user = userEvent.setup();

    render(
      <Popover.Root>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content>
          <input aria-label="Setting name" />
        </Popover.Content>
      </Popover.Root>,
    );

    await user.pointer({
      keys: "[TouchA]",
      target: screen.getByRole("button", { name: "Open settings" }),
    });

    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveFocus();
    expect(
      screen.getByRole("textbox", { name: "Setting name" }),
    ).not.toHaveFocus();
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

  it("lets legacy open autofocus handlers move focus", async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const onOpenAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
      inputRef.current?.focus();
    });

    render(
      <Popover.Root>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content onOpenAutoFocus={onOpenAutoFocus} skipAnimation>
          <input aria-label="Setting name" ref={inputRef} />
        </Popover.Content>
      </Popover.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    const input = await screen.findByRole("textbox", { name: "Setting name" });

    expect(input).toHaveFocus();
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
  });

  it("keeps animated content mounted while close motion starts", async () => {
    const user = userEvent.setup();
    const actionsRef: { current: PopoverRootActions | null } = {
      current: null,
    };
    const unmount = vi.fn();

    render(
      <Popover.Root actionsRef={actionsRef} defaultOpen>
        <Popover.Trigger>
          <TestButton>Open settings</TestButton>
        </Popover.Trigger>
        <Popover.Content data-testid="popover-content">
          Settings content
        </Popover.Content>
      </Popover.Root>,
    );

    await screen.findByTestId("popover-content");
    await waitFor(() => {
      expect(actionsRef.current).not.toBeNull();
    });

    actionsRef.current = {
      ...actionsRef.current,
      unmount,
    } as PopoverRootActions;

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    expect(screen.getByTestId("popover-content")).toHaveAttribute(
      "data-state",
      "closed",
    );
  });

  it("finishes the deferred close unmount if controlled content unmounts before animation completion", async () => {
    const user = userEvent.setup();
    const actionsRef: { current: PopoverRootActions | null } = {
      current: null,
    };
    const unmount = vi.fn();

    const ControlledPopover = () => {
      const [open, setOpen] = useState(true);

      return (
        <Popover.Root
          open={open}
          onOpenChange={setOpen}
          actionsRef={actionsRef}
        >
          <Popover.Trigger>
            <TestButton>Open settings</TestButton>
          </Popover.Trigger>
          {open && (
            <Popover.Content data-testid="popover-content">
              Settings content
            </Popover.Content>
          )}
        </Popover.Root>
      );
    };

    render(<ControlledPopover />);

    await screen.findByTestId("popover-content");
    await waitFor(() => {
      expect(actionsRef.current).not.toBeNull();
    });

    actionsRef.current = {
      ...actionsRef.current,
      unmount,
    } as PopoverRootActions;

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    await waitFor(() => {
      expect(unmount).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
  });

  it("keeps animated content mounted if the controlled root rerenders during close", async () => {
    const user = userEvent.setup();
    const unmount = vi.fn();
    const onAnimationComplete = vi.fn();
    let currentActions: PopoverRootActions | null = null;
    const actionsRef: { current: PopoverRootActions | null } = {
      get current() {
        return currentActions;
      },
      set current(nextActions) {
        currentActions = nextActions
          ? ({ ...nextActions, unmount } as PopoverRootActions)
          : null;
      },
    };

    const ControlledPopover = () => {
      const [open, setOpen] = useState(true);
      const [rerenderCount, setRerenderCount] = useState(0);

      return (
        <Popover.Root
          actionsRef={actionsRef}
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            setRerenderCount((count) => count + 1);
          }}
        >
          <span data-testid="rerender-count">{rerenderCount}</span>
          <Popover.Trigger>
            <TestButton>Open settings</TestButton>
          </Popover.Trigger>
          <Popover.Content
            data-testid="popover-content"
            onAnimationComplete={onAnimationComplete}
          >
            Settings content
          </Popover.Content>
        </Popover.Root>
      );
    };

    render(<ControlledPopover />);

    await screen.findByTestId("popover-content");
    await waitFor(() => {
      expect(actionsRef.current).not.toBeNull();
    });
    onAnimationComplete.mockClear();
    unmount.mockClear();

    await user.click(screen.getByRole("button", { name: "Open settings" }));

    await waitFor(() => {
      expect(screen.getByTestId("rerender-count")).toHaveTextContent("1");
    });
    expect(screen.getByTestId("popover-content")).toHaveAttribute(
      "data-state",
      "closed",
    );
    await waitFor(() => {
      expect(onAnimationComplete).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(unmount).toHaveBeenCalled();
    });

    expect(onAnimationComplete.mock.invocationCallOrder[0]).toBeLessThan(
      unmount.mock.invocationCallOrder[0],
    );
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
    // The z-index must sit on the Base UI positioner (the popup's parent and
    // stacking-context root) so popovers layer above positioned app content.
    expect(content.parentElement).toHaveStyle({
      zIndex: "var(--tgph-zIndex-popover)",
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
