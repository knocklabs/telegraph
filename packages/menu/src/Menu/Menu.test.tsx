import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChevronRight } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  createRef,
  useEffect,
  useState,
} from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { axe, expectToHaveNoViolations } from "../../../../vitest/axe";

import { Menu } from "./Menu";
import type {
  MenuButtonProps,
  MenuContentProps,
  MenuSubContentProps,
  MenuSubProps,
  MenuSubTriggerProps,
} from "./index";

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

const renderBasicMenu = ({
  defaultOpen,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) => {
  return render(
    <>
      <button type="button">Outside</button>
      <Menu.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content data-testid="menu-content">
          <Menu.Button onClick={() => {}}>Manage workflow</Menu.Button>
          <Menu.Button>Archive workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>
    </>,
  );
};

afterEach(() => {
  cleanup();
});

describe("Menu", () => {
  describe("type inheritance", () => {
    it("accepts valid content-specific props", () => {
      const validProps: MenuContentProps = {
        sideOffset: 4,
      };
      void validProps;
    });

    it("accepts inherited stack/layout props", () => {
      const validProps: MenuContentProps = {
        gap: "2",
        padding: "4",
        rounded: "4",
        bg: "surface-1",
      };
      void validProps;
    });

    it("accepts skipAnimation for Popover API parity", () => {
      const validProps: MenuContentProps = {
        skipAnimation: true,
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on MenuContentProps
      const invalidProp: MenuContentProps = { invalidProp: "invalid" };
      void invalidProp;
    });
  });

  describe("Sub type inheritance", () => {
    it("accepts controlled open props", () => {
      const validProps: MenuSubProps = {
        open: true,
        onOpenChange: () => {},
      };
      void validProps;
    });

    it("accepts defaultOpen for uncontrolled use", () => {
      const validProps: MenuSubProps = { defaultOpen: true };
      void validProps;
    });

    it("rejects mistyped known props", () => {
      // @ts-expect-error open must be a boolean, not a string
      const invalidProps: MenuSubProps = { open: "yes" };
      void invalidProps;
    });
  });

  describe("SubTrigger type inheritance", () => {
    it("accepts menu-item props (icon, disabled, children)", () => {
      const validProps: MenuSubTriggerProps = {
        leadingIcon: { icon: ChevronRight, "aria-hidden": true },
        trailingIcon: { icon: ChevronRight, "aria-hidden": true },
        disabled: true,
        children: "Recent files",
      };
      void validProps;
    });

    it("rejects mistyped known props", () => {
      // @ts-expect-error disabled must be a boolean, not a string
      const invalidProp: MenuSubTriggerProps = { disabled: "yes" };
      void invalidProp;
    });
  });

  describe("SubContent type inheritance", () => {
    it("accepts positioning and stack/layout props", () => {
      const validProps: MenuSubContentProps = {
        sideOffset: 0,
        alignOffset: -4,
        gap: "2",
        rounded: "4",
      };
      void validProps;
    });

    it("rejects mistyped known props", () => {
      // @ts-expect-error sideOffset must be a number, not a string
      const invalidProp: MenuSubContentProps = { sideOffset: "4" };
      void invalidProp;
    });
  });

  it("is accessible when open", async () => {
    renderBasicMenu({ defaultOpen: true });

    const menu = await screen.findByRole("menu");

    expectToHaveNoViolations(await axe(menu));
  });

  it("opens and closes with the trigger in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    renderBasicMenu({ onOpenChange });

    const trigger = screen.getByRole("button", {
      name: "Workflow actions",
    });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(await screen.findByRole("menu")).toHaveTextContent(
      "Manage workflow",
    );
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const ControlledMenu = () => {
      const [open, setOpen] = useState(false);

      return (
        <Menu.Root
          open={open}
          onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
        >
          <Menu.Trigger>
            <TestButton>Workflow actions</TestButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Button>Manage workflow</Menu.Button>
          </Menu.Content>
        </Menu.Root>
      );
    };

    render(<ControlledMenu />);

    await user.click(screen.getByRole("button", { name: "Workflow actions" }));

    expect(await screen.findByRole("menu")).toHaveTextContent(
      "Manage workflow",
    );
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("lets a custom trigger click handler own open state changes", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <Menu.Root onOpenChange={onOpenChange}>
        <Menu.Trigger onClick={onClick}>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button>Manage workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Workflow actions" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("dismisses with Escape and outside pointer interactions", async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = vi.fn();
    const onPointerDownOutside = vi.fn();

    render(
      <>
        <button type="button">Outside</button>
        <Menu.Root defaultOpen>
          <Menu.Trigger>
            <TestButton>Workflow actions</TestButton>
          </Menu.Trigger>
          <Menu.Content
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
          >
            <Menu.Button>Manage workflow</Menu.Button>
          </Menu.Content>
        </Menu.Root>
      </>,
    );

    await screen.findByRole("menu");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Workflow actions" }));
    await screen.findByRole("menu");
    await user.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
  });

  it("keeps the menu open when legacy dismissal handlers prevent default", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Menu.Root defaultOpen onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content onEscapeKeyDown={(event) => event.preventDefault()}>
          <Menu.Button>Manage workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await screen.findByRole("menu");
    await user.keyboard("{Escape}");

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("keeps submenu content open when submenu dismissal handlers prevent default", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSubmenuEscapeKeyDown = vi.fn((event: KeyboardEvent) => {
      event.preventDefault();
    });

    render(
      <Menu.Root defaultOpen onOpenChange={onOpenChange}>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content data-testid="root-content">
          <Menu.Sub defaultOpen>
            <Menu.SubTrigger>Share</Menu.SubTrigger>
            <Menu.SubContent
              data-testid="submenu-content"
              onEscapeKeyDown={onSubmenuEscapeKeyDown}
            >
              <Menu.Button>Copy link</Menu.Button>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>,
    );

    await screen.findByTestId("submenu-content");
    screen.getByRole("menuitem", { name: "Copy link" }).focus();
    await user.keyboard("{Escape}");

    expect(onSubmenuEscapeKeyDown).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("root-content")).toBeInTheDocument();
    expect(screen.getByTestId("submenu-content")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("lets submenu content close when parent dismissal handlers prevent default", async () => {
    const user = userEvent.setup();
    const onRootEscapeKeyDown = vi.fn((event: KeyboardEvent) => {
      event.preventDefault();
    });
    const onSubmenuOpenChange = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content
          data-testid="root-content"
          onEscapeKeyDown={onRootEscapeKeyDown}
        >
          <Menu.Sub defaultOpen onOpenChange={onSubmenuOpenChange}>
            <Menu.SubTrigger>Share</Menu.SubTrigger>
            <Menu.SubContent data-testid="submenu-content">
              <Menu.Button>Copy link</Menu.Button>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>,
    );

    await screen.findByTestId("submenu-content");
    screen.getByRole("menuitem", { name: "Copy link" }).focus();
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByTestId("submenu-content")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("root-content")).toBeInTheDocument();
    expect(onRootEscapeKeyDown).not.toHaveBeenCalled();
    expect(onSubmenuOpenChange).toHaveBeenCalledWith(false);
  });

  it("keeps parent dismissal handlers after submenu content unmounts", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onPointerDownOutside = vi.fn((event: Event) => {
      event.preventDefault();
    });

    const ControlledSubmenu = () => {
      const [submenuOpen, setSubmenuOpen] = useState(true);

      useEffect(() => {
        setSubmenuOpen(false);
      }, []);

      return (
        <>
          <button type="button">Outside</button>
          <Menu.Root defaultOpen onOpenChange={onOpenChange}>
            <Menu.Trigger>
              <TestButton>Workflow actions</TestButton>
            </Menu.Trigger>
            <Menu.Content onPointerDownOutside={onPointerDownOutside}>
              <Menu.Button>Parent action</Menu.Button>
              <Menu.Sub open={submenuOpen} onOpenChange={setSubmenuOpen}>
                <Menu.SubTrigger>Share</Menu.SubTrigger>
                <Menu.SubContent data-testid="submenu-content">
                  <Menu.Button>Copy link</Menu.Button>
                </Menu.SubContent>
              </Menu.Sub>
            </Menu.Content>
          </Menu.Root>
        </>
      );
    };

    render(<ControlledSubmenu />);

    await waitFor(() => {
      expect(screen.queryByTestId("submenu-content")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Outside" }));

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("returns focus to the trigger after dismissal", async () => {
    const user = userEvent.setup();

    renderBasicMenu();

    const trigger = screen.getByRole("button", {
      name: "Workflow actions",
    });

    await user.click(trigger);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("lets legacy open autofocus handlers move focus", async () => {
    const user = userEvent.setup();
    const archiveRef = createRef<HTMLElement>();
    const onOpenAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
      archiveRef.current?.focus();
    });

    render(
      <Menu.Root>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content onOpenAutoFocus={onOpenAutoFocus}>
          <Menu.Button>Manage workflow</Menu.Button>
          <Menu.Button tgphRef={archiveRef}>Archive workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Workflow actions" }));

    const archiveItem = await screen.findByRole("menuitem", {
      name: "Archive workflow",
    });

    await waitFor(() => {
      expect(archiveItem).toHaveFocus();
    });
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
  });

  it("renders styled content in a scoped portal", async () => {
    const { container } = renderBasicMenu({ defaultOpen: true });

    const content = await screen.findByTestId("menu-content");

    expect(content).toHaveClass("tgph");
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("role", "menu");
    expect(content).toHaveStyle({
      outline: "none",
    });
    expect(content).toHaveStyle({
      transformOrigin: "var(--transform-origin)",
    });
    expect(content).toHaveStyle({
      "--radix-popper-transform-origin": "var(--transform-origin)",
    });
    expect(content.parentElement).toHaveStyle({
      zIndex: "var(--tgph-zIndex-popover)",
    });
    expect(
      screen.getByRole("menuitem", { name: "Manage workflow" }),
    ).toHaveStyle({
      outline: "none",
    });
    expect(container).not.toContainElement(content);
  });

  it("consumes skipAnimation instead of leaking it to the DOM", async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content data-testid="menu-content" skipAnimation>
          <Menu.Button>Manage workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const content = await screen.findByTestId("menu-content");

    // Menu accepts skipAnimation for Popover parity but must not forward it to
    // the DOM node, which would trigger React's unknown-prop warning.
    expect(content).not.toHaveAttribute("skipanimation");
  });

  it("forwards trigger and content refs through tgphRef", async () => {
    const triggerRef = createRef<HTMLElement>();
    const triggerTgphRef = createRef<HTMLElement>();
    const contentTgphRef = createRef<HTMLDivElement>();
    const contentStackRef = createRef<HTMLDivElement>();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger ref={triggerRef} tgphRef={triggerTgphRef}>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content
          contentStackRef={contentStackRef}
          data-testid="menu-content"
          tgphRef={contentTgphRef}
        >
          <Menu.Button>Manage workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const trigger = screen.getByRole("button", { name: "Workflow actions" });
    const content = await screen.findByTestId("menu-content");

    expect(triggerRef.current).toBe(trigger);
    expect(triggerTgphRef.current).toBe(trigger);
    expect(contentTgphRef.current).toBe(content);
    expect(contentStackRef.current).toBe(content);
  });

  it("focuses the first item from an open trigger with ArrowDown", async () => {
    const user = userEvent.setup();

    renderBasicMenu();

    const trigger = screen.getByRole("button", {
      name: "Workflow actions",
    });

    await user.click(trigger);
    const firstItem = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    trigger.focus();
    expect(trigger).toHaveFocus();

    await user.keyboard("[ArrowDown]");

    expect(firstItem).toHaveFocus();
  });

  it("focuses the first item when an open trigger consumer prevents ArrowDown", async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root>
        <Menu.Trigger onKeyDown={(event) => event.preventDefault()}>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button>Manage workflow</Menu.Button>
          <Menu.Button>Archive workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const trigger = screen.getByRole("button", {
      name: "Workflow actions",
    });

    await user.click(trigger);
    const firstItem = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    await user.keyboard("[ArrowDown]");

    expect(firstItem).toHaveFocus();
  });

  it("focuses the first item from nested focusable trigger content", async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root>
        <Menu.Trigger>
          <TestButton data-testid="trigger">
            <span>Workflow actions</span>
            <span tabIndex={0}>Email tag</span>
          </TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button>Manage workflow</Menu.Button>
          <Menu.Button>Archive workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(screen.getByTestId("trigger"));
    const firstItem = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    screen.getByText("Email tag").focus();
    await user.keyboard("[ArrowDown]");

    expect(firstItem).toHaveFocus();
  });

  it("opens from nested focusable trigger content with Base UI keyboard handling", async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root>
        <Menu.Trigger>
          <TestButton data-testid="trigger">
            <span>Workflow actions</span>
            <span tabIndex={0}>Email tag</span>
          </TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button>Manage workflow</Menu.Button>
          <Menu.Button>Archive workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    screen.getByText("Email tag").focus();
    await user.keyboard("[ArrowDown]");

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Manage workflow" }),
    ).toBeInTheDocument();
  });

  it("fires item handlers once and closes by default", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSelect = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button onClick={onClick} onSelect={onSelect}>
            Manage workflow
          </Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(
      await screen.findByRole("menuitem", { name: "Manage workflow" }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("fires item keyboard handlers from a focused item", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button onKeyDown={onKeyDown}>Manage workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    item.focus();
    await user.keyboard("[Enter]");

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("fires keyboard handlers for option-role items", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button
            aria-selected="true"
            data-tgph-combobox-option
            data-tgph-combobox-option-value="email"
            onKeyDown={onKeyDown}
            role="option"
          >
            Email
          </Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = await screen.findByRole("option", { name: "Email" });

    item.focus();
    await user.keyboard("[Enter]");

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("fires select once from keyboard selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button onSelect={onSelect}>Manage workflow</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    item.focus();
    await user.keyboard("[Enter]");

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("does not double-call a shared keydown and select handler", async () => {
    const user = userEvent.setup();
    const handleSelection = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button
            onKeyDown={
              handleSelection as NonNullable<MenuButtonProps["onKeyDown"]>
            }
            onSelect={
              handleSelection as NonNullable<MenuButtonProps["onSelect"]>
            }
          >
            Manage workflow
          </Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    item.focus();
    await user.keyboard("[Enter]");

    expect(handleSelection).toHaveBeenCalledTimes(1);
  });

  it("falls back to keyboard activation when native keydown propagation is stopped", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    const onSelect = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button onKeyDown={onKeyDown} onSelect={onSelect}>
            Manage workflow
          </Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    item.addEventListener("keydown", (event) => event.stopPropagation());
    item.focus();
    await user.keyboard("[Enter]");

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
    expect(onKeyDown).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("does not reselect from the native keyboard click when keydown prevents default", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((event) => event.preventDefault());
    const onSelect = vi.fn();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button onKeyDown={onKeyDown} onSelect={onSelect}>
            Manage workflow
          </Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    const item = await screen.findByRole("menuitem", {
      name: "Manage workflow",
    });

    item.focus();
    await user.keyboard("[Enter]");

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("keeps the menu open when item handlers prevent default", async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button onSelect={(event) => event.preventDefault()}>
            Keep open
          </Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(
      await screen.findByRole("menuitem", { name: "Keep open" }),
    );

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("respects closeOnClick=false", async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Button closeOnClick={false}>Keep open</Menu.Button>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(
      await screen.findByRole("menuitem", { name: "Keep open" }),
    );

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders controlled submenu state and compatibility attributes", async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <TestButton>Workflow actions</TestButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Sub defaultOpen>
            <Menu.SubTrigger>Share</Menu.SubTrigger>
            <Menu.SubContent data-testid="submenu-content">
              <Menu.Button>Copy link</Menu.Button>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>,
    );

    const trigger = await screen.findByRole("menuitem", { name: "Share" });
    const submenu = await screen.findByTestId("submenu-content");

    expect(trigger).toHaveAttribute("data-state", "open");
    expect(submenu).toHaveClass("tgph");
    expect(submenu).toHaveAttribute("role", "menu");
    expect(submenu).toHaveAttribute("data-side", "right");
    expect(submenu).toHaveAttribute("data-align", "start");
  });
});
