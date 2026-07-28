import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "lucide-react";

import { COLOR_MAP, SIZE_MAP } from "../Icon/Icon.constants";

import { type SpinnerProps, Spinner as TelegraphSpinner } from "./Spinner";

// `icon` is remapped to a string so the control can offer Lucide icon names.
type StorybookSpinnerType = Omit<SpinnerProps<"span">, "icon"> & {
  icon: string;
};

const StorybookTelegraphSpinner = ({
  icon,
  ...props
}: StorybookSpinnerType) => {
  return (
    <TelegraphSpinner
      // @ts-expect-error: for illustrative purposes only
      icon={Icons[icon as keyof typeof Icons]}
      {...props}
    />
  );
};

const meta: Meta<StorybookSpinnerType> = {
  tags: ["autodocs"],
  title: "Components/Icon/Spinner",
  component: StorybookTelegraphSpinner,
};

export default meta;

export const Default: Story = {
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      control: {
        type: "select",
      },
    },
    size: {
      options: Object.keys(SIZE_MAP),
      control: {
        type: "select",
      },
    },
    color: {
      options: Object.keys(COLOR_MAP.primary),
      control: {
        type: "select",
      },
    },
    variant: {
      options: Object.keys(COLOR_MAP),
      control: {
        type: "select",
      },
    },
    animation: {
      options: ["spin", "none"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    color: "gray",
    size: "3",
    icon: "LoaderCircle",
    alt: "Loading...",
    variant: "primary",
    animation: "spin",
  },
};

type Story = StoryObj<StorybookSpinnerType>;
