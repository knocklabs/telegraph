import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import {
  type RemappedOmit,
  type TgphComponentProps,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
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
  onValueChange?: (value: string[]) => void;
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
 * Deliberately not polymorphic. A checkbox group is always a `Stack`, and the
 * generic `as` would have to resolve inside the Base UI `render` callback,
 * where it collapses against Stack's catch-all prop signature.
 */
export type CheckboxGroupProps = RemappedOmit<
  TgphComponentProps<typeof Stack>,
  "tgphRef" | "value" | "defaultValue" | "onChange" | "color"
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
  ...props
}: CheckboxGroupProps) => {
  return (
    <CheckboxGroupContext.Provider value={{ size, color, disabled }}>
      <BaseCheckboxGroup
        value={value}
        defaultValue={defaultValue}
        allValues={allValues}
        disabled={disabled}
        onValueChange={(nextValue) => onValueChange?.(nextValue)}
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
