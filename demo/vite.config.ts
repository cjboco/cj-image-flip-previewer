import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "/cj-image-flip-previewer/",
  resolve: {
    alias: {
      "cj-image-flip-previewer": path.resolve(__dirname, "../src/index.ts"),
    },
  },
});
