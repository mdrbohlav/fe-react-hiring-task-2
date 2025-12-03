import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  server: {
    port: 5173,
    host: true,
    proxy: {},
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@app': '/src',
    },
  },
  plugins: [react()],
})
