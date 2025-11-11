import type { Meta, StoryObj } from "@storybook/react";
import * as Icons from "lucide-react";

import { COLOR_MAP, SIZE_MAP } from "../Icon/Icon.constants";

import { Spinner as TelegraphSpinner } from "./Spinner";

type StorybookTelegraphSpinnerType = React.ComponentProps<
  typeof TelegraphSpinner
>;

const StorybookTelegraphSpinner = ({
  icon,
  ...props
}: StorybookTelegraphSpinnerType) => {
  return (
    <TelegraphSpinner
      // @ts-expect-error: for illustrative purposes only
      icon={Icons[icon as keyof typeof Icons]}
      {...props}
    />
  );
};

const meta: Meta<typeof TelegraphSpinner> = {
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

type StorybookSpinnerType = Omit<
  React.ComponentProps<typeof TelegraphSpinner>,
  "icon"
> & {
  icon: string;
};

type Story = StoryObj<StorybookSpinnerType>;
