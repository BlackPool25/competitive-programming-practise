import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // The week notes live in the parent dir (../../weeks) and are imported
      // with `?raw`, so the dev server must be allowed to read above the root.
      allow: [fileURLToPath(new URL('..', import.meta.url))],
    },
  },
})
