import type { LucideIcon } from "@telegraph/icon";
import React from "react";

import { getOperator } from "./helpers";
import { FilterOptionValue, OptionProps } from "./types";

export type UseInternalFilterStateProps = {
  /**
   * Whether to use query params to store the filter state
   */
  useQueryParams?: boolean;
};

/**
 * Values for the operators.
 *
 * These values may be used in the URL query params, so they must be URL-safe.
 * Query params may look like this:
 * `?drinks=is:sodas,milk&foods=is_not:fruits,vegetables`
 *
 * We can get our value + operator via splitting at `:` → `["is", "sodas,milk"]`
 * and split at `,` → `["sodas", "milk"]`
 *
 * We can then use the operator to determine how to process the value.
 *
 * TODO: Account for multi-select values, "is one of", "contains", etc.
 */
export const OPERATORS = {
  is: "is",
  isAnyOf: "is_any_of",
} as const;

export const OPERATOR_CONFIGS = {
  [OPERATORS.is]: {
    label: "is",
    supportsSingleSelect: true,
    supportsMultiSelect: true,
  },
  [OPERATORS.isAnyOf]: {
    label: "is any of",
    supportsSingleSelect: false,
    supportsMultiSelect: true,
  },
} as const;

export const DEFAULT_OPERATOR = OPERATORS.is;
export type Operator = keyof typeof OPERATORS;
export type OperatorValue = (typeof OPERATORS)[Operator];

export type FilterOption = Pick<OptionProps, "value" | "name" | "icon">;

export type FilterStateValue = {
  /**
   * The param key to use for the filter
   */
  filterKey: string;
  /**
   * The operator to use for the filter
   * e.g. "is" or "is_any_of"
   */
  operator: OperatorValue;
  /**
   * Active options for this parameter
   */
  active: FilterOption | FilterOption[];
  /**
   * Top-level display name for the parameter
   */
  filterName?: string;
  /**
   * Top-level icon for the parameter
   */
  icon?: LucideIcon;
  /**
   * Whether the value is an array
   */
  isMulti?: boolean;
  /**
   * The plural noun for the parameter
   */
  pluralNoun?: string;
};

// Our filter state can receive a variety of data for passing it around to different places to render
// Will only accept one value at a time
export type FilterFunctionParams = Omit<FilterStateValue, "active"> & {
  /**
   * The upserted option to use for the filter
   */
  option: FilterOption;
};

type FilterState = Record<string, FilterStateValue>;

/**
 * Let's say we have a grocery list and we want to filter by certain categories
 * Here in our example, the filter state will be refining to show only certain drinks and foods
 * Internally, state will look like this:
 *
 * {
 *  "drinks": {
 *    "active": [
 *      {
 *        "value": "sodas",
 *        "name": "Sodas",
 *        "icon": Lucide.CupSoda
 *      },
 *      {
 *        "value": "milk",
 *        "name": "Milk",
 *        "icon": Lucide.CupMilk
 *      }
 *    ],
 *    "operator": "is_any_of",
 *    "paramName": "Drinks",
 *    "filterKey": "drinks",
 *    "icon": Lucide.CupSoda,
 *    "isMulti": true,
 *    "pluralNoun": "drinks"
 *  },
 *  "foods": {...}
 * }
 */

/**
 * **To reference this in downstream components, use the `stateControl` property on the useFilter() hook.**
 *
 * This state controller for filters provides functions to manipulate filter state easily and predictably.
 *
 * This hook should be used only once directly, internally, at the top level of the Filter.Root component.
 */
