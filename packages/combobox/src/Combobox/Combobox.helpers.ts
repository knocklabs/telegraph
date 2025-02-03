import React from "react";

export type DefinedOption = { value: string; label?: string | React.ReactNode };
export type Option = DefinedOption | string | React.ReactNode;
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
    const childrenArray = React.Children.toArray(children);

    childrenArray.forEach((child) => {
      if (React.isValidElement(child)) {
        if (child.props.value) {
          // If it has a value prop, it's an option
          options.push(child);
        } else if (child.props.children) {
          // If it has children, recursively search them
          recursivelyFindOptionElements(child.props.children, options);
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

type DoesOptionMatchSearchQueryProps = {
  label?: string;
  value?: string;
  searchQuery: string;
};

export const doesOptionMatchSearchQuery = ({
  label,
  value,
  searchQuery,
}: DoesOptionMatchSearchQueryProps) => {
  return (
    value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    label?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
