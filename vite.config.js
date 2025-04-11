import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { URL, fileURLToPath } from "node:url";
import Pages from "vite-plugin-pages";
import Components from "unplugin-vue-components/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      src: fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("src/assets", import.meta.url)),
    },
  },
  server: {
    port: 5290,
    strictPort: true,
    hmr: {
      port: 5290,
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: "src/popup/index.html",
        overrides: "src/overrides/index.html",
        offscreen: "src/offscreen/index.html",
      },
    },
  },
  assetsInclude: ["src/assets/*/**"],
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  plugins: [
    vue(),
    // vueDevTools(),
    tailwindcss(),
    Pages({
      dirs: [
        {
          dir: "src/popup/views",
          baseRoute: "popup",
        },
      ],
    }),
    Components({
      dirs: ["src/_components"],
      resolvers: [
        // auto import icons
        IconsResolver(),
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    Icons({
      autoInstall: true,
      compiler: "vue3",
      scale: 1.5,
    }),
  ],
});
