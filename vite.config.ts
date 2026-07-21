import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT || 5173),
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
