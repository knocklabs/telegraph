import {
  Checkbox as BaseCheckbox,
  type CheckboxRootProps as BaseCheckboxRootProps,
  type CheckboxRootChangeEventDetails,
} from "@base-ui/react/checkbox";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type AsAndTgphRefProps,
  type RemappedOmit,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Icon, type IconProps, type LucideIcon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { Text, type TextProps } from "@telegraph/typography";
import { Check, Minus } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context";

import {
  CHECKBOX_COLOR_MAP,
  CHECKBOX_SIZE_MAP,
  CHECKBOX_UNCHECKED,
  type CheckboxColor,
  type CheckboxSize,
} from "./Checkbox.constants";
import { countLabels } from "./Checkbox.helpers";

// `name`, `required`, `readOnly`, `disabled` and `id` pass straight through to
// Base UI and mean exactly what they mean there, so they come from its types.
// The rest are declared here: `size` and `color` are Telegraph tokens, and the
// four below are renamed on the way in — `checked` -> `value`,
// `defaultChecked` -> `defaultValue`, `onCheckedChange` -> `onValueChange`,
// and Base UI's `value` -> `formValue`.
export type RootBaseProps = Pick<
  BaseCheckboxRootProps,
  "name" | "required" | "readOnly" | "disabled" | "id"
> & {
  size?: CheckboxSize;
  color?: CheckboxColor;
  value?: boolean;
  defaultValue?: boolean;
  // The second argument carries the native event and `cancel()`.
  onValueChange?: (
    value: boolean,
    eventDetails: CheckboxRootChangeEventDetails,
  ) => void;
  indeterminate?: boolean;
  // Needs a `CheckboxGroup` with `allValues`. The group derives this
  // checkbox's state, so don't pass `value` alongside it.
  parent?: boolean;
  // Also the key its group tracks it by. Falls back to `name`.
  formValue?: string;
  // Submitted when unticked, where a plain checkbox submits nothing. Base UI
  // ignores it inside a `CheckboxGroup` and on a `parent`.
  uncheckedValue?: string;
};

// Everything the root resolves and the parts read back. Sourced from
// `RootBaseProps` so a prop added to the public surface cannot silently fail to
// reach the parts that render it.
type InternalContextType = Pick<
  RootBaseProps,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "formValue"
  | "indeterminate"
  | "parent"
  | "uncheckedValue"
  | "name"
  | "required"
  | "readOnly"
  | "disabled"
> &
  Pick<BaseCheckboxRootProps, "aria-label" | "aria-describedby"> & {
    // `Root` always resolves these three, so the context holds them where
    // `RootBaseProps` leaves them optional.
    size: CheckboxSize;
    color: CheckboxColor;
    id: string;
    labelId: string;
    // The id Base UI actually put on the hidden input, which is not always the
    // `id` we passed: inside a select-all group it derives its own and discards
    // ours. `Checkbox.Label` needs the real one or `htmlFor` points at nothing.
    inputId?: string;
    registerInputId: (id: string) => void;
    // Decided during render, not in an effect: the control has to emit
    // `aria-labelledby` in the first pass or SSR ships an unnamed checkbox.
    hasLabel: boolean;
    // Base UI types this as `string | null`; we only ever pass a string.
    "aria-labelledby"?: string;
  };

const CheckboxContext = createContext<InternalContextType>({
  size: "2",
  color: "default",
  disabled: false,
  indeterminate: false,
  parent: false,
  id: "",
  labelId: "",
  registerInputId: () => {},
  hasLabel: false,
});

// Stripped from *both* halves. Every element declares `defaultValue?: string |
// number | readonly string[]`, so leaving it in the passthrough intersects it
// with our `defaultValue?: boolean` and yields a type nothing can satisfy.
// `disabled` and `id` are declared on `RootBaseProps` instead, since the root
// renders a `div` but forwards them to the input `Checkbox.Control` renders.
type StripConflicting =
  | "value"
  | "defaultValue"
  | "onChange"
  | "disabled"
  | "id";

export type RootProps<T extends TgphElement = "div"> = RemappedOmit<
  StackProps<T>,
  "tgphRef" | "as" | StripConflicting
