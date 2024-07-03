import type {
  PolymorphicProps,
  TgphComponentProps,
  TgphElement,
} from "@telegraph/helpers";
import { useStyleProps } from "@telegraph/style-engine";
import clsx from "clsx";

import { Box } from "../Box";

import { type StyleProps, stylePropsFn } from "./Stack.css";

type StackProps<T extends TgphElement> = PolymorphicProps<T> &
  TgphComponentProps<typeof Box> &
  StyleProps;

const Stack = <T extends TgphElement>({
  className,
  display = "flex",
  ...props
}: StackProps<T>) => {
  const { styleClassName, componentProps } = useStyleProps({
    props: { ...props, display },
    stylePropsFn,
  });

  return (
    <Box
      className={clsx("tgph-stack", styleClassName, className)}
      {...componentProps}
    />
  );
};

export { Stack };
