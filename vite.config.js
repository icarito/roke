import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "/roke/",
  optimizeDeps: {
    exclude: ['excalibur']
  },
  build: {
    assetsInlineLimit: 0, // excalibur cannot handle inlined xml in prod mode
    sourcemap: true,
    rollupOptions: {
      output: "umd",
    },
  },
});
