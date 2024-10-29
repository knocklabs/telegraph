export type DefinedOption = { value: string; label?: string | React.ReactNode };
export type Option = DefinedOption | undefined;
export const isMultiSelect = (
  value: Option | Array<Option>,
): value is Array<Option> => {
  return Array.isArray(value);
};

export const isSingleSelect = (
  value: Option | Array<Option>,
): value is Option => {
  return (typeof value === "object" && !Array.isArray(value)) || !value;
};
