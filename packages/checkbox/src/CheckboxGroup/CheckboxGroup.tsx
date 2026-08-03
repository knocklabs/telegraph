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

/**
 * The group keeps Base UI's names and signatures for the selection props, so
 * they come straight from Base UI rather than being redeclared. The README
 * covers what they mean here: `value` is keyed by each checkbox's `formValue`
 * (falling back to `name`), and `allValues` is required whenever the group
 * contains a `parent` checkbox.
 */
export type CheckboxGroupBaseProps = Pick<
  BaseCheckboxGroupProps,
  "value" | "defaultValue" | "onValueChange" | "allValues" | "disabled"
> & {
  /** Applied to every checkbox in the group unless one sets its own. */
  size?: CheckboxSize;
  /** Applied to every checkbox in the group unless one sets its own. */
  color?: CheckboxColor;
  children?: ReactNode;
};

/**
 * Not polymorphic: the group renders a `Stack` and the element would have to
 * resolve inside the Base UI `render` callback. `StackProps<"div">` pins the
 * passthrough to the element actually rendered.
 *
 * Base UI's own props are listed on `CheckboxGroupBaseProps` and destructured
 * by name below. Everything else is a `Stack` prop and spreads onto the
 * element. Handing the leftovers to Base UI instead would let it swallow any
 * prop it happens to consume — `id` did exactly that.
 */
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
