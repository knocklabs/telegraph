import { Button } from "@telegraph/button";
import { Combobox } from "@telegraph/combobox";
import { Input } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import { Menu } from "@telegraph/menu";
import { Text } from "@telegraph/typography";
import { SquareCheckBig } from "lucide-react";
import React from "react";

import {
  getOperatorOptions,
  getSelectedIcon,
  getSelectedLabel,
} from "./helpers";
import type {
  ContentProps,
  FilterContextValue,
  FilterProps,
  MenuContextValue,
  MenuProps,
  OptionProps,
  ParameterProps,
  TriggerProps,
} from "./types";
import {
  OPERATOR_CONFIGS,
  OperatorValue,
  useInternalFilterState,
} from "./useInternalStateController";
import {
  DEFAULT_OPERATOR,
  type FilterStateValue,
} from "./useInternalStateController";

/**
 * This will be our data store for the filter
 */
const FilterContext = React.createContext<FilterContextValue | null>(null);

/**
 * Hook to reuse the filter context
 */
export const useFilter = () => {
  const context = React.useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter must be used within a Filter.Root");
  }
  return context;
};

/**
 * The root component for the filter
 */
export const Root = ({ children }: FilterProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuContext, setMenuContext] = React.useState<MenuContextValue | null>(
    null,
  );
  const [searchValue, setSearchValue] = React.useState<string>("");
  const triggerRef = React.useRef<HTMLDivElement>(null);

  // Initialize state at the Root level, the only time this hook should be used
  const stateControl = useInternalFilterState();

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);

    if (!isOpen) {
      // Wait for the menu to close before resetting the state to avoid flickering
      setTimeout(() => {
        setMenuContext(null);
        setSearchValue("");
        triggerRef.current?.focus();
      }, 250);
    }
  };

  return (
    <FilterContext.Provider
      value={{
        isOpen,
        setMenuOpen: handleOpenChange,
        menuContext,
        setMenuContext,
        searchValue,
        setSearchValue,
        stateControl,
        triggerRef,
      }}
    >
      <Menu.Root open={isOpen} onOpenChange={handleOpenChange}>
        {children}
      </Menu.Root>
    </FilterContext.Provider>
  );
};

export const Trigger = ({ children }: TriggerProps) => {
  const { triggerRef } = useFilter();
  return (
    <Menu.Trigger tgphRef={triggerRef} asChild={true}>
      {children}
    </Menu.Trigger>
  );
};

/**
 * Content to render within the panel
 * This is where we can do some searchin'
 *
 * Desired behavior:
 * - autofocus the input, have a highlighted element below
 * - when enter is hit, select the first item
 * - when arrow down is hit once, remove focus from the input and move focus to the highlighted element below
 * - when arrow down is hit again, move focus to the next element down
 * - when arrow is down at the bottom, move focus to the input
 * - tldr: input should be another element in the stack, but we should have a psuedo active state for the first item to make it very snappy to use
 */
