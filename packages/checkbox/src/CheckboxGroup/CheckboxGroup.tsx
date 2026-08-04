import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
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

// Selection props come straight from Base UI. The README covers what they mean
// here: `value` is keyed by each checkbox's `formValue` (falling back to
// `name`), and `allValues` is required whenever the group holds a `parent`.
export type CheckboxGroupBaseProps = Pick<
  BaseCheckboxGroupProps,
  "value" | "defaultValue" | "onValueChange" | "allValues" | "disabled"
> & {
  // Applied to every checkbox in the group unless one sets its own.
  size?: CheckboxSize;
  color?: CheckboxColor;
  children?: ReactNode;
};

// Not polymorphic: the element resolves inside Base UI's `render` callback, so
// `StackProps<"div">` pins the passthrough to what is actually rendered.
//
// Base UI's props are destructured by name below and everything else spreads
// onto the `Stack`. Handing the leftovers to Base UI instead would let it
// swallow any prop it happens to consume — `id` did exactly that.
export type CheckboxGroupProps = RemappedOmit<
  StackProps<"div">,
  "tgphRef" | "as" | "value" | "defaultValue" | "onChange" | "color"
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
  children,
  tgphRef,
  ...stackProps
}: CheckboxGroupProps) => {
  return (
    <CheckboxGroupContext.Provider value={{ size, color, disabled }}>
      <BaseCheckboxGroup
        value={value}
        defaultValue={defaultValue}
        allValues={allValues}
        disabled={disabled}
        onValueChange={onValueChange}
        render={createTgphBaseUIRender<
          BaseCheckboxGroupRenderProps,
          BaseCheckboxGroupState
        >(() => (
          <Stack
            direction={direction}
            gap={gap}
            data-tgph-checkbox-group
            tgphRef={tgphRef}
            {...stackProps}
          >
            {children}
          </Stack>
        ))}
      />
    </CheckboxGroupContext.Provider>
  );
};

export { CheckboxGroup };
