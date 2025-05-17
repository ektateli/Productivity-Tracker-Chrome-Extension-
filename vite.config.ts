import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"), // ✅ Ensure index.html is built
        background: resolve(__dirname, "src/background.ts"), // ✅ Ensure background script compiles
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});





// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { crx } from '@crxjs/vite-plugin'
// import manifest from './manifest.json'

// export default defineConfig({
//   plugins: [
//     react(),
//     crx({ manifest }),
//   ],
// })