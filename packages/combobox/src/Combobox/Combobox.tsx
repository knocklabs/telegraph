import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Button as TelegraphButton } from "@telegraph/button";
import { useComposedRefs } from "@telegraph/compose-refs";
import { RefToTgphRef, type TgphElement, type TgphComponentProps } from "@telegraph/helpers";
import { Icon, Lucide } from "@telegraph/icon";
import { Input as TelegraphInput } from "@telegraph/input";
import { Box } from "@telegraph/layout";
import { Menu as TelegraphMenu } from "@telegraph/menu";
import { motion } from "framer-motion";
import React from "react";

const FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
const LAST_KEYS = ["ArrowUp", "PageDown", "End"];

type RootProps = React.PropsWithChildren<{
  value: string;
  onValueChange: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  closeOnSelect?: boolean;
}>;

const ComboboxContext = React.createContext<
  Omit<RootProps, "children"> & {
    contentId: string;
    triggerId: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    onOpenToggle: () => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    triggerRef?: React.RefObject<HTMLDivElement>;
    searchRef?: React.RefObject<HTMLInputElement>;
    contentRef?: React.RefObject<HTMLDivElement>
  }
>({
  value: "",
  onValueChange: () => { },
  contentId: "",
  triggerId: "",
  open: false,
  setOpen: () => { },
  onOpenToggle: () => { },
});

const Root = ({
  modal = true,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultOpen: defaultOpenProp,
  value,
  onValueChange,
  closeOnSelect,
  ...props
}: RootProps) => {
  const contentId = React.useId();
  const triggerId = React.useId();
  const triggerRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const contentRef = React.useRef(null);

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpenProp,
    onChange: onOpenChangeProp,
  });

  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onOpenToggle = React.useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, [setOpen]);

  return (
    <ComboboxContext.Provider
      value={{
        contentId,
        triggerId,
        value,
        onValueChange,
        open,
        setOpen,
        onOpenToggle,
        closeOnSelect,
        searchQuery,
        setSearchQuery,
        triggerRef,
        searchRef,
        contentRef,
      }}
    >
      <TelegraphMenu.Root
        open={open}
        onOpenChange={setOpen}
        modal={modal}
        {...props}
      />
    </ComboboxContext.Provider>
  );
};

type TriggerProps = React.ComponentProps<typeof TelegraphMenu.Anchor>;

const Trigger = ({ ...props }: TriggerProps) => {
  const context = React.useContext(ComboboxContext);
  return (
    <TelegraphMenu.Anchor
      {...props}
      asChild
      id={context.triggerId}
      onClick={(event) => {
        event.preventDefault();
        context.onOpenToggle();
        context.triggerRef?.current?.focus();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          context.onOpenToggle();
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
        }
      }}
      tgphRef={context.triggerRef}
    >
      <RefToTgphRef>
        <TelegraphButton.Root
          variant="outline"
          w="full"
          justify="space-between"
          role="combobox"
          aria-expanded={context.open}
        >
          <TelegraphButton.Text>{context.value}</TelegraphButton.Text>
          <TelegraphButton.Icon
            as={motion.div}
            icon={Lucide.ChevronDown}
            animate={{ rotate: context.open ? "180deg" : "0deg" }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            aria-hidden
          />
        </TelegraphButton.Root>
      </RefToTgphRef>
    </TelegraphMenu.Anchor>
  );
};

type ContentProps<T extends TgphElement> = TgphComponentProps<typeof TelegraphMenu.Content<T>>

