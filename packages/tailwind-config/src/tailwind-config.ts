import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{jsx,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "var(--telegraph-green)",
      },
    },
  },
  plugins: [],
} satisfies Config;
