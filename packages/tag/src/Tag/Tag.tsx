import { Button as TelegraphButton } from "@telegraph/button";
import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Lucide, Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Tooltip } from "@telegraph/tooltip";
import { Text as TelegraphText } from "@telegraph/typography";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { COLOR, SIZE } from "./Tag.constants";

type RootBaseProps = {
  size?: "0" | "1" | "2";
  color?: keyof (typeof COLOR.Root)["soft"];
  variant?: keyof typeof COLOR.Root;
};

type RootProps<T extends TgphElement> = PolymorphicPropsWithTgphRef<
  T,
  HTMLSpanElement
> &
  TgphComponentProps<typeof Stack> &
  RootBaseProps;

const TagContext = React.createContext<Required<RootBaseProps>>({
  size: "1",
  color: "default",
  variant: "soft",
});

const Root = <T extends TgphElement>({
  as = "span" as T,
  size = "1",
  color = "default",
  variant = "soft",
  className,
  ...props
}: RootProps<T>) => {
  return (
    <TagContext.Provider value={{ size, color, variant }}>
      <Stack
        as={as}
        display="inline-flex"
        align="center"
        rounded="3"
        pl={size === "0" ? "1" : "2"}
        className={clsx(SIZE.Root[size], COLOR.Root[variant][color], className)}
        {...props}
        data-tag
      />
    </TagContext.Provider>
  );
};

type TextProps<T extends TgphElement> = Omit<
  TgphComponentProps<typeof TelegraphText<T>>,
  "as"
> & {
  as?: T;
};

const Text = <T extends TgphElement>({
  as = "span" as T,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(TagContext);
  return (
    <TelegraphText
      as={as}
      size={context.size}
      color={COLOR.Text[context.variant][context.color]}
      weight="medium"
      mr="2"
      {...props}
    />
  );
};
type ButtonProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphButton<T>
>;

type CopyButtonProps = TgphComponentProps<typeof TelegraphButton.Root> & {
  textToCopy?: string;
};

const CopyButton = ({
  onClick,
  textToCopy,
  className,
  ...props
}: CopyButtonProps) => {
  const context = React.useContext(TagContext);

  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Tooltip label="Copy text">
        <TelegraphButton.Root
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            // Still run onClick incase the consumer wants to do something else
            onClick?.(event);
            setCopied(true);
            textToCopy && navigator.clipboard.writeText(textToCopy);
            event.currentTarget?.blur();
          }}
          size={context.size}
          color={COLOR.Button[context.variant][context.color]}
          variant={context.variant}
          className={clsx("overflow-hidden", className)}
          roundedTopRight="3"
          roundedBottomRight="3"
          roundedTopLeft="0"
          roundedBottomLeft="0"
          {...props}
        >
          {copied ? (
            <TelegraphButton.Icon
              as={motion.span}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.2, type: "spring", bounce: 0 }}
              icon={Lucide.Check}
              alt="Copied text"
              key={"check icon"}
            />
          ) : (
            <TelegraphButton.Icon
              as={motion.span}
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.2, type: "spring", bounce: 0 }}
              icon={Lucide.Copy}
              alt="Copy text"
              key={"copy icon"}
            />
          )}
        </TelegraphButton.Root>
      </Tooltip>
    </AnimatePresence>
  );
};

const Button = <T extends TgphElement>({
  className,
  ...props
}: ButtonProps<T>) => {
  const context = React.useContext(TagContext);
  return (
    <TelegraphButton
      size={context.size}
      color={COLOR.Button[context.variant][context.color]}
      variant={context.variant}
      icon={{ icon: Lucide.X, alt: "close" }}
      className={clsx("rounded-tl-0 rounded-bl-0", className)}
      {...props}
    />
  );
};
type IconProps<T extends TgphElement> = TgphComponentProps<
  typeof TelegraphIcon<T>
>;

const Icon = <T extends TgphElement>({
  icon,
  alt,
  "aria-hidden": ariaHidden,
  className,
  ...props
}: IconProps<T>) => {
  const context = React.useContext(TagContext);
  const a11yProps = !alt ? { "aria-hidden": ariaHidden } : { alt };
  return (
    <TelegraphIcon
      icon={icon}
      size={context.size}
      color={COLOR.Icon[context.variant][context.color]}
      className={clsx("rounded-tl-0 rounded-bl-0 mr-1", className)}
      {...a11yProps}
      {...props}
    />
  );
};

type DefaultProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root<T>> & {
    icon?: React.ComponentProps<typeof TelegraphIcon>;
    onRemove?: () => void;
  } & ( // Optionally allow textToCopy only when onCopy is defined
    | {
        onCopy: () => void;
        textToCopy?: string;
      }
    | {
        onCopy?: never;
        textToCopy?: never;
      }
  );

const Default = <T extends TgphElement>({
  color = "default",
  size = "1",
  variant = "soft",
  icon,
  onRemove,
  onCopy,
  textToCopy,
  children,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root color={color} size={size} variant={variant} {...props}>
      {icon && <Icon {...icon} />}
      <Text as="span">{children}</Text>
      {onRemove && size !== "0" && (
        <Button onClick={onRemove} icon={{ icon: Lucide.X, alt: "Remove" }} />
      )}
      {onCopy && size !== "0" && (
        <CopyButton onClick={onCopy} textToCopy={textToCopy} />
      )}
    </Root>
  );
};

Object.assign(Default, {
  Root,
  Button,
  Text,
  Icon,
  CopyButton,
});

const Tag = Default as typeof Default & {
  Root: typeof Root;
  Button: typeof Button;
  Text: typeof Text;
  Icon: typeof Icon;
  CopyButton: typeof CopyButton;
};

export { Tag };
