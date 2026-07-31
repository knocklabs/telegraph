import {
  CheckboxGroup as BaseCheckboxGroup,
  type CheckboxGroupChangeEventDetails,
} from "@base-ui/react/checkbox-group";
import { type RemappedOmit, createTgphBaseUIRender } from "@telegraph/helpers";
import { Stack, type StackProps } from "@telegraph/layout";
import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";

import type {
  CheckboxColor,
  CheckboxSize,
} from "../Checkbox/Checkbox.constants";

import { CheckboxGroupContext } from "./CheckboxGroup.context";

type BaseCheckboxGroupProps = ComponentPropsWithoutRef<
  typeof BaseCheckboxGroup
>;

type BaseCheckboxGroupRenderProps = ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<HTMLElement>;
};

type BaseCheckboxGroupState = {
  disabled: boolean;
};

export type CheckboxGroupBaseProps = {
  /**
   * The checkboxes in the group that are ticked, keyed by each checkbox's
   * `formValue` (which falls back to its `name`).
   */
  value?: string[];
  /** Initial selection for an uncontrolled group. */
  defaultValue?: string[];
  /**
   * Called with the new selection. The second argument is Base UI's event
   * detail: it carries the native event (`eventDetails.event`, useful for
   * shift-click range selection) and `eventDetails.cancel()`.
   */
  onValueChange?: (
    value: string[],
    eventDetails: CheckboxGroupChangeEventDetails,
  ) => void;
  /**
   * Every checkbox key in the group. Required when the group contains a
   * checkbox marked `parent`, since the parent's checked and indeterminate
   * state is derived from this list.
   */
  allValues?: string[];
  /** Applied to every checkbox in the group unless one sets its own. */
  size?: CheckboxSize;
  /** Applied to every checkbox in the group unless one sets its own. */
  color?: CheckboxColor;
  disabled?: boolean;
  children?: ReactNode;
};

/**
 * Not polymorphic: the group renders a `Stack` and the element would have to
 * resolve inside the Base UI `render` callback. `StackProps<"div">` pins the
 * passthrough to the element actually rendered.
 */
export type CheckboxGroupProps = RemappedOmit<
  StackProps<"div">,
  "tgphRef" | "as" | "value" | "defaultValue" | "onChange" | "color"
> &
  RemappedOmit<
    BaseCheckboxGroupProps,
    | "className"
    | "defaultValue"
    | "onValueChange"
    | "render"
    | "style"
    | "value"
  > &
  CheckboxGroupBaseProps & {
    style?: CSSProperties;
    tgphRef?: Ref<HTMLElement>;
  };

const CheckboxGroup = ({
  value,
  defaultValue,
  onValueChange,
  allValues,
  size,
  color,
  disabled = false,
  direction = "column",
  gap = "2",
  align,
  justify,
  className,
  style,
  tgphRef,
  children,
  // Base UI consumes `id` for its own field registration and never renders it,
  // so put it on the element ourselves.
  id,
  ...props
}: CheckboxGroupProps) => {
  return (
    <CheckboxGroupContext.Provider
      value={{ size, color, disabled, hasAllValues: allValues !== undefined }}
    >
      <BaseCheckboxGroup
        value={value}
        defaultValue={defaultValue}
        allValues={allValues}
        disabled={disabled}
        onValueChange={onValueChange}
        {...props}
        render={createTgphBaseUIRender<
          BaseCheckboxGroupRenderProps,
          BaseCheckboxGroupState
        >(() => (
          <Stack
            direction={direction}
            gap={gap}
            align={align}
            justify={justify}
            display="flex"
            className={className}
            data-tgph-checkbox-group
            id={id}
            tgphRef={tgphRef}
            style={style}
          >
            {children}
          </Stack>
        ))}
      />
    </CheckboxGroupContext.Provider>
  );
};

export { CheckboxGroup };
