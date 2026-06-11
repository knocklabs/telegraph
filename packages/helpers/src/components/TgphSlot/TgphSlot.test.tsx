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

type TrackingTelegraphButtonProps = TelegraphButtonProps & {
  onTgphRefChange: (tgphRef: TelegraphButtonProps["tgphRef"]) => void;
};

const TrackingTelegraphButton = ({
  tgphRef,
  onTgphRefChange,
  ...props
}: TrackingTelegraphButtonProps) => {
  onTgphRefChange(tgphRef);

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

  it("keeps child tgphRef stable when parent refs change", () => {
    const firstRef = vi.fn();
    const secondRef = vi.fn();
    const seenTgphRefs: TelegraphButtonProps["tgphRef"][] = [];

    const { rerender } = render(
      <TgphSlot ref={firstRef}>
        <TrackingTelegraphButton
          onTgphRefChange={(tgphRef) => seenTgphRefs.push(tgphRef)}
        >
          Open
        </TrackingTelegraphButton>
      </TgphSlot>,
    );

    const button = screen.getByRole("button", { name: "Open" });
    const stableTgphRef = seenTgphRefs.at(-1);

    rerender(
      <TgphSlot ref={secondRef}>
        <TrackingTelegraphButton
          onTgphRefChange={(tgphRef) => seenTgphRefs.push(tgphRef)}
        >
          Open
        </TrackingTelegraphButton>
      </TgphSlot>,
    );

    expect(seenTgphRefs.at(-1)).toBe(stableTgphRef);
    expect(firstRef).toHaveBeenCalledWith(button);
    expect(firstRef).toHaveBeenLastCalledWith(null);
    expect(secondRef).toHaveBeenCalledWith(button);
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

  it("preserves ref support for custom forwardRef children without leaking tgphRef", () => {
    const childRef = createRef<HTMLButtonElement>();
    const slotRef = createRef<HTMLButtonElement>();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      render(
        <TgphSlot data-testid="forward-ref-button" ref={slotRef}>
          <ForwardRefButton ref={childRef}>Open</ForwardRefButton>
        </TgphSlot>,
      );

      const button = screen.getByTestId("forward-ref-button");

      expect(slotRef.current).toBe(button);
      expect(childRef.current).toBe(button);
      expect(button).not.toHaveAttribute("tgphRef");
      expect(errorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining("does not recognize the `tgphRef` prop"),
        expect.anything(),
      );
    } finally {
      errorSpy.mockRestore();
    }
  });
});
