import React from "react";

import type { DefinedOption, Option } from "./Combobox.types";

export const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
export const LAST_KEYS = ["ArrowUp", "PageDown", "End"];
export const SELECT_KEYS = ["Enter", " "];

export const isMultiSelect = (
  value: Option | Array<Option> | undefined,
): value is Array<Option> => {
  return Array.isArray(value);
};

export const isSingleSelect = (
  value: Option | Array<Option> | undefined,
): value is Option => {
  return (
    (typeof value === "object" && !Array.isArray(value)) ||
    typeof value === "string" ||
    !value
  );
};

export const getOptions = (children: React.ReactNode): Array<DefinedOption> => {
  const recursivelyFindOptionElements = (
    children: React.ReactNode,
    options: Array<React.ReactNode> = [],
  ) => {
    // Options can be wrapped in grouping/layout components, so walk the child
    // tree instead of assuming direct Combobox.Option children.
    const childrenArray = React.Children.toArray(children);

    childrenArray.forEach((child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as Record<string, unknown>;
        if (childProps.value) {
          // Combobox.Option is identified by its public value prop.
          options.push(child);
        } else if (childProps.children) {
          // Non-option wrappers may still contain options further down.
          recursivelyFindOptionElements(
            childProps.children as React.ReactNode,
            options,
          );
        }
      }
    });

    return options;
  };

  const optionElements = recursivelyFindOptionElements(children);

  const options = optionElements.map((_element) => {
    const element = _element as React.ReactElement<{
      value: string;
      label?: string | React.ReactNode;
      children?: React.ReactNode;
    }>;
    return {
      value: element.props.value,
      label:
        element.props?.label || element.props.children || element.props.value,
    };
  });

  return options;
};

export const getValueFromOption = (
  option: Option | undefined,
  legacyBehavior: boolean,
): string | undefined => {
  if (!option) return undefined;

  if (legacyBehavior === true) {
    // Legacy callers store selected values as { value, label } objects.
    return (option as DefinedOption)?.value;
  }

  // Newer callers store the selected value directly as a string.
  return option as string;
};

export const getOptionAccessibleLabel = (option?: DefinedOption) => {
  if (!option) {
    return undefined;
  }

  if (typeof option.label === "string" && option.label !== "") {
    return option.label;
  }

  if (typeof option.label === "number" || typeof option.label === "bigint") {
    // aria-label needs text; React labels fall back to value below.
    return String(option.label);
  }

  return option.value;
};

export const getCurrentOption = (
  value: Option | undefined,
  options: Array<DefinedOption>,
  legacyBehavior: boolean,
): DefinedOption | undefined => {
  if (!value) return undefined;
  if (!options || options.length === 0) return undefined;

  const foundOption = options.find(
    (o) => o.value === getValueFromOption(value, legacyBehavior),
  );

  if (!foundOption) return undefined;

  return foundOption;
};

type DoesOptionMatchSearchQueryProps = {
  children?: React.ReactNode;
  value?: string;
  searchQuery: string;
};

export const doesOptionMatchSearchQuery = ({
  children,
  value,
  searchQuery,
}: DoesOptionMatchSearchQueryProps) => {
  // Search both the option value and any rendered text because labels can be
  // supplied through nested React children.
  const childStrings = findStringNodes(children);

  return (
    value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    childStrings.some((str) =>
      str.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  );
};

// Exported for testing
export const findStringNodes = (children: React.ReactNode): string[] => {
  const childrenArray = React.Children.toArray(children);
  const strNodes: string[] = [];

  childrenArray.forEach((child) => {
    if (typeof child === "string") {
      strNodes.push(child);
    }

    if (React.isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      if (childProps.children) {
        strNodes.push(
          ...findStringNodes(childProps.children as React.ReactNode),
        );
      }
    }
  });

  return strNodes;
};
