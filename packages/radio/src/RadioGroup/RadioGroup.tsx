import {
  RadioGroup as BaseRadioGroup,
  type RadioGroupProps as BaseRadioGroupProps,
  type RadioGroupChangeEventDetails,
} from "@base-ui/react/radio-group";
import { type RemappedOmit, createTgphBaseUIRender } from "@telegraph/helpers";
import { Stack, type StackProps } from "@telegraph/layout";
import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
} from "react";

import type { RadioColor, RadioSize } from "../Radio/Radio.constants";

import { RadioGroupContext } from "./RadioGroup.context";

type BaseRadioGroupRenderProps = ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<HTMLElement>;
};

type BaseRadioGroupState = {
  disabled: boolean;
};

// `name`, `form`, `readOnly` and `required` pass straight through to Base UI.
// The selection props are declared here because Base UI types `value` as its
// generic `Value`, and Telegraph pins it to the string a radio submits.
export type RadioGroupBaseProps = Pick<
  BaseRadioGroupProps,
  "name" | "form" | "readOnly" | "required" | "inputRef"
> & {
  // The selected option. A radio group holds one value, so this is a string
  // rather than the checkbox group's array.
  value?: string;
  defaultValue?: string;
  // The second argument is Base UI's event detail, matching
  // `@telegraph/checkbox`. It carries the native event and `cancel()`.
  onValueChange?: (
    value: string,
    eventDetails: RadioGroupChangeEventDetails,
  ) => void;
  // Applied to every radio in the group unless one sets its own.
  size?: RadioSize;
  color?: RadioColor;
  disabled?: boolean;
  children?: ReactNode;
};

// Not polymorphic: the element resolves inside Base UI's `render` callback, so
// `StackProps<"div">` pins the passthrough to what is actually rendered.
//
// Base UI's props are destructured by name below and everything else spreads
// onto the `Stack`. Handing the leftovers to Base UI instead would let it
// swallow any prop it happens to consume.
export type RadioGroupProps = RemappedOmit<
  StackProps<"div">,
  "tgphRef" | "as" | "value" | "defaultValue" | "onChange" | "color"
> &
  RadioGroupBaseProps & {
    style?: CSSProperties;
    tgphRef?: Ref<HTMLElement>;
  };

const RadioGroup = ({
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  readOnly,
  required,
  inputRef,
  size,
  color,
  disabled = false,
  direction = "column",
  gap = "2",
  children,
  tgphRef,
  ...stackProps
}: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ size, color, disabled }}>
      <BaseRadioGroup
        value={value}
        defaultValue={defaultValue}
        // Base UI types the callback value as its generic `Value`. Every radio
        // in this package takes a string `value`, so the cast reflects what a
        // group can actually emit rather than widening the public callback.
        onValueChange={(nextValue, eventDetails) =>
          onValueChange?.(nextValue as string, eventDetails)
        }
        name={name}
        form={form}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        inputRef={inputRef}
        render={createTgphBaseUIRender<
          BaseRadioGroupRenderProps,
          BaseRadioGroupState
        >(() => (
          <Stack
            direction={direction}
            gap={gap}
            data-tgph-radio-group
            tgphRef={tgphRef}
            {...stackProps}
          >
            {children}
          </Stack>
        ))}
      />
    </RadioGroupContext.Provider>
  );
};

export { RadioGroup };
