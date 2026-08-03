import {
  Radio as BaseRadio,
  type RadioRootProps as BaseRadioRootProps,
} from "@base-ui/react/radio";
import {
  type AsAndTgphRefProps,
  type RemappedOmit,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Box, Stack, type StackProps } from "@telegraph/layout";
import { Text, type TextProps } from "@telegraph/typography";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  createContext,
  useContext,
  useId,
  useMemo,
} from "react";

import { useRadioGroupContext } from "../RadioGroup/RadioGroup.context";

import {
  RADIO_COLOR_MAP,
  RADIO_SIZE_MAP,
  RADIO_UNSELECTED,
  type RadioColor,
  type RadioSize,
} from "./Radio.constants";
import { countLabels } from "./Radio.helpers";

// `value` identifies the option and is required, unlike the checkbox where it
// held the checked state. `disabled`, `required` and `readOnly` pass straight
// through to Base UI. Whether a radio is selected is owned entirely by the
// enclosing group, so there is no `checked` prop and no indeterminate state.
export type RootBaseProps = Pick<
  BaseRadioRootProps,
  "disabled" | "required" | "readOnly"
> & {
  // This option's identity, and the string the form submits under the group's
  // `name`. Required by Base UI.
  value: string;
  size?: RadioSize;
  color?: RadioColor;
  id?: string;
};

// `value` is stripped from the `Stack` half because a radio's `value` is a
// string option id, while every element declares its own conflicting `value`.
type StripConflicting = "value" | "defaultValue" | "onChange" | "disabled";

export type RootProps<T extends TgphElement = "div"> = RemappedOmit<
  StackProps<T>,
  "tgphRef" | "as" | StripConflicting
> &
  AsAndTgphRefProps<T, HTMLElement> &
  RootBaseProps;

// Everything the root resolves and the parts read back. Sourced from
// `RootBaseProps` so a prop added to the public surface cannot silently fail
// to reach the parts that render it.
type InternalContextType = Pick<
  RootBaseProps,
  "value" | "disabled" | "required" | "readOnly"
> &
  Pick<BaseRadioRootProps, "aria-label" | "aria-describedby"> & {
    // `Root` always resolves these, so the context holds them where
    // `RootBaseProps` leaves them optional.
    size: RadioSize;
    color: RadioColor;
    id: string;
    labelId: string;
    // Decided during render, not in an effect: the control has to emit
    // `aria-labelledby` in the first pass or SSR ships an unnamed radio.
    hasLabel: boolean;
    // Base UI types this as `string | null`; we only ever pass a string.
    "aria-labelledby"?: string;
  };

const RadioContext = createContext<InternalContextType>({
  value: "",
  size: "2",
  color: "default",
  disabled: false,
  id: "",
  labelId: "",
  hasLabel: false,
});

const Root = <T extends TgphElement = "div">(rootProps: RootProps<T>) => {
  const {
    size: sizeProp,
    color: colorProp,
    value,
    disabled: disabledProp,
    required,
    readOnly,
    id: idProp,
    className,
    children,
    as,
    style,
    // These three describe the radio, so they belong on the element Base UI
    // gives `role="radio"`. Left in the spread they land on the layout
    // wrapper, where a screen reader never reads them.
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...props
  } = rootProps as RootProps<"div">;
  const group = useRadioGroupContext();

  // Own prop wins, then the group's default, then the component default.
  const size = sizeProp ?? group?.size ?? "2";
  const color = colorProp ?? group?.color ?? "default";
  // `disabled` is the exception: Base UI ORs the group's value over the
  // radio's own, so a group that disables its children cannot be opted out of.
  // Match that here or the label styles itself enabled over a control Base UI
  // has already disabled.
  const disabled = group?.disabled || disabledProp || false;

  const generatedId = useId();
  const id = idProp || generatedId;
  const labelId = `${id}-label`;

  const hasLabel = useMemo(() => countLabels(children, Label) > 0, [children]);

  return (
    <RadioContext.Provider
      value={{
        size,
        color,
        value,
        disabled,
        required,
        readOnly,
        id,
        labelId,
        hasLabel,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
      }}
    >
      <Stack
        as={as}
        align="center"
        gap="2"
        className={className}
        data-tgph-radio-root
        style={style}
        {...props}
      >
        {children}
      </Stack>
    </RadioContext.Provider>
  );
};

type BaseRadioRenderProps = ComponentPropsWithoutRef<"span"> & {
  ref?: Ref<HTMLElement>;
};

type BaseRadioState = {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
};

// `Radio.Indicator` exposes a narrower state than the root: just `checked` and
// a transition status. Declaring the root's state here would ask for fields
// Base UI never passes.
type BaseRadioIndicatorState = {
  checked: boolean;
};

// Picked, not omitted: `Radio.Root` owns every other Base UI prop and forwards
// it, and the HTML attribute surface already arrives with the `Stack` props
// below. An omit list would let anything Base UI adds later type-check here
// and then spread onto the styled `div`.
export type ControlProps = Pick<BaseRadioRootProps, "inputRef"> &
  // Layout props reach the styled circle, so callers can size or recolor it.
  RemappedOmit<StackProps<"div">, "as" | "tgphRef" | "color"> & {
    tgphRef?: Ref<HTMLElement>;
    // Overrides the dot. Listed field by field rather than omitted from
    // `StackProps`, so the surface stays small and obvious.
    dotProps?: {
      bg?: StackProps<"div">["bg"];
      w?: StackProps<"div">["w"];
      h?: StackProps<"div">["h"];
    };
  };

