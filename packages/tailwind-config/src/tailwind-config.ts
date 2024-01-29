import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{jsx,ts,jsx,tsx}", "../../packages/**/*.{jsx,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
