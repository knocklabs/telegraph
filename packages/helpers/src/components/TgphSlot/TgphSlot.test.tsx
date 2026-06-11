import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  createRef,
  forwardRef,
} from "react";
import { describe, expect, it, vi } from "vitest";

import { TgphSlot } from "./TgphSlot";

type TelegraphButtonProps = ComponentPropsWithoutRef<"button"> & {
  tgphRef?: Ref<HTMLButtonElement>;
};

const TelegraphButton = ({ tgphRef, ...props }: TelegraphButtonProps) => {
  return <button ref={tgphRef} type="button" {...props} />;
};

const ForwardRefButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>((props, ref) => {
  return <button ref={ref} type="button" {...props} />;
});

describe("TgphSlot", () => {
  it("merges props and refs into native children", async () => {
    const childClick = vi.fn();
    const slotClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const user = userEvent.setup();

    render(
      <TgphSlot
        aria-expanded
        className="slot"
        data-testid="native-button"
        onClick={slotClick}
        ref={ref}
      >
        <button className="child" onClick={childClick} type="button">
          Open
        </button>
      </TgphSlot>,
    );

    const button = screen.getByTestId("native-button");
    await user.click(button);

    expect(button).toHaveClass("child");
    expect(button).toHaveClass("slot");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(childClick).toHaveBeenCalledOnce();
    expect(slotClick).toHaveBeenCalledOnce();
    expect(ref.current).toBe(button);
  });

  it("maps refs to tgphRef for Telegraph-style children", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <TgphSlot data-testid="telegraph-button" ref={ref}>
        <TelegraphButton>Open</TelegraphButton>
      </TgphSlot>,
    );

    expect(ref.current).toBe(screen.getByTestId("telegraph-button"));
  });

  it("composes refs with existing tgphRef props on Telegraph-style children", () => {
    const childRef = createRef<HTMLButtonElement>();
    const slotRef = createRef<HTMLButtonElement>();

    render(
      <TgphSlot ref={slotRef}>
        <TelegraphButton tgphRef={childRef}>Open</TelegraphButton>
      </TgphSlot>,
    );

    const button = screen.getByRole("button", { name: "Open" });

    expect(childRef.current).toBe(button);
    expect(slotRef.current).toBe(button);
  });

  it("preserves ref support for custom forwardRef children", () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <TgphSlot data-testid="forward-ref-button" ref={ref}>
        <ForwardRefButton>Open</ForwardRefButton>
      </TgphSlot>,
    );

    expect(ref.current).toBe(screen.getByTestId("forward-ref-button"));
  });
});