export const Content = ({
  children,
  isTopSearchable = false,
}: ContentProps) => {
  const { menuContext, searchValue, setSearchValue } = useFilter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const childrenRefs = React.useRef<Array<HTMLSpanElement>>([]);

  const isTopLevelMenu = !menuContext;
  const isSearchable =
    (isTopLevelMenu && isTopSearchable) || menuContext?.isSearchable;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchValue(searchValue);
  };

  const childrenToUse = isTopLevelMenu ? children : menuContext?.children;

  // Determines the children to render with regards to the search value
  const filteredChildren = React.useMemo(() => {
    // Important to reset the refs array so we don't have null or refs from the past in the array
    childrenRefs.current = [];
    // Focus the input when the menu opens, if there is one
    inputRef.current?.focus();
    return !searchValue
      ? childrenToUse
      : React.Children.toArray(childrenToUse).filter((child) => {
          // Check for TS
          if (React.isValidElement(child)) {
            let menuItemName = child.props?.name || "";
            let menuItemValue = child.props?.value || "";

            // Wild block of code to get the actual name and value to filter by
            // from the nested menu item within a nested Parameter component
            const componentType =
              child?.type as React.JSXElementConstructor<unknown>;
            const componentName = componentType?.name
              ? componentType?.name
              : "";
            // Name of the sub-component we defined
            if (componentName === "Parameter") {
              menuItemName = child?.props?.children?.props?.name || "";
              menuItemValue = child?.props?.children?.props?.value || "";
            }

            const shouldShowOption: boolean =
              menuItemName.toLowerCase().includes(searchValue.toLowerCase()) ||
              menuItemValue.toLowerCase().includes(searchValue.toLowerCase());

            return shouldShowOption;
          }
          return true;
        });
  }, [searchValue, childrenToUse]);

  // We add a ref to each child so we have an array of refs to work with
  // this helps us focus the correct item when we need to
  // Hacky because I can't get this to work with tgphRefs
  const childrenWithRefs = React.Children.map(
    filteredChildren,
    (child, index) => {
      return (
        <span
          ref={(el) => {
            if (el) {
              childrenRefs.current[index] = el;
            }
          }}
        >
          {child}
        </span>
      );
    },
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quick fix to remove null refs in case array size changes between renders
    // const els = childrenRefs.current.filter((ref) => ref !== null);
    // childrenRefs.current = els;
    const activeElement = document.activeElement;
    const isSearchInputFocused = activeElement === inputRef.current;
    const firstChild = childrenRefs.current[0];
    const lastChild = childrenRefs.current[childrenRefs.current.length - 1];
    const firstChildButton = firstChild?.firstElementChild as HTMLButtonElement;
    const lastChildButton = lastChild?.firstElementChild as HTMLButtonElement;
    const isFirstChildFocused = activeElement === firstChildButton;
    const isLastChildFocused = activeElement === lastChildButton;

    // We have to reimplement the loop behavior
    // so bottom elements cycle back to the top using arrow keys
    // and top elements cycle back to the bottom using arrow keys

    // No cycling for one item and no search input
    if (!isSearchable && childrenRefs.current.length === 1) {
      return;
    }

    // Trigger the first item for speedy navigation
    if (isSearchInputFocused && e.key === "Enter") {
      e.preventDefault();
      return firstChildButton?.click();
    }

    // Focus the first item when the user hits arrow down when they're in search input
    if (isSearchInputFocused && e.key === "ArrowDown") {
      e.preventDefault();
      return firstChildButton?.focus();
    }

    // Focus the first item when the user hits arrow down when they're in search input
    if (!isSearchable && isLastChildFocused && e.key === "ArrowDown") {
      e.preventDefault();
      return firstChildButton?.focus();
    }

    // Focus the first item when the user hits arrow up when they're in search input
    if (!isSearchable && isFirstChildFocused && e.key === "ArrowUp") {
      e.preventDefault();
      return lastChildButton?.focus();
    }

    // Focus the first item when the user hits arrow up when they're in search input
    if (isSearchable && isFirstChildFocused && e.key === "ArrowUp") {
      e.preventDefault();
      return inputRef.current?.focus();
    }

    // Focus the first item when the user hits arrow up when they're in search input
    if (isSearchable && isLastChildFocused && e.key === "ArrowDown") {
      e.preventDefault();
      return inputRef.current?.focus();
    }

    // Focus the last item when the user hits arrow up when they're in search input
    // Maybe we don't want this behavior?
    if (isSearchInputFocused && e.key === "ArrowUp") {
      e.preventDefault();
      return lastChildButton?.focus();
    }

    // Focus the search input when the user hits arrow up when they're on first item
    if (isFirstChildFocused && e.key === "ArrowUp") {
      e.preventDefault();
      return inputRef.current?.focus();
    }

    // Focus the search input when the user hits arrow down when they're on last item
    if (isLastChildFocused && e.key === "ArrowDown") {
      e.preventDefault();
      return inputRef.current?.focus();
    }
  };

  return (
    <Box onKeyDown={handleKeyPress}>
      <Menu.Content hideWhenDetached>
        <ParameterContext.Provider
          value={menuContext?.parameterContext || null}
        >
          {isSearchable && (
            <Input
              tgphRef={inputRef}
              type="text"
              value={searchValue}
              autoFocus
              placeholder={menuContext?.parameterContext?.name || "Search"}
              onChange={handleSearchChange}
            />
          )}
          {childrenWithRefs}
        </ParameterContext.Provider>
      </Menu.Content>
    </Box>
  );
};

