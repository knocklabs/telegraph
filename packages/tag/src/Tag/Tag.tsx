import { Button as TelegraphButton } from "@telegraph/button";
import type {
  PolymorphicProps,
  PolymorphicPropsWithTgphRef,
  RemappedOmit,
  Required,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { Lucide, Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { motion } from "@telegraph/motion";
import { Tooltip } from "@telegraph/tooltip";
import { Text as TelegraphText } from "@telegraph/typography";
import { clsx } from "clsx";
import React from "react";

import { COLOR, SIZE, SPACING } from "./Tag.constants";

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
        align="center"
        rounded="2"
        display="inline-flex"
        pl={SPACING.Root[size]}
        backgroundColor={COLOR.Root[variant][color]}
        h={SIZE.Root[size].h}
        className={clsx("tgph-tag", className)}
        {...props}
        data-tag
      />
    </TagContext.Provider>
  );
};

type TextProps<T extends TgphElement> = RemappedOmit<
  TgphComponentProps<typeof TelegraphText<T>>,
  "as"
> & {
  as?: T;
};

const Text = <T extends TgphElement>({
  as = "span" as T,
  maxW = "40",
  overflow = "hidden",
  style,
  ...props
}: TextProps<T>) => {
  const context = React.useContext(TagContext);
  return (
    <TelegraphText
      as={as}
      size={context.size}
      color={COLOR.Text[context.variant][context.color]}
      weight="medium"
      mr={SPACING.Text[context.size]}
      maxW={maxW}
      overflow={overflow}
      internal_optionalAs={true}
      style={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        ...style,
      }}
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

const CopyButton = ({ onClick, textToCopy, ...props }: CopyButtonProps) => {
  const context = React.useContext(TagContext);

  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
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
        roundedTopRight="3"
        roundedBottomRight="3"
        roundedTopLeft="0"
        roundedBottomLeft="0"
        position="relative"
        overflow="hidden"
        p="2"
        {...props}
      >
        <TelegraphButton.Icon
          as={motion.span}
          initializeWithAnimation={false}
          animate={{ y: copied ? 0 : "150%", opacity: copied ? 1 : 1 }}
          transition={{ duration: 150, type: "spring" }}
          icon={Lucide.Check}
          alt="Copied text"
          aria-hidden={!copied}
        />
        <TelegraphButton.Icon
          as={motion.span}
          initializeWithAnimation={false}
          animate={{ y: !copied ? 0 : "-150%", opacity: !copied ? 1 : 1 }}
          transition={{ duration: 150, type: "spring" }}
          icon={Lucide.Copy}
          position="absolute"
          alt="Copy text"
          aria-hidden={copied}
        />
      </TelegraphButton.Root>
    </Tooltip>
  );
};

const Button = <T extends TgphElement>({ ...props }: ButtonProps<T>) => {
  const context = React.useContext(TagContext);
  return (
    <TelegraphButton
      size={context.size}
      color={COLOR.Button[context.variant][context.color]}
      variant={context.variant}
      icon={{ icon: Lucide.X, alt: "close" }}
      roundedTopRight="3"
      roundedBottomRight="3"
      roundedTopLeft="0"
      roundedBottomLeft="0"
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
  ...props
}: IconProps<T>) => {
  const context = React.useContext(TagContext);
  const a11yProps = !alt ? { "aria-hidden": ariaHidden } : { alt };
  return (
    <TelegraphIcon
      icon={icon}
      size={context.size}
      color={COLOR.Icon[context.variant][context.color]}
      mr="1"
      roundedTopRight="3"
      roundedBottomRight="3"
      roundedTopLeft="0"
      roundedBottomLeft="0"
      {...a11yProps}
      {...props}
    />
  );
};

type DefaultProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Root<T>> & {
    icon?: React.ComponentProps<typeof TelegraphIcon>;
    textProps?: React.ComponentProps<typeof Text>;
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
  textProps = { maxW: "40" },
  children,
  ...props
}: DefaultProps<T>) => {
  return (
    <Root color={color} size={size} variant={variant} {...props}>
      {icon && <Icon {...icon} />}
      <Text as="span" {...textProps}>
        {children}
      </Text>
      {onRemove && (
        <Button onClick={onRemove} icon={{ icon: Lucide.X, alt: "Remove" }} />
      )}
      {onCopy && <CopyButton onClick={onCopy} textToCopy={textToCopy} />}
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
