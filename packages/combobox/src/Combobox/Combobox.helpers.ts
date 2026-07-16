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

export const getOptions = (
  children: React.ReactNode,
  isOptionElement: (element: React.ReactElement) => boolean,
): Array<DefinedOption> => {
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
        if (isOptionElement(child)) {
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
  renderedText?: string[];
  searchQuery: string;
};

// Compares text the way it reads on screen: case-insensitive, with runs of
// whitespace collapsed. Collapsing matters because text assembled from sibling
// nodes ("Kyle " + "McDonald") would otherwise carry a doubled gap that no
// realistic query contains, and because pasted queries carry stray whitespace.
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

  // Search the option value and any rendered text because labels can be
  // supplied through nested React children. Joining the strings lets a query
  // spanning sibling nodes ("Kyle McDonald") match.
  const childText = normalize(findStringNodes(children).join(" "));

  // renderedText holds the option's captured DOM text variants. They're what
  // make text produced inside child components searchable — that text exists
  // only in render output, which the element walk above can't reach.
  return (
    normalize(value ?? "").includes(query) ||
    childText.includes(query) ||
    (renderedText ?? []).some((variant) => normalize(variant).includes(query))
  );
};

// Extracts an option's on-screen text for search matching. Returns both
// joining variants because DOM text nodes alone can't settle word boundaries:
// raw concatenation keeps words split by inline markup intact ("<b>K</b>yle"
// stays "Kyle"), while space-joining keeps words in separate elements apart
// ("<span>Kyle</span><span>Smith</span>" reads "Kyle Smith", not "KyleSmith").
// The variants stay separate strings so a query can only match text that
// actually appears in one of them, never across an artificial seam.
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
export const findStringNodes = (children: React.ReactNode): string[] => {
  const childrenArray = React.Children.toArray(children);
  const strNodes: string[] = [];

  childrenArray.forEach((child) => {
    if (typeof child === "string") {
      strNodes.push(child);
    }

    // React renders numbers as text, so they're searchable like strings.
    if (typeof child === "number") {
      strNodes.push(String(child));
    }

    if (React.isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      // Recurse unconditionally. A falsy but renderable child like 0 still
      // contributes text, and an absent one just yields an empty array.
      strNodes.push(...findStringNodes(childProps.children as React.ReactNode));
    }
  });

  return strNodes;
};
