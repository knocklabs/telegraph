import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default {
  build: {
    lib: {
      entry: ["src/index.ts"],
      name: "telegraph",
      fileName: (format: string) => `index.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        entryFileNames: "[name].[format].js",
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
    }),
    react(),
  ],
};