const ParameterContext = React.createContext<ParameterProps | null>(null);

/**
 * Hook to reuse the context of the current filter key
 *
 * A filter will have a key, name, value, icon, etc.
 * This hook makes it easy to access that context from sub components.
 */
const useParameterContext = () => {
  const context = React.useContext(ParameterContext);
  if (!context) {
    throw new Error(
      "useFilterKeyContext must be used within a FilterKeyContext",
    );
  }
  return context;
};

/**
 * General sub menu, can be nested within each other infinitely
 * This will render an item that will navigate to a deeper menu
 */
export const FilterMenu = ({
  children,
  name,
  icon: iconProp,
  isSearchable,
}: MenuProps) => {
  const { setMenuContext, setSearchValue } = useFilter();
  const parameterContext = useParameterContext();

  // When the item is clicked, we navigate to the deeper menu
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Prevent the menu from auto closing on us
    event.preventDefault();

    // Reset the search value for the next menu
    setSearchValue("");

    // This is a little funky, but since we're going to replace the children we're rendering
    // via MenuContext update, we need to also wrap the new children in the filter key context so that
    // the new children can know what filter we're working with.
    setMenuContext({
      parameterContext,
      // This is the magic that renders the next menu, handled by Content component above
      children,
      isSearchable,
    });
  };

  const icon = iconProp
    ? { icon: iconProp, "aria-hidden": true as const }
    : undefined;

  return (
    <Menu.Button leadingIcon={icon} onClick={handleClick}>
      <Text as="span">{name}</Text>
    </Menu.Button>
  );
};

/**
 * Wrapper to pass filter key context to subcomponents.
 *
 * Keeping it composable gives us the flexibility to use nested filters,
 * e.g. a menu like
 * Account > isActive
 * OR
 * Account > Users (_change filter key_) > isAdmin
 */
export const Parameter = ({ isMulti = false, ...props }: ParameterProps) => {
  const context = { ...props, isMulti };
  return (
    // Initialize the parameter context around the menu
    // @ts-expect-error shut up for now
    <ParameterContext.Provider value={context}>
      {props.children}
    </ParameterContext.Provider>
  );
};

/**
 * A selectable filter option
 */