const Content = <T extends TgphElement>({ tgphRef, style, ...props }: ContentProps<T>) => {
  const context = React.useContext(ComboboxContext);
  const hasInteractedOutside = React.useRef(false);
  const composedRef = useComposedRefs(tgphRef, context.contentRef);
  return (
    <TelegraphMenu.Content
      as={motion.div}
      key={"content"}
      mt="1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      id={context.contentId}
      onInteractOutside={() => {
        context.setOpen(false);
        hasInteractedOutside.current = true;
      }}
      onCloseAutoFocus={(event: Event) => {
        if (!hasInteractedOutside.current) context.triggerRef?.current?.focus();
        hasInteractedOutside.current = false;

        event.preventDefault();
      }}
      onKeyDown={(event) => {
        const options = context.contentRef?.current?.querySelectorAll(
          "[data-tgph-combobox-option]",
        );

        if (
          document.activeElement === options?.[0] &&
          LAST_KEYS.includes(event.key)
        ) {
          context.searchRef?.current?.focus();
        }

        if (event.key === "Escape") {
          context.setOpen(false);
        }
      }}
      style={{
        ...style,
        maxHeight: "var(--tgph-combobox-content-available-height)",
        minHeight: "40px",
        overflowY: "auto",
        ...{
          "--tgph-comobobox-content-transform-origin":
            "var(--radix-popper-transform-origin)",
          "--tgph-combobox-content-available-width":
            "var(--radix-popper-available-width)",
          "--tgph-combobox-content-available-height":
            "calc(var(--radix-popper-available-height) - var(--tgph-spacing-8))",
          "--tgph-comobobox-trigger-width": "var(--radix-popper-anchor-width)",
          "--tgph-combobox-trigger-height": "var(--radix-popper-anchor-height)",
        },
      }}
      {...props}
      // TODO: Fix this type casting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tgphRef={composedRef as any}
    />
  );
};

type OptionProps = TgphComponentProps<typeof TelegraphMenu.Button> & {
  value: string;
};

const Option = ({ value, children, ...props }: OptionProps) => {
  const context = React.useContext(ComboboxContext);
  const [isFocused, setIsFocused] = React.useState(false);

  if (
    !context.searchQuery ||
    value.toLowerCase().includes(context.searchQuery.toLowerCase())
  ) {
    return (
      <TelegraphMenu.Button
        onSelect={(event: Event) => {
          context.closeOnSelect && event.preventDefault();
          context.onValueChange(value);
          context.triggerRef?.current?.focus();
        }}
        selected={context.value === value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-activedescendant={isFocused ? "true" : undefined}
        data-tgph-combobox-option
        {...props}
        key={value}
      >
        {children || value}
      </TelegraphMenu.Button>
    );
  }
};

type SearchProps = TgphComponentProps<typeof TelegraphInput>;

const Search = ({ tgphRef, ...props }: SearchProps) => {
  const context = React.useContext(ComboboxContext);
  const composedRef = useComposedRefs(tgphRef, context.searchRef);

  React.useEffect(() => {
    const handleSearchKeyDown = (event: KeyboardEvent) => {
      if (FIRST_KEYS.includes(event.key)) {
        context.contentRef?.current?.focus({ preventScroll: true });
      }

      if (event.key === "Escape") {
        context.setOpen(false);
      }

      event.stopPropagation();
    };

    const searchInput = context.searchRef?.current;

    if (searchInput) {
      searchInput.addEventListener("keydown", handleSearchKeyDown);
      return () => {
        searchInput.removeEventListener("keydown", handleSearchKeyDown);
      };
    }
  }, [context]);

  return (
    <Box borderBottom px="1" pb="1">
      <TelegraphInput
        variant="ghost"
        placeholder="Search"
        value={context.searchQuery}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          context?.setSearchQuery?.(event.target.value);
        }}
        LeadingComponent={<Icon icon={Lucide.Search} alt="Search Icon" />}
        {...props}
        tgphRef={composedRef}
        autoFocus
      />
    </Box>
  );
};

const Combobox = {} as {
  Root: typeof Root;
  Trigger: typeof Trigger;
  Content: typeof Content;
  Option: typeof Option;
  Search: typeof Search;
};

Object.assign(Combobox, {
  Root,
  Trigger,
  Content,
  Option,
  Search,
});

export { Combobox };
