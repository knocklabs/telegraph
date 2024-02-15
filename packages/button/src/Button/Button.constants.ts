export const buttonColorMap = {
  solid: {
    gray: "bg-gray-9 hover:bg-gray-10 focus:bg-gray-11",
    red: "bg-red-9 hover:bg-red-10 focus:bg-red-11",
    accent: "bg-accent-9 hover:bg-accent-10 focus:bg-accent-11",
    disabled: "bg-gray-2",
  },
  soft: {
    gray: "bg-gray-3 hover:bg-gray-4 focus:bg-gray-5",
    red: "bg-red-3 hover:bg-red-4 focus:bg-red-5",
    accent: "bg-accent-3 hover:bg-accent-4 focus:bg-accent-6",
    disabled: "bg-gray-2",
  },
  outline: {
    gray: "bg-transparent shadow-[inset_0_0_0_1px] shadow-gray-6 hover:shadow-gray-7 focus:shadow-gray-8",
    red: "bg-transparent shadow-[inset_0_0_0_1px] shadow-red-6 hover:shadow-red-7 focus:shadow-red-8",
    accent:
      "bg-transparent shadow-[inset_0_0_0_1px] shadow-accent-6 hover:shadow-accent-7 focus:shadow-accent-8",
    disabled: "bg-gray-2",
  },
  ghost: {
    gray: "bg-transparent hover:bg-gray-3 focus:bg-gray-4",
    red: "bg-transparent hover:bg-red-3 focus:bg-red-4",
    accent: "bg-transparent hover:bg-accent-3 focus:bg-accent-4",
    disabled: "bg-transparent",
  },
} as const;

export const buttonSizeMap = {
  default: {
    "1": "h-6 px-2 gap-1",
    "2": "h-8 px-3 gap-2",
    "3": "h-10 px-4 gap-3",
  },
  "icon-only": {
    "1": "h-6 w-6",
    "2": "h-8 w-8",
    "3": "h-10 w-10",
  },
} as const;

export const textSizeMap = {
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const textColorMap = {
  solid: {
    gray: "white",
    red: "white",
    accent: "white",
    disabled: "disabled",
  },
  soft: {
    gray: "default",
    red: "red",
    accent: "accent",
    disabled: "disabled",
  },
  outline: {
    gray: "gray",
    red: "red",
    accent: "accent",
    disabled: "disabled",
  },
  ghost: {
    gray: "default",
    red: "red",
    accent: "accent",
    disabled: "disabled",
  },
} as const;

export const iconSizeMap = {
  "1": "1",
  "2": "2",
  "3": "3",
} as const;

export const iconColorMap = {
  solid: {
    gray: "white",
    red: "white",
    accent: "white",
    disabled: "disabled",
  },
  soft: {
    accent: "accent",
    gray: "gray",
    red: "red",
    disabled: "disabled",
  },
  outline: {
    accent: "accent",
    gray: "gray",
    red: "red",
    disabled: "disabled",
  },
  ghost: {
    accent: "accent",
    gray: "gray",
    red: "red",
    disabled: "disabled",
  },
} as const;

export const iconVariantMap = {
  default: "secondary",
  "icon-only": "primary",
} as const;
