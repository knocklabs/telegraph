import type { ComponentRenderFn, HTMLProps } from "@base-ui/react/use-render";
import { type ReactElement, type Ref, isValidElement } from "react";

import { TgphSlot } from "../components/TgphSlot";

type PropsWithRef = HTMLProps & {
  ref?: Ref<unknown>;
};

type TgphBaseUIRenderElement<State = Record<string, unknown>> =
  | ReactElement
  | ((state: State) => ReactElement);

type GetRenderElementParams<State> = {
  element: TgphBaseUIRenderElement<State>;
  state: State;
};

type RenderWithTgphSlotParams = {
  props: PropsWithRef;
  renderElement: ReactElement;
};

const getRenderElement = <State = Record<string, unknown>,>({
  element,
  state,
}: GetRenderElementParams<State>) => {
  if (typeof element === "function") {
    return element(state);
  }

  return element;
};

const renderWithTgphSlot = ({
  props,
  renderElement,
}: RenderWithTgphSlotParams) => {
  // Base UI gives render targets a standard React ref; TgphSlot decides whether
  // that ref should stay on `ref` or be bridged onto Telegraph's `tgphRef`.
  const { ref } = props;

  return (
    <TgphSlot {...props} ref={ref as Ref<HTMLElement>}>
      {renderElement}
    </TgphSlot>
  );
};

const createTgphBaseUIRender = <
  Props extends HTMLProps = HTMLProps,
  State = Record<string, unknown>,
>(
  element: TgphBaseUIRenderElement<State>,
): ComponentRenderFn<Props, State> => {
  return (props, state) => {
    // Base UI may call `render` with live state, so resolve function children
    // before asking TgphSlot to merge props into the concrete element.
    const renderElement = getRenderElement({ element, state });

    if (!isValidElement(renderElement)) {
      return renderElement;
    }

    // Keep native elements, forwardRef components, and tgphRef-only components
    // on the same prop/ref composition path.
    return renderWithTgphSlot({
      props: props as PropsWithRef,
      renderElement,
    });
  };
};

export { createTgphBaseUIRender };
export type { TgphBaseUIRenderElement };
