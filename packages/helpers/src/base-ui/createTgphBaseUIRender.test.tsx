import { render, screen } from "@testing-library/react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  createRef,
  forwardRef,
} from "react";
import { describe, expect, it } from "vitest";

import { createTgphBaseUIRender } from "./createTgphBaseUIRender";

type BaseUIRenderProps = ComponentPropsWithoutRef<"button"> & {
  ref?: Ref<HTMLButtonElement>;
};

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

describe("createTgphBaseUIRender", () => {
  it("forwards Base UI render props to a native element", () => {
    const ref = createRef<HTMLButtonElement>();
    const renderButton = createTgphBaseUIRender<BaseUIRenderProps>(
      <button className="child" type="button">
        Open
      </button>,
    );

    render(
      renderButton(
        {
          "aria-expanded": true,
          className: "base-ui",
          "data-testid": "native-button",
          ref,
        },
        {},
      ),
    );

    const button = screen.getByTestId("native-button");

    expect(button).toHaveClass("child");
    expect(button).toHaveClass("base-ui");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(ref.current).toBe(button);
  });

  it("maps Base UI refs to tgphRef for Telegraph-style children", () => {
    const ref = createRef<HTMLButtonElement>();
    const renderButton = createTgphBaseUIRender<BaseUIRenderProps>(
      <TelegraphButton>Open</TelegraphButton>,
    );

    render(
      renderButton(
        {
          "data-testid": "telegraph-button",
          ref,
        },
        {},
      ),
    );

    expect(ref.current).toBe(screen.getByTestId("telegraph-button"));
  });

  it("composes Base UI refs with existing native element refs", () => {
    const baseUIRef = createRef<HTMLButtonElement>();
    const childRef = createRef<HTMLButtonElement>();
    const renderButton = createTgphBaseUIRender<BaseUIRenderProps>(
      <button ref={childRef} type="button">
        Open
      </button>,
    );

    render(
      renderButton(
        {
          "data-testid": "native-button",
          ref: baseUIRef,
        },
        {},
      ),
    );

    const button = screen.getByTestId("native-button");

    expect(baseUIRef.current).toBe(button);
    expect(childRef.current).toBe(button);
  });

  it("preserves ref support for custom forwardRef children", () => {
    const ref = createRef<HTMLButtonElement>();
    const renderButton = createTgphBaseUIRender<BaseUIRenderProps>(
      <ForwardRefButton>Open</ForwardRefButton>,
    );

    render(
      renderButton(
        {
          "data-testid": "forward-ref-button",
          ref,
        },
        {},
      ),
    );

    expect(ref.current).toBe(screen.getByTestId("forward-ref-button"));
  });

  it("merges child and Base UI event handlers", () => {
    const childClick = vi.fn();
    const baseUIClick = vi.fn();
    const renderButton = createTgphBaseUIRender<BaseUIRenderProps>(
      <button onClick={childClick} type="button">
        Open
      </button>,
    );

    render(
      renderButton(
        {
          "data-testid": "merged-button",
          onClick: baseUIClick,
        },
        {},
      ),
    );

    screen.getByTestId("merged-button").click();

    expect(childClick).toHaveBeenCalledOnce();
    expect(baseUIClick).toHaveBeenCalledOnce();
  });

  it("supports render callbacks that receive Base UI state", () => {
    const renderButton = createTgphBaseUIRender<
      BaseUIRenderProps,
      { open: boolean }
    >((state) => {
      return <TelegraphButton>{state.open ? "Close" : "Open"}</TelegraphButton>;
    });

    render(
      renderButton(
        {
          "data-testid": "state-button",
        },
        { open: true },
      ),
    );

    expect(screen.getByTestId("state-button")).toHaveTextContent("Close");
  });
});
