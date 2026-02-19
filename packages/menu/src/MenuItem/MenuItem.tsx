import { Button } from "@telegraph/button";
import { TgphComponentProps, TgphElement } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import { Check } from "lucide-react";
import { LazyMotion, domAnimation } from "motion/react";
import * as motion from "motion/react-m";

export type MenuItemProps<T extends TgphElement = "button"> =
  TgphComponentProps<typeof Button<T>> & {
    selected?: boolean | null;
    leadingComponent?: React.ReactNode;
    trailingComponent?: React.ReactNode;
    textProps?: TgphComponentProps<typeof Button.Text>;
  };

const MenuItem = <T extends TgphElement = "button">({
  variant = "ghost",
  size = "2",
  px = "2",
  gap = "1_5",
  justify = "space-between",
  w = "auto",
  selected,
  icon,
  leadingIcon,
  leadingComponent,
  trailingIcon,
  trailingComponent,
  textProps,
  ...props
}: MenuItemProps<T>) => {
  return (
    <Button.Root
      size={size}
      variant={variant}
      gap={gap}
      px={px}
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
        <Button.Text
          weight={props?.fontWeight || "medium"}
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          {...textProps}
        >
          {props.children}
        </Button.Text>
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
    return (
      <LazyMotion features={domAnimation}>
        <Button.Icon
          as={motion.span}
          variant="primary"
          icon={Check}
          aria-hidden={true}
          animate={
            selected
              ? {
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }
              : {
                  opacity: 0,
                  rotate: -45,
                  scale: 0.3,
                }
          }
          transition={{ duration: 0.15, type: "spring", bounce: 0 }}
          style={{ transformOrigin: "center" }}
          display="block"
        />
      </LazyMotion>
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
