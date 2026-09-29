import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    port: 5173,
    strictPort: true,
  },
  css: {
    preprocessorOptions: {
      css: {
        includePaths: [path.resolve(__dirname, 'src')],
      },
    },
  },
})
