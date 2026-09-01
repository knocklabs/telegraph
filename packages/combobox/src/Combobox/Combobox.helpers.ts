import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";

import type { DefinedOption } from "./Combobox.types";

export const isMultiSelect = <T>(
  value: T | Array<T> | undefined,
): value is Array<T> => {
  return Array.isArray(value);
};

export const isSingleSelect = <T>(
  value: T | Array<T> | undefined,
): value is T | undefined => {
  return !Array.isArray(value);
};

type GetOptionsProps = {
  children: ReactNode;
  isOptionElement: (element: ReactElement) => boolean;
  isOptionsElement: (element: ReactElement) => boolean;
};

const getOptionElements = ({
  children,
  isOptionElement,
  isOptionsElement,
}: GetOptionsProps): Array<ReactElement> => {
  const recursivelyFindOptionElements = (
    children: ReactNode,
    options: Array<ReactNode> = [],
    insideOptions = false,
  ) => {
    // Find the Options collection first, then walk its grouping/layout wrappers.
    // Other popup controls can also carry `value` props, but only descendants of
    // Combobox.Options participate in selection and filtering.
    const childrenArray = Children.toArray(children);

    childrenArray.forEach((child) => {
      if (isValidElement(child)) {
        const childProps = child.props as Record<string, unknown>;
        const childIsOptions = isOptionsElement(child);

        if (insideOptions && isOptionElement(child)) {
          options.push(child);
        } else if (childProps.children) {
          recursivelyFindOptionElements(
            childProps.children as ReactNode,
            options,
            insideOptions || childIsOptions,
          );
        }
      }
    });

    return options;
  };

  return recursivelyFindOptionElements(children) as Array<ReactElement>;
};

export const getOptions = ({
  children,
  isOptionElement,
  isOptionsElement,
}: GetOptionsProps): Array<DefinedOption> => {
  const optionElements = getOptionElements({
    children,
    isOptionElement,
    isOptionsElement,
  });

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
  value: string | undefined,
  options: Array<DefinedOption>,
): DefinedOption | undefined => {
  if (!value) return undefined;
  if (!options || options.length === 0) return undefined;

  const foundOption = options.find((o) => o.value === value);

  if (!foundOption) return undefined;

  return foundOption;
};

type DoesOptionMatchSearchQueryProps = {
  children?: ReactNode;
  value?: string;
  renderedText?: string[];
  searchQuery: string;
};

// Lowercase and collapse whitespace so joined sibling text and pasted
// queries compare like on-screen text.
const normalize = (text: string) =>
  text.replace(/\s+/g, " ").trim().toLowerCase();

export const doesOptionMatchSearchQuery = ({
  children,
  value,
  renderedText,
  searchQuery,
}: DoesOptionMatchSearchQueryProps) => {
  const query = normalize(searchQuery);

  if (!query) return true;

  // Join child strings so a query can span sibling nodes
  const childText = normalize(findStringNodes(children).join(" "));

  // renderedText covers text rendered inside child components, which the
  // element walk can't reach
  return (
    normalize(value ?? "").includes(query) ||
    childText.includes(query) ||
    (renderedText ?? []).some((variant) => normalize(variant).includes(query))
  );
};

// Returns the element's text two ways: concatenated (keeps words split by
// inline markup whole) and space-joined (keeps words in separate elements
// apart). Kept as separate strings so a query can't match across the seam.
export const getRenderedSearchText = (element: Element | null): string[] => {
  if (!element) return [];

  const parts: string[] = [];
  const collect = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
      parts.push(node.nodeValue);
    }
    node.childNodes.forEach(collect);
  };
  collect(element);

  return [parts.join(""), parts.join(" ")];
};

// Exported for testing
export const findStringNodes = (children: ReactNode): string[] => {
  const childrenArray = Children.toArray(children);
  const strNodes: string[] = [];

  childrenArray.forEach((child) => {
    if (typeof child === "string") {
      strNodes.push(child);
    }

    // Numbers render as text, so they're searchable
    if (typeof child === "number") {
      strNodes.push(String(child));
    }

    if (isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      // Recurse even when children is falsy, since 0 still renders
      strNodes.push(...findStringNodes(childProps.children as ReactNode));
    }
  });

  return strNodes;
};
