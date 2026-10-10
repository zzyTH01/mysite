import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://zzyth01.github.io",
  base: "/mysite",
  vite: {
    plugins: [tailwindcss()],
  },
});
