export type Option = { value: string; label?: string };
export const isMultiSelect = (
  value: Option | Array<Option>,
): value is Array<Option> => {
  return Array.isArray(value);
};

export const isSingleSelect = (
  value: Option | Array<Option>,
): value is Option => {
  return typeof value === "object" && !Array.isArray(value);
};
