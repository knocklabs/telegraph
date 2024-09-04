import { Button } from "@telegraph/button";
import { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Lucide } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { motion } from "framer-motion";

type MenuItemProps<T extends TgphElement> = TgphComponentProps<
  typeof Button<T>
> & {
  selected?: boolean | null;
  leadingComponent?: React.ReactNode;
  trailingComponent?: React.ReactNode;
};

const MenuItem = <T extends TgphElement>({
  variant = "ghost",
  size = "2",
  h = "7",
  gap = "3",
  justify = "space-between",
  w = "auto",
  selected,
  icon,
  leadingIcon,
  leadingComponent,
  trailingIcon,
  trailingComponent,
  ...props
}: MenuItemProps<T>) => {
  return (
    <Button.Root
      size={size}
      variant={variant}
      h={h}
      gap={gap}
      justify={justify}
      w={w}
      {...props}
    >
      <Stack gap={gap} align="center" w="full">
        <MenuItemLeading
          icon={icon}
          selected={selected}
          leadingIcon={leadingIcon}
          leadingComponent={leadingComponent}
        />
        <Button.Text weight="regular">{props.children}</Button.Text>
      </Stack>
      <MenuItemTrailing
        trailingIcon={trailingIcon}
        trailingComponent={trailingComponent}
      />
    </Button.Root>
  );
};

type MenuItemLeadingProps = Pick<
  TgphComponentProps<typeof MenuItem>,
  "leadingIcon" | "icon" | "selected" | "leadingComponent"
>;

const MenuItemLeading = ({
  icon,
  selected,
  leadingIcon,
  leadingComponent,
}: MenuItemLeadingProps) => {
  const isSelectableButton = selected === true || selected === false;

  if (isSelectableButton) {
    const variants = {
      selected: {
        opacity: [1, 1],
        transform: ["rotate(-45deg) scale(0.3)", "rotate(0deg) scale(1)"],
      },
      unselected: { opacity: 0, transform: "rotate(0deg)" },
    };

    return (
      <Button.Icon
        as={motion.span}
        variant="primary"
        icon={Lucide.Check}
        aria-hidden={true}
        initial={false}
        variants={variants}
        animate={selected ? "selected" : "unselected"}
        transition={{ duration: 0.2, type: "spring", bounce: 0 }}
        style={{ transformOrigin: "center" }}
        key="menu item check"
      />
    );
  }

  const combinedLeadingIcon = leadingIcon || icon;

  if (combinedLeadingIcon) {
    return <Button.Icon variant="primary" {...combinedLeadingIcon} />;
  }

  if (leadingComponent) {
    return leadingComponent;
  }
};

type MenuItemTrailingProps = Pick<
  TgphComponentProps<typeof MenuItem>,
  "trailingIcon" | "trailingComponent"
>;

const MenuItemTrailing = ({
  trailingIcon,
  trailingComponent,
}: MenuItemTrailingProps) => {
  if (trailingIcon) {
    return <Button.Icon variant="primary" {...trailingIcon} />;
  }

  if (trailingComponent) {
    return trailingComponent;
  }
};

export { MenuItem };
