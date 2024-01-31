import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

export default {
  build: {
    lib: {
      entry: "src/index.ts",
      name: "telegraph",
      fileName: (format: string) => `index.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
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