> &
  AsAndTgphRefProps<T, HTMLElement> &
  RootBaseProps;

const Root = <T extends TgphElement = "div">(rootProps: RootProps<T>) => {
  const {
    size: sizeProp,
    color: colorProp,
    value,
    defaultValue,
    onValueChange,
    indeterminate,
    parent,
    formValue,
    uncheckedValue,
    name,
    disabled: disabledProp,
    required,
    readOnly,
    id: idProp,
    className,
    children,
    as,
    style,
    // These three describe the checkbox, so they belong on the element Base UI
    // gives `role="checkbox"`. Left in the spread they land on the layout
    // wrapper, where a screen reader never reads them.
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...props
  } = rootProps as RootProps<"div">;
  const group = useCheckboxGroupContext();

  // Own prop wins, then the group's default, then the component default.
  const size = sizeProp ?? group?.size ?? "2";
  const color = colorProp ?? group?.color ?? "default";
  // `disabled` is the exception: Base UI ORs the group's value over the
  // checkbox's own (`CheckboxRoot.js`), so a group that disables its children
  // cannot be opted out of. Match that here or the label styles itself enabled
  // over a control Base UI has already disabled.
  const disabled = group?.disabled || disabledProp || false;

  const generatedId = useId();
  const id = idProp || generatedId;
  const labelId = `${id}-label`;

  const [inputId, setInputId] = useState<string>();

  const hasLabel = useMemo(() => countLabels(children, Label) > 0, [children]);

  return (
    <CheckboxContext.Provider
      value={{
        size,
        color,
        disabled,
        indeterminate,
        parent,
        id,
        labelId,
        inputId,
        registerInputId: setInputId,
        hasLabel,
        value,
        defaultValue,
        onValueChange,
        formValue,
        uncheckedValue,
        name,
        required,
        readOnly,
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
        data-tgph-checkbox-root
        style={style}
        {...props}
      >
        {children}
      </Stack>
    </CheckboxContext.Provider>
  );
};

type BaseCheckboxRenderProps = ComponentPropsWithoutRef<"span"> & {
  ref?: Ref<HTMLElement>;
};

type BaseCheckboxState = {
  checked: boolean;
  disabled: boolean;
  indeterminate: boolean;
  readOnly: boolean;
  required: boolean;
};

// Picked, not omitted: `Checkbox.Root` owns every other Base UI prop and
// forwards it, and the HTML attribute surface already arrives with the `Stack`
// props below. An omit list let anything Base UI added later — `uncheckedValue`
// did exactly this — type-check here and then spread onto the styled `div`.
export type ControlProps = Pick<BaseCheckboxRootProps, "form" | "inputRef"> &
  // Layout props reach the styled box, so callers can size or recolor it.
  // `className` and `style` come from here too: Base UI types both as
  // `string | ((state) => string)`, and the `Stack` takes the plain forms.
  RemappedOmit<StackProps<"div">, "as" | "tgphRef" | "color"> & {
    tgphRef?: Ref<HTMLElement>;
    // Overrides the indicator. Listed field by field rather than omitted from
    // `IconProps`: that type is a discriminated union over every HTML
    // attribute, and an `Omit` across it pushed `tsc` past two minutes. No
    // `alt` or `aria-hidden` — the control carries the accessible name.
    iconProps?: {
      icon?: LucideIcon;
      size?: IconProps<"span">["size"];
      variant?: IconProps<"span">["variant"];
      color?: IconProps<"span">["color"];
    };
  };

const Control = (controlProps: ControlProps) => {
  const {
    tgphRef,
    iconProps,
    // Base UI owns these two; everything left over styles the box.
    inputRef,
    form,
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
  const context = useContext(CheckboxContext);
  const { size, iconSize } = CHECKBOX_SIZE_MAP[context.size];
  const { backgroundColor, indicatorColor } = CHECKBOX_COLOR_MAP[context.color];
  const { registerInputId } = context;

  const localInputRef = useRef<HTMLInputElement>(null);
  const composedInputRef = useComposedRefs<HTMLInputElement>(
    inputRef,
    localInputRef,
  );

  // Report whatever id Base UI settled on, so `Checkbox.Label` can point
  // `htmlFor` at it. Base UI recomputes that id from `value ?? name`, the
  // group's `allValues`, and `id` — on the *same* input node, so a ref callback
  // would fire once and then go stale. Read it after every render instead.
  useEffect(() => {
    const nextId = localInputRef.current?.id;
    if (nextId) registerInputId(nextId);
  });

  const ariaProps = {
    ...(context["aria-label"] !== undefined && {
      "aria-label": context["aria-label"],
    }),
    ...(context["aria-describedby"] !== undefined && {
      "aria-describedby": context["aria-describedby"],
    }),
  };

  return (
    <BaseCheckbox.Root
      inputRef={composedInputRef}
      id={context.id}
      name={context.name}
      value={context.formValue}
      uncheckedValue={context.uncheckedValue}
      checked={context.value}
      defaultChecked={context.defaultValue}
      indeterminate={context.indeterminate}
      parent={context.parent}
      disabled={context.disabled}
      required={context.required}
      readOnly={context.readOnly}
      // Only the aria props we actually have. Base UI does not destructure
      // `aria-describedby`, so it lands in `elementProps` and merges *after*
      // `getDescriptionProps` — and that merge has no undefined guard. Passing
      // `aria-describedby={undefined}` would erase the id a wrapping
      // `Field.Description` or `Field.Error` just computed.
      {...ariaProps}
      // An explicit `aria-labelledby` wins. Otherwise point at our own label
      // whenever one exists. `aria-label` does not suppress this: Base UI's
      // fallback re-derives `aria-labelledby` from the associated `<label>`
      // anyway, and that outranks `aria-label` in the name computation. Naming
      // it here just moves the same result into the first paint.
      aria-labelledby={
        context["aria-labelledby"] ??
        (context.hasLabel ? context.labelId : undefined)
      }
      onCheckedChange={(checked, eventDetails) =>
        context.onValueChange?.(checked, eventDetails)
      }
      form={form}
      render={createTgphBaseUIRender<
        BaseCheckboxRenderProps,
        BaseCheckboxState
      >((state) => {
        const active = state.checked || state.indeterminate;
        return (
          <Stack
            align="center"
            justify="center"
            w={size}
            h={size}
            rounded="2"
            border="px"
            borderColor={
              active ? backgroundColor : CHECKBOX_UNCHECKED.borderColor
            }
            bg={active ? backgroundColor : CHECKBOX_UNCHECKED.backgroundColor}
            data-tgph-checkbox-control
            data-tgph-checkbox-size={context.size}
            data-tgph-checkbox-color={context.color}
            tgphRef={tgphRef}
            {...stackProps}
          >
            <BaseCheckbox.Indicator
              render={createTgphBaseUIRender<
                BaseCheckboxRenderProps,
                BaseCheckboxState
              >((indicatorState) => (
                <Stack
                  align="center"
                  justify="center"
                  data-tgph-checkbox-indicator
                >
                  <Icon
                    icon={indicatorState.indeterminate ? Minus : Check}
                    size={iconSize}
                    color={indicatorColor}
                    {...iconProps}
                    aria-hidden
                  />
                </Stack>
              ))}
            />
          </Stack>
        );
      })}
    />
  );
};

// `as` is re-declared as optional so `<Checkbox.Label>` works without it;
// Telegraph's `Text` otherwise requires `as` unless `internal_optionalAs` is set.
// `id` is not the caller's to set: `Checkbox.Control` points `aria-labelledby`
// at `context.labelId` during render, so a different id here leaves a dangling
// IDREF and the control ends up with no accessible name at all.
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
  const context = useContext(CheckboxContext);

  return (
    <Text
      as={as || "label"}
      // The id Base UI actually used, falling back to ours before the input
      // has mounted. Inside a select-all group these differ.
      htmlFor={context.inputId ?? context.id}
      id={context.labelId}
      size={CHECKBOX_SIZE_MAP[context.size].labelSize}
      data-tgph-checkbox-label
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

const Checkbox = {
  Default,
  Root,
  Control,
  Label,
};

export { Checkbox, CheckboxContext };
