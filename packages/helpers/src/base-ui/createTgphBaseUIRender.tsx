import { mergeProps } from "@base-ui/react/merge-props";
import type { ComponentRenderFn, HTMLProps } from "@base-ui/react/use-render";
import {
  type ComponentPropsWithRef,
  type ReactElement,
  type Ref,
  type RefAttributes,
  cloneElement,
  isValidElement,
} from "react";

import { RefToTgphRef } from "../components/RefToTgphRef";

type PropsWithRef = HTMLProps & {
  ref?: Ref<unknown>;
};

type CloneableProps = Record<string, unknown> & RefAttributes<unknown>;

type IntrinsicMergeProps = ComponentPropsWithRef<"button">;

type TgphBaseUIRenderElement<State = Record<string, unknown>> =
  | ReactElement
  | ((state: State) => ReactElement);

const isIntrinsicElement = (element: ReactElement) => {
  return typeof element.type === "string";
};

const getRenderElement = <State = Record<string, unknown>,>(
  element: TgphBaseUIRenderElement<State>,
  state: State,
) => {
  if (typeof element === "function") {
    return element(state);
  }

  return element;
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

    if (isIntrinsicElement(renderElement)) {
      const { ref } = props as PropsWithRef;

      return cloneElement(renderElement as ReactElement<CloneableProps>, {
        ...mergeProps(
          props as IntrinsicMergeProps,
          renderElement.props as IntrinsicMergeProps,
        ),
        ref,
      });
    }

    return <RefToTgphRef {...props}>{renderElement}</RefToTgphRef>;
  };
};

export { createTgphBaseUIRender };
export type { TgphBaseUIRenderElement };
