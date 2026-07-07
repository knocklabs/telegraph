type SegmentedControlType = "single" | "multiple";
type SegmentedControlValue<
  T extends SegmentedControlType = SegmentedControlType,
> = T extends "multiple" ? string[] : string;
type AnySegmentedControlValue = SegmentedControlValue<SegmentedControlType>;

const ROVING_FOCUS_KEYS = [
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
];

const PRIVATE_VALUE_PREFIX = "__tgph_segmented_control_value__";
const EMPTY_STRING_VALUE = `${PRIVATE_VALUE_PREFIX}empty`;
const ESCAPED_VALUE_PREFIX = `${PRIVATE_VALUE_PREFIX}escaped__`;

const getBaseToggleValue = (value: string) => {
  if (value === "") {
    // Base UI ToggleGroup treats empty string as no value, but Telegraph has
    // historically allowed it as a real option value.
    return EMPTY_STRING_VALUE;
  }

  if (value.startsWith(PRIVATE_VALUE_PREFIX)) {
    // Escape caller values that look like our sentinel values so round-tripping
    // never turns a real user value into an internal marker.
    return `${ESCAPED_VALUE_PREFIX}${value}`;
  }

  return value;
};

const getLegacyToggleValue = (value: string) => {
  if (value === EMPTY_STRING_VALUE) {
    // Decode the sentinel back to the public Telegraph value shape.
    return "";
  }

  if (value.startsWith(ESCAPED_VALUE_PREFIX)) {
    // Remove only the escape prefix, leaving the caller's original private-looking
    // value intact.
    return value.slice(ESCAPED_VALUE_PREFIX.length);
  }

  return value;
};

const getBaseToggleGroupValue = (
  value: AnySegmentedControlValue | undefined,
): readonly string[] | undefined => {
  if (value === undefined) {
    // Leave undefined alone so Base UI can stay uncontrolled.
    return undefined;
  }

  return Array.isArray(value)
    ? value.map(getBaseToggleValue)
    : [getBaseToggleValue(value)];
};

const getLegacyToggleGroupValue = (
  type: SegmentedControlType,
  value: string[],
): AnySegmentedControlValue => {
  // Base UI always reports an array; Telegraph's single mode reports one value.
  return type === "multiple"
    ? value.map(getLegacyToggleValue)
    : getLegacyToggleValue(value[0] ?? "");
};

export {
  ROVING_FOCUS_KEYS,
  getBaseToggleValue,
  getBaseToggleGroupValue,
  getLegacyToggleGroupValue,
};
export type {
  AnySegmentedControlValue,
  SegmentedControlType,
  SegmentedControlValue,
};
