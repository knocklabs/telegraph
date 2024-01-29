import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default {
  build: {
    lib: {
      entry: "src/index.ts",
      name: "telegraph",
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        interop: "compat",
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      outputDir: "dist/types",
    }),
    react(),
  ],
};
