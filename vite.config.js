import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

const ldtkPlugin = () => {
  return {
    name: "ldtk-tileset-plugin",
    resolveId: {
      order: "pre",
      handler(sourceId, importer, options) {
        if (!sourceId.endsWith(".ldtk")) return;
        return { id: "tileset:" + sourceId, external: "relative" };
      },
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), ldtkPlugin()],
  base: "/roke/",
  build: {
    assetsInlineLimit: 0, // excalibur cannot handle inlined xml in prod mode
    sourcemap: true,
    rollupOptions: {
      output: "umd",
    },
  },
});
