export type DefinedOption = {
  value: string;
  label?: string | React.ReactNode;
};
export type Option = DefinedOption | string | React.ReactNode;

export type SingleSelect = {
  value?: Option;
  onValueChange?: (value: Option | undefined) => void;
};

export type MultiSelect = {
  value?: Array<Option>;
  onValueChange?: (value: Array<Option>) => void;
};
