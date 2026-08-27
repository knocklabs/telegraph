export type DefinedOption = {
  value: string;
  label?: string | React.ReactNode;
};

export type ComboboxValue = string | Array<string>;

export type SingleSelect = {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
};

export type MultiSelect = {
  value?: Array<string>;
  onValueChange?: (value: Array<string>) => void;
};
