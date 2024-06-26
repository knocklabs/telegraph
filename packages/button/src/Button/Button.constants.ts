export const buttonColorMap = {
  solid: {
    gray: "bg-gray-9 hover:bg-gray-10 focus:bg-gray-11 data-[tgph-button-active=true]:!bg-gray-11",
    red: "bg-red-9 hover:bg-red-10 focus:bg-red-11 data-[tgph-button-active=true]:!bg-red-11",
    accent:
      "bg-accent-9 hover:bg-accent-10 focus:bg-accent-11 data-[tgph-button-active=true]:!bg-accent-11",
    green:
      "bg-green-9 hover:bg-green-10 focus:bg-green-11 data-[tgph-button-active=true]:!bg-green-11",
    blue: "bg-blue-9 hover:bg-blue-10 focus:bg-blue-11 data-[tgph-button-active=true]:!bg-blue-11",
    yellow:
      "bg-yellow-9 hover:bg-yellow-10 focus:bg-yellow-11 data-[tgph-button-active=true]:!bg-yellow-11",
    purple:
      "bg-purple-9 hover:bg-purple-10 focus:bg-purple-11 data-[tgph-button-active=true]:!bg-purple-11",
    disabled: "bg-gray-2",
  },
  soft: {
    gray: "bg-gray-3 hover:bg-gray-4 focus:bg-gray-5 data-[tgph-button-active=true]:!bg-gray-5",
    red: "bg-red-3 hover:bg-red-4 focus:bg-red-5 data-[tgph-button-active=true]:!bg-red-5",
    accent:
      "bg-accent-3 hover:bg-accent-4 focus:bg-accent-6 data-[tgph-button-active=true]:!bg-accent-6",
    green:
      "bg-green-3 hover:bg-green-4 focus:bg-green-5 data-[tgph-button-active=true]:!bg-green-5",
    blue: "bg-blue-3 hover:bg-blue-4 focus:bg-blue-5 data-[tgph-button-active=true]:!bg-blue-5",
    yellow:
      "bg-yellow-3 hover:bg-yellow-4 focus:bg-yellow-5 data-[tgph-button-active=true]:!bg-yellow-5",
    purple:
      "bg-purple-3 hover:bg-purple-4 focus:bg-purple-5 data-[tgph-button-active=true]:!bg-purple-5",
    disabled: "bg-gray-2",
  },
  outline: {
    gray: "bg-transparent shadow-[inset_0_0_0_1px] shadow-gray-6 hover:shadow-gray-7 focus:shadow-gray-8 data-[tgph-button-active=true]:!shadow-gray-8",
    red: "bg-transparent shadow-[inset_0_0_0_1px] shadow-red-6 hover:shadow-red-7 focus:shadow-red-8 data-[tgph-button-active=true]:!shadow-red-8",
    accent:
      "bg-transparent shadow-[inset_0_0_0_1px] shadow-accent-6 hover:shadow-accent-7 focus:shadow-accent-8  data-[tgph-button-active=true]:!shadow-accent-8",
    green:
      "bg-transparent shadow-[inset_0_0_0_1px] shadow-green-6 hover:shadow-green-7 focus:shadow-green-8 data-[tgph-button-active=true]:!shadow-green-8",
    blue: "bg-transparent shadow-[inset_0_0_0_1px] shadow-blue-6 hover:shadow-blue-7 focus:shadow-blue-8 data-[tgph-button-active=true]:!shadow-blue-8",
    yellow:
      "bg-transparent shadow-[inset_0_0_0_1px] shadow-yellow-6 hover:shadow-yellow-7 focus:shadow-yellow-8 data-[tgph-button-active=true]:!shadow-yellow-8",
    purple:
      "bg-transparent shadow-[inset_0_0_0_1px] shadow-purple-6 hover:shadow-purple-7 focus:shadow-purple-8 data-[tgph-button-active=true]:!shadow-purple-8",
    disabled: "bg-gray-2",
  },
  ghost: {
    gray: "bg-transparent hover:bg-gray-3 focus:bg-gray-4 data-[tgph-button-active=true]:!bg-gray-4 [&data-[tgph-button-active=true]>span]:!text-gray-12",
    red: "bg-transparent hover:bg-red-3 focus:bg-red-4 data-[tgph-button-active=true]:!bg-red-4",
    accent:
      "bg-transparent hover:bg-accent-3 focus:bg-accent-4 data-[tgph-button-active=true]:!bg-accent-4",
    green:
      "bg-transparent hover:bg-green-3 focus:bg-green-4 data-[tgph-button-active=true]:!bg-green-4",
    blue: "bg-transparent hover:bg-blue-3 focus:bg-blue-4 data-[tgph-button-active=true]:!bg-blue-4",
    yellow:
      "bg-transparent hover:bg-yellow-3 focus:bg-yellow-4 data-[tgph-button-active=true]:!bg-yellow-4",
    purple:
      "bg-transparent hover:bg-purple-3 focus:bg-purple-4 data-[tgph-button-active=true]:!bg-purple-4",
    disabled: "bg-transparent",
  },
} as const;

export const buttonSizeMap = {
  default: {
    "1": {
      w: "auto",
      h: "6",
      gap: "1",
      px: "2",
    },
    "2": {
      w: "auto",
      h: "8",
      gap: "2",
      px: "3",
    },
    "3": {
      w: "auto",
      h: "10",
      gap: "3",
      px: "4",
    },
  },
  "icon-only": {
    "1": {
      w: "6",
      h: "6",
      gap: "0",
      px: "0",
    },
    "2": {
      w: "8",
      h: "8",
      gap: "0",
      px: "0",
    },
    "3": {
      w: "10",
      h: "10",
      gap: "0",
      px: "0",
    },
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
    green: "white",
    blue: "white",
    yellow: "white",
    purple: "white",
    disabled: "disabled",
  },
  soft: {
    gray: "default",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  outline: {
    gray: "default",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  ghost: {
    gray: "gray",
    red: "red",
    accent: "accent",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
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
    green: "white",
    blue: "white",
    yellow: "white",
    purple: "white",
    disabled: "disabled",
  },
  soft: {
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  outline: {
    accent: "accent",
    gray: "gray",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
  ghost: {
    accent: "accent",
    gray: "default",
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "yellow",
    purple: "purple",
    disabled: "disabled",
  },
} as const;

export const iconVariantMap = {
  default: "secondary",
  "icon-only": "primary",
} as const;
