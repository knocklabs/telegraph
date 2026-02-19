import { type LucideIcon } from "@telegraph/icon";

import type { InternalFilterState } from "./useInternalStateController";

export type FilterOptionValue = string | boolean | number;

export type MenuContextValue = {
  parameterContext: ParameterProps;
  children: React.ReactNode;
  isSearchable?: boolean;
};

export type FilterContextValue = {
  isOpen: boolean;
  setMenuOpen: (isOpen: boolean) => void;
  menuContext: MenuContextValue | null;
  setMenuContext: React.Dispatch<React.SetStateAction<MenuContextValue | null>>;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  stateControl: InternalFilterState;
  triggerRef: React.RefObject<HTMLDivElement | null>;
};

export type FilterProps = {
  children: React.ReactNode;
};

export type TriggerProps = {
  children: React.ReactNode;
};

export type ContentProps = {
  children: React.ReactNode;
  isTopSearchable?: boolean;
};

/**
 * A Menu is a generic way to refer to a menu of options
 * It can be a submenu for nested display purposes or
 * render a list of options for a filter
 */
export type MenuProps = {
  /**
   * Display name for this node
   */
  name?: string;
  /**
   * Icon to render in the menu
   */
  icon?: LucideIcon;
  /**
   * Hotkey to use for navigating to this option
   */
  hotKey?: string;
  /**
   * Should the list render a combobox to filter the items
   */
  isSearchable?: boolean;
  children?: React.ReactNode;
};

export type ParameterBaseProps = {
  children: React.ReactNode;
  /**
   * Required. The key for the parameter.
   */
  value: string;
  /**
   * Whether or not multiple options can be selected
   */
  isMulti?: boolean;
  /**
   * Display name for this filter
   */
  name?: string;
  /**
   * Icon to render for this filter when it's active
   */
  icon?: LucideIcon;
};

export type MultiSelectParameterProps = ParameterBaseProps & {
  /**
   * The plural noun for the parameter.
   * This will be used to generate the label for the parameter.
   * e.g. "workflow" -> "workflows"
   */
  pluralNoun: string;
  /**
   * Whether or not multiple options can be selected
   */
  isMulti?: true;
};

export type SingleSelectOptionProps = ParameterBaseProps & {
  /**
   * Not needed for single select options
   */
  pluralNoun?: never;
  isMulti?: false;
};

export type ParameterProps =
  | MultiSelectParameterProps
  | SingleSelectOptionProps;

/**
 * Values that child menus can access about their parent parameter
 */
export type FilterKeyContextProps = Omit<ParameterProps, "children">;

export type OptionProps = {
  value: FilterOptionValue;
  name?: string;
  hotKey?: string;
  icon?: LucideIcon;
};