export const Option = ({ name, value, icon: optionIcon }: OptionProps) => {
  const { setMenuOpen, stateControl } = useFilter();
  const {
    isMulti,
    icon: filterIcon,
    name: filterName,
    value: filterKey,
    pluralNoun,
  } = useParameterContext();

  const updateFilterState = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // This block of code is to prevent the multi-select menu from auto-closing when the user clicks on an option
    const currentValue = stateControl.getValue(filterKey);
    const isRemoving = stateControl.isKeyValueActive(filterKey, value);
    if (!isRemoving) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (Array.isArray(currentValue)) {
      if (isRemoving && currentValue.length > 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    // If there's no children and no key, warn and do nothing
    if (!filterKey) {
      console.warn(
        `Filter menu warning: tried to set a filter but no key is active, make sure all of your Items have values or this filter won't set! Check the parent of \`${value}\``,
      );
      return;
    }

    // This is the main spot where we "lift" the filter option upwards to render a chip
    stateControl.toggle(filterKey, {
      filterKey,
      filterName,
      option: { value, name, icon: optionIcon },
      isMulti,
      icon: filterIcon,
      // In the future, we can pass this in as a prop or something
      operator: DEFAULT_OPERATOR,
      pluralNoun,
    });

    // After selection, close the menu if it's not a multi-select
    if (!isMulti) {
      setMenuOpen(false);
    }
  };

  // Find if the value is present in our state
  const isSelected = stateControl.isKeyValueActive(filterKey, value);

  const icon = isSelected
    ? { icon: SquareCheckBig, "aria-hidden": true as const }
    : optionIcon
      ? { icon: optionIcon, "aria-hidden": true as const }
      : undefined;

  return (
    <Menu.Button leadingIcon={icon} onClick={updateFilterState}>
      <Text as="span">{name || value}</Text>
    </Menu.Button>
  );
};

/**
 * A divider between items
 */
export const Divider = () => {
  return <Menu.Divider />;
};

/**
 * A chip to display an active filter
 */
export const Chip = (props: FilterStateValue) => {
  const { filterKey, active, operator, filterName, icon, pluralNoun } = props;
  const { stateControl } = useFilter();
  const { clearKey, updateKey } = stateControl;

  if (!active) {
    return null;
  }

  // We'll have to access the unselected values here as well to render the option change dropdown
  // or maybe we can just re-render our top-level node? it'll be the same menu...?

  // This is where we change the operator
  const handleComboboxChange = (newOperator: OperatorValue) => {
    updateKey(filterKey, { operator: newOperator });
  };

  // Determine the label of the rendered chip
  const selectedValueLabel = getSelectedLabel(active, pluralNoun || "items");

  // If a multi-select and one value, show the icon of the selected value if it exists
  // if there are multiple values, we don't want to show an icon
  // if a single-select, show the icon of the selected value if it exists
  const selectedValueIcon = getSelectedIcon(active);

  const selectedValueIconProp = selectedValueIcon
    ? { icon: selectedValueIcon, "aria-hidden": true as const }
    : undefined;

  const numActiveOptions = Array.isArray(active) ? active.length : 1;
  const validOperatorOptions = getOperatorOptions(numActiveOptions);

  return (
    // Remove this mt="4" when we have a way to render the chips in a row
    <Stack direction="row" align="center" my="2">
      <Button
        as="div"
        variant="outline"
        size="1"
        // @ts-expect-error icon needs improvement
        leadingIcon={{ icon, "aria-hidden": true }}
      >
        {filterName}
      </Button>
      <Box width="24">
        <Combobox.Root
          value={operator}
          onValueChange={handleComboboxChange}
          disabled
        >
          <Combobox.Trigger size="1" />
          <Combobox.Content>
            <Combobox.Options>
              {validOperatorOptions.map((v) => (
                <Combobox.Option value={v} key={v}>
                  {OPERATOR_CONFIGS[v].label}
                </Combobox.Option>
              ))}
            </Combobox.Options>
            <Combobox.Empty />
          </Combobox.Content>
        </Combobox.Root>
      </Box>
      <Button
        as="span"
        variant="outline"
        size="1"
        leadingIcon={selectedValueIconProp}
      >
        {selectedValueLabel}
      </Button>
      <Button variant="outline" size="1" onClick={() => clearKey(filterKey)}>
        Clear
      </Button>
    </Stack>
  );
};

/**
 * A container for active filter chips
 */
export const ChipLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box>{children}</Box>;
};

/**
 * A display for a chip
 */
export const ChipDisplay = () => {
  const { stateControl } = useFilter();
  const { state } = stateControl;

  return (
    <ChipLayout>
      {Object.entries(state).map(([key, value]) => {
        return <Chip key={key} {...value} />;
      })}
    </ChipLayout>
  );
};

export const Filter = {
  Root,
  Trigger,
  Content,
  Parameter,
  Menu: FilterMenu,
  Option,
  Divider,
  Chip,
  ChipLayout,
  ChipDisplay,
};
