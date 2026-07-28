import type { IconProps } from "@telegraph/icon";
import type { StackProps } from "@telegraph/layout";
import type { TextProps } from "@telegraph/typography";

export const sizeMap = {
  "0": {
    stack: {
      minW: "4",
      h: "4",
    },
    text: {
      size: "0",
      px: "1",
    },
    icon: {
      size: "0",
    },
  },
  "1": {
    stack: {
      minW: "5",
      h: "5",
    },
    text: {
      size: "0",
      px: "1",
    },
    icon: {
      size: "0",
    },
  },
  "2": {
    stack: {
      minW: "6",
      h: "6",
    },
    text: { size: "1", px: "1" },
    icon: {
      size: "1",
    },
  },
  "3": {
    stack: {
      minW: "8",
      h: "8",
    },
    text: {
      size: "2",
      px: "2",
    },
    icon: {
      size: "2",
    },
  },
} as const;

// `StackProps`/`TextProps`/`IconProps` rather than `TgphComponentProps<typeof
// X>`: extracting props from a generic component instantiates its parameter at
// the constraint, which erases the passthrough. The exported props types keep
// each component's prop set intact.
type StackColor = {
  borderColor: StackProps["borderColor"];
  bg: StackProps["bg"];
  bgPressed: StackProps["bg"];
};

type TextColor = {
  color: TextProps["color"];
};

type IconColor = {
  color: IconProps["color"];
};

export type Appearance = "light" | "dark";
export type Contrast = "default" | "contrast";
export type ColorMap = {
  [key in Appearance]: {
    [key in Contrast]: {
      stack: StackColor;
      text: TextColor;
      icon: IconColor;
    };
  };
};

export const colorMap: ColorMap = {
  light: {
    default: {
      stack: {
        borderColor: "gray-3",
        bg: "surface-1",
        bgPressed: "gray-4",
      },
      text: {
        color: "default",
      },
      icon: {
        color: "default",
      },
    },
    contrast: {
      stack: {
        borderColor: "gray-3",
        bg: "transparent",
        bgPressed: "alpha-black-2",
      },
      text: {
        color: "white",
      },
      icon: {
        color: "white",
      },
    },
  },
  dark: {
    default: {
      stack: {
        borderColor: "gray-3",
        bg: "surface-1",
        bgPressed: "gray-4",
      },
      text: {
        color: "default",
      },
      icon: {
        color: "default",
      },
    },
    contrast: {
      stack: {
        borderColor: "black",
        bg: "transparent",
        bgPressed: "alpha-black-2",
      },
      text: {
        color: "black",
      },
      icon: {
        color: "black",
      },
    },
  },
};
