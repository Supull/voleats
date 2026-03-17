import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/menu": {
        target: "https://dining.utk.edu",
        changeOrigin: true,
        rewrite: () =>
          "/wp-admin/admin-ajax.php?action=get_cached_menu",
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const url = new URL(req.url ?? "", "http://localhost");
            const serviceAreaId = url.searchParams.get("service_area_id");
            const date = url.searchParams.get("date");
            proxyReq.path = `/wp-admin/admin-ajax.php?action=get_cached_menu&service_area_id=${serviceAreaId}&date=${date}`;
          });
        },
      },
    },
  },
});