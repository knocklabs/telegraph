import {
  Checkbox as BaseCheckbox,
  type CheckboxRootChangeEventDetails,
} from "@base-ui/react/checkbox";
import { useComposedRefs } from "@telegraph/compose-refs";
import {
  type AsAndTgphRefProps,
  type RemappedOmit,
  type TgphElement,
  createTgphBaseUIRender,
} from "@telegraph/helpers";
import { Icon } from "@telegraph/icon";
import { Stack, type StackProps } from "@telegraph/layout";
import { Text, type TextProps } from "@telegraph/typography";
import { Check, Minus } from "lucide-react";
import {
  type CSSProperties,
  Children,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  createContext,
  isValidElement,
  useCallback,
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
  type CheckboxColor,
  type CheckboxSize,
  LABEL_SIZE_MAP,
} from "./Checkbox.constants";

type InternalContextType = {
  size: CheckboxSize;
  color: CheckboxColor;
  disabled: boolean;
  indeterminate: boolean;
  parent: boolean;
  id: string;
  labelId: string;
  /**
   * The id Base UI actually put on the hidden input, which is not always the
   * `id` we passed: inside a select-all group it derives its own and discards
   * ours. `Checkbox.Label` needs the real one or `htmlFor` points at nothing.
   */
  inputId?: string;
  registerInputId: (id: string) => void;
  /**
   * Whether a `Checkbox.Label` is among the children. Decided during render,
   * not in an effect: the control has to emit `aria-labelledby` in the very
   * first pass or server-rendered markup ships with an unnamed checkbox.
   *
   * When no label is found the control leaves `aria-labelledby` unset, so Base
   * UI can fall back to a wrapping `<label>` or a `Field.Label`.
   */
  hasLabel: boolean;
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (
    value: boolean,
    eventDetails: CheckboxRootChangeEventDetails,
  ) => void;
  formValue?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

const CheckboxContext = createContext<InternalContextType>({
  size: "2",
  color: "blue",
  disabled: false,
  indeterminate: false,
  parent: false,
  id: "",
  labelId: "",
  registerInputId: () => {},
  hasLabel: false,
});

/**
 * Counts `Checkbox.Label` children, walking into plain wrappers so a label
 * inside a `Stack` still counts. It cannot see through a custom component; in
 * that case `hasLabel` stays false and Base UI names the control from the
 * rendered `<label for>` instead, which is the right fallback.
 */
const countLabels = (node: ReactNode): number =>
  Children.toArray(node).reduce<number>((total, child) => {
    if (!isValidElement(child)) return total;
    if (child.type === Label) return total + 1;
    const nested = (child.props as { children?: ReactNode }).children;
    return nested ? total + countLabels(nested) : total;
  }, 0);

export type RootBaseProps = {
  size?: CheckboxSize;
  color?: CheckboxColor;
  /** Whether the checkbox is ticked. Use `defaultValue` for an uncontrolled checkbox. */
  value?: boolean;
  /** Initial ticked state for an uncontrolled checkbox. */
  defaultValue?: boolean;
  /**
   * Called with the new ticked state. The second argument is Base UI's event
   * detail: it carries the native event (`eventDetails.event`, useful for
   * shift-click range selection) and `eventDetails.cancel()`.
   */
  onValueChange?: (
    value: boolean,
    eventDetails: CheckboxRootChangeEventDetails,
  ) => void;
  /** Renders the mixed state: `aria-checked="mixed"` plus a dash indicator. */
  indeterminate?: boolean;
  /**
   * Marks this checkbox as the select-all for its group. Requires a
   * `CheckboxGroup` with `allValues`; the group derives this checkbox's
   * checked and indeterminate state, so don't pass `value` alongside it.
   */
  parent?: boolean;
  /**
   * The string submitted with the form. Inside a `CheckboxGroup` this is also
   * the key the group tracks this checkbox by. Falls back to `name`.
   */
  formValue?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  id?: string;
};

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
    indeterminate = false,
    parent = false,
    formValue,
    name,
    disabled: disabledProp,
    required = false,
    readOnly = false,
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
  const color = colorProp ?? group?.color ?? "blue";
  // `disabled` is the exception: Base UI ORs the group's value over the
  // checkbox's own (`CheckboxRoot.js`), so a group that disables its children
  // cannot be opted out of. Match that here or the label styles itself enabled
  // over a control Base UI has already disabled.
  const disabled = group?.disabled || disabledProp || false;

  const generatedId = useId();
  const id = idProp || generatedId;
  const labelId = `${id}-label`;

  const [inputId, setInputId] = useState<string>();
  const registerInputId = useCallback((nextId: string) => {
    setInputId(nextId);
  }, []);

  const labelCount = useMemo(() => countLabels(children), [children]);
  const hasLabel = labelCount > 0;

  // Combinations that do nothing at all rather than failing loudly.
  const hasOwnValue = value !== undefined || defaultValue !== undefined;
  const inGroup = group !== null;
  const groupHasAllValues = group?.hasAllValues ?? false;
  const untrackedInGroup = inGroup && !parent && !formValue && !name;
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (labelCount > 1) {
      console.warn(
        "Checkbox warning: more than one `Checkbox.Label` under a single " +
          "`Checkbox.Root`. They share one id, which is invalid HTML. Use one " +
          "label per checkbox.",
      );
    }
    if (untrackedInGroup) {
      console.warn(
        "Checkbox warning: a checkbox inside a `CheckboxGroup` needs a `name` " +
          "or a `formValue`. Without one the group cannot track it, so it never " +
          "appears in the group value and never reaches `onValueChange`.",
      );
    }
    if (parent && !groupHasAllValues) {
      console.warn(
        "Checkbox warning: `parent` needs a `CheckboxGroup` with `allValues` to " +
          "derive its state. Without it the select-all checkbox toggles nothing.",
      );
    }
    if (inGroup && hasOwnValue) {
      console.warn(
        "Checkbox warning: a checkbox inside a `CheckboxGroup` ignores its own " +
          "`value` / `defaultValue`. The group owns the selection — set it on " +
          "the group instead, keyed by this checkbox's `formValue` (or `name`).",
      );
    }
  }, [
    parent,
    groupHasAllValues,
    inGroup,
    hasOwnValue,
    labelCount,
    untrackedInGroup,
  ]);

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
        registerInputId,
        hasLabel,
        value,
        defaultValue,
        onValueChange,
        formValue,
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
        direction="row"
        align="center"
        gap="2"
        display="flex"
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

