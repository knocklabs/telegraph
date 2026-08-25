import {
  Button,
  type ButtonIconProps,
  type ButtonRootProps,
  type ButtonTextProps,
} from "@telegraph/button";
import type { PolymorphicProps, TgphElement } from "@telegraph/helpers";
import { Stack } from "@telegraph/layout";
import Check from "lucide-react/dist/esm/icons/check.mjs";
import * as motion from "motion/react-m";
import type { ReactNode } from "react";

// Presentational option row, kept in-package so @telegraph/combobox does not
// depend on @telegraph/menu. Mirrors @telegraph/menu's `MenuItem` (ghost
// `Button.Root` + animated `Check` indicator) so a combobox option and a menu
// item stay visually identical — keep the two in sync if the shared look
// changes.

type OptionItemIconProps = {
  icon?: ButtonIconProps;
  leadingIcon?: ButtonIconProps;
  trailingIcon?: ButtonIconProps;
};

// Source the polymorphic element props from `PolymorphicProps<T>` and the
// Button.Root style props from the *non-generic* `ButtonRootProps`. A bare
// `TgphComponentProps<typeof Button.Root<T>>` defers the mapped type at an
// unresolved `T`, so `children` becomes inaccessible in the body — the same
// KNO-14309 shape documented on `Combobox.Content`/`Combobox.Option`.
export type OptionItemProps<T extends TgphElement = "button"> =
  PolymorphicProps<T> &
    Omit<ButtonRootProps, "as"> &
    OptionItemIconProps & {
      selected?: boolean | null;
      leadingComponent?: ReactNode;
      trailingComponent?: ReactNode;
      textProps?: ButtonTextProps<"span">;
    };

const OptionItem = <T extends TgphElement = "button">({
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
}: OptionItemProps<T>) => {
  const rootProps = props as ButtonRootProps<"button">;

  return (
    <Button.Root
      size={size}
      variant={variant}
      gap={gap}
      px={px}
      justify={justify}
      w={w}
      {...rootProps}
    >
      <Stack gap={gap} align="center" w="full">
        <OptionItemLeading
          icon={icon}
          selected={selected}
          leadingIcon={leadingIcon}
          leadingComponent={leadingComponent}
        />
        <Button.Text
          weight="medium"
          w="full"
          overflow="hidden"
          textOverflow="ellipsis"
          {...textProps}
        >
          {rootProps.children}
        </Button.Text>
      </Stack>
      <OptionItemTrailing
        trailingIcon={trailingIcon}
        trailingComponent={trailingComponent}
      />
    </Button.Root>
  );
};

type OptionItemLeadingProps = Pick<
  OptionItemProps,
  "leadingIcon" | "icon" | "selected" | "leadingComponent"
>;

const OptionItemLeading = ({
  icon,
  selected,
  leadingIcon,
  leadingComponent,
}: OptionItemLeadingProps) => {
  const isSelectableButton = selected === true || selected === false;

  if (isSelectableButton) {
    return (
      <Button.Icon
        as={motion.span}
        variant="primary"
        icon={Check}
        aria-hidden={true}
        // Mount at the animate target so unselected items don't flash checked
        // on open. Only blocks the mount animation; toggling still animates.
        initial={false}
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

type OptionItemTrailingProps = Pick<
  OptionItemProps,
  "trailingIcon" | "trailingComponent"
>;

const OptionItemTrailing = ({
  trailingIcon,
  trailingComponent,
}: OptionItemTrailingProps) => {
  if (trailingIcon) {
    return <Button.Icon variant="primary" {...trailingIcon} />;
  }

  if (trailingComponent) {
    return trailingComponent;
  }
};

export { OptionItem };
