import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        checkoutSuccess: resolve(__dirname, "checkout/success.html"),
        checkoutCancel: resolve(__dirname, "checkout/cancel.html"),
      },
    },
  },
});