const Control = (controlProps: ControlProps) => {
  const {
    tgphRef,
    dotProps,
    inputRef,
    // Keeping these out of `ControlProps` only stops a type-checked caller.
    // Base UI resolves them from the root, so drop anything that slips
    // through untyped rather than let it spread over the resolved value.
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    ...stackProps
  } = controlProps as ControlProps & {
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
  };
  const context = useContext(RadioContext);
  const { size, dotSize } = RADIO_SIZE_MAP[context.size];
  const { backgroundColor, dotColor } = RADIO_COLOR_MAP[context.color];

  // Only the aria props we actually have. Base UI does not destructure
  // `aria-describedby`, so it lands in `elementProps` and merges *after*
  // `getDescriptionProps` — and that merge has no undefined guard. Passing
  // `aria-describedby={undefined}` would erase the id a wrapping
  // `Field.Description` or `Field.Error` just computed.
  const ariaProps = {
    ...(context["aria-label"] !== undefined && {
      "aria-label": context["aria-label"],
    }),
    ...(context["aria-describedby"] !== undefined && {
      "aria-describedby": context["aria-describedby"],
    }),
  };

  return (
    <BaseRadio.Root
      inputRef={inputRef}
      id={context.id}
      value={context.value}
      disabled={context.disabled}
      required={context.required}
      readOnly={context.readOnly}
      {...ariaProps}
      // An explicit `aria-labelledby` wins. Otherwise point at our own label
      // whenever one exists. `aria-label` does not suppress this: Base UI's
      // fallback re-derives `aria-labelledby` from the associated `<label>`
      // anyway, and that outranks `aria-label` in the name computation.
      aria-labelledby={
        context["aria-labelledby"] ??
        (context.hasLabel ? context.labelId : undefined)
      }
      render={createTgphBaseUIRender<BaseRadioRenderProps, BaseRadioState>(
        (state) => (
          <Stack
            align="center"
            justify="center"
            w={size}
            h={size}
            rounded="full"
            border="px"
            borderColor={
              state.checked ? backgroundColor : RADIO_UNSELECTED.borderColor
            }
            bg={
              state.checked ? backgroundColor : RADIO_UNSELECTED.backgroundColor
            }
            data-tgph-radio-control
            data-tgph-radio-size={context.size}
            data-tgph-radio-color={context.color}
            tgphRef={tgphRef}
            {...stackProps}
          >
            <BaseRadio.Indicator
              render={createTgphBaseUIRender<
                BaseRadioRenderProps,
                BaseRadioIndicatorState
              >(() => (
                <Stack
                  align="center"
                  justify="center"
                  data-tgph-radio-indicator
                >
                  <Box
                    w={dotSize}
                    h={dotSize}
                    rounded="full"
                    bg={dotColor}
                    {...dotProps}
                  />
                </Stack>
              ))}
            />
          </Stack>
        ),
      )}
    />
  );
};

// `as` is re-declared as optional so `<Radio.Label>` works without it;
// Telegraph's `Text` otherwise requires `as` unless `internal_optionalAs` is
// set. `id` is not the caller's to set: `Radio.Control` points
// `aria-labelledby` at `context.labelId` during render, so a different id here
// leaves a dangling IDREF and the control ends up with no accessible name.
export type LabelProps<T extends TgphElement = "label"> = RemappedOmit<
  TextProps<T>,
  "as" | "id"
> & {
  as?: T;
};

const Label = <T extends TgphElement = "label">(labelProps: LabelProps<T>) => {
  // `id` is destructured away rather than merely omitted from the type, so an
  // untyped caller cannot spread over the one `aria-labelledby` points at.
  const {
    as,
    style,
    id: _id,
    ...props
  } = labelProps as LabelProps<"label"> & { id?: string };
  const context = useContext(RadioContext);

  return (
    <Text
      as={as || "label"}
      htmlFor={context.id}
      id={context.labelId}
      size={RADIO_SIZE_MAP[context.size].labelSize}
      data-tgph-radio-label
      style={style}
      {...props}
    />
  );
};

// `children` is dropped: `Default` renders its own control and label, so
// anything passed would be silently discarded.
export type DefaultProps<T extends TgphElement = "div"> = RemappedOmit<
  RootProps<T>,
  "children"
> & {
  label?: ReactNode;
  labelProps?: RemappedOmit<LabelProps<"label">, "as">;
  controlProps?: ControlProps;
};

const Default = <T extends TgphElement = "div">({
  label,
  labelProps,
  controlProps,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root {...(props as RootProps<T>)}>
      <Control {...controlProps} />
      {/* Not `label &&`: that renders a bare `0` for `label={0}`, and `false`
          is what `label={cond && "text"}` yields when the condition fails. */}
      {label != null && label !== false && (
        <Label as="label" {...labelProps}>
          {label}
        </Label>
      )}
    </Root>
  );
};

const Radio = {
  Default,
  Root,
  Control,
  Label,
};

export { Radio, RadioContext };
