// Builds the one-file Level 1 embed (src/embed.tsx) → dist-embed/mezgeb.js, served at /v1/mezgeb.js.
//   npm run build:embed
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  plugins: [react(), tailwindcss()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: "dist-embed",
    emptyOutDir: true,
    lib: {
      entry: "src/embed.tsx",
      formats: ["es"],
      fileName: () => "mezgeb.js",
    },
  },
});
