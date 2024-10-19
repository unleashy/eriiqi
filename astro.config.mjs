// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  scopedStyleStrategy: "where",
  vite: {
    css: {
      transformer: "lightningcss"
    }
  }
});
