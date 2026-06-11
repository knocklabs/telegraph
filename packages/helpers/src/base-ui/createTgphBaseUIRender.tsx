import type { ComponentRenderFn, HTMLProps } from "@base-ui/react/use-render";
import { type ReactElement, type Ref, isValidElement } from "react";

import { TgphSlot } from "../components/TgphSlot";

type PropsWithRef = HTMLProps & {
  ref?: Ref<unknown>;
};

type TgphBaseUIRenderElement<State = Record<string, unknown>> =
  | ReactElement
  | ((state: State) => ReactElement);

const getRenderElement = <State = Record<string, unknown>,>(
  element: TgphBaseUIRenderElement<State>,
  state: State,
) => {
  if (typeof element === "function") {
    return element(state);
  }

  return element;
};

const renderWithTgphSlot = (
  props: PropsWithRef,
  renderElement: ReactElement,
) => {
  const { ref, ...slotProps } = props;

  return (
    <TgphSlot {...slotProps} ref={ref as Ref<HTMLElement>}>
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
    const renderElement = getRenderElement(element, state);

    if (!isValidElement(renderElement)) {
      return renderElement;
    }

    return renderWithTgphSlot(props as PropsWithRef, renderElement);
  };
};

export { createTgphBaseUIRender };
export type { TgphBaseUIRenderElement };
