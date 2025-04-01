import {
  FilterOption,
  OPERATORS,
  OPERATOR_CONFIGS,
  OperatorValue,
} from "./useInternalStateController";

/**
 * Get the operator options based on the number of active options
 * @param numActive - The number of active options
 * @returns The operator options
 */
const getOperatorOptions = (numActive: number): OperatorValue[] => {
  const operatorOptions = Object.values(OPERATORS);

  // When a multi-select, with one option: show supportsSingleSelect only
  // When a multi-select, with multiple options: show supportsMultiSelect only
  // When a single-select, with one option: show supportsSingleSelect
  const validOperatorOptions = operatorOptions.filter((v) => {
    const config = OPERATOR_CONFIGS[v];
    const showOnlySingleSelectOption = numActive === 1;
    return showOnlySingleSelectOption
      ? config.supportsSingleSelect
      : config.supportsMultiSelect && !config.supportsSingleSelect;
  });

  return validOperatorOptions;
};

/**
 * Get the icon of the selected value, renders within the chip post-selection
 * @param active - The active value from state
 * @returns The icon of the selected value
 */
const getSelectedIcon = (active: FilterOption | FilterOption[]) => {
  // If a multi-select and one value, show the icon of the selected value if it exists
  // if there are multiple values, we don't want to show an icon
  // if a single-select, show the icon of the selected value if it exists

  // Multi-select
  if (Array.isArray(active)) {
    // Use the icon if there's only one value
    if (active.length === 1 && active[0]?.icon) {
      return active[0].icon;
    }

    // If there are multiple values, we don't want to show an icon, going to render "2 items"
    if (active.length > 1) {
      return undefined;
    }

    // If there are no values, we don't want to show an icon, mostly just to make TS happy
    return undefined;
  }

  // Single-select
  if (active?.icon) {
    return active.icon;
  }

  return undefined;
};

/**
 * Get the label of the selected value, renders within the chip post-selection
 * @param active - The active value from state
 * @param pluralNoun - The plural noun for the parameter
 * @returns The label of the selected value
 */
const getSelectedLabel = (
  active: FilterOption | FilterOption[],
  pluralNoun: string,
) => {
  // Multi-select
  if (Array.isArray(active)) {
    if (active.length > 1) {
      // "2 items"
      return `${active.length} ${pluralNoun}`;
    }

    if (active.length === 1 && active[0]) {
      // Name of the single selected value
      return active[0].name ?? active[0].value;
    }

    // If there are no values, we don't want to show an icon, mostly just to make TS happy
    return undefined;
  }

  // Single-select
  if (active?.name) {
    return active.name;
  }

  // If there is no name, we'll just show gthe value
  return active.value;
};

/**
 * Get the operator based on the number of active options
 * @param numActive - The number of active options
 * @returns The operator
 */
const getOperator = (numActive: number) => {
  const operator = numActive > 1 ? OPERATORS.isAnyOf : OPERATORS.is;

  return operator;
};

export { getOperatorOptions, getSelectedIcon, getSelectedLabel, getOperator };
