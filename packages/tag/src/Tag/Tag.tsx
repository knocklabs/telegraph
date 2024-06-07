import { Button as TelegraphButton } from "@telegraph/button";
import type {
  ComponentPropsWithAs,
  PropsWithAs,
  RefWithAs,
  Required,
} from "@telegraph/helpers";
import { Lucide, Icon as TelegraphIcon } from "@telegraph/icon";
import { Stack } from "@telegraph/layout";
import { Text as TelegraphText } from "@telegraph/typography";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { COLOR, SIZE } from "./Tag.constants";

type RootBaseProps = {
  size?: "1" | "2";
  color?: keyof (typeof COLOR.Root)["soft"];
  variant?: keyof typeof COLOR.Root;
};

type RootProps = ComponentPropsWithAs<typeof Stack, RootBaseProps>;

type RootRef = RefWithAs<typeof Stack>;

const TagContext = React.createContext<Required<RootBaseProps>>({
  size: "1",
  color: "default",
  variant: "soft",
});

const Root = React.forwardRef<RootRef, RootProps>(
  (
    { size = "1", color = "default", variant = "soft", className, ...props },
    forwardedRef,
  ) => {
    return (
      <TagContext.Provider value={{ size, color, variant }}>
        <Stack
          as="span"
          className={clsx(
            SIZE.Root[size],
            COLOR.Root[variant][color],
            className,
          )}
          display="inline-flex"
          align="center"
          rounded="3"
          pl="2"
          {...props}
          ref={forwardedRef}
          data-tag
        />
      </TagContext.Provider>
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, RootProps> & { ref?: RootRef },
) => React.ReactElement;

type TextProps = Omit<ComponentPropsWithAs<typeof TelegraphText>, 'as'> & {
  as?: React.ElementType;
};
type TextRef = RefWithAs<typeof TelegraphText>;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ as = "span", ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphText
        as={as}
        size={context.size}
        color={COLOR.Text[context.variant][context.color]}
        mr="2"
        roundedTopLeft="0"
        roundedBottomLeft="0"
        {...props}
        ref={forwardedRef}
      />
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, TextProps> & { ref?: TextRef },
) => React.ReactElement;

type ButtonProps = ComponentPropsWithAs<typeof TelegraphButton>;
type ButtonRef = RefWithAs<typeof TelegraphButton>;

const Button = React.forwardRef<ButtonRef, ButtonProps>(
  ({ className, ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphButton
        size={context.size}
        color={COLOR.Button[context.variant][context.color]}
        variant={context.variant}
        className={clsx("rounded-tl-0 rounded-bl-0", className)}
        {...props}
        ref={forwardedRef}
      />
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, ButtonProps> & { ref?: ButtonRef },
) => React.ReactElement;

type IconProps = ComponentPropsWithAs<typeof TelegraphIcon>;
type IconRef = RefWithAs<typeof TelegraphIcon>;

const Icon = React.forwardRef<IconRef, IconProps>(
  ({ className, ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphIcon
        size={context.size}
        color={COLOR.Icon[context.variant][context.color]}
        className={clsx("rounded-tl-0 rounded-bl-0 mr-1", className)}
        {...props}
        ref={forwardedRef}
      />
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, IconProps> & { ref?: IconRef },
) => React.ReactElement;

type CopyButtonProps = React.ComponentProps<typeof Button> & {
  textToCopy?: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({
  onClick,
  textToCopy,
  className,
  ...props
}: CopyButtonProps) => {
  const context = React.useContext(TagContext);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [copied, setCopied] = React.useState(false);
  const [buttonHeight, setButtonHeight] = React.useState(0);

  React.useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  // Use button height to calculate the offst of the icon animation
  React.useEffect(() => {
    if (buttonRef?.current) {
      const buttonHeight = buttonRef.current.getBoundingClientRect().height;
      setButtonHeight(buttonHeight - buttonHeight / 4);
    }
  }, [buttonRef]);

  // TODO: Add tooltip upon completion of KNO-5405
  return (
    <AnimatePresence mode="wait" initial={false}>
      <TelegraphButton.Root
        onClick={(event: MouseEvent) => {
          // Still run onClick incase the consumer wants to do something else
          onClick?.(event);
          setCopied(true);
          textToCopy && navigator.clipboard.writeText(textToCopy);
          buttonRef.current?.blur();
        }}
        size={context.size}
        color={COLOR.Button[context.variant][context.color]}
        variant={context.variant}
        className={clsx("rounded-tl-0 rounded-bl-0 overflow-hidden", className)}
        ref={buttonRef}
        {...props}
      >
        {copied ? (
          <TelegraphButton.Icon
            as={motion.span}
            className="rounded-tl-0 rounded-bl-0"
            initial={{ y: buttonHeight }}
            animate={{ y: 0 }}
            exit={{ y: buttonHeight }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            icon={Lucide.Check}
            alt="Copied text"
            key={"check icon"}
          />
        ) : (
          <TelegraphButton.Icon
            as={motion.span}
            className="rounded-tl-0 rounded-bl-0"
            initial={{ y: -buttonHeight }}
            animate={{ y: 0 }}
            exit={{ y: -buttonHeight }}
            transition={{ duration: 0.2, type: "spring", bounce: 0 }}
            icon={Lucide.Copy}
            alt="Copy text"
            key={"copy icon"}
          />
        )}
      </TelegraphButton.Root>
    </AnimatePresence>
  );
};

type DefaultProps = ComponentPropsWithAs<
  typeof Root,
  {
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
  )
>;

type DefaultRef = RefWithAs<typeof Root>;

const Default = React.forwardRef<DefaultRef, DefaultProps>(
  (
    {
      color = "default",
      size = "1",
      variant = "soft",
      icon,
      onRemove,
      onCopy,
      textToCopy,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Root color={color} size={size} variant={variant} {...props} ref={ref}>
        {icon && <Icon {...icon} />}
        <Text as="span">{children}</Text>
        {onRemove && (
          <Button onClick={onRemove} icon={{ icon: Lucide.X, alt: "Remove" }} />
        )}
        {onCopy && <CopyButton onClick={onCopy} textToCopy={textToCopy} />}
      </Root>
    );
  },
) as <T extends React.ElementType>(
  props: PropsWithAs<T, DefaultProps> & { ref?: DefaultRef },
) => React.ReactElement;

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