type BaseCheckboxRootProps = ComponentPropsWithoutRef<typeof BaseCheckbox.Root>;

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

export type ControlProps = RemappedOmit<
  BaseCheckboxRootProps,
  | "checked"
  | "className"
  | "defaultChecked"
  // `Checkbox.Root` owns these and forwards them here. Left open, a value
  // passed through `controlProps` would spread over the one the root resolved
  // and leave the control live under a root and label styled disabled.
  | "disabled"
  | "readOnly"
  | "required"
  | "id"
  | "indeterminate"
  | "name"
  // Base UI moves the id onto the rendered element and warns that it expected a
  // native `<button>`, which breaks `Checkbox.Label`'s `htmlFor`.
  | "nativeButton"
  | "onCheckedChange"
  | "parent"
  | "render"
  | "style"
  | "value"
> & {
  // Base UI types both of these as `string | ((state) => string)`. They land on
  // the styled `Stack`, which takes the plain forms.
  className?: string;
  style?: CSSProperties;
  tgphRef?: Ref<HTMLElement>;
};

const Control = (controlProps: ControlProps) => {
  const {
    className,
    style,
    tgphRef,
    inputRef,
    // Omitting these from `ControlProps` only stops a type-checked caller.
    // They are spread below, after the values the root resolved, so anything
    // that slips through untyped would win. Drop them here instead.
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    ...props
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

  return (
    <BaseCheckbox.Root
      inputRef={composedInputRef}
      id={context.id}
      name={context.name}
      value={context.formValue}
      checked={context.value}
      defaultChecked={context.defaultValue}
      indeterminate={context.indeterminate}
      parent={context.parent}
      disabled={context.disabled}
      required={context.required}
      readOnly={context.readOnly}
      aria-label={context["aria-label"]}
      aria-describedby={context["aria-describedby"]}
      // An explicit `aria-labelledby` wins. Otherwise point at our own label,
      // but only when one exists: a dangling IDREF names nothing and also stops
      // Base UI falling back to a wrapping `<label>` or a `Field.Label`.
      aria-labelledby={
        context["aria-labelledby"] ??
        (context["aria-label"] || !context.hasLabel
          ? undefined
          : context.labelId)
      }
      onCheckedChange={(checked, eventDetails) =>
        context.onValueChange?.(checked, eventDetails)
      }
      {...props}
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
            borderColor={active ? backgroundColor : "gray-6"}
            bg={active ? backgroundColor : "surface-1"}
            data-tgph-checkbox-control
            data-tgph-checkbox-size={context.size}
            data-tgph-checkbox-color={context.color}
            className={className}
            tgphRef={tgphRef}
            style={style}
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
export type LabelProps<T extends TgphElement = "label"> = RemappedOmit<
  TextProps<T>,
  "as"
> & {
  as?: T;
};

const Label = <T extends TgphElement = "label">(labelProps: LabelProps<T>) => {
  const { as, style, ...props } = labelProps as LabelProps<"label">;
  const context = useContext(CheckboxContext);

  return (
    <Text
      as={as || "label"}
      // The id Base UI actually used, falling back to ours before the input
      // has mounted. Inside a select-all group these differ.
      htmlFor={context.inputId ?? context.id}
      id={context.labelId}
      size={LABEL_SIZE_MAP[context.size]}
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
