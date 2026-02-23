import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import { type TgphComponentProps, type TgphElement } from "@telegraph/helpers";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box, Stack } from "@telegraph/layout";
import React from "react";

import {
  doesOptionMatchSearchQuery,
  getOptions,
} from "../Combobox/Combobox.helpers";
import type { DefinedOption } from "../Combobox/Combobox.types";

const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_KEYS = ["ArrowUp", "PageDown", "End"];

type AutocompleteContextValue = {
  inputValue: string;
  setInputValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  listboxId: string;
  activeOptionId: string | undefined;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  visibleOptionValues: Array<string>;
  handleOptionSelect: (value: string) => void;
  disabled?: boolean;
  errored?: boolean;
  options: Array<DefinedOption>;
};

const AutocompleteContext = React.createContext<AutocompleteContextValue>({
  inputValue: "",
  setInputValue: () => {},
  open: false,
  setOpen: () => {},
  inputRef: { current: null },
  contentRef: { current: null },
  listboxId: "",
  activeOptionId: undefined,
  activeIndex: -1,
  setActiveIndex: () => {},
  visibleOptionValues: [],
  handleOptionSelect: () => {},
  disabled: false,
  errored: false,
  options: [],
});

type RootProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  errored?: boolean;
  children?: React.ReactNode;
};

const Root = ({
  value: valueProp,
  onValueChange: onValueChangeProp,
  defaultValue,
  disabled = false,
  errored = false,
  children,
}: RootProps) => {
  const listboxId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [inputValue = "", setInputValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? "",
    onChange: onValueChangeProp,
  });

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const options = React.useMemo(() => getOptions(children), [children]);

  const visibleOptionValues = React.useMemo(() => {
    if (!inputValue) return options.map((o) => o.value);
    return options
      .filter((o) =>
        doesOptionMatchSearchQuery({
          children: o.label,
          value: o.value,
          searchQuery: inputValue,
        }),
      )
      .map((o) => o.value);
  }, [inputValue, options]);

  const computedOpen = open && visibleOptionValues.length > 0;

  const activeOptionId =
    activeIndex >= 0 && activeIndex < visibleOptionValues.length
      ? `${listboxId}-option-${visibleOptionValues[activeIndex]}`
      : undefined;

  React.useEffect(() => {
    setActiveIndex(-1);
  }, [inputValue]);

  const handleOptionSelect = React.useCallback(
    (value: string) => {
      setInputValue(value);
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [setInputValue],
  );

  return (
    <AutocompleteContext.Provider
      value={{
        inputValue,
        setInputValue,
        open: computedOpen,
        setOpen,
        inputRef,
        contentRef,
        listboxId,
        activeOptionId,
        activeIndex,
        setActiveIndex,
        visibleOptionValues,
        handleOptionSelect,
        disabled,
        errored,
        options,
      }}
    >
      <Box position="relative" w="full">
        {children}
      </Box>
    </AutocompleteContext.Provider>
  );
};

type InputProps = TgphComponentProps<typeof TelegraphInput>;

const Input = ({ tgphRef, ...props }: InputProps) => {
  const context = React.useContext(AutocompleteContext);
  const composedRef = useComposedRefs(tgphRef, context.inputRef);

  const handleFocus = () => {
    context.setOpen(true);
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (context.contentRef.current?.contains(event.relatedTarget)) {
      return;
    }
    context.setOpen(false);
    context.setActiveIndex(-1);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    context.setInputValue(event.target.value);
    context.setOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!context.open) {
      if (FIRST_KEYS.includes(event.key) || LAST_KEYS.includes(event.key)) {
        event.preventDefault();
        context.setOpen(true);
      }
      return;
    }

    const optionCount = context.visibleOptionValues.length;
    if (optionCount === 0) return;

    if (FIRST_KEYS.includes(event.key)) {
      event.preventDefault();
      context.setActiveIndex((prev) => {
        if (event.key === "Home" || event.key === "PageUp") return 0;
        return prev < optionCount - 1 ? prev + 1 : 0;
      });
      return;
    }

    if (LAST_KEYS.includes(event.key)) {
      event.preventDefault();
      context.setActiveIndex((prev) => {
        if (event.key === "End" || event.key === "PageDown")
          return optionCount - 1;
        return prev > 0 ? prev - 1 : optionCount - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (context.activeIndex >= 0 && context.activeIndex < optionCount) {
        const selectedValue = context.visibleOptionValues[context.activeIndex];
        if (selectedValue) {
          context.handleOptionSelect(selectedValue);
        }
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      context.setOpen(false);
      context.setActiveIndex(-1);
      return;
    }
  };

  return (
    <TelegraphInput
      autoComplete="off"
      value={context.inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={context.disabled}
      errored={context.errored}
      role="combobox"
      aria-expanded={context.open}
      aria-controls={context.listboxId}
      aria-activedescendant={context.activeOptionId}
      aria-autocomplete="list"
      data-tgph-autocomplete-input
      {...props}
      tgphRef={composedRef}
    />
  );
};

type ContentProps<T extends TgphElement> = TgphComponentProps<typeof Stack<T>>;

const Content = <T extends TgphElement>({
  children,
  tgphRef,
  ...props
}: ContentProps<T>) => {
  const context = React.useContext(AutocompleteContext);
  const composedRef = useComposedRefs(tgphRef, context.contentRef);

  if (!context.open) return null;

  return (
    <Stack
      direction="column"
      gap="1"
      py="1"
      bg="surface-1"
      rounded="4"
      border="px"
      borderColor="gray-8"
      shadow="2"
      zIndex="popover"
      data-tgph-autocomplete-content
      role="listbox"
      id={context.listboxId}
      {...props}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        marginTop: "var(--tgph-spacing-1)",
        maxHeight: "240px",
        overflowY: "auto",
        ...props?.style,
      }}
      tgphRef={composedRef}
    >
      {children}
    </Stack>
  );
};

type OptionProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphButton.Root<T>
> & {
  value: string;
  label?: string | React.ReactNode;
};

const Option = <T extends TgphElement>({
  value,
  label,
  children,
  ...props
}: OptionProps<T>) => {
  const context = React.useContext(AutocompleteContext);

  const isVisible = context.visibleOptionValues.includes(value);

  const isActive = context.visibleOptionValues[context.activeIndex] === value;

  const optionId = `${context.listboxId}-option-${value}`;

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const handleClick = () => {
    context.handleOptionSelect(value);
  };

  if (!isVisible) return null;

  return (
    <TelegraphButton.Root
      id={optionId}
      type="button"
      variant="ghost"
      size="2"
      px="2"
      mx="1"
      w="auto"
      justify="start"
      role="option"
      aria-selected={isActive}
      data-tgph-autocomplete-option
      data-value={value}
      data-active={isActive || undefined}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => {
        const idx = context.visibleOptionValues.indexOf(value);
        if (idx >= 0) context.setActiveIndex(idx);
      }}
      {...props}
      style={{
        flexShrink: 0,
        ...props?.style,
      }}
    >
      <TelegraphButton.Text
        weight="medium"
        w="full"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {label || children || value}
      </TelegraphButton.Text>
    </TelegraphButton.Root>
  );
};

const Autocomplete = {} as {
  Root: typeof Root;
  Input: typeof Input;
  Content: typeof Content;
  Option: typeof Option;
};

Object.assign(Autocomplete, {
  Root,
  Input,
  Content,
  Option,
});

export { Autocomplete, AutocompleteContext };