export const useInternalFilterState = () => {
  const [filterState, setFilterState] = React.useState<FilterState>({});

  /**
   * Add a value to the filter state
   * For arrays, add the value to the array
   * For single values, set the value
   */
  const add = (filterKey: string, filterObj: FilterFunctionParams) => {
    // Pull out things we don't want to spread on the FilterStateValue
    const { option, ...rest } = filterObj;
    const { isMulti = false } = rest;

    setFilterState((prev) => {
      const currentFilterObj = prev[filterKey];
      const currentValue = isMulti
        ? ((currentFilterObj?.active || []) as FilterOption[])
        : (currentFilterObj?.active as FilterOption);

      // What the length will be after adding the new value
      // Important for determining the operator below
      // Length of a single-select will always be 1
      const newLength = Array.isArray(currentValue)
        ? currentValue.length + 1
        : 1;

      // Handle adjusting the operator based on the number of values in an array on update
      const operator = getOperator(newLength);

      const newFilterState: FilterState = {
        // Maintain any existing state
        ...prev,
        [filterKey]: {
          // Maintain any existing state on this particular key
          ...currentFilterObj,
          // Spread any new stuff passed in, most commonly for initial creation
          ...rest,
          operator,
          // If an array, add the value to the array, otherwise just set the value
          active: Array.isArray(currentValue)
            ? [...currentValue, option]
            : option,
        },
      };
      return newFilterState;
    });
  };

  /**
   * Remove a value from the filter state
   * For arrays, remove the value from the array
   * For single values, remove the key from state
   * For both, if empty, remove the key from state
   */
  const remove = (filterKey: string, value: FilterOptionValue) => {
    const currentFilterObj = filterState[filterKey] as FilterStateValue;
    const currentValue = currentFilterObj.active;

    // newValue will always be null if it's not an array
    // For non multi-select, we're just going to unset the value
    const newValue = Array.isArray(currentValue)
      ? currentValue.filter((v) => v.value !== value)
      : null;

    // What the length will be after adding the new value
    // Important for determining the operator below
    // Length of a single-select will always be 1
    const newLength = Array.isArray(newValue) ? newValue.length : 1;

    // Handle adjusting the operator based on the number of values in an array on update
    const operator = getOperator(newLength);

    // If the value is null or an empty array, remove the key
    const shouldRemoveKey = !newValue || newValue?.length === 0;

    // If the value is empty or null, remove the key
    if (shouldRemoveKey) {
      return setFilterState((prev) => {
        const newFilterState = { ...prev };
        delete newFilterState[filterKey];
        return newFilterState;
      });
    }

    // If there are still values in the array, update the value
    return setFilterState(
      (prev) =>
        ({
          ...prev,
          [filterKey]: {
            ...currentFilterObj,
            active: newValue,
            operator,
          },
        }) as FilterState,
    );
  };

  /**
   * Update a key in the filter state
   */
  const updateKey = (
    filterKey: string,
    newFilterObj: Partial<FilterStateValue>,
  ) => {
    // If the key doesn't exist, do nothing
    if (!filterState[filterKey]) {
      console.warn(
        `Calling updateKey on ${filterKey} but it does not exist in filter state`,
      );
      return;
    }
    // Maintain existing state and spread any updates onto the existing key
    return setFilterState(
      (prev) =>
        ({
          ...prev,
          [filterKey]: {
            ...prev[filterKey],
            ...newFilterObj,
          },
        }) as FilterState,
    );
  };

  /**
   * Remove a specific key from the filter state
   */
  const clearKey = (filterKey: string) => {
    // If the key doesn't exist, do nothing
    if (!filterState[filterKey]) return;
    return setFilterState((prev) => {
      const newFilterState = { ...prev };
      delete newFilterState[filterKey];
      return newFilterState;
    });
  };

  /**
   * Reset to an empty filter state
   */
  const reset = () => {
    return setFilterState({});
  };

  /**
   * Check if a specific key/value pair is present in the filter state
   */
  const isKeyValueActive = (filterKey: string, value: FilterOptionValue) => {
    const currentFilterObj = filterState[filterKey];
    const currentValue = currentFilterObj?.active;
    return Array.isArray(currentValue)
      ? !!currentValue.find((v) => v.value === value)
      : currentValue?.value === value;
  };

  /**
   * Toggle the presence of a specific key/value pair in the filter state
   * if the value is already present, remove it, otherwise add it
   * functions like an upsert for a specific key/value pair
   */
  const toggle = (filterKey: string, filterObj: FilterFunctionParams) => {
    const { option } = filterObj;
    const isValueActive = isKeyValueActive(filterKey, option.value);

    return isValueActive
      ? remove(filterKey, option.value)
      : add(filterKey, filterObj);
  };

  /**
   * Get the value of a specific key in the filter state
   */
  const getValue = (filterKey: string) => {
    const currentFilterObj = filterState[filterKey];
    const currentValue = currentFilterObj?.active;
    return currentValue;
  };

  return {
    state: filterState,
    add,
    remove,
    updateKey,
    clearKey,
    reset,
    toggle,
    getValue,
    isKeyValueActive,
  };
};

export type InternalFilterState = ReturnType<typeof useInternalFilterState>;
