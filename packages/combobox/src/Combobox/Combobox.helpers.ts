import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";

import type { DefinedOption, Option } from "./Combobox.types";

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

export const getOptions = (children: ReactNode): Array<DefinedOption> => {
  const recursivelyFindOptionElements = (
    children: ReactNode,
    options: Array<ReactNode> = [],
  ) => {
    const childrenArray = Children.toArray(children);

    childrenArray.forEach((child) => {
      if (isValidElement(child)) {
        const childProps = child.props as Record<string, unknown>;
        if (childProps.value) {
          // If it has a value prop, it's an option
          options.push(child);
        } else if (childProps.children) {
          // If it has children, recursively search them
          recursivelyFindOptionElements(
            childProps.children as ReactNode,
            options,
          );
        }
      }
    });

    return options;
  };

  const optionElements = recursivelyFindOptionElements(children);

  const options = optionElements.map((_element) => {
    const element = _element as ReactElement<{
      value: string;
      label?: string | ReactNode;
      children?: ReactNode;
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
    return (option as DefinedOption)?.value;
  }

  return option as string;
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

export const getOptionAccessibleLabel = (option?: DefinedOption) => {
  if (!option) {
    return undefined;
  }

  if (
    typeof option.label === "string" ||
    typeof option.label === "number" ||
    typeof option.label === "bigint"
  ) {
    return String(option.label);
  }

  return option.value;
};

type DoesOptionMatchSearchQueryProps = {
  children?: ReactNode;
  value?: string;
  searchQuery: string;
};

export const doesOptionMatchSearchQuery = ({
  children,
  value,
  searchQuery,
}: DoesOptionMatchSearchQueryProps) => {
  const childStrings = findStringNodes(children);

  return (
    value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    childStrings.some((str) =>
      str.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  );
};

// Exported for testing
export const findStringNodes = (children: ReactNode): string[] => {
  const childrenArray = Children.toArray(children);
  const strNodes: string[] = [];

  childrenArray.forEach((child) => {
    if (typeof child === "string") {
      strNodes.push(child);
    }

    if (isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      if (childProps.children) {
        strNodes.push(...findStringNodes(childProps.children as ReactNode));
      }
    }
  });

  return strNodes;
};
