import { Button as TelegraphButton } from "@telegraph/button";
import { closeSharp } from "@telegraph/icon";
import { Text as TelegraphText } from "@telegraph/typography";
import React from "react";

type RootProps = React.HTMLAttributes<RootRef> & {
  size: "1" | "2";
  color: React.ComponentProps<typeof TelegraphButton>["color"];
  variant: "soft" | "solid";
};

type RootRef = HTMLSpanElement;

const TagContext = React.createContext<RootProps>({
  size: "1",
  color: "accent",
  variant: "solid",
});


const Root = React.forwardRef<RootRef, RootProps>(
  (
    { size = "1", color = "accent", variant = "solid", children, ...props },
    forwardedRef,
  ) => {
    return (
      <TagContext.Provider value={{ size, color, variant }}>
        <span
          className="inline-flex items-center bg-accent-9 rounded-3"
          {...props}
          ref={forwardedRef}
        >
          {children}
        </span>
      </TagContext.Provider>
    );
  },
);

type TextProps = Omit<React.ComponentProps<typeof TelegraphText>, "as"> & {
  as: React.ComponentProps<typeof TelegraphText>["as"];
};

type TextRef = React.ElementRef<typeof TelegraphText>;

const Text = React.forwardRef<TextRef, TextProps>(
  ({ as = "span", ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphText
        as={as}
        size={context.size}
        color={context.color}
        className="pl-2 pr-3"
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

type ButtonProps = React.ComponentProps<typeof TelegraphButton.Root>;

type ButtonRef = React.ElementRef<typeof TelegraphButton.Root>;

const Button = React.forwardRef<ButtonRef, ButtonProps>(
  ({ ...props }, forwardedRef) => {
    const context = React.useContext(TagContext);
    return (
      <TelegraphButton
        size={context.size}
        color={context.color}
        variant={context.variant}
        icon={{ icon: closeSharp, alt: "close" }}
        className="rounded-tl-0 rounded-bl-0"
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

const Default = {};

Object.assign(Default, {
  Root,
  Button,
  Text,
});

const Tag = Default as typeof Default & {
  Root: typeof Root;
  Button: typeof Button;
  Text: typeof Text;
};

export { Tag };
