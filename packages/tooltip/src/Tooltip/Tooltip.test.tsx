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

import { Tooltip } from "./Tooltip";
import type { TooltipProps } from "./Tooltip";
import { TooltipGroupProvider } from "./Tooltip.hooks";

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

describe("Tooltip", () => {
  describe("type inheritance", () => {
    it("accepts valid tooltip-specific props", () => {
      const validProps: TooltipProps = {
        label: "Tooltip text",
        side: "top",
        enabled: true,
        children: null,
      };
      void validProps;
    });

    it("accepts disableFocusOpen prop", () => {
      const propsWithDisableFocusOpen: TooltipProps = {
        label: "Tooltip text",
        disableFocusOpen: true,
        children: null,
      };
      void propsWithDisableFocusOpen;
    });

    it("accepts legacy wrapper passthrough props", () => {
      const validProps: TooltipProps = {
        label: "Tooltip text",
        asChild: true,
        style: { zIndex: 9999 },
        children: null,
      };
      void validProps;
    });

    it("rejects unknown props on type level", () => {
      // @ts-expect-error unknown prop rejected on TooltipProps
      const invalidProp: TooltipProps = {
        label: "test",
        invalidProp: "invalid",
        children: null,
      };
      void invalidProp;
    });
  });

  it("opens and closes on hover in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Tooltip
        label="Helpful context"
        delayDuration={0}
        onOpenChange={onOpenChange}
        skipAnimation
      >
        <TestButton>Hover target</TestButton>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hover target" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-state", "closed");

    await user.hover(trigger);

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Helpful context",
    );
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-state", "closed");
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const ControlledTooltip = () => {
      const [open, setOpen] = useState(false);

      return (
        <Tooltip
          label="Controlled context"
          delayDuration={0}
          open={open}
          onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen);
            setOpen(nextOpen);
          }}
          skipAnimation
        >
          <TestButton>Hover target</TestButton>
        </Tooltip>
      );
    };

    render(<ControlledTooltip />);

    await user.hover(screen.getByRole("button", { name: "Hover target" }));

    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Controlled context",
    );
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("keeps disabled tooltips closed", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        defaultOpen
        enabled={false}
        label="Hidden context"
        delayDuration={0}
        skipAnimation
      >
        <TestButton>Hover target</TestButton>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button", { name: "Hover target" }));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("dismisses with Escape", async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = vi.fn();

    render(
      <>
        <button type="button">Outside</button>
        <Tooltip
          defaultOpen
          label="Dismissible context"
          onEscapeKeyDown={onEscapeKeyDown}
          skipAnimation
        >
          <TestButton>Hover target</TestButton>
        </Tooltip>
      </>,
    );

    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1);
  });

  it("dismisses with outside pointer interactions", async () => {
    const user = userEvent.setup();
    const onPointerDownOutside = vi.fn();

    render(
      <>
        <button type="button">Outside</button>
        <Tooltip
          defaultOpen
          label="Dismissible context"
          onPointerDownOutside={onPointerDownOutside}
          skipAnimation
        >
          <TestButton>Hover target</TestButton>
        </Tooltip>
      </>,
    );

    await screen.findByRole("tooltip");
    await user.click(screen.getByRole("button", { name: "Outside" }));

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
  });

  it("keeps the tooltip open when legacy dismissal handlers prevent default", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Tooltip
        defaultOpen
        label="Persistent context"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onOpenChange={onOpenChange}
        skipAnimation
      >
        <TestButton>Hover target</TestButton>
      </Tooltip>,
    );

    await screen.findByRole("tooltip");
    await user.keyboard("{Escape}");

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("prevents focus-triggered opens when disableFocusOpen is true", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        label="Focus context"
        delayDuration={0}
        disableFocusOpen
        skipAnimation
      >
        <TestButton>Focus target</TestButton>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByRole("button", { name: "Focus target" })).toHaveFocus();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("renders styled content in a scoped portal", async () => {
    const { container } = render(
      <Tooltip
        defaultOpen
        label="Styled context"
        labelProps={{ "data-testid": "tooltip-content" }}
        skipAnimation
      >
        <TestButton>Hover target</TestButton>
      </Tooltip>,
    );

    const content = await screen.findByTestId("tooltip-content");
    const trigger = screen.getByRole("button", { name: "Hover target" });

    expect(content).toHaveClass("tgph");
    expect(content).toHaveAttribute("data-state", "open");
    expect(content).toHaveAttribute("data-tgph-appearance", "dark");
    expect(content).toHaveAttribute("role", "tooltip");
    expect(trigger).toHaveAttribute("aria-describedby", content.id);
    expect(trigger).toHaveAttribute("data-state", "open");
    expect(content).toHaveStyle({
      transformOrigin: "var(--transform-origin)",
    });
    expect(container).not.toContainElement(content);
  });

  it("preserves existing trigger descriptions when linking the tooltip", async () => {
    render(
      <Tooltip
        defaultOpen
        label="Described context"
        labelProps={{ "data-testid": "tooltip-content" }}
        skipAnimation
      >
        <TestButton aria-describedby="existing-description">
          Hover target
        </TestButton>
      </Tooltip>,
    );

    const content = await screen.findByTestId("tooltip-content");

    expect(
      screen.getByRole("button", { name: "Hover target" }),
    ).toHaveAttribute("aria-describedby", `existing-description ${content.id}`);
  });

  it("keeps the trigger description linked when labelProps includes an id", async () => {
    render(
      <Tooltip
        defaultOpen
        label="Described context"
        labelProps={{
          "data-testid": "tooltip-content",
          id: "custom-tooltip-id",
        }}
        skipAnimation
      >
        <TestButton>Hover target</TestButton>
      </Tooltip>,
    );

    const content = await screen.findByTestId("tooltip-content");
    const trigger = screen.getByRole("button", { name: "Hover target" });

    expect(content).not.toHaveAttribute("id", "custom-tooltip-id");
    expect(trigger).toHaveAttribute("aria-describedby", content.id);
  });

  it("forwards trigger refs through tgphRef-compatible children", async () => {
    const triggerRef = createRef<HTMLButtonElement>();

    render(
      <Tooltip
        defaultOpen
        label="Ref context"
        triggerRef={triggerRef}
        skipAnimation
      >
        <TestButton>Hover target</TestButton>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hover target" });

    expect(triggerRef.current).toBe(trigger);
  });

  it("opens grouped tooltips without delay after another tooltip is open", async () => {
    const user = userEvent.setup();

    render(
      <TooltipGroupProvider>
        <Tooltip
          defaultOpen
          label="First context"
          delayDuration={1000}
          skipAnimation
        >
          <TestButton>First target</TestButton>
        </Tooltip>
        <Tooltip label="Second context" delayDuration={1000} skipAnimation>
          <TestButton>Second target</TestButton>
        </Tooltip>
      </TooltipGroupProvider>,
    );

    await screen.findByText("First context");
    await user.hover(screen.getByRole("button", { name: "Second target" }));

    expect(await screen.findByText("Second context")).toBeInTheDocument();
  });
});
