import { Slot } from "@radix-ui/react-slot";
import { TextField } from "@telegraph/text-field";
import { Text as TelegraphText } from "@telegraph/typography";
import { clsx } from "clsx";
import React from "react";

import { COLOR } from "./Field.constants";

type RootProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  "value" | "onChange"
> & {
  disabled?: boolean;
  error?: boolean | string;
  value?: string;
  onChange?: (
    value: string,
    { event }: { event: React.ChangeEvent<HTMLInputElement> },
  ) => void;
};

type RootRef = HTMLDivElement;

type InternalProps = {
  id: string;
  state: "default" | "error" | "disabled";
  message: string;
  value: RootProps["value"];
  onChange: RootProps["onChange"];
};

const FieldContext = React.createContext<InternalProps>({
  id: "",
  state: "default",
  message: "",
  value: "",
  onChange: () => {},
});

const Root = React.forwardRef<RootRef, RootProps>(
  ({ value, onChange, disabled, error, className, ...props }, forwardedRef) => {
    const id = React.useId();
    const [internalState, setInternalState] =
      React.useState<InternalProps["state"]>("default");
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
      setMessage("");
      if (disabled) {
        setInternalState("disabled");
      } else if (error) {
        setInternalState("error");
        if (typeof error === "string") {
          setMessage(error);
        }
      } else {
        setInternalState("default");
      }
    }, [disabled, error]);

    return (
      <FieldContext.Provider
        value={{ state: internalState, id, message, value, onChange }}
      >
        <div
          className={clsx("flex flex-col gap-1", className)}
          {...props}
          ref={forwardedRef}
        />
      </FieldContext.Provider>
    );
  },
);

type LabelProps = Omit<React.HTMLProps<HTMLLabelElement>, "size"> &
  Omit<React.ComponentProps<typeof TelegraphText>, "as"> & {
    as?: React.ComponentProps<typeof TelegraphText>["as"];
  };
type LabelRef = React.ElementRef<typeof TelegraphText>;

const Label = React.forwardRef<LabelRef, LabelProps>(
  ({ as = "label", size = "2", ...props }, forwardedRef) => {
    const context = React.useContext(FieldContext);
    return (
      <TelegraphText
        htmlFor={context.id}
        as={as}
        size={size}
        color={COLOR.Label[context.state]}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

type MessageProps = Omit<React.ComponentProps<typeof TelegraphText>, "as"> & {
  as?: React.ComponentProps<typeof TelegraphText>["as"];
};
type MessageRef = React.ElementRef<typeof TelegraphText>;

const Message = React.forwardRef<MessageRef, MessageProps>(
  ({ as = "span", size = "2", children, ...props }, forwardedRef) => {
    const context = React.useContext(FieldContext);
    return (
      <TelegraphText
        as={as}
        size={size}
        color={COLOR.Message[context.state]}
        {...props}
        ref={forwardedRef}
      >
        {context.message ? context.message : children}
      </TelegraphText>
    );
  },
);

type ControlProps = React.HTMLProps<HTMLInputElement> & {
  error?: boolean | string;
};
type ControlRef = HTMLInputElement;

const Control = React.forwardRef<ControlRef, ControlProps>(
  ({ ...props }, forwardedRef) => {
    const context = React.useContext(FieldContext);
    return (
      <Slot
        id={context.id}
        value={context.value}
        onChange={context.onChange}
        error={context.state === "error"}
        disabled={context.state === "disabled"}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

type DefaultProps = React.ComponentProps<typeof Root> & {
  label?: string;
  message?: string;
  control?: {
    name: "TextField";
    props: React.ComponentProps<typeof TextField>;
  } & React.ComponentProps<typeof TextField>;
};

const Default = ({
  control = {
    name: "TextField",
    props: {},
  },
  label,
  message,
  ...props
}: DefaultProps) => {
  return (
    <Root {...props}>
      {label && <Label>{label}</Label>}
      {control && (
        <Control>
          {control.name === "TextField" && <TextField {...control.props} />}
        </Control>
      )}
      {message && <Message>{message}</Message>}
    </Root>
  );
};

Object.assign(Default, {
  Root,
  Label,
  Message,
  Control,
});

const Field = Default as typeof Default & {
  Root: typeof Root;
  Label: typeof Label;
  Message: typeof Message;
  Control: typeof Control;
};

export { Field };
